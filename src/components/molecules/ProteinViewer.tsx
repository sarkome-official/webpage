import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, Minimize2, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProteinViewerProps {
  uniprotId: string;
  title?: string;
}

declare global {
  interface Window {
    $3Dmol: any;
  }
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({ uniprotId, title }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadScript = () => {
      if (window.$3Dmol) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://3Dmol.org/build/3Dmol-min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load 3Dmol.js'));
        document.head.appendChild(script);
      });
    };

    const initViewer = async () => {
      try {
        await loadScript();
        if (!isMounted || !viewerRef.current) return;

        const element = viewerRef.current;
        // Clear previous viewer instance (canvases) if exists
        element.innerHTML = '';

        const config = { backgroundColor: 0x000000, alpha: true };
        const viewer = window.$3Dmol.createViewer(element, config);

        const id = uniprotId.toUpperCase();

        // First: query the AlphaFold public API for canonical model URLs.
        const apiUrls: string[] = [];
        try {
          const apiResp = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${id}`);
          if (apiResp.ok) {
            const json = await apiResp.json();
            if (Array.isArray(json) && json.length > 0) {
              const entry = json[0];
              if (entry.cifUrl) apiUrls.push(entry.cifUrl);
              if (entry.pdbUrl) apiUrls.push(entry.pdbUrl);
              if (entry.bcifUrl) apiUrls.push(entry.bcifUrl);
            }
          }
        } catch (e) {
          console.warn('AlphaFold API lookup failed, will fall back to guessed URLs', e);
        }

        // If API didn't return usable URLs, fall back to tried patterns.
        const fallback = [
          `https://alphafold.ebi.ac.uk/files/AF-${id}-F1-model_v6.cif`,
          `https://alphafold.ebi.ac.uk/files/AF-${id}-F1-model_v6.pdb`,
          `https://alphafold.ebi.ac.uk/files/AF-${id}-F1-model_v4.cif`,
          `https://alphafold.ebi.ac.uk/files/AF-${id}-F1-model_v4.pdb`,
          `https://alphafold.ebi.ac.uk/files/AF-${id}-F1-model_v3.cif`
        ];

        const urls = apiUrls.length > 0 ? apiUrls.concat(fallback) : fallback;

        let loaded = false;
        const attempted: string[] = [];
        for (const url of urls) {
          attempted.push(url);
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.text();
              const format = url.endsWith('.cif') || url.endsWith('.bcif') ? 'cif' : 'pdb';
              viewer.addModel(data, format);
              // AlphaFold Standard Colors:
              const colorfunc = function (atom: any) {
                const b = typeof atom.b === 'number' ? atom.b : (atom.bfactor || 0);
                if (b > 90) return '#0053D6'; // Very High (Dark Blue)
                if (b > 70) return '#65CBF3'; // High (Light Blue)
                if (b > 50) return '#FFDB13'; // Low (Yellow)
                return '#FF7D45'; // Very Low (Orange)
              };
              viewer.setStyle({}, { cartoon: { colorfunc } });
              viewer.zoomTo();
              viewer.render();
              loaded = true;
              break;
            }
          } catch (e) {
            console.warn(`Failed to load from ${url}`, e);
          }
        }

        if (loaded) {
          if (isMounted) setIsLoading(false);
        } else {
          if (isMounted) {
            const entryUrl = `https://alphafold.ebi.ac.uk/entry/${id}`;
            setError(`Model not found in AlphaFold DB. Tried:\n${attempted.join('\n')}\n\nOpen entry: ${entryUrl}`);
            setIsLoading(false);
          }
          return;
        }
      } catch (err) {
        console.error('ProteinViewer Error:', err);
        if (isMounted) {
          // Provide a helpful message including the AlphaFold entry URL
          const entryUrl = `https://alphafold.ebi.ac.uk/entry/${uniprotId.toUpperCase()}`;
          setError(`Could not load 3D model. Visit the AlphaFold entry: ${entryUrl}`);
          setIsLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
    };
  }, [uniprotId]);

  return (
    <div className={`flex flex-col w-full bg-card/50 overflow-hidden group relative transition-all duration-300 ${isMaximized ? 'fixed inset-0 z-50 h-screen w-screen bg-background' : 'h-full'}`}>
      <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-primary/10 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-foreground tracking-tight">
            {title || `Protein Structure: ${uniprotId}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
            <Info className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 w-full bg-black/20 backdrop-blur-sm min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
              Fetching AlphaFold Model...
            </span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-destructive p-4 text-center">
            <Info className="w-8 h-8 opacity-50" />
            <p className="text-xs font-medium">{error}</p>
            <p className="text-[10px] opacity-70">UniProt ID: {uniprotId}</p>
          </div>
        )}

        <div
          ref={viewerRef}
          className="w-full h-full"
          style={{ position: 'relative' }}
        />

        {!isLoading && !error && (
          <>
            {/* Model Confidence Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-lg z-10 pointer-events-none select-none">
              <h5 className="text-[10px] font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                Model Confidence
              </h5>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#0053D6] shadow-sm border border-white/10" />
                  <span className="text-[10px] text-white/90">Very high (pLDDT &gt; 90)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#65CBF3] shadow-sm border border-white/10" />
                  <span className="text-[10px] text-white/90">High (90 &gt; pLDDT &gt; 70)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#FFDB13] shadow-sm border border-white/10" />
                  <span className="text-[10px] text-white/90">Low (70 &gt; pLDDT &gt; 50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#FF7D45] shadow-sm border border-white/10" />
                  <span className="text-[10px] text-white/90">Very low (pLDDT &lt; 50)</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={`https://alphafold.ebi.ac.uk/entry/${uniprotId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-medium shadow-lg hover:bg-primary/90 transition-all"
              >
                <Download className="w-3 h-3" />
                AlphaFold DB
              </a>
            </div>
          </>
        )}
      </div>

      <div className="flex-none px-4 py-2 bg-primary/5 border-t border-primary/10">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Interactive 3D visualization powered by AlphaFold 3 & 3Dmol.js.
          Drag to rotate, scroll to zoom.
        </p>
      </div>
    </div>
  );
};
