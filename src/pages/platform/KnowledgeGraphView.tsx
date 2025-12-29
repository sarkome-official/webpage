import React, { useState } from 'react';
import { Search, Database, Code, ExternalLink, Info, Activity, Zap, ShieldCheck } from 'lucide-react';

export const KnowledgeGraphView = () => {
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
                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase tracking-wider">v2.4.0</span>
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-[10px] font-mono text-primary uppercase tracking-wider border border-primary/20">Precision Medicine Substrate</span>
                                <span className="flex items-center gap-1 ml-0 md:ml-2 text-[10px] text-green-500 font-mono">
                                    <Activity className="w-3 h-3" />
                                    LIVE SUBSTRATE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 text-foreground">
                            <ExternalLink className="w-4 h-4" />
                            Source
                        </button>
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium transition-all shadow-lg shadow-primary/20">
                            Explore Nodes
                        </button>
                    </div>
                </div>

                <p className="text-muted-foreground max-w-3xl leading-relaxed text-sm md:text-base">
                    **PrimeKG** (Precision Medicine Oriented Knowledge Graph) is a comprehensive knowledge substrate that integrates over 20 high-quality biomedical databases. It provides a unified representation of diseases, drugs, phenotypes, and their complex causal relationships, specifically optimized for rare sarcoma research.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                            <div className="text-muted-foreground/60 text-xs font-mono uppercase tracking-widest">Biomedical Entities</div>
                            <div className="text-3xl font-bold text-foreground">110,000+</div>
                            <div className="text-[10px] text-primary font-mono">Diseases, Drugs, Genes, Phenotypes</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                            <div className="text-muted-foreground/60 text-xs font-mono uppercase tracking-widest">Relational Edges</div>
                            <div className="text-3xl font-bold text-foreground">4.05M</div>
                            <div className="text-[10px] text-primary font-mono">Validated Biological Links</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                            <div className="text-muted-foreground/60 text-xs font-mono uppercase tracking-widest">Data Sources</div>
                            <div className="text-3xl font-bold text-foreground">20+</div>
                            <div className="text-[10px] text-primary font-mono">Curated Biomedical Repositories</div>
                        </div>
                    </div>

                    {/* Documentation Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                            <Info className="w-5 h-5 text-primary" />
                            <h2>Precision Medicine Architecture</h2>
                        </div>

                        <div className="prose prose-invert max-w-none text-muted-foreground">
                            <p>
                                PrimeKG is designed to bridge the gap between genomic data and clinical phenotypes. By mapping the entire landscape of human disease through a precision medicine lens, it enables the Sarkome multi-agent system to perform high-fidelity causal reasoning.
                            </p>
                            <p>
                                The graph structure allows for the identification of novel drug-disease associations, particularly in rare conditions like **Alveolar Soft Part Sarcoma (ASPS)**, where traditional clinical data is sparse.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 rounded-xl bg-muted/10 border border-border hover:border-primary/30 transition-colors group">
                                <Zap className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-foreground font-bold mb-2">Causal Reasoning</h3>
                                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                                    Optimized for GraphRAG (Retrieval-Augmented Generation) to provide agents with deep biological context.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-muted/10 border border-border hover:border-primary/30 transition-colors group">
                                <ShieldCheck className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-foreground font-bold mb-2">Clinical Relevance</h3>
                                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                                    Every node and edge is mapped to clinical ontologies (MONDO, HPO, DrugBank) for maximum precision.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* API Example Card */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-foreground font-bold">Graph Query Example: ASPS Causal Path</h3>
                            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">CYPHER / SPARQL SUBSTRATE</span>
                        </div>
                        <div className="bg-muted/10 rounded-xl border border-border p-6 font-mono text-sm overflow-x-auto">
                            <div className="flex gap-4 mb-4 border-b border-border pb-4">
                                <span className="text-primary">MATCH</span>
                                <span className="text-muted-foreground/60">(d:Disease &#123;name: "ASPS"&#125;)-[r]-(g:Gene) RETURN d, r, g</span>
                            </div>
                            <pre className="text-muted-foreground/80">
                                {`{
  "query_target": "Alveolar Soft Part Sarcoma",
  "nodes_found": 142,
  "primary_fusion": "ASPSCR1-TFE3",
  "causal_links": [
    { "source": "TFE3", "relation": "upregulates", "target": "MET" },
    { "source": "MET", "relation": "associated_with", "target": "Angiogenesis" }
  ]
}`}
                            </pre>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
