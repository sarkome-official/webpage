import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

interface Agent {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: 'zinc' | 'purple' | 'orange' | 'red' | 'amber';
    status: string;
    logs: string[];
    isChairman?: boolean;
}

const agentsData: Agent[] = [
    {
        id: 'sarkome-agent',
        name: 'Sarkome In-Silico Agent',
        icon: <Brain className="w-8 h-8" />,
        color: 'zinc',
        status: 'Thinking',
        logs: [
            'Initializing multi-modal embedding space...',
            'Traversing PrimeKG knowledge substrate...',
            'Identifying TFE3-ASPSCR1 fusion dependencies...',
            'Cross-referencing MET oncogene upregulation...',
            'Analyzing VCP-Metabolic axis flux...',
            'Simulating VEGFR2 phosphorylation inhibition...',
            'Evaluating clinical trial efficacy signals...',
            'Synthesizing causal inference pathways...',
            'Validating hypothesis against wet-lab constraints...',
            'Generating therapeutic target priority list...'
        ]
    }
];

const AgentCard = ({ agent }: { agent: Agent }) => {
    const [logIndex, setLogIndex] = useState(0);

    // Color mapping for dynamic styles
    const colors = {
        zinc: {
            bg: 'bg-primary/10',
            text: 'text-primary',
            border: 'border-primary/20',
            dot: 'bg-primary',
            glow: 'shadow-[0_0_15px_rgba(255,255,255,0.05)] border-primary/40'
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

    useEffect(() => {
        // Cycle logs at random intervals to simulate organic thinking
        const interval = setInterval(() => {
            setLogIndex((prev) => (prev + 1) % agent.logs.length);
        }, 1500 + Math.random() * 1000);
        return () => clearInterval(interval);
    }, [agent.logs.length]);

    // Get current and next log for display
    const currentLog = agent.logs[logIndex];
    const nextLog = agent.logs[(logIndex + 1) % agent.logs.length];

    return (
        <div className={`bg-muted/20 rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden transition-all duration-500 border border-border ${style.glow} min-h-[200px]`}>
            <div className="flex items-center gap-4 relative z-10">
                <div className={`size-14 rounded-full flex items-center justify-center ${style.bg} ${style.text} ${style.border}`}>
                    {agent.icon}
                </div>
                <div>
                    <h4 className="font-bold text-foreground text-xl">{agent.name}</h4>
                    <p className={`text-xs font-bold uppercase flex items-center gap-2 ${style.text}`}>
                        <span className={`size-2 rounded-full animate-pulse ${style.dot}`}></span>
                        {agent.status}
                    </p>
                </div>
            </div>

            <div className="bg-muted/10 p-4 rounded-lg font-mono text-sm text-muted-foreground h-32 overflow-hidden relative z-10 flex flex-col justify-end gap-2 border border-border">
                <div className="opacity-30 truncate transition-all duration-300">
                    <span className={style.text}>{'>'}</span> {agent.logs[(logIndex + 2) % agent.logs.length]}
                </div>
                <div className="opacity-60 truncate transition-all duration-300">
                    <span className={style.text}>{'>'}</span> {nextLog}
                </div>
                <div className="truncate transition-all duration-300 text-foreground">
                    <span className={style.text}>{'>'}</span> {currentLog}
                </div>
            </div>

            {/* Pulse Effect for active agents */}
            <div className={`absolute inset-0 ${style.bg} opacity-5 animate-pulse pointer-events-none`}></div>
        </div>
    );
};

export const AgentPerformanceView = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Header */}

            <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1600px] w-full mx-auto flex flex-col gap-6 md:gap-8">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-muted/20 border border-border p-5 rounded-xl">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Total Tokens (Session)</p>
                        <p className="text-3xl font-bold text-foreground mb-2">1.4M</p>
                        <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%]"></div>
                        </div>
                    </div>
                    <div className="bg-muted/20 border border-border p-5 rounded-xl">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Est. Cost (Run)</p>
                        <p className="text-3xl font-bold text-foreground mb-2">$4.28</p>
                        <p className="text-xs text-muted-foreground">+ $0.12 last hr</p>
                    </div>
                    <div className="bg-muted/20 border border-border p-5 rounded-xl">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Active Agents</p>
                        <p className="text-3xl font-bold text-emerald-400 mb-2">1/1</p>
                        <p className="text-xs text-muted-foreground">GPT-5.1-Codex-Max Active</p>
                    </div>
                    <div className="bg-muted/20 border border-border p-5 rounded-xl">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Graph Updates</p>
                        <p className="text-3xl font-bold text-amber-500 mb-2">852</p>
                        <p className="text-xs text-muted-foreground">New Nodes/Edges</p>
                    </div>
                </div>

                {/* Agent Status Grid */}
                <h3 className="text-lg font-bold text-foreground mt-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Live Agent Status
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {agentsData.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                </div>

                {/* Activity & Logs Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                    <div className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col">
                        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Thought Chain Volume</h3>
                        {/* Fake Chart Bars */}
                        <div className="flex-1 flex items-end gap-2 px-2 pb-2">
                            {[40, 65, 30, 80, 55, 40, 70, 90, 60, 45, 75, 50, 65, 85, 40].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/30 hover:bg-primary transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-border text-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h} thoughts
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between text-[10px] text-muted-foreground">
                            <span>10:30 AM</span>
                            <span>Current</span>
                        </div>
                    </div>

                    <div className="bg-muted/20 border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-muted/10 border-b border-border">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Live Chain of Thought</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                            <div className="flex gap-2 text-muted-foreground">
                                <span className="text-muted-foreground/40">10:44:12</span>
                                <span className="text-primary">[Sarkome]</span>
                                <span>Identified target: MET</span>
                            </div>
                            <div className="flex gap-2 text-muted-foreground">
                                <span className="text-muted-foreground/40">10:44:15</span>
                                <span className="text-primary">[Sarkome]</span>
                                <span>Found 2 relevant trials in PrimeKG</span>
                            </div>
                            <div className="flex gap-2 text-muted-foreground">
                                <span className="text-muted-foreground/40">10:44:18</span>
                                <span className="text-primary">[Sarkome]</span>
                                <span>Simulating VCP-Metabolic axis flux...</span>
                            </div>
                            <div className="flex gap-2 text-muted-foreground">
                                <span className="text-muted-foreground/40">10:44:22</span>
                                <span className="text-primary">[Sarkome]</span>
                                <span>Validating causal relationship: VEGFR2 {"->"} ASPS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
