import React, { useState } from 'react';

export const AgentPerformanceView = () => {
    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] bg-[#111218] px-6 lg:px-10 py-3 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-[#1132d4] flex items-center justify-center bg-[#1132d4]/10 rounded-lg">
                        <span className="material-symbols-outlined text-[24px]">hub</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-white">Council Overwatch</h2>
                        <p className="text-xs text-[#9da1b9] font-medium">Agent Performance & Cost Metrics</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Healthy
                    </span>
                    <div className="h-8 w-px bg-[#282b39]"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-[#1132d4]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            <main className="flex-1 p-6 lg:p-10 max-w-[1600px] w-full mx-auto flex flex-col gap-8">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#1c1d27] border border-[#282b39] p-5 rounded-xl">
                        <p className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider mb-2">Total Tokens (Session)</p>
                        <p className="text-3xl font-bold text-white mb-2">1.4M</p>
                        <div className="h-1.5 w-full bg-[#111218] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1132d4] w-[75%]"></div>
                        </div>
                    </div>
                    <div className="bg-[#1c1d27] border border-[#282b39] p-5 rounded-xl">
                        <p className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider mb-2">Est. Cost (Run)</p>
                        <p className="text-3xl font-bold text-white mb-2">$4.28</p>
                        <p className="text-xs text-[#9da1b9]">+ $0.12 last hr</p>
                    </div>
                    <div className="bg-[#1c1d27] border border-[#282b39] p-5 rounded-xl">
                        <p className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider mb-2">Active Agents</p>
                        <p className="text-3xl font-bold text-emerald-400 mb-2">4/5</p>
                        <p className="text-xs text-[#9da1b9]">Toxicologist Idle</p>
                    </div>
                    <div className="bg-[#1c1d27] border border-[#282b39] p-5 rounded-xl">
                        <p className="text-[#9da1b9] text-xs font-bold uppercase tracking-wider mb-2">Graph Updates</p>
                        <p className="text-3xl font-bold text-amber-500 mb-2">852</p>
                        <p className="text-xs text-[#9da1b9]">New Nodes/Edges</p>
                    </div>
                </div>

                {/* Agent Status Grid */}
                <h3 className="text-lg font-bold text-white mt-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1132d4]">groups</span>
                    Live Agent Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {/* Agent 1 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <span className="material-symbols-outlined">biotech</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Bio-Specialist</h4>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Thinking
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden relative z-10">
                            <span className="text-blue-400">{'>'}</span> Analyzing VEGFR2 phosphorylation pathway impact...
                            <br />
                            <span className="text-blue-400">{'>'}</span> Querying generic background knowledge...
                        </div>
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none"></div>
                    </div>

                    {/* Agent 2 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                <span className="material-symbols-outlined">clinical_notes</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Clin-Trialist</h4>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Extracting
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden">
                            <span className="text-purple-400">{'>'}</span> Parsing Table 2 from PDF...
                            <br />
                            <span className="text-purple-400">{'>'}</span> Normalizing dosage units (mg/kg)...
                        </div>
                    </div>

                    {/* Agent 3 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-4 flex flex-col gap-4 opacity-75">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                                <span className="material-symbols-outlined">science</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Toxicologist</h4>
                                <p className="text-[10px] text-[#6b7280] font-bold uppercase flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-[#6b7280]"></span>
                                    Idle
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden flex items-center justify-center italic text-[#6b7280]">
                            Waiting for tasks...
                        </div>
                    </div>

                    {/* Agent 4 */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                                <span className="material-symbols-outlined">gavel</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Skeptic</h4>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Reviewing
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden">
                            <span className="text-red-400">{'>'}</span> Checking p-value validity...
                            <br />
                            <span className="text-red-400">{'>'}</span> Scanning for conflict of interest...
                        </div>
                    </div>

                    {/* Agent 5 - Chairman */}
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-4 flex flex-col gap-4 ring-1 ring-amber-500/30">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                                <span className="material-symbols-outlined">balance</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Chairman</h4>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Synthesizing
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden">
                            <span className="text-amber-500">{'>'}</span> Resolving Bio vs Skeptic conflict...
                            <br />
                            <span className="text-amber-500">{'>'}</span> 80% consensus achieved.
                        </div>
                    </div>
                </div>

                {/* Activity & Logs Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl p-5 flex flex-col">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Thought Chain Volume</h3>
                        {/* Fake Chart Bars */}
                        <div className="flex-1 flex items-end gap-2 px-2 pb-2">
                            {[40, 65, 30, 80, 55, 40, 70, 90, 60, 45, 75, 50, 65, 85, 40].map((h, i) => (
                                <div key={i} className="flex-1 bg-[#1132d4]/30 hover:bg-[#1132d4] transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h} thoughts
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-[#282b39] pt-2 flex justify-between text-[10px] text-[#6b7280]">
                            <span>10:30 AM</span>
                            <span>Current</span>
                        </div>
                    </div>

                    <div className="bg-[#1c1d27] border border-[#282b39] rounded-xl overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-[#111218] border-b border-[#282b39]">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Event Stream</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                            <div className="flex gap-2 text-[#9da1b9]">
                                <span className="text-[#6b7280]">10:44:12</span>
                                <span className="text-blue-400">[Bio]</span>
                                <span>Identified target: MET</span>
                            </div>
                            <div className="flex gap-2 text-[#9da1b9]">
                                <span className="text-[#6b7280]">10:44:15</span>
                                <span className="text-purple-400">[Clin]</span>
                                <span>Found 2 relevant trials</span>
                            </div>
                            <div className="flex gap-2 text-[#9da1b9]">
                                <span className="text-[#6b7280]">10:44:18</span>
                                <span className="text-red-400">[Skeptic]</span>
                                <span>Questioning sample size (n=12)</span>
                            </div>
                            <div className="flex gap-2 text-[#9da1b9]">
                                <span className="text-[#6b7280]">10:44:22</span>
                                <span className="text-amber-500">[Chair]</span>
                                <span>Decision: Approved (Low Confidence)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
