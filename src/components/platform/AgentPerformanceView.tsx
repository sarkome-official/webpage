import React, { useState, useEffect } from 'react';

interface Agent {
    id: string;
    name: string;
    icon: string;
    color: 'blue' | 'purple' | 'orange' | 'red' | 'amber';
    status: string;
    logs: string[];
    isChairman?: boolean;
}

const agentsData: Agent[] = [
    {
        id: 'bio',
        name: 'Bio-Specialist',
        icon: 'biotech',
        color: 'blue',
        status: 'Thinking',
        logs: [
            'Analyzing VEGFR2 phosphorylation pathway impact...',
            'Querying generic background knowledge...',
            'Cross-referencing protein interactions...',
            'Evaluating signal transduction efficacy...',
            'Mapping gene expression profiles...',
            'Identifying potential biomarkers...'
        ]
    },
    {
        id: 'clin',
        name: 'Clin-Trialist',
        icon: 'clinical_notes',
        color: 'purple',
        status: 'Extracting',
        logs: [
            'Parsing Table 2 from PDF...',
            'Normalizing dosage units (mg/kg)...',
            'Identifying exclusion criteria...',
            'Verifying patient cohort demographics...',
            'Extracting adverse event tables...',
            'Standardizing endpoint definitions...'
        ]
    },
    {
        id: 'tox',
        name: 'Toxicologist',
        icon: 'science',
        color: 'orange',
        status: 'Thinking',
        logs: [
            'Analyzing adverse event reports...',
            'Calculating LD50 projections...',
            'Reviewing hepatotoxicity markers...',
            'Simulating metabolic clearance rates...',
            'Checking drug-drug interaction risks...',
            'Evaluating long-term exposure data...'
        ]
    },
    {
        id: 'skeptic',
        name: 'Skeptic',
        icon: 'gavel',
        color: 'red',
        status: 'Reviewing',
        logs: [
            'Checking p-value validity...',
            'Scanning for conflict of interest...',
            'Auditing sample size calculations...',
            'Verifying statistical methodology...',
            'Challenging efficacy claims...',
            'Looking for data inconsistencies...'
        ]
    },
    {
        id: 'chairman',
        name: 'Chairman',
        icon: 'balance',
        color: 'amber',
        status: 'Waiting',
        logs: [
            'Awaiting Bio-Specialist report...',
            'Awaiting Clin-Trialist data...',
            'Awaiting Toxicologist analysis...',
            'Awaiting Skeptic review...',
            'Standing by for consensus...'
        ],
        isChairman: true
    }
];

const AgentCard = ({ agent }: { agent: Agent }) => {
    const [logIndex, setLogIndex] = useState(0);

    // Color mapping for dynamic styles
    const colors = {
        blue: {
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            border: 'border-blue-500/20',
            dot: 'bg-blue-400',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/40'
        },
        purple: {
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            border: 'border-purple-500/20',
            dot: 'bg-purple-400',
            glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)] border-purple-500/40'
        },
        orange: {
            bg: 'bg-orange-500/10',
            text: 'text-orange-400',
            border: 'border-orange-500/20',
            dot: 'bg-orange-400',
            glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)] border-orange-500/40'
        },
        red: {
            bg: 'bg-red-500/10',
            text: 'text-red-400',
            border: 'border-red-500/20',
            dot: 'bg-red-400',
            glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)] border-red-500/40'
        },
        amber: {
            bg: 'bg-amber-500/10',
            text: 'text-amber-500',
            border: 'border-amber-500/20',
            dot: 'bg-amber-400',
            glow: 'ring-1 ring-amber-500/30' // Chairman keeps distinct style
        }
    };

    const style = colors[agent.color];
    const isActive = !agent.isChairman; // First 4 agents are "active/thinking"

    useEffect(() => {
        // Cycle logs at random intervals to simulate organic thinking
        const interval = setInterval(() => {
            setLogIndex((prev) => (prev + 1) % agent.logs.length);
        }, 2000 + Math.random() * 1500);
        return () => clearInterval(interval);
    }, [agent.logs.length]);

    // Get current and next log for display
    const currentLog = agent.logs[logIndex];
    const nextLog = agent.logs[(logIndex + 1) % agent.logs.length];

    return (
        <div className={`bg-[#1c1d27] rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden transition-all duration-500 border ${isActive ? style.glow : 'border-[#282b39]'} ${agent.isChairman && agent.status !== 'Waiting' ? 'ring-1 ring-amber-500/30' : ''} ${agent.status === 'Waiting' ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 relative z-10">
                <div className={`size-10 rounded-full flex items-center justify-center ${style.bg} ${style.text} ${style.border}`}>
                    <span className="material-symbols-outlined">{agent.icon}</span>
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                    <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${agent.status === 'Waiting' ? 'text-slate-500' : (agent.isChairman ? 'text-emerald-400' : style.text)}`}>
                        <span className={`size-1.5 rounded-full ${agent.status === 'Waiting' ? 'bg-slate-600' : 'animate-pulse'} ${agent.status === 'Waiting' ? '' : (agent.isChairman ? 'bg-emerald-400' : style.dot)}`}></span>
                        {agent.status}
                    </p>
                </div>
            </div>

            <div className="bg-[#111218] p-3 rounded font-mono text-[10px] text-[#9da1b9] h-20 overflow-hidden relative z-10 flex flex-col justify-end gap-1">
                <div className={`opacity-50 truncate transition-all duration-300 ${agent.status === 'Waiting' ? 'italic' : ''}`}>
                    <span className={agent.status === 'Waiting' ? 'text-slate-600' : style.text}>{'>'}</span> {nextLog}
                </div>
                <div className={`truncate transition-all duration-300 ${agent.status === 'Waiting' ? 'italic' : ''}`}>
                    <span className={agent.status === 'Waiting' ? 'text-slate-600' : style.text}>{'>'}</span> {currentLog}
                </div>
            </div>

            {/* Pulse Effect for active agents */}
            {isActive && (
                <div className={`absolute inset-0 ${style.bg} opacity-5 animate-pulse pointer-events-none`}></div>
            )}
        </div>
    );
};

export const AgentPerformanceView = () => {
    return (
        <div className="flex flex-col min-h-screen font-display bg-[#101322] text-white">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282b39] bg-[#111218] px-4 md:px-6 lg:px-10 py-3 md:sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-[#1132d4] flex items-center justify-center bg-[#1132d4]/10 rounded-lg shrink-0">
                        <span className="material-symbols-outlined text-[24px]">hub</span>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base md:text-lg font-bold leading-tight tracking-tight text-white truncate">Council Overwatch</h2>
                        <p className="text-[10px] md:text-xs text-[#9da1b9] font-medium truncate">Agent Performance & Cost Metrics</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Healthy
                    </span>
                    <div className="hidden sm:block h-8 w-px bg-[#282b39]"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-9 ring-2 ring-[#1132d4]/20 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAs7eXv_elH2SbDPaTC4YbG65r6ZfQYwFMxuPdEHT1KH55cdk1GNPmDpWLvfzae21Hjzgz9V3WBoHEZMRdtpF5e4z8_RYrWMb6gzD4-qVgiKpBcEa1GmvpOTyb__cFpLgCw-Mc46DQkXmsNNYqyju5bDR3uP-D6spfIr8ossdCYFDKBdoJQBARlcSVIjWjKfucFBWdnrYaq1sluEtBzD3Eq0BjH1hh8GRQDi3jQun1Kfp3PIGRvs3UhpNW5lqBatnbXlDQqrL2GL8E")' }}></div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1600px] w-full mx-auto flex flex-col gap-6 md:gap-8">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <p className="text-3xl font-bold text-emerald-400 mb-2">5/5</p>
                        <p className="text-xs text-[#9da1b9]">All Systems Nominal</p>
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
                    {agentsData.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
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
                                <span className="text-orange-400">[Tox]</span>
                                <span>Simulating liver enzyme elevation...</span>
                            </div>
                            <div className="flex gap-2 text-[#9da1b9]">
                                <span className="text-[#6b7280]">10:44:22</span>
                                <span className="text-red-400">[Skeptic]</span>
                                <span>Flagging potential bias in Trial A...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
