import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const KnowledgeGraphNodes = () => {
    const navigate = useNavigate();
    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        // Initial measurement
        updateDimensions();

        const observer = new ResizeObserver(() => {
            updateDimensions();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Efficiently load data once
    useEffect(() => {
        // Fetch from public folder
        fetch('/graph_data.json')
            .then(res => res.json())
            .then(data => {
                // If NetworkX used 'edges', rename to 'links' for the library
                if (data.edges && !data.links) {
                    data.links = data.edges;
                }

                const nodes = data.nodes || [];
                const links = data.links || [];

                setGraphData({ nodes, links });
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load graph data", err);
                setIsLoading(false);
            });
    }, []);

    const [isDark, setIsDark] = useState(true);

    // Theme detection
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkTheme(); // Initial check

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const handleNodeClick = useCallback((node: any) => {
        if (!fgRef.current) return;

        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );
    }, []);

    // Performance configurations
    const graphConfig = useMemo(() => ({
        controlType: 'orbit' as const,
        rendererConfig: {
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance' as const
        }
    }), []);

    return (
        <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>

            {isLoading && (
                <div className={`absolute inset-0 flex items-center justify-center z-40 ${isDark ? 'bg-black text-primary' : 'bg-white text-primary'}`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-mono tracking-widest uppercase">Initializing Neural Core...</span>
                    </div>
                </div>
            )}

            {!isLoading && (
                <ForceGraph3D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeAutoColorBy="group"
                    nodeVal={(node: any) => node.val || 3}
                    backgroundColor={isDark ? "#000000" : "#ffffff"}

                    // Link styling to match user's request
                    linkWidth={(link: any) => link.weight || 1}
                    linkOpacity={isDark ? 0.4 : 0.25}
                    linkColor={() => isDark ? '#ffffff' : '#000000'}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={(d: any) => (d.weight || 1) * 0.01}

                    // Interaction
                    onNodeClick={handleNodeClick}

                    // Performance
                    warmupTicks={50}
                    cooldownTicks={100}
                    nodeResolution={8}
                    enableNodeDrag={false}
                    onEngineStop={() => console.log('Physics simulation stopped for performance.')}
                />
            )}

            {/* UI Entities - Placed after graph to ensure they are on top in the stacking context */}

            {/* Entity 1: Navigation Control */}
            <div className="absolute top-6 left-6 z-[100] pointer-events-auto">
                <Button
                    onClick={() => navigate('/knowledge-graph')}
                    variant="outline"
                    className={`gap-2 backdrop-blur-md border shadow-xl transition-colors ${isDark
                        ? 'bg-black/60 border-white/20 text-white hover:bg-white/20'
                        : 'bg-white/60 border-black/10 text-black hover:bg-black/5'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" />

                </Button>
            </div>

            {/* Entity 2: Information Overlay */}
            <div className={`absolute bottom-6 left-6 z-[100] backdrop-blur-md p-4 rounded-xl border select-none max-w-[280px] shadow-2xl transition-colors ${isDark
                ? 'bg-black/70 border-white/10 text-white'
                : 'bg-white/70 border-black/10 text-black'
                }`}>
                <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Interactive 3D Substrate
                </h3>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-slate-600'}`}>
                    Scroll: Zoom | Drag: Rotate | Click Node: Center Camera | 0.01% of PrimeKG
                </p>
            </div>

            {/* Entity 3: Fullscreen Control */}
            <div className="absolute bottom-6 right-6 z-[100] pointer-events-auto">
                <Button
                    onClick={toggleFullscreen}
                    variant="outline"
                    size="icon"
                    className={`backdrop-blur-md border shadow-xl transition-colors rounded-full w-10 h-10 ${isDark
                        ? 'bg-black/60 border-white/20 text-white hover:bg-white/20'
                        : 'bg-white/60 border-black/10 text-black hover:bg-black/5'
                        }`}
                >
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
