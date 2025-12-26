import React from 'react';
import { Database, Plus, Network, RefreshCw, CheckCircle2, Zap, FlaskConical, Settings, MoreVertical, FileText, Terminal } from 'lucide-react';

export const DataIngestionView = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Top Navigation - Inner Header */}

            {/* Main Content Info */}
            <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col gap-6 md:gap-8 max-w-[1600px] w-full mx-auto">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat Card 1 */}
                    <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Database className="w-[60px] h-[60px]" />
                        </div>
                        <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Connected Databases</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">12</span>
                            <span className="text-xs text-emerald-400 font-bold flex items-center">
                                <Plus className="w-3.5 h-3.5" />
                                2 new
                            </span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-primary w-[85%]"></div>
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Network className="w-[60px] h-[60px]" />
                        </div>
                        <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Knowledge Nodes</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">12.4M</span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-purple-500 w-[92%]"></div>
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <RefreshCw className="w-[60px] h-[60px]" />
                        </div>
                        <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">PrimeKG Sync</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-400">Up to Date</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-muted-foreground/40">Last synced: 2 hours ago</p>
                    </div>
                    {/* Stat Card 4 */}
                    <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap className="w-[60px] h-[60px]" />
                        </div>
                        <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">API Latency</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-primary">24ms</span>
                            <span className="text-xs text-muted-foreground">Avg response</span>
                        </div>
                        <p className="text-xs text-muted-foreground/40">Optimized via Edge</p>
                    </div>
                </div>

                {/* Queue & Status Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    {/* Left: Active Ingestion Queue */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Embedded Databases
                            </h3>
                            <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Manage Connections</button>
                        </div>

                        <div className="bg-muted/20 border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/10 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                            <th className="px-6 py-4 font-bold">Database Name</th>
                                            <th className="px-6 py-4 font-bold">Modality</th>
                                            <th className="px-6 py-4 font-bold">Records</th>
                                            <th className="px-6 py-4 font-bold">Sync Status</th>
                                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-border">
                                        <tr className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <FlaskConical className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">AlphaFold Database API</p>
                                                        <p className="text-xs text-muted-foreground/40">Structural Biology Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">Protein Structures</td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">214,681 Models</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                    Live Connection
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"><Settings className="w-[18px] h-[18px]" /></button>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                                        <Network className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">PrimeKG Knowledge Substrate</p>
                                                        <p className="text-xs text-muted-foreground/40">Causal Graph Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">Relational Graph</td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">110M Edges</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Synced
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"><MoreVertical className="w-[18px] h-[18px]" /></button>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <FileText className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">PubMed Central (PMC)</p>
                                                        <p className="text-xs text-muted-foreground/40">Natural Language Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">Scientific Literature</td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">5.2M Articles</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Indexed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"><MoreVertical className="w-[18px] h-[18px]" /></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: System Logs */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            System Logs
                        </h3>
                        <div className="bg-muted/10 rounded-xl border border-border overflow-hidden flex flex-col h-[500px]">
                            <div className="px-4 py-3 bg-muted/20 border-b border-border flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-muted-foreground/60" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Console Output</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="size-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                                    <div className="size-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                                    <div className="size-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                                </div>
                            </div>
                            <div className="p-4 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-1.5 bg-background/50">
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:42:01</span>
                                    <span className="text-primary">[INFO]</span>
                                    <span>Initializing Neo4j Bolt driver...</span>
                                </div>
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:42:02</span>
                                    <span className="text-emerald-400">[SUCCESS]</span>
                                    <span>Connection established. Session active.</span>
                                </div>
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:42:15</span>
                                    <span className="text-primary">[INFO]</span>
                                    <span>Establishing secure handshake with AlphaFold API (v4)...</span>
                                </div>
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:42:18</span>
                                    <span className="text-yellow-400">[WARN]</span>
                                    <span>Rate limit threshold approaching for UniProt endpoint. Throttling requests.</span>
                                </div>
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:42:22</span>
                                    <span className="text-red-400">[ERROR]</span>
                                    <span>PrimeKG Sync: Connection timeout on node resolution. Retrying...</span>
                                </div>
                                <div className="flex gap-3 text-muted-foreground/60">
                                    <span className="opacity-50 w-16">10:43:05</span>
                                    <span className="text-primary">[INFO]</span>
                                    <span className="text-muted-foreground">Entity Resolution: Found 12 new potential 'Gene' entities in ASPS context. <span className="animate-pulse">_</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
