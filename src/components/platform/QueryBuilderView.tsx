import React, { useState } from 'react';

export const QueryBuilderView = () => {
    const [query, setQuery] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    const handleStart = () => {
        setIsStarting(true);
        setTimeout(() => {
            window.location.href = '/platform/agents';
        }, 2500);
    };

    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Top Navigation - Inner Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] bg-[#111218] px-4 md:px-6 lg:px-10 py-3 md:sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-indigo-400 flex items-center justify-center bg-indigo-500/10 rounded-lg shrink-0">
                        <span className="material-symbols-outlined text-[24px]">hub</span>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base md:text-lg font-bold leading-tight tracking-tight text-white truncate">Sarkome Intelligence</h2>
                        <p className="text-[10px] md:text-xs text-[#9da1b9] font-medium truncate">Investigation Protocol</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg transition-colors text-sm font-bold border border-[#282b39]">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        History
                    </button>
                    <div className="hidden sm:block h-8 w-px bg-[#282b39]"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-9 ring-2 ring-indigo-500/20 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-indigo-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-3xl z-10 flex flex-col gap-6 md:gap-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Start New Investigation</h1>
                        <p className="text-base md:text-lg text-[#9da1b9]">Initiate the Council of Agents to analyze complex biomedical queries.</p>
                    </div>

                    {/* Query Input */}
                    <div className="bg-[#1c1d27] p-2 rounded-2xl border border-[#282b39] shadow-2xl shadow-indigo-900/10">
                        <div className="relative">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Describe your investigation target..."
                                className="w-full bg-[#111218] text-white text-base md:text-lg placeholder:text-slate-600 rounded-xl p-4 md:p-6 min-h-[120px] md:min-h-[160px] outline-none border border-transparent focus:border-indigo-500/50 transition-colors resize-none"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 md:gap-3">
                                <button className="p-2 text-[#9da1b9] hover:text-white transition-colors rounded-lg hover:bg-[#282b39]" title="Attach Context">
                                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                </button>
                                <button 
                                    onClick={handleStart}
                                    className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all text-sm md:text-base"
                                >
                                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                    <span className="hidden xs:inline">Launch Council</span>
                                    <span className="xs:hidden">Launch</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Starters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-indigo-500/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">medication</span>
                            </div>
                            <span className="text-white font-bold text-sm">Find New Drug Targets</span>
                            <p className="text-xs text-[#9da1b9]">Identify molecular targets for ASPS based on recent fusion protein studies.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-indigo-500/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                            </div>
                            <span className="text-white font-bold text-sm">Analyze Side Effects</span>
                            <p className="text-xs text-[#9da1b9]">Cross-reference clinical trial data to build a safety profile for a specific compound.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-[#1c1d27] border border-[#282b39] hover:border-indigo-500/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
                            </div>
                            <span className="text-white font-bold text-sm">Mechanism Comparison</span>
                            <p className="text-xs text-[#9da1b9]">Compare efficacy of different TKI generations against TFE3-ASPSCR1.</p>
                        </button>
                    </div>
                </div>
            </main>

            {/* Launch Overlay */}
            {isStarting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101322] animate-in fade-in duration-500">
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Animated Logo/Spinner */}
                        <div className="relative size-24">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white animate-pulse">hub</span>
                            </div>
                        </div>
                        
                        {/* Text */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-white">Initializing Council</h2>
                            <p className="text-[#9da1b9] animate-pulse">Establishing secure connection to agent swarm...</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1 bg-[#282b39] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-in slide-in-from-left duration-[2500ms] w-full"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
