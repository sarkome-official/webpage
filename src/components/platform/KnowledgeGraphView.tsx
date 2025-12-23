import React, { useState, useMemo, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// --- DATA MODEL: SEMANTIC ENTITIES & RELATIONSHIPS ---
// The Knowledge Graph functions as the "Virtual Mind" of Sarkome.
// Future Implementation: Memory Temperature (Hot/Warm/Cold)
// - Hot: High opacity, active vector index.
// - Warm: Medium opacity, traversable but not indexed.
// - Cold: Low opacity/Hidden, archived metadata awaiting reactivation.
const MOCK_GRAPH_DATA = {
    nodes: [
        { id: 'ASPSCR1-TFE3', name: 'ASPSCR1-TFE3', label: 'Fusion', val: 40, color: '#a855f7', pmid: '30123456', description: 'Central driver of Alveolar Soft Part Sarcoma.' },
        { id: 'Cediranib', name: 'Cediranib', label: 'Drug', val: 25, color: '#1132d4', phase: 'Phase 3', mechanism: 'VEGFR Inhibitor' },
        { id: 'Sunitinib', name: 'Sunitinib', label: 'Drug', val: 22, color: '#60a5fa', phase: 'Approved', mechanism: 'Multi-TKI' },
        { id: 'Pazopanib', name: 'Pazopanib', label: 'Drug', val: 22, color: '#60a5fa', phase: 'Approved', mechanism: 'Multi-TKI' },
        { id: 'MET', name: 'MET', label: 'Gene', val: 18, color: '#10b981', description: 'Oncogene often upregulated in ASPS.' },
        { id: 'VEGFR2', name: 'VEGFR2', label: 'Gene', val: 18, color: '#10b981', description: 'Key mediator of angiogenesis.' },
        { id: 'VEGF', name: 'VEGF', label: 'Gene', val: 15, color: '#10b981' },
        { id: 'HIF1A', name: 'HIF1A', label: 'Gene', val: 15, color: '#10b981' },
        { id: 'mTOR', name: 'mTOR', label: 'Pathway', val: 16, color: '#f59e0b' },
        { id: 'Angiogenesis', name: 'Angiogenesis', label: 'Process', val: 20, color: '#ef4444' },
    ],
    // Aristas: Relaciones con semántica explícita (SOURCE -[RELATION]-> TARGET)
    links: [
        { source: 'Cediranib', target: 'VEGFR2', label: 'INHIBITS', quality: 'Gold', confidence: 0.98 },
        { source: 'Sunitinib', target: 'VEGFR2', label: 'INHIBITS', quality: 'Gold', confidence: 0.94 },
        { source: 'Pazopanib', target: 'VEGFR2', label: 'INHIBITS', quality: 'Gold', confidence: 0.91 },
        { source: 'ASPSCR1-TFE3', target: 'MET', label: 'UPREGULATES', quality: 'Gold', confidence: 0.95 },
        { source: 'ASPSCR1-TFE3', target: 'VEGFR2', label: 'DRIVES', quality: 'Gold', confidence: 0.92 },
        { source: 'ASPSCR1-TFE3', target: 'HIF1A', label: 'TRANSCRIPT_FACTOR', quality: 'Gold', confidence: 0.88 },
        { source: 'HIF1A', target: 'VEGF', label: 'REGULATES', quality: 'PrimeKG', confidence: 0.72 },
        { source: 'VEGFR2', target: 'Angiogenesis', label: 'PROMOTES', quality: 'Gold', confidence: 0.99 },
        { source: 'MET', target: 'mTOR', label: 'CROSSTALK', quality: 'PrimeKG', confidence: 0.45 },
    ]
};

export const KnowledgeGraphView = () => {
    const fgRef = useRef<any>();
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [filter, setFilter] = useState('');

    const filteredData = useMemo(() => {
        const data = MOCK_GRAPH_DATA;
        if (!filter) return data;
        const lowerFilter = filter.toLowerCase();
        // Simple filter logic
        const nodes = data.nodes.filter(n =>
            n.name.toLowerCase().includes(lowerFilter) || n.label.toLowerCase().includes(lowerFilter)
        );
        const nodeIds = new Set(nodes.map(n => n.id));
        const links = data.links.filter(l =>
            nodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source) &&
            nodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target)
        );
        return { nodes, links };
    }, [filter]);

    const handleNodeClick = useCallback((node: any) => {
        setSelectedNode(node);
        // Center view on node
        fgRef.current?.centerAt(node.x, node.y, 1000);
        fgRef.current?.zoom(3, 2000);
    }, []);

    return (
        <div className="flex h-full w-full overflow-hidden font-display relative">
            {/* --- GRAPH VISUALIZATION LAYER --- */}
            <div className="absolute inset-0 z-0 bg-[#0a0b14]">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={filteredData}
                    // Visual Configuration
                    backgroundColor="#0a0b14"
                    nodeLabel="name"
                    nodeRelSize={6}

                    // --- NODE RENDERING (Entidades) ---
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                        const fontSize = 12 / globalScale;
                        ctx.font = `600 ${fontSize}px "Space Grotesk"`;
                        const label = node.name;
                        const textWidth = ctx.measureText(label).width;

                        // Glow effect for selected node
                        if (selectedNode && node.id === selectedNode.id) {
                            ctx.shadowColor = node.color;
                            ctx.shadowBlur = 15;
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 2 / globalScale;
                            ctx.stroke();
                            ctx.shadowBlur = 0; // Reset
                        }

                        // Node Circle
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                        ctx.fillStyle = node.color;
                        ctx.fill();

                        // Node Label (Semantic Type shown on hover/zoom or below name)
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.fillText(label, node.x - textWidth / 2, node.y + 12 / globalScale);

                        const typeLabel = `[${node.label}]`;
                        ctx.font = `400 ${fontSize * 0.8}px "Space Grotesk"`;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        const typeWidth = ctx.measureText(typeLabel).width;
                        ctx.fillText(typeLabel, node.x - typeWidth / 2, node.y + 22 / globalScale);
                    }}

                    // --- LINK RENDERING (Aristas) ---
                    linkColor={(link: any) => link.quality === 'Gold' ? '#fbbf24' : '#475569'}
                    linkWidth={(link: any) => link.quality === 'Gold' ? 1.5 : 1}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    // Draw relationship labels on links
                    linkCanvasObjectMode={() => 'after'}
                    linkCanvasObject={(link: any, ctx, globalScale) => {
                        if (globalScale < 2) return; // Only show labels when zoomed in

                        const start = link.source;
                        const end = link.target;

                        // Calculate middle point
                        const textPos = Object.assign({}, ...['x', 'y'].map(c => ({
                            [c]: start[c] + (end[c] - start[c]) / 2
                        })));

                        const relLabel = link.label;
                        const fontSize = 10 / globalScale;
                        ctx.font = `bold ${fontSize}px "Space Grotesk"`;

                        // Background box for text
                        const textWidth = ctx.measureText(relLabel).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);
                        ctx.fillStyle = 'rgba(10, 11, 20, 0.8)';
                        ctx.fillRect(textPos.x - bckgDimensions[0] / 2, textPos.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                        // Text
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = link.quality === 'Gold' ? '#fbbf24' : '#94a3b8';
                        ctx.fillText(relLabel, textPos.x, textPos.y);
                    }}

                    onNodeClick={handleNodeClick}
                    cooldownTicks={100}
                />
            </div>

            {/* --- UI OVERLAY LAYER --- */}

            {/* Left Sidebar: Filters & Search */}
            <aside className="absolute top-0 left-0 w-80 h-full flex flex-col bg-[#1a1d2d]/95 backdrop-blur border-r border-[#282b39] z-20 shadow-2xl transition-transform duration-300 transform -translate-x-0">
                <div className="p-4 border-b border-[#282b39]">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            className="bg-[#101322] border border-[#282b39] text-white text-sm rounded-lg focus:ring-[#1132d4] focus:border-[#1132d4] block w-full pl-10 p-2.5 placeholder-slate-500 outline-none"
                            placeholder="Find entity..."
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Semantic Legend */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            Semantic Types
                        </h3>
                        <div className="space-y-2">
                            {['Drug', 'Gene', 'Fusion', 'Pathway'].map(type => (
                                <div key={type} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: MOCK_GRAPH_DATA.nodes.find(n => n.label === type)?.color }}></span>
                                        <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{type}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">{MOCK_GRAPH_DATA.nodes.filter(n => n.label === type).length}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Relationship Types */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Relationship Semantics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['INHIBITS', 'UPREGULATES', 'DRIVES', 'REGULATES'].map(rel => (
                                <span key={rel} className="px-2 py-1 rounded bg-[#101322] border border-[#282b39] text-[10px] font-mono text-slate-400">
                                    {`-[:${rel}]->`}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right Sidebar: Semantic Inspector */}
            <aside className={`absolute top-0 right-0 w-96 h-full bg-[#1a1d2d]/95 backdrop-blur border-l border-[#282b39] flex flex-col z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] transition-transform duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedNode && (
                    <>
                        <div className="p-6 border-b border-[#282b39] relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <span className="material-symbols-outlined text-[100px]">hub</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <span style={{ color: selectedNode.color, borderColor: selectedNode.color }} className="px-2 py-0.5 rounded bg-opacity-10 bg-white text-[10px] font-bold uppercase tracking-wider border opacity-80">
                                        :{selectedNode.label}
                                    </span>
                                    <button className="text-slate-400 hover:text-white" onClick={() => setSelectedNode(null)}>
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-1 font-display">{selectedNode.name}</h2>
                                <p className="text-slate-400 text-xs font-mono">UUID: {selectedNode.id}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Properties Table */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1132d4] text-[18px]">dataset</span> Properties
                                </h3>
                                <div className="bg-[#101322] rounded-lg border border-[#282b39] overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <tbody>
                                            {Object.entries(selectedNode).filter(([k]) => !['id', 'name', 'label', 'x', 'y', 'vx', 'vy', 'index', 'color', 'val'].includes(k)).map(([key, value]: [string, any]) => (
                                                <tr key={key} className="border-b border-[#282b39] last:border-0 hover:bg-white/5">
                                                    <td className="px-3 py-2 text-slate-500 font-mono text-xs uppercase w-1/3">{key}</td>
                                                    <td className="px-3 py-2 text-slate-200">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Connected Relationships */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500 text-[18px]">alt_route</span> Semantic Connections
                                </h3>
                                <div className="space-y-2">
                                    {MOCK_GRAPH_DATA.links.filter((l: any) => l.source.id === selectedNode.id || l.target.id === selectedNode.id).map((link: any, i) => {
                                        const isSource = link.source.id === selectedNode.id;
                                        const otherNode = isSource ? link.target : link.source;
                                        return (
                                            <div key={i} className="flex items-center justify-between p-3 bg-[#101322] border border-[#282b39] rounded-lg group hover:border-[#1132d4] transition-colors cursor-pointer" onClick={() => handleNodeClick(otherNode)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-mono text-slate-500">{isSource ? 'OUT' : 'IN'}</span>
                                                        <span className="material-symbols-outlined text-[16px] text-amber-500 rotate-90">{isSource ? 'arrow_outward' : 'arrow_downward'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">:{link.label}</span>
                                                        <p className="text-sm text-white font-medium mt-1">{otherNode.name}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-[#1132d4] opacity-0 group-hover:opacity-100 transition-opacity">GO &rarr;</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
};
