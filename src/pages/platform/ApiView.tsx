import React, { useState } from 'react';
import { Database, FileJson, Table, Copy, FileText, Lock, Webhook } from 'lucide-react';

export const ApiView = () => {
    const [showWipDialog, setShowWipDialog] = useState(true);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Header */}

            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-10 gap-6 md:gap-8">
                {/* Left Column: Export Options */}


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

                        </div>
                    </div>
                </section>
            </div>

            {showWipDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-background border border-border p-6 rounded-xl shadow-2xl max-w-sm w-full mx-auto relative animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="p-3 bg-primary/10 rounded-full mb-2">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">We are working here</h2>
                            <p className="text-sm text-muted-foreground">
                                The API management interface is currently under development. Stay tuned for updates!
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center w-full">
                            <button
                                onClick={() => setShowWipDialog(false)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
