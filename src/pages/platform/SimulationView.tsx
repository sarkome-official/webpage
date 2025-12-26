import React from 'react';
import { Activity, Zap, ShieldCheck, FlaskConical, BarChart3 } from 'lucide-react';

export const SimulationView = () => {
    return (
        <div className="flex flex-col h-full w-full bg-background text-muted-foreground font-sans overflow-hidden">
            {/* Header Section */}
            <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                            <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Metabolic Simulator</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Digital Twin v0.4</span>
                                <span className="flex items-center gap-1 ml-0 md:ml-2 text-[10px] text-emerald-500 font-mono">
                                    <Activity className="w-3 h-3" />
                                    SIMULATION ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.href = '/platform/alphafold'}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-xs md:text-sm font-medium transition-all text-foreground"
                        >
                            View AlphaFold
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
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Simulation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart Area */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-muted/20 border border-border flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-foreground font-bold flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                                    Pathway Flux Analysis
                                </h3>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-[10px] text-emerald-400 border border-emerald-500/20">OXPHOS</span>
                                    <span className="px-2 py-1 rounded bg-muted text-[10px] text-muted-foreground">Glycolysis</span>
                                </div>
                            </div>

                            {/* Placeholder for Graph */}
                            <div className="flex-1 min-h-[300px] bg-muted/10 rounded-xl border border-dashed border-border flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-1/4 left-0 right-0 h-px bg-emerald-500/50"></div>
                                    <div className="absolute top-2/4 left-0 right-0 h-px bg-emerald-500/50"></div>
                                    <div className="absolute top-3/4 left-0 right-0 h-px bg-emerald-500/50"></div>
                                </div>
                                <svg className="w-full h-full px-4" viewBox="0 0 800 300">
                                    <path d="M0,250 Q100,220 200,240 T400,180 T600,100 T800,50" fill="none" stroke="#10b981" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <path d="M0,260 Q150,250 300,200 T500,220 T800,180" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                                </svg>
                                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground/40">TFE3-ASPSCR1 Metabolic Shift</div>
                            </div>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="flex flex-col gap-6">
                            <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Cellular State</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">ATP Production</span>
                                        <span className="text-sm font-bold text-emerald-400">+42%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%]"></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Lactate Secretion</span>
                                        <span className="text-sm font-bold text-amber-400">+18%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[60%]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Drug Interaction</h4>
                                <div className="p-3 rounded-lg bg-muted/10 border border-border">
                                    <div className="text-xs font-bold text-foreground mb-1">VCP Inhibitor (Experimental)</div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Predicted to disrupt the VCP-mediated protein homeostasis in ASPS cells.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                                    <ShieldCheck className="w-3 h-3" />
                                    92% PLAUSIBILITY SCORE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
