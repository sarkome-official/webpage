import React from 'react';
import { FileText, Share2, Download, ShieldCheck, GitBranch, BookOpen, Fingerprint } from 'lucide-react';

export const ReportView = () => {
    return (
        <div className="flex flex-col h-full w-full bg-background text-muted-foreground font-sans overflow-hidden">
            {/* Header Section */}
            <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Investigation Audit Report</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase tracking-wider">ID: #SRK-2025-089</span>
                                <span className="flex items-center gap-1 ml-0 md:ml-2 text-[10px] text-emerald-500 font-mono">
                                    <ShieldCheck className="w-3 h-3" />
                                    VERIFIED THOUGHT SIGNATURE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 text-foreground">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-12">
                    
                    {/* Executive Summary */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            Executive Summary
                        </h2>
                        <div className="p-6 rounded-2xl bg-muted/20 border border-border leading-relaxed">
                            <p className="text-muted-foreground">
                                The Sarkome In-Silico Agent has completed the investigation into the **VCP-Metabolic axis in Alveolar Soft Part Sarcoma (ASPS)**. 
                                The reasoning engine identified a high-confidence causal path linking the **TFE3-ASPSCR1 fusion** to mitochondrial dysfunction via the **VCP/p97** protein homeostasis node.
                            </p>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-muted/10 border border-border">
                                    <div className="text-[10px] text-muted-foreground/60 uppercase mb-1">Confidence</div>
                                    <div className="text-xl font-bold text-emerald-400">94.2%</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/10 border border-border">
                                    <div className="text-[10px] text-muted-foreground/60 uppercase mb-1">Citations</div>
                                    <div className="text-xl font-bold text-foreground">12 Papers</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/10 border border-border">
                                    <div className="text-[10px] text-muted-foreground/60 uppercase mb-1">Nodes Traversed</div>
                                    <div className="text-xl font-bold text-foreground">142</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Causal Graph Snippet */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-primary" />
                            Visual Causal Path
                        </h2>
                        <div className="h-64 rounded-2xl bg-muted/20 border border-border flex items-center justify-center relative overflow-hidden">
                            {/* Abstract Graph Visualization */}
                            <div className="flex items-center gap-8 md:gap-16">
                                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">TFE3</div>
                                <div className="w-16 h-px bg-border relative">
                                    <div className="absolute -right-1 -top-1 w-2 h-2 border-t border-r border-border rotate-45"></div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-400">VCP</div>
                                <div className="w-16 h-px bg-border relative">
                                    <div className="absolute -right-1 -top-1 w-2 h-2 border-t border-r border-border rotate-45"></div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400">ASPS</div>
                            </div>
                            <div className="absolute bottom-4 text-[10px] text-muted-foreground/40 font-mono">SIMPLIFIED CAUSAL CHAIN</div>
                        </div>
                    </section>

                    {/* Provenance & Citations */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Evidence & Provenance
                        </h2>
                        <div className="space-y-3">
                            {[
                                { title: "VCP/p97 maintains mitochondrial homeostasis in ASPS", journal: "Nature Communications", year: "2024", id: "PMC1092831" },
                                { title: "TFE3 fusion proteins and metabolic reprogramming", journal: "Cancer Cell", year: "2023", id: "PMC982172" },
                                { title: "Targeting the VCP-p97 axis in rare sarcomas", journal: "Journal of Clinical Investigation", year: "2024", id: "PMC110293" }
                            ].map((paper, i) => (
                                <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border hover:bg-muted/30 transition-colors flex items-center justify-between group">
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{paper.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{paper.journal} • {paper.year} • {paper.id}</p>
                                    </div>
                                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
