import React from 'react';
import { ExternalLink, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProteinViewerProps {
  uniprotId: string;
  title?: string;
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({ uniprotId, title }) => {
  const alphaFoldUrl = `https://alphafold.ebi.ac.uk/entry/${uniprotId}`;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Dna className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">
            {title || `Protein Structure: ${uniprotId}`}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
            UniProt: {uniprotId}
          </span>
        </div>
      </div>

      <a
        href={alphaFoldUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
      >
        <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
          View on AlphaFold
          <ExternalLink className="w-3 h-3" />
        </Button>
      </a>
    </div>
  );
};
