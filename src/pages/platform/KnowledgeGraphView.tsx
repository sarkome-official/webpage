import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, ExternalLink, Activity, Check, ArrowRight, Play } from 'lucide-react';

export const KnowledgeGraphView = () => {
    const navigate = useNavigate();


    return (
        <div className="flex flex-col h-full w-full bg-background text-foreground font-sans overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-[1800px] mx-auto p-6 md:p-10 lg:p-12 h-full">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 h-full">

                        {/* Left Column: Content */}
                        <div className="flex flex-col gap-8 order-2 xl:order-1">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">PrimeKG</h1>
                                    <div className="flex flex-col gap-1.5 opacity-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-forwards">
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider w-fit">
                                            v2.0 Stable
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider w-fit">
                                            Updated 24h ago
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    Precision Medicine Knowledge Graph
                                </h2>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Diseases</div>
                                    <div className="text-2xl font-black text-foreground">17,080</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Relationships</div>
                                    <div className="text-2xl font-black text-foreground">4,050,249</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Nodes</div>
                                    <div className="text-2xl font-black text-foreground">129,375</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Data Sources</div>
                                    <div className="text-2xl font-black text-foreground">20</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="text-muted-foreground leading-relaxed space-y-6 text-lg">
                                <p>
                                    PrimeKG integrates disparate biomedical datasets into a unified graph structure, bridging the gap between molecular interactions and clinical outcomes. This architecture enables high-fidelity analysis for precision medicine applications.
                                </p>

                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-purple-600 rounded-full"></div>
                                    <p className="text-xl md:text-2xl font-medium italic text-foreground tracking-tight">
                                        "Not just this disease, but specifically <span className="text-purple-500">this patient's disease context</span>."
                                    </p>
                                </div>

                                <ul className="space-y-3 pt-2">
                                    {[
                                        "Drug-disease prediction algorithms",
                                        "Traceable off-label use edges",
                                        "Multi-modal analysis support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-base">
                                            <div className="bg-purple-500/10 p-1 rounded-full">
                                                <Check className="w-3.5 h-3.5 text-purple-500" strokeWidth={3} />
                                            </div>
                                            <span className="text-foreground/90">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 pt-4 mt-auto">

                                <button
                                    onClick={() => window.open('https://zitniklab.hms.harvard.edu/projects/PrimeKG/', '_blank')}
                                    className="px-8 py-3.5 rounded-lg bg-transparent border border-border hover:bg-muted text-foreground font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    View Source
                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Visualization Preview */}
                        <div className="flex flex-col h-full min-h-[500px] xl:min-h-0 order-1 xl:order-2">
                            <div className="flex-1 bg-black/40 border border-border rounded-3xl overflow-hidden relative group">
                                {/* Top Label */}
                                <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live Preview - 2900 Node Sample</span>
                                </div>

                                {/* Animated Graph Visuals (Background) */}
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000">
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px]"></div>
                                    <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-[100px]"></div>

                                    {/* Animated nodes */}
                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Connecting lines - subtle pulse */}
                                        <g className="opacity-30">
                                            <line x1="20" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.15" className="text-purple-400" />
                                            <line x1="80" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="0.15" className="text-purple-400" />
                                            <line x1="30" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="0.15" className="text-purple-400" />
                                            <line x1="70" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="0.15" className="text-purple-400" />
                                            <line x1="15" y1="55" x2="50" y2="50" stroke="currentColor" strokeWidth="0.1" className="text-blue-400" />
                                            <line x1="85" y1="65" x2="70" y2="70" stroke="currentColor" strokeWidth="0.1" className="text-blue-400" />
                                        </g>

                                        {/* Animated floating nodes */}
                                        <circle cx="20" cy="20" r="1.2" fill="currentColor" className="text-white/70">
                                            <animate attributeName="cy" values="20;18;22;20" dur="4s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="20;21;19;20" dur="5s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="80" cy="30" r="1" fill="currentColor" className="text-white/60">
                                            <animate attributeName="cy" values="30;32;28;30" dur="3.5s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="80;78;81;80" dur="4.5s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="50" cy="50" r="2" fill="currentColor" className="text-purple-400">
                                            <animate attributeName="r" values="2;2.3;1.8;2" dur="3s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="30" cy="80" r="1" fill="currentColor" className="text-white/60">
                                            <animate attributeName="cy" values="80;78;82;80" dur="4.2s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="30;32;29;30" dur="5.5s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="70" cy="70" r="1.2" fill="currentColor" className="text-white/70">
                                            <animate attributeName="cy" values="70;72;68;70" dur="3.8s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="70;68;71;70" dur="4.8s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="15" cy="55" r="0.8" fill="currentColor" className="text-blue-400/60">
                                            <animate attributeName="cy" values="55;53;57;55" dur="4.5s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="15;17;14;15" dur="5.2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="85" cy="65" r="0.8" fill="currentColor" className="text-blue-400/60">
                                            <animate attributeName="cy" values="65;67;63;65" dur="4s" repeatCount="indefinite" />
                                            <animate attributeName="cx" values="85;83;86;85" dur="4.3s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="40" cy="35" r="0.6" fill="currentColor" className="text-white/40">
                                            <animate attributeName="cy" values="35;33;37;35" dur="5s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="60" cy="85" r="0.6" fill="currentColor" className="text-white/40">
                                            <animate attributeName="cy" values="85;83;87;85" dur="4.7s" repeatCount="indefinite" />
                                        </circle>
                                    </svg>
                                </div>

                                {/* Interactive Center Button */}
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <button
                                        onClick={() => navigate('/knowledge-graph-nodes')}
                                        className="group/btn relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Play className="w-4 h-4 fill-current" />
                                            Initialize Visualization
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
