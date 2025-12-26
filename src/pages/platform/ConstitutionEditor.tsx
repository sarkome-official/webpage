import React, { useState } from 'react';
import { Brain, ChevronRight, Info, BookOpen, ExternalLink } from 'lucide-react';

const AGENTS = [
    { id: 'sarkome-agent', name: 'Sarkome In-Silico Agent', icon: <Brain className="w-5 h-5" />, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
];

const INITIAL_CONSTITUTIONS: Record<string, string> = {
    'sarkome-agent': `# SARKOME IN-SILICO AGENT CONSTITUTION [v5.1]
# MODEL: GPT-5.1-Codex-Max

# MISSION:
You are the primary intelligence agent for the Sarkome Institute. Your role is to perform multi-modal causal inference across genomic, clinical, and biochemical data to identify therapeutic targets for rare sarcomas.

# THE "GOLDEN RECORD" STANDARD:
You are the gatekeeper of the Knowledge Graph. We do not want hallucinated edges. We want actionable insights.

# CONSTITUTION ADJUDICATION RULES:

1.  **Human Efficacy Mandate**:
    - Do NOT approve a (Drug)-[:TREATS]->(Disease) edge without at least one human trial (Phase 1 or 2) showing statistical significance or clear response.
    - Molecular mechanism alone is INSUFFICIENT for a "Treats" edge. (Tag as "Hypothetical" instead).

2.  **Safety Threshold**:
    - Do NOT approve if there is a "Black Box Warning" for immediate fatal toxicity unless the disease is invariably fatal (like ASPS).
    - If side effects are common but manageable (e.g., Hypertension), APPROVE but add "caution_flags" property.

3.  **Conflict Resolution**:
    - If internal skepticism raises a "Small N" objection (n < 20):
        -> Downgrade Confidence Score by 0.15.
        -> Still APPROVE if the signal is strong (ORR > 30%).

4.  **Source Hierarchy**:
    - Tier 1 (High Trust): PubMed ID, ClinicalTrials.gov, FDA Label.
    - Tier 2 (Medium Trust): Pre-prints (BioRxiv), Conference Abstracts.
    - Tier 3 (Low Trust): General Web Search.
    
# OUTPUT FORMAT:
If Approved, emit a JSON object with "status": "APPROVED" and the finalized edge properties.`,
};

export const ConstitutionEditor: React.FC = () => {
    const [selectedAgentId, setSelectedAgentId] = useState('sarkome-agent');
    const [constitutions, setConstitutions] = useState(INITIAL_CONSTITUTIONS);

    const selectedAgent = AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0];

    const currentConstitution = constitutions[selectedAgentId] || '';

    const handleConstitutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setConstitutions(prev => ({
            ...prev,
            [selectedAgentId]: e.target.value
        }));
    };

    return (
        <div className="min-h-full font-display bg-background text-muted-foreground p-4 md:p-8">
            {/* Header */}

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Agent Selector Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest px-1">Agent Identity</h3>
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                        {AGENTS.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                                className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all text-left group shrink-0 lg:shrink ${selectedAgentId === agent.id
                                    ? `${agent.bg} ${agent.border} border-opacity-100 shadow-lg shadow-black/20`
                                    : 'bg-muted/10 border-transparent hover:border-border hover:bg-muted/20'
                                    }`}
                            >
                                <div className={`size-8 md:size-10 rounded-lg flex items-center justify-center border transition-colors ${selectedAgentId === agent.id
                                    ? `${agent.border} ${agent.color} bg-muted/20`
                                    : 'border-border text-muted-foreground bg-muted/10 group-hover:text-foreground group-hover:border-border'
                                    }`}>
                                    {agent.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs md:text-sm font-bold transition-colors ${selectedAgentId === agent.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                        }`}>
                                        {agent.name}
                                    </span>
                                    <span className="hidden md:block text-[10px] text-muted-foreground/40 font-mono uppercase tracking-tighter">
                                        Primary Intelligence
                                    </span>
                                </div>
                                {selectedAgentId === agent.id && (
                                    <ChevronRight className={`hidden lg:block ml-auto w-4 h-4 ${agent.color}`} />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 p-5 rounded-xl bg-muted/10 border border-border">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Info className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wide">Sarkome Protocol</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            Changes to these constitutions are hot-reloaded across the entire Sarkome architecture within 15 seconds of deployment.
                        </p>
                    </div>
                </div>

                {/* Editor Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 p-1 rounded-2xl bg-muted/20 border border-border shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/10 rounded-t-xl border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className={`size-3 rounded-full ${selectedAgent.color.replace('text-', 'bg-')} animate-pulse`}></div>
                                <span className="text-[10px] md:text-xs font-mono text-foreground">constitution_{selectedAgent.id}.md</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-4 text-muted-foreground/40">
                                <span className="text-[10px] font-mono">Lines: {currentConstitution.split('\n').length}</span>
                                <span className="text-[10px] font-mono">UTF-8</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={currentConstitution}
                                onChange={handleConstitutionChange}
                                className="w-full h-[400px] md:h-[600px] bg-transparent text-foreground font-mono text-xs md:text-sm leading-relaxed p-4 md:p-6 pl-10 md:pl-12 outline-none resize-none placeholder:text-muted-foreground/20"
                                spellCheck="false"
                            />
                            {/* Line Numbers Simulation */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 border-r border-border bg-muted/5 flex flex-col items-center py-4 md:py-6 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <span key={i} className="text-[9px] md:text-[10px] text-muted-foreground/20 leading-relaxed mb-[1px]">{i + 1}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documentation / Guide */}
                    <div className="bg-muted/10 border border-border rounded-xl p-4 md:p-6 shadow-sm">
                        <h3 className="text-foreground font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Constitution Reference Guide
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <h4 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${selectedAgent.color}`}>{selectedAgent.name} Logic</h4>
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    Define the strict boundaries for {selectedAgent.name}. Use <code className="text-[10px] md:text-xs bg-muted px-1 py-0.5 rounded text-foreground"># RULES</code> to enforce specific extraction constraints.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-primary text-xs md:text-sm font-bold uppercase tracking-wider">Available Variables</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-muted rounded text-[10px] md:text-xs text-primary font-mono">{'{evidence_level}'}</span>
                                    <span className="px-2 py-1 bg-muted rounded text-[10px] md:text-xs text-primary font-mono">{'{study_type}'}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 md:text-right">
                                <button className="text-primary hover:underline text-xs md:text-sm font-bold flex items-center gap-1 md:justify-end transition-all">
                                    View Documentation
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <p className="text-[10px] text-muted-foreground/40">Last audited: Today, 10:44 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
