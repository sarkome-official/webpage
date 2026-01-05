import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Database, ExternalLink, Activity, Check, ArrowRight, Play } from 'lucide-react';
import { KnowledgeGraphExplorer } from '@/components/molecules/KnowledgeGraphExplorer';
import { Input } from '@/components/ui/input';

export const KnowledgeGraphView = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setSearchParams({ entities: searchQuery });
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background text-foreground font-sans overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-[1800px] mx-auto p-6 md:p-10 lg:p-12 h-full">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 h-full">

                        {/* Left Column: Content */}
                        <div className="flex flex-col gap-8 order-2 xl:order-1">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">PrimeKG</h1>
                                    <div className="flex flex-col gap-1.5 opacity-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-forwards">
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider w-fit">
                                            v2.0 Stable
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider w-fit">
                                            Updated 24h ago
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    Precision Medicine Knowledge Graph
                                </h2>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Diseases</div>
                                    <div className="text-2xl font-black text-foreground">17,080</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Relationships</div>
                                    <div className="text-2xl font-black text-foreground">4,050,249</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Nodes</div>
                                    <div className="text-2xl font-black text-foreground">129,375</div>
                                </div>
                                <div className="bg-muted/30 border border-border p-4 rounded-xl">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Data Sources</div>
                                    <div className="text-2xl font-black text-foreground">20</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="text-muted-foreground leading-relaxed space-y-6 text-lg">
                                <p>
                                    PrimeKG integrates disparate biomedical datasets into a unified graph structure, bridging the gap between molecular interactions and clinical outcomes. This architecture enables high-fidelity analysis for precision medicine applications.
                                </p>




                            </div>

                            {/* Search Section */}
                            <div className="flex w-full max-w-md items-center space-x-2">
                                <Input 
                                    type="text" 
                                    placeholder="Search entities (e.g. 'Lung Cancer')" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="bg-muted/30 border-border"
                                />
                                <button 
                                    onClick={handleSearch}
                                    data-slot="button" 
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer"
                                >
                                    <Search className="size-4" />
                                    Search
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 pt-4 mt-auto">

                                <button
                                    onClick={() => window.open('https://zitniklab.hms.harvard.edu/projects/PrimeKG/', '_blank')}
                                    className="px-8 py-3.5 rounded-lg bg-transparent border border-border hover:bg-muted text-foreground font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    View Source
                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Visualization Preview */}
                        <div className="flex flex-col h-full min-h-[500px] xl:min-h-0 order-1 xl:order-2">
                            <KnowledgeGraphExplorer />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
