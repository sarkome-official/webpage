import React, { useState } from 'react';
import { Database, FileJson, Table, Copy, FileText, Lock, Webhook } from 'lucide-react';

export const KnowledgeExportView = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Header */}

            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-10 gap-6 md:gap-8">
                {/* Left Column: Export Options */}
                <section className="flex-1 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Knowledge Graph Snippets</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Download high-fidelity, conflict-resolved slices of the ASPS Knowledge Graph.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Option 1: Neo4j Dump */}
                        <div className="bg-muted/20 border border-border p-4 md:p-6 rounded-xl flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-primary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-10 md:size-12 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Database className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-base md:text-lg">Neo4j Dump (.dump)</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground/60 mt-1 max-w-md">Full graph binary dump compatible with Neo4j Enterprise 5.x.</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[9px] md:text-[10px] bg-muted/30 text-muted-foreground px-2 py-0.5 rounded border border-border">Updated: 2h ago</span>
                                        <span className="text-[9px] md:text-[10px] bg-muted/30 text-muted-foreground px-2 py-0.5 rounded border border-border">Size: 1.2 GB</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto px-4 py-2 bg-muted/30 hover:bg-primary text-foreground rounded-lg font-bold text-xs md:text-sm transition-colors border border-border group-hover:border-primary group-hover:text-white">
                                Download
                            </button>
                        </div>

                        {/* Option 2: JSON Excerpt */}
                        <div className="bg-muted/20 border border-border p-6 rounded-xl flex items-start justify-between group hover:border-primary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <FileJson className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg">JSON Excerpt (Sarkome Schema)</h3>
                                    <p className="text-sm text-muted-foreground/60 mt-1 max-w-md">Lightweight JSON export of "Approved" edges only. Optimized for web visualization and analysis.</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[10px] bg-muted/30 text-muted-foreground px-2 py-0.5 rounded border border-border">Updated: Live</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-muted/30 hover:bg-amber-500/20 text-foreground rounded-lg font-bold text-sm transition-colors border border-border group-hover:border-amber-500 group-hover:text-amber-500">
                                Generate
                            </button>
                        </div>

                        {/* Option 3: CSV Triples */}
                        <div className="bg-muted/20 border border-border p-6 rounded-xl flex items-start justify-between group hover:border-primary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <Table className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg">RDF Triples / CSV</h3>
                                    <p className="text-sm text-muted-foreground/60 mt-1 max-w-md">Standard node-edge-node csv format. Suitable for import into other graph tools or spreadsheet analysis.</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-muted/30 hover:bg-purple-500/20 text-foreground rounded-lg font-bold text-sm transition-colors border border-border group-hover:border-purple-500 group-hover:text-purple-500">
                                Download
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Column: API Access */}
                <section className="flex-1">
                    <div className="bg-muted/20 rounded-2xl border border-border overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-border bg-muted/10">
                            <h3 className="text-foreground font-bold text-lg mb-1">API Access</h3>
                            <p className="text-muted-foreground text-sm">Programmatic access to the Sarkome Engine.</p>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            {/* Key Management */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Your API Key (Production)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-muted-foreground flex items-center justify-between">
                                        <span>sk_prod_592182...8d9a</span>
                                        <Copy className="w-4 h-4 text-muted-foreground/40 cursor-pointer hover:text-foreground" />
                                    </div>
                                    <button className="px-4 py-2 bg-muted/30 hover:bg-muted text-foreground rounded-lg font-bold text-sm border border-border">
                                        Rotate
                                    </button>
                                </div>
                            </div>

                            {/* Endpoint Status */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Endpoint Status</label>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 rounded bg-background/50 border border-border flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-emerald-500 relative">
                                            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                                        </span>
                                        <span className="text-xs font-mono text-foreground">/v1/query</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded bg-background/50 border border-border flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs font-mono text-foreground">/v1/graph/sync</span>
                                    </div>
                                </div>
                            </div>

                            {/* Example Request */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Example Request (cURL)</label>
                                <div className="bg-background/50 rounded-lg p-4 font-mono text-xs text-muted-foreground leading-relaxed overflow-x-auto border border-border">
                                    <span className="text-purple-400">curl</span> -X POST \<br />
                                    &nbsp;&nbsp;https://api.sarkome.bio/v1/cypher \<br />
                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer sk_prod_..."</span> \<br />
                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Content-Type: application/json"</span> \<br />
                                    &nbsp;&nbsp;-d <span className="text-yellow-400">{'{"query": "MATCH (n:Gene) RETURN n LIMIT 5"}'}</span>
                                </div>
                                <button className="w-full mt-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-medium transition-colors">
                                    View Full API Documentation
                                </button>
                            </div>

                            {/* Helpful Links */}
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                                <h3 className="text-primary font-bold text-sm mb-3">Documentation Resources</h3>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                        <FileText className="w-4 h-4" />
                                        Neo4j Schema Reference
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                        <Lock className="w-4 h-4" />
                                        Authentication & Scopes Guide
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                        <Webhook className="w-4 h-4" />
                                        Webhooks Configuration
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
