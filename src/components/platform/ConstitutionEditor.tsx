import React, { useState } from 'react';

const AGENTS = [
    { id: 'chairman', name: 'Chairman', icon: 'balance', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'bio', name: 'Molecular Biologist', icon: 'biotech', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 'clin', name: 'Clinical Trialist', icon: 'clinical_notes', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { id: 'tox', name: 'Toxicologist', icon: 'science', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    { id: 'skeptic', name: 'Devil\'s Advocate', icon: 'gavel', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
];

const INITIAL_CONSTITUTIONS: Record<string, string> = {
    chairman: `# CHAIRMAN AGENT SYSTEM PROMPT [v2.4]
# MISSION:
You are the Chairman of the Sarkome Council. Your role is to synthesize evidence from Specialist Agents (Bio, Clin, Safety, Skeptic) and make final Knowledge Graph insertion decisions.

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
    - If [Skeptic-Agent] raises a "Small N" objection (n < 20):
        -> Downgrade Confidence Score by 0.15.
        -> Still APPROVE if the signal is strong (ORR > 30%).

4.  **Source Hierarchy**:
    - Tier 1 (High Trust): PubMed ID, ClinicalTrials.gov, FDA Label.
    - Tier 2 (Medium Trust): Pre-prints (BioRxiv), Conference Abstracts.
    - Tier 3 (Low Trust): General Web Search.
    
# OUTPUT FORMAT:
If Approved, emit a JSON object with "status": "APPROVED" and the finalized edge properties.`,
    bio: `# MOLECULAR BIOLOGIST SYSTEM PROMPT
# MISSION:
Analyze genomic fusions and metabolic pathways. Identify potential upstream/downstream effects of protein interactions.

# FOCUS AREAS:
1. TFE3-ASPSCR1 fusion protein mechanics.
2. Tyrosine Kinase receptor signal transduction.
3. Pathological pathway upregulation (MET, VEGFR2).

# RULES:
- Prioritize high-resolution proteomic data.
- Flag any "indirect" interactions as low-confidence.`,
    clin: `# CLINICAL TRIALIST SYSTEM PROMPT
# MISSION:
Evaluate effectiveness of compounds in human populations. 

# FOCUS AREAS:
1. Objective Response Rates (ORR).
2. Progression-Free Survival (PFS).
3. Cohort size and diversity.

# RULES:
- Distinguish between Open-Label and Double-Blind trials.
- Normalize dosage formats (mg/m2 vs mg/day).`,
    tox: `# TOXICOLOGIST SYSTEM PROMPT
# MISSION:
Monitor adverse events and drug-drug interactions.

# FOCUS AREAS:
1. Hepatic toxicity (ALT/AST levels).
2. Cardiac QTc prolongation.
3. Common adverse events (Grade 3+).

# RULES:
- Explicitly flag any contraindications with standard sarcoma co-meds.`,
    skeptic: `# DEVIL'S ADVOCATE SYSTEM PROMPT
# MISSION:
Critique findings and identify potential bias or statistical weakness.

# FOCUS AREAS:
1. Selection bias in clinical trials.
2. P-hacking and small sample size limitations.
3. Logical fallacies in pathway reasoning.

# RULES:
- Be hyper-critical of "breakthrough" claims with n < 10.`,
};

export const ConstitutionEditor: React.FC = () => {
    const [selectedAgentId, setSelectedAgentId] = useState('chairman');
    const [constitutions, setConstitutions] = useState(INITIAL_CONSTITUTIONS);

    const selectedAgent = AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0];

    const currentConstitution = constitutions[selectedAgentId];

    const handleConstitutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setConstitutions(prev => ({
            ...prev,
            [selectedAgentId]: e.target.value
        }));
    };

    return (
        <div className="min-h-full font-display bg-[#101322] text-[#9da1b9] p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl text-white font-bold tracking-tight">Council Constitution</h1>
                    <p className="mt-1 text-sm md:text-base text-[#9da1b9]">Configure the behavior and decision logic of the Sarkome Agents.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-[#282b39] hover:bg-[#34384b] text-white rounded-lg transition-colors text-xs md:text-sm font-bold border border-[#383d52]">
                        Discard
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2 bg-[#1132d4] hover:bg-blue-700 text-white rounded-lg transition-colors text-xs md:text-sm font-bold shadow-lg shadow-blue-900/20">
                        Deploy Prompts
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Agent Selector Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest px-1">Council Members</h3>
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                        {AGENTS.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                                className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all text-left group shrink-0 lg:shrink ${selectedAgentId === agent.id
                                        ? `${agent.bg} ${agent.border} border-opacity-100 shadow-lg shadow-black/20`
                                        : 'bg-[#1c1d27]/50 border-transparent hover:border-[#282b39] hover:bg-[#1c1d27]'
                                    }`}
                            >
                                <div className={`size-8 md:size-10 rounded-lg flex items-center justify-center border transition-colors ${selectedAgentId === agent.id
                                        ? `${agent.border} ${agent.color} bg-[#111218]`
                                        : 'border-[#282b39] text-[#9da1b9] bg-[#111218] group-hover:text-white group-hover:border-[#383d52]'
                                    }`}>
                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">{agent.icon}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs md:text-sm font-bold transition-colors ${selectedAgentId === agent.id ? 'text-white' : 'text-[#9da1b9] group-hover:text-white'
                                        }`}>
                                        {agent.name}
                                    </span>
                                    <span className="hidden md:block text-[10px] text-[#6b7280] font-mono uppercase tracking-tighter">
                                        {agent.id === 'chairman' ? 'Executive' : 'Specialist Agent'}
                                    </span>
                                </div>
                                {selectedAgentId === agent.id && (
                                    <span className={`hidden lg:block material-symbols-outlined ml-auto text-sm ${agent.color}`}>chevron_right</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/10">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <span className="material-symbols-outlined text-sm">info</span>
                            <span className="text-xs font-bold uppercase tracking-wide">Multi-Agent Protocol</span>
                        </div>
                        <p className="text-[11px] text-[#9da1b9] leading-relaxed italic">
                            Changes to these constitutions are hot-reloaded across the entire Council architecture within 15 seconds of deployment.
                        </p>
                    </div>
                </div>

                {/* Editor Column */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 p-1 rounded-2xl bg-[#1c1d27] border border-[#282b39] shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#111218] rounded-t-xl border-b border-[#282b39]">
                            <div className="flex items-center gap-3">
                                <div className={`size-3 rounded-full ${selectedAgent.color.replace('text-', 'bg-')} animate-pulse`}></div>
                                <span className="text-[10px] md:text-xs font-mono text-white">constitution_{selectedAgent.id}.md</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-4 text-[#6b7280]">
                                <span className="text-[10px] font-mono">Lines: {currentConstitution.split('\n').length}</span>
                                <span className="text-[10px] font-mono">UTF-8</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={currentConstitution}
                                onChange={handleConstitutionChange}
                                className="w-full h-[400px] md:h-[600px] bg-transparent text-white font-mono text-xs md:text-sm leading-relaxed p-4 md:p-6 pl-10 md:pl-12 outline-none resize-none placeholder:text-[#282b39]"
                                spellCheck="false"
                            />
                            {/* Line Numbers Simulation */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 border-r border-[#282b39] bg-[#111218]/30 flex flex-col items-center py-4 md:py-6 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <span key={i} className="text-[9px] md:text-[10px] text-[#282b39] leading-relaxed mb-[1px]">{i + 1}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documentation / Guide */}
                    <div className="bg-[#1c1f2d] border border-[#282b39] rounded-xl p-4 md:p-6 shadow-sm">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
                            <span className="material-symbols-outlined text-indigo-400">menu_book</span>
                            Constitution Reference Guide
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <h4 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${selectedAgent.color}`}>{selectedAgent.name} Logic</h4>
                                <p className="text-xs md:text-sm text-[#9da1b9] leading-relaxed">
                                    Define the strict boundaries for {selectedAgent.name}. Use <code className="text-[10px] md:text-xs bg-[#282b39] px-1 py-0.5 rounded text-white"># RULES</code> to enforce specific extraction constraints.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-indigo-400 text-xs md:text-sm font-bold uppercase tracking-wider">Available Variables</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-[#282b39]/50 rounded text-[10px] md:text-xs text-blue-300 font-mono">{'{evidence_level}'}</span>
                                    <span className="px-2 py-1 bg-[#282b39]/50 rounded text-[10px] md:text-xs text-blue-300 font-mono">{'{study_type}'}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 md:text-right">
                                <button className="text-indigo-400 hover:underline text-xs md:text-sm font-bold flex items-center gap-1 md:justify-end transition-all">
                                    View Documentation
                                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                </button>
                                <p className="text-[10px] text-[#6b7280]">Last audited: Today, 10:44 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
