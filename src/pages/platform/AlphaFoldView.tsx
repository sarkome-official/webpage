import React, { useState, useEffect } from 'react';
import { Box, Activity, Info, Layers, Maximize2, Construction, X } from 'lucide-react';

export const AlphaFoldView = () => {
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNotice(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-background text-muted-foreground font-sans overflow-hidden relative">
            {/* Construction Notice Modal */}
            {showNotice && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="max-w-md w-full bg-card border border-primary/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                        
                        <button 
                            onClick={() => setShowNotice(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Construction className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-foreground tracking-tight">Feature Under Construction</h2>
                                <p className="text-sm leading-relaxed">
                                    The AlphaFold Server protein visualizer is already conceptualized and currently under construction.
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    This module will enable high-fidelity 3D analysis of biomolecular structures directly within Sarkome OS.
                                </p>
                            </div>

                            <button 
                                onClick={() => setShowNotice(false)}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Box className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">AlphaFold Structural Enricher</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase tracking-wider">UniProt: P04626</span>
                                <span className="flex items-center gap-1 ml-0 md:ml-2 text-[10px] text-primary font-mono">
                                    <Activity className="w-3 h-3" />
                                    FETCHING METADATA
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.href = '/platform/simulation'}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-xs md:text-sm font-medium transition-all text-foreground"
                        >
                            Run Simulation
                        </button>
                        <button
                            onClick={() => window.location.href = '/platform/report'}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* 3D Viewer Placeholder */}
                <div className="flex-1 bg-muted/5 relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Abstract Protein Representation */}
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 border-2 border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Layers className="w-32 h-32 text-primary/40 blur-[1px]" />
                            </div>
                        </div>
                    </div>

                    {/* Viewer Controls */}
                    <div className="absolute bottom-6 left-6 flex gap-2">
                        <button className="p-2 rounded bg-muted/80 border border-border hover:bg-muted transition-colors text-foreground">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="absolute top-6 right-6 p-4 rounded-xl bg-muted/80 border border-border backdrop-blur-md max-w-xs">
                        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest">Confidence (pLDDT)</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span>Very High ({'>'}90)</span>
                                <span className="text-primary">82%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[82%]"></div>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span>Confident (70-90)</span>
                                <span className="text-muted-foreground">12%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-muted-foreground/50 w-[12%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-muted/10 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                About AlphaFold Integration
                            </h3>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">How does AlphaFold Server work?</h4>
                                <p className="text-xs leading-relaxed text-foreground/80">
                                    AlphaFold Server is a web-service that can generate highly accurate biomolecular structure predictions containing proteins, DNA, RNA, ligands, ions, and also model chemical modifications for proteins and nucleic acids in one platform.
                                </p>
                                <p className="text-xs leading-relaxed text-foreground/80 font-medium">
                                    It’s powered by the newest AlphaFold 3 model.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Structure Details
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Protein Name</div>
                                    <div className="text-sm text-foreground font-medium">VCP (Valosin-containing protein)</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Sequence Length</div>
                                    <div className="text-sm text-foreground font-medium">806 amino acids</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                                    <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Model Source</div>
                                    <div className="text-sm text-foreground font-medium">AlphaFold DB v4 (2024-07-15)</div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-foreground font-bold mb-4">Functional Domains</h3>
                            <div className="space-y-2">
                                {['AAA+ ATPase domain 1', 'AAA+ ATPase domain 2', 'N-terminal domain'].map((domain, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <span className="text-xs text-muted-foreground">{domain}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
