import React from 'react';

export const DataIngestionView = () => {
    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Top Navigation - Inner Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] bg-[#111218] px-4 md:px-6 lg:px-10 py-3 md:sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-[#1132d4] flex items-center justify-center bg-[#1132d4]/10 rounded-lg shrink-0">
                        <span className="material-symbols-outlined text-[24px]">hub</span>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base md:text-lg font-bold leading-tight tracking-tight text-white truncate">Data Refinery</h2>
                        <p className="text-[10px] md:text-xs text-[#9da1b9] font-medium truncate">Ingestion & Management Console</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#1132d4] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-bold shadow-lg shadow-blue-900/20">
                        <span className="material-symbols-outlined text-[18px]">add_database</span>
                        <span className="hidden sm:inline">Connect Database</span>
                        <span className="sm:hidden">Connect</span>
                    </button>
                    <div className="hidden sm:block h-8 w-px bg-[#282b39]"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-9 ring-2 ring-[#1132d4]/20 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            {/* Main Content Info */}
            <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col gap-6 md:gap-8 max-w-[1600px] w-full mx-auto">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat Card 1 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[60px]">database</span>
                        </div>
                        <div className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider">Connected Databases</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">12</span>
                            <span className="text-xs text-emerald-400 font-bold flex items-center">
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                2 new
                            </span>
                        </div>
                        <div className="h-1 w-full bg-[#282b39] rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-[#1132d4] w-[85%]"></div>
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[60px]">hub</span>
                        </div>
                        <div className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider">Total Knowledge Nodes</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">12.4M</span>
                        </div>
                        <div className="h-1 w-full bg-[#282b39] rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-purple-500 w-[92%]"></div>
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[60px]">sync</span>
                        </div>
                        <div className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider">PrimeKG Sync</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-400">Up to Date</span>
                            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                        </div>
                        <p className="text-xs text-[#6b7280]">Last synced: 2 hours ago</p>
                    </div>
                    {/* Stat Card 4 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[60px]">bolt</span>
                        </div>
                        <div className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider">API Latency</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-indigo-400">24ms</span>
                            <span className="text-xs text-[#9da1b9]">Avg response</span>
                        </div>
                        <p className="text-xs text-[#6b7280]">Optimized via Edge</p>
                    </div>
                </div>

                {/* Queue & Status Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    {/* Left: Active Ingestion Queue */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#1132d4]">database</span>
                                Embedded Databases
                            </h3>
                            <button className="text-xs font-bold text-[#1132d4] hover:text-blue-400 transition-colors">Manage Connections</button>
                        </div>

                        <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#111218] border-b border-[#282b39] text-xs uppercase tracking-wider text-[#9da1b9]">
                                            <th className="px-6 py-4 font-bold">Database Name</th>
                                            <th className="px-6 py-4 font-bold">Modality</th>
                                            <th className="px-6 py-4 font-bold">Records</th>
                                            <th className="px-6 py-4 font-bold">Sync Status</th>
                                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-[#282b39]">
                                        <tr className="group hover:bg-[#282b39]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-[18px]">biotech</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">AlphaFold Database API</p>
                                                        <p className="text-xs text-[#6b7280]">Structural Biology Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#9da1b9]">Protein Structures</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#9da1b9]">214,681 Models</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                                    Live Connection
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-[#9da1b9] hover:text-white hover:bg-[#282b39] rounded transition-colors"><span className="material-symbols-outlined text-[18px]">settings</span></button>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-[#282b39]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-[18px]">hub</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">PrimeKG Knowledge Substrate</p>
                                                        <p className="text-xs text-[#6b7280]">Causal Graph Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#9da1b9]">Relational Graph</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#9da1b9]">110M Edges</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Synced
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-[#9da1b9] hover:text-white hover:bg-[#282b39] rounded transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-[#282b39]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-[18px]">article</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">PubMed Central (PMC)</p>
                                                        <p className="text-xs text-[#6b7280]">Natural Language Modality</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#9da1b9]">Scientific Literature</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#9da1b9]">5.2M Articles</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Indexed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-[#9da1b9] hover:text-white hover:bg-[#282b39] rounded transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: System Logs */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            System Logs
                        </h3>
                        <div className="bg-[#111218] rounded-xl border border-[#282b39] overflow-hidden flex flex-col h-[500px]">
                            <div className="px-4 py-3 bg-[#161926] border-b border-[#282b39] flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-[16px]">terminal</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Console Output</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="size-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                                    <div className="size-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                                    <div className="size-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                                </div>
                            </div>
                            <div className="p-4 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-1.5 bg-[#0a0b10]">
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:42:01</span>
                                    <span className="text-blue-400">[INFO]</span>
                                    <span>Initializing Neo4j Bolt driver...</span>
                                </div>
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:42:02</span>
                                    <span className="text-emerald-400">[SUCCESS]</span>
                                    <span>Connection established. Session active.</span>
                                </div>
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:42:15</span>
                                    <span className="text-blue-400">[INFO]</span>
                                    <span>Establishing secure handshake with AlphaFold API (v4)...</span>
                                </div>
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:42:18</span>
                                    <span className="text-yellow-400">[WARN]</span>
                                    <span>Rate limit threshold approaching for UniProt endpoint. Throttling requests.</span>
                                </div>
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:42:22</span>
                                    <span className="text-red-400">[ERROR]</span>
                                    <span>PrimeKG Sync: Connection timeout on node resolution. Retrying...</span>
                                </div>
                                <div className="flex gap-3 text-slate-500">
                                    <span className="opacity-50 w-16">10:43:05</span>
                                    <span className="text-blue-400">[INFO]</span>
                                    <span className="text-slate-300">Entity Resolution: Found 12 new potential 'Gene' entities in ASPS context. <span className="animate-pulse">_</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
