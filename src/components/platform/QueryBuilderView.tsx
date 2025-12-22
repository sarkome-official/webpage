import React, { useState } from 'react';

export const QueryBuilderView = () => {
    const [query, setQuery] = useState('');

    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Top Navigation - Inner Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] bg-[#111218] px-6 lg:px-10 py-3 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-[#1132d4] flex items-center justify-center bg-[#1132d4]/10 rounded-lg">
                        <span className="material-symbols-outlined text-[24px]">hub</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-white">Sarkome Intelligence</h2>
                        <p className="text-xs text-[#9da1b9] font-medium">Investigation Protocol</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg transition-colors text-sm font-bold border border-[#282b39]">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        History
                    </button>
                    <div className="h-8 w-px bg-[#282b39]"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-[#1132d4]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1132d4]/5 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-3xl z-10 flex flex-col gap-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Start New Investigation</h1>
                        <p className="text-lg text-[#9da1b9]">Initiate the Council of Agents to analyze complex biomedical queries.</p>
                    </div>

                    {/* Query Input */}
                    <div className="bg-[#1c1d27] p-2 rounded-2xl border border-[#282b39] shadow-2xl shadow-blue-900/10">
                        <div className="relative">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Describe your investigation target (e.g. 'Investigate efficacy of Tyrosine Kinase Inhibitors for Alveolar Soft Part Sarcoma')..."
                                className="w-full bg-[#111218] text-white text-lg placeholder:text-slate-600 rounded-xl p-6 min-h-[120px] outline-none border border-transparent focus:border-[#1132d4]/50 transition-colors resize-none"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                <button className="p-2 text-[#9da1b9] hover:text-white transition-colors rounded-lg hover:bg-[#282b39]" title="Attach Context">
                                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1132d4] hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all">
                                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                    Launch Council
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Starters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-[#1132d4]/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">medication</span>
                            </div>
                            <span className="text-white font-bold text-sm">Find New Drug Targets</span>
                            <p className="text-xs text-[#9da1b9]">Identify molecular targets for ASPS based on recent fusion protein studies.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-[#1132d4]/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                            </div>
                            <span className="text-white font-bold text-sm">Analyze Side Effects</span>
                            <p className="text-xs text-[#9da1b9]">Cross-reference clinical trial data to build a safety profile for a specific compound.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-[#1132d4]/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
                            </div>
                            <span className="text-white font-bold text-sm">Mechanism Comparison</span>
                            <p className="text-xs text-[#9da1b9]">Compare efficacy of different TKI generations against TFE3-ASPSCR1.</p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
