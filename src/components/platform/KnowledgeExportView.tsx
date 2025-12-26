import React, { useState } from 'react';

export const KnowledgeExportView = () => {
    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Header */}

            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 gap-6 md:gap-8">
                {/* Left Column: Export Options */}
                <section className="flex-1 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Knowledge Graph Snippets</h2>
                        <p className="text-sm md:text-base text-[#9da1b9]">Download high-fidelity, conflict-resolved slices of the ASPS Knowledge Graph.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Option 1: Neo4j Dump */}
                        <div className="bg-[#1c1d27] border border-[#282b39] p-4 md:p-6 rounded-xl flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-[#1132d4]/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-10 md:size-12 rounded bg-[#1132d4]/10 flex items-center justify-center text-[#1132d4] shrink-0">
                                    <span className="material-symbols-outlined text-[24px] md:text-[28px]">database</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base md:text-lg">Neo4j Dump (.dump)</h3>
                                    <p className="text-xs md:text-sm text-[#9da1b9] mt-1 max-w-md">Full graph binary dump compatible with Neo4j Enterprise 5.x.</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[9px] md:text-[10px] bg-[#282b39] text-[#9da1b9] px-2 py-0.5 rounded border border-[#282b39]">Updated: 2h ago</span>
                                        <span className="text-[9px] md:text-[10px] bg-[#282b39] text-[#9da1b9] px-2 py-0.5 rounded border border-[#282b39]">Size: 1.2 GB</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg font-bold text-xs md:text-sm transition-colors border border-[#383d52] group-hover:bg-[#1132d4] group-hover:border-[#1132d4] group-hover:text-white">
                                Download
                            </button>
                        </div>

                        {/* Option 2: JSON Excerpt */}
                        <div className="bg-[#1c1d27] border border-[#282b39] p-6 rounded-xl flex items-start justify-between group hover:border-[#1132d4]/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <span className="material-symbols-outlined text-[28px]">data_object</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">JSON Excerpt (Sarkome Schema)</h3>
                                    <p className="text-sm text-[#9da1b9] mt-1 max-w-md">Lightweight JSON export of "Approved" edges only. Optimized for web visualization and analysis.</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[10px] bg-[#282b39] text-[#9da1b9] px-2 py-0.5 rounded border border-[#282b39]">Updated: Live</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg font-bold text-sm transition-colors border border-[#383d52] group-hover:border-amber-500 group-hover:text-amber-500 group-hover:bg-amber-500/10">
                                Generate
                            </button>
                        </div>

                        {/* Option 3: CSV Triples */}
                        <div className="bg-[#1c1d27] border border-[#282b39] p-6 rounded-xl flex items-start justify-between group hover:border-[#1132d4]/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <span className="material-symbols-outlined text-[28px]">table_chart</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">RDF Triples / CSV</h3>
                                    <p className="text-sm text-[#9da1b9] mt-1 max-w-md">Standard node-edge-node csv format. Suitable for import into other graph tools or spreadsheet analysis.</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg font-bold text-sm transition-colors border border-[#383d52] group-hover:border-purple-500 group-hover:text-purple-500 group-hover:bg-purple-500/10">
                                Download
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Column: API Access */}
                <section className="flex-1">
                    <div className="bg-[#1c1d27] rounded-2xl border border-[#282b39] overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-[#282b39] bg-[#161926]">
                            <h3 className="text-white font-bold text-lg mb-1">API Access</h3>
                            <p className="text-[#9da1b9] text-sm">Programmatic access to the Sarkome Engine.</p>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            {/* Key Management */}
                            <div>
                                <label className="text-xs font-bold text-[#9da1b9] uppercase tracking-wider mb-2 block">Your API Key (Production)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[#111218] border border-[#282b39] rounded-lg px-4 py-2.5 font-mono text-sm text-slate-300 flex items-center justify-between">
                                        <span>sk_prod_592182...8d9a</span>
                                        <span className="material-symbols-outlined text-[#9da1b9] cursor-pointer hover:text-white" style={{ fontSize: '16px' }}>content_copy</span>
                                    </div>
                                    <button className="px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg font-bold text-sm border border-[#383d52]">
                                        Rotate
                                    </button>
                                </div>
                            </div>

                            {/* Endpoint Status */}
                            <div>
                                <label className="text-xs font-bold text-[#9da1b9] uppercase tracking-wider mb-2 block">Endpoint Status</label>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 rounded bg-[#111218] border border-[#282b39] flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-green-500 relative">
                                            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                        </span>
                                        <span className="text-xs font-mono text-white">/v1/query</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded bg-[#111218] border border-[#282b39] flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs font-mono text-white">/v1/graph/sync</span>
                                    </div>
                                </div>
                            </div>

                            {/* Example Request */}
                            <div>
                                <label className="text-xs font-bold text-[#9da1b9] uppercase tracking-wider mb-2 block">Example Request (cURL)</label>
                                <div className="bg-[#111218] rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto border border-[#282b39]">
                                    <span className="text-purple-400">curl</span> -X POST \<br />
                                    &nbsp;&nbsp;https://api.sarkome.bio/v1/cypher \<br />
                                    &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer sk_prod_..."</span> \<br />
                                    &nbsp;&nbsp;-H <span className="text-green-400">"Content-Type: application/json"</span> \<br />
                                    &nbsp;&nbsp;-d <span className="text-yellow-400">{'{"query": "MATCH (n:Gene) RETURN n LIMIT 5"}'}</span>
                                </div>
                                <button className="w-full mt-4 py-2 rounded border border-[#282b39] text-[#9da1b9] hover:text-white hover:bg-[#282b39] text-xs font-medium transition-colors">
                                    View Full API Documentation
                                </button>
                            </div>

                            {/* Helpful Links */}
                            <div className="bg-[#1132d4]/5 border border-[#1132d4]/20 rounded-xl p-5">
                                <h3 className="text-[#1132d4] font-bold text-sm mb-3">Documentation Resources</h3>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-center gap-2 text-sm text-[#9da1b9] hover:text-[#1132d4] cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">article</span>
                                        Neo4j Schema Reference
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#9da1b9] hover:text-[#1132d4] cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">lock</span>
                                        Authentication & Scopes Guide
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-[#9da1b9] hover:text-[#1132d4] cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">webhook</span>
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
