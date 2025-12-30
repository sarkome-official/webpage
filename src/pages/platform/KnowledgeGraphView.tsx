import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Code, ExternalLink, Info, Activity, Zap, ShieldCheck } from 'lucide-react';

export const KnowledgeGraphView = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="flex flex-col h-full w-full bg-background text-muted-foreground font-sans overflow-hidden">
            {/* Header Section */}
            <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Database className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">PrimeKG: Precision Medicine Knowledge Graph</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-[10px] font-mono text-primary uppercase tracking-wider border border-primary/20">Precision Medicine Substrate</span>
                                <span className="flex items-center gap-1 ml-0 md:ml-2 text-[10px] text-green-500 font-mono">
                                    <Activity className="w-3 h-3" />
                                    LIVE SUBSTRATE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.open('https://zitniklab.hms.harvard.edu/projects/PrimeKG/', '_blank')}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 text-foreground"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Source
                        </button>
                        <button
                            onClick={() => navigate('/knowledge-graph-nodes')}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            Explore Nodes
                        </button>
                    </div>
                </div>

                <div className="text-muted-foreground max-w-4xl leading-relaxed text-sm md:text-base space-y-4">
                    <p>
                        Developing personalized diagnostic strategies and targeted treatments requires a deep understanding of disease biology and the ability to dissect the relationship between molecular and genetic factors and their phenotypic consequences. However, such knowledge is fragmented across publications, non-standardized research repositories, and evolving ontologies describing various scales of biological organization between genotypes and clinical phenotypes.
                    </p>
                    <p>
                        We introduce <strong>PrimeKG</strong>, a precision medicine-oriented knowledge graph that provides a holistic view of diseases. PrimeKG integrates 20 high-quality resources to describe 17,080 diseases with 4,050,249 relationships representing ten major biological scales, including disease-associated protein perturbations, biological processes and pathways, anatomical and phenotypic scale, and the entire range of approved and experimental drugs with their therapeutic action, considerably expanding previous efforts in disease-rooted knowledge graphs.
                    </p>
                    <div className="border-l-4 border-primary/40 pl-4 py-2 my-6 bg-muted/30 rounded-r-lg">
                        <p className="italic text-foreground font-medium">
                            "Not just 'this disease exists', but 'this disease is linked to this specific gene, which is affected by this drug, which has this side effect'."
                        </p>
                    </div>
                    <p>
                        PrimeKG supports drug-disease prediction by including an abundance of 'indications', 'contradictions' and 'off-label use' edges, which are usually missing in other knowledge graphs. We accompany PrimeKG's graph structure with text descriptions of clinical guidelines for drugs and diseases to enable multi-modal analyses.
                    </p>
                </div>
            </div>
        </div>
    );
};
