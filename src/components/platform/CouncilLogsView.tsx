import React from 'react';

export const CouncilLogsView = () => {
    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Top Navigation - Adapted for Dashboard context */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] px-4 md:px-10 py-3 bg-[#111218] md:sticky top-0 z-20">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-3 md:gap-4 text-white">
                        <div className="size-8 flex items-center justify-center bg-indigo-600 rounded-lg text-white shrink-0">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>hub</span>
                        </div>
                        <h2 className="text-base md:text-lg font-bold leading-tight tracking-[-0.015em] truncate">Council Logs</h2>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                    <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-[#9da1b9] flex border-none bg-[#282b39] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-[#9da1b9]" style={{ fontSize: '20px' }}>search</span>
                            </div>
                            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#282b39] focus:border-none h-full placeholder:text-[#9da1b9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search logs..." />
                        </div>
                    </label>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-10 ring-2 ring-[#1132d4]/20 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-6">
                        {/* Breadcrumbs & Heading */}
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2 px-2 md:px-4 pt-2">
                                <a className="text-[#9da1b9] text-xs md:text-sm font-medium leading-normal hover:underline" href="#">Home</a>
                                <span className="text-[#9da1b9] text-xs md:text-sm font-medium leading-normal">/</span>
                                <a className="text-[#9da1b9] text-xs md:text-sm font-medium leading-normal hover:underline" href="#">Pipeline Runs</a>
                                <span className="text-[#9da1b9] text-xs md:text-sm font-medium leading-normal">/</span>
                                <span className="text-white text-xs md:text-sm font-medium leading-normal">Log ID: #CK-9921</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-4 md:p-6 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm">
                                <div className="flex flex-col gap-2 max-w-3xl">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-amber-500/10 text-amber-400 text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wide border border-amber-500/20">Reviewing</span>
                                        <span className="text-[#9da1b9] text-xs md:text-sm">Started 2 mins ago</span>
                                    </div>
                                    <h1 className="text-white text-xl md:text-3xl font-bold leading-tight tracking-[-0.033em]">Query: Efficacy of Tyrosine Kinase Inhibitors in ASPS</h1>
                                    <p className="text-[#9da1b9] text-sm md:text-base">Target Entity: <span className="text-indigo-400 font-medium">TFE3-ASPSCR1 Fusion</span> • Data Source: PubMed, ClinicalTrials.gov</p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#282b39] text-white rounded-lg hover:bg-[#34384b] transition-colors text-xs md:text-sm font-bold">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Raw Logs
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/platform/knowledge-graph'}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1132d4] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-bold shadow-lg shadow-blue-900/20"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">account_tree</span>
                                        View Graph
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
                            {/* Left Column: Agents & Synthesis (8 cols) */}
                            <div className="lg:col-span-8 flex flex-col gap-8">
                                {/* Agents Section */}
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-white text-xl font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-indigo-400">groups</span>
                                        Council Agents Analysis
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Agent 1: Molecular Biologist */}
                                        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                                                        <span className="material-symbols-outlined">biotech</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">Molecular Biologist</h3>
                                                        <p className="text-xs text-[#9da1b9]">Focus: Pathways & Genomics</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-emerald-500">88% Conf.</span>
                                                    <div className="w-16 h-1 bg-[#282b39] rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-[88%]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#111218] p-3 rounded-lg border border-[#282b39]/50 text-sm text-[#cbd5e1] leading-relaxed">
                                                "Identified significant upregulation in MET and VEGFR2 pathways consequent to TFE3 fusion. Tyrosine Kinase Inhibitors (TKIs) show strong mechanistic potential."
                                            </div>
                                            <button className="text-xs font-bold text-indigo-400 hover:underline self-start mt-1 flex items-center gap-1">
                                                VIEW CITATIONS (3)
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                            </button>
                                        </div>
                                        {/* Agent 2: Clinical Trialist */}
                                        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                                                        <span className="material-symbols-outlined">clinical_notes</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">Clinical Trialist</h3>
                                                        <p className="text-xs text-[#9da1b9]">Focus: Human Data</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-emerald-500">92% Conf.</span>
                                                    <div className="w-16 h-1 bg-[#282b39] rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-[92%]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#111218] p-3 rounded-lg border border-[#282b39]/50 text-sm text-[#cbd5e1] leading-relaxed">
                                                "Phase 2 data (NCT021...) indicates 40% response rate. Sunitinib demonstrates clear efficacy signals in small cohorts."
                                            </div>
                                            <button className="text-xs font-bold text-indigo-400 hover:underline self-start mt-1 flex items-center gap-1">
                                                VIEW TRIALS (2)
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                            </button>
                                        </div>
                                        {/* Agent 3: Toxicologist */}
                                        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-400">
                                                        <span className="material-symbols-outlined">science</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">Toxicologist</h3>
                                                        <p className="text-xs text-[#9da1b9]">Focus: Adverse Events</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-amber-500">75% Conf.</span>
                                                    <div className="w-16 h-1 bg-[#282b39] rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-amber-500 w-[75%]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#111218] p-3 rounded-lg border border-[#282b39]/50 text-sm text-[#cbd5e1] leading-relaxed">
                                                "Liver toxicity (Grade 3/4) noted in 15% of patients. Requires strict monitoring protocols. Long-term cardiac effects unclear."
                                            </div>
                                            <button className="text-xs font-bold text-indigo-400 hover:underline self-start mt-1 flex items-center gap-1">
                                                VIEW ADVERSE EVENTS
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                            </button>
                                        </div>
                                        {/* Agent 4: Devil's Advocate */}
                                        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm relative overflow-hidden">
                                            <div className="absolute -right-4 -top-4 size-16 bg-red-500/5 rounded-full blur-xl"></div>
                                            <div className="flex justify-between items-start z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                                                        <span className="material-symbols-outlined">gavel</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">Devil's Advocate</h3>
                                                        <p className="text-xs text-[#9da1b9]">Focus: Critique & Bias</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-red-500">High Risk</span>
                                                    <div className="w-16 h-1 bg-[#282b39] rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-red-500 w-[60%]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#321c1c] p-3 rounded-lg border border-red-900/50 text-sm text-red-100 leading-relaxed z-10">
                                                "Challenge: Sample sizes in cited trials are statistically insignificant (n &lt; 15). Selection bias probable due to open-label nature."
                                            </div>
                                            <button className="text-xs font-bold text-red-400 hover:underline self-start mt-1 flex items-center gap-1 z-10">
                                                VIEW COUNTER-ARGUMENTS
                                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Chairman's Synthesis */}
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-white text-xl font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">balance</span>
                                        Chairman's Synthesis
                                    </h2>
                                    <div className="relative p-6 rounded-xl bg-[#1c1d27] border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] overflow-hidden">
                                        {/* Decorative background element */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="flex-1 flex flex-col gap-4">
                                                <div>
                                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Truth or False Verification</div>
                                                    <p className="text-white text-lg font-medium leading-relaxed">
                                                        "Final Causal Truth: The VCP-Metabolic axis is a primary driver of ASPS progression. This relationship is validated by multi-agent consensus and is ready for integration into the Knowledge Graph substrate."
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <button className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/30 transition-all group text-left">
                                                        <div className="text-xs text-emerald-400/70 font-medium group-hover:text-emerald-400 transition-colors">Reinforcement Learning Action</div>
                                                        <div className="text-emerald-400 font-bold flex items-center gap-2 mt-1">
                                                            <span className="material-symbols-outlined text-sm">upload_file</span>
                                                            YES: UPLOAD TO GRAPH
                                                        </div>
                                                    </button>
                                                    <button className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all group text-left">
                                                        <div className="text-xs text-red-400/70 font-medium group-hover:text-red-400 transition-colors">Causal Rejection</div>
                                                        <div className="text-red-400 font-bold flex items-center gap-2 mt-1">
                                                            <span className="material-symbols-outlined text-sm">cancel</span>
                                                            NO: DISCARD EVIDENCE
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="lg:w-64 flex flex-col justify-center items-center gap-2 p-4 bg-[#111218] rounded-xl border border-[#282b39]">
                                                <div className="relative size-24 flex items-center justify-center">
                                                    {/* Radial Progress Background */}
                                                    <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                                                        <circle className="text-[#282b39]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                                        <circle className="text-indigo-500" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="20" strokeLinecap="round" strokeWidth="8"></circle>
                                                    </svg>
                                                    <div className="absolute flex flex-col items-center">
                                                        <span className="text-2xl font-bold text-white">92%</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-[#9da1b9]">Final Confidence</div>
                                                <button 
                                                    onClick={() => window.location.href = '/platform/report'}
                                                    className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
                                                >
                                                    Download Inform
                                                </button>
                                                <button 
                                                    onClick={() => window.location.href = '/platform/simulation'}
                                                    className="w-full py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-bold rounded-lg transition-colors border border-indigo-500/20"
                                                >
                                                    Run Simulation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column: Metadata & Details (4 cols) */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {/* Pipeline Stats Card */}
                                <div className="p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm flex flex-col gap-4">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-[#282b39] pb-2">Pipeline Metadata</h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#9da1b9] text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                Execution Time
                                            </span>
                                            <span className="text-white text-sm font-medium">4.2s</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#9da1b9] text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">token</span>
                                                Tokens Used
                                            </span>
                                            <span className="text-white text-sm font-medium">12,405</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#9da1b9] text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">memory</span>
                                                Model
                                            </span>
                                            <span className="text-white text-sm font-medium">Gemini 3 Flash</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#9da1b9] text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">attach_money</span>
                                                Cost Estimate
                                            </span>
                                            <span className="text-white text-sm font-medium">$0.24</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Related Knowledge Graph Nodes */}
                                <div className="p-5 rounded-xl bg-[#1c1d27] border border-[#282b39] shadow-sm flex flex-col gap-4">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-[#282b39] pb-2">Graph Connections</h3>
                                    <div className="flex flex-col gap-2">
                                        <a className="group flex items-center gap-3 p-2 hover:bg-[#282b39] rounded-lg transition-colors" href="#">
                                            <div className="size-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <span className="material-symbols-outlined text-[18px]">share</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-bold group-hover:text-indigo-400 transition-colors">MET Oncogene</span>
                                                <span className="text-[#9da1b9] text-xs">Strong Correlation</span>
                                            </div>
                                        </a>
                                        <a className="group flex items-center gap-3 p-2 hover:bg-[#282b39] rounded-lg transition-colors" href="#">
                                            <div className="size-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <span className="material-symbols-outlined text-[18px]">share</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-bold group-hover:text-indigo-400 transition-colors">Sunitinib Malate</span>
                                                <span className="text-[#9da1b9] text-xs">Direct Treatment</span>
                                            </div>
                                        </a>
                                        <a className="group flex items-center gap-3 p-2 hover:bg-[#282b39] rounded-lg transition-colors" href="#">
                                            <div className="size-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <span className="material-symbols-outlined text-[18px]">share</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-bold group-hover:text-indigo-400 transition-colors">VEGFR2</span>
                                                <span className="text-[#9da1b9] text-xs">Target Pathway</span>
                                            </div>
                                        </a>
                                    </div>
                                    <button className="w-full mt-2 text-[#9da1b9] hover:text-indigo-400 text-xs font-bold transition-colors">
                                        VIEW ALL 12 CONNECTIONS
                                    </button>
                                </div>
                                {/* Raw Data Teaser */}
                                <div className="relative w-full h-32 rounded-xl bg-[#111218] border border-[#282b39] overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0 opacity-40 bg-[url('https://placeholder.pics/svg/400x150/1c1d27/282b39/JSON%20Structure')] bg-cover bg-center"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111218] to-transparent"></div>
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-[#9da1b9]">Raw Format</div>
                                            <div className="text-white font-bold text-sm">council_log.json</div>
                                        </div>
                                        <div className="size-8 rounded-full bg-[#282b39] flex items-center justify-center text-white group-hover:bg-[#1132d4] transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">code</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
