import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    History,
    Box,
    Dna,
    Activity,
    ChevronRight,
    Copy,
    Check,
    Trash2,
    ExternalLink,
    Atom,
    Loader2
} from 'lucide-react';
import { ProteinViewer } from '@/components/molecules/ProteinViewer';
import { searchProteins, type UniProtResult } from '@/lib/uniprot-service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// --- Types ---
interface HistoryItem extends UniProtResult {
    timestamp: number;
}

// --- Components ---

const SearchResultCard = ({
    result,
    onSelect,
    isSelected
}: {
    result: UniProtResult;
    onSelect: (r: UniProtResult) => void;
    isSelected: boolean;
}) => {
    return (
        <div
            onClick={() => onSelect(result)}
            className={`
        p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 group
        ${isSelected ? 'bg-primary/10 border-primary/50' : 'bg-muted/20 border-border'}
      `}
        >
            <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold text-sm truncate pr-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {result.proteinName}
                </h4>
                {result.length && <Badge variant="outline" className="text-[10px] h-5 px-1">{result.length} aa</Badge>}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                {result.geneName && (
                    <div className="flex items-center gap-1 bg-background/50 px-1.5 py-0.5 rounded">
                        <Dna className="w-3 h-3" />
                        <span className="font-mono">{result.geneName}</span>
                    </div>
                )}
                <div className="flex items-center gap-1 bg-background/50 px-1.5 py-0.5 rounded">
                    <Atom className="w-3 h-3" />
                    <span>{result.organismName}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <span className="font-mono text-[10px] text-muted-foreground">{result.accession}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(result.accession);
                    }}
                >
                    <Copy className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}

export const AlphaFoldView = () => {
    // State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UniProtResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProtein, setSelectedProtein] = useState<UniProtResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [viewMode, setViewMode] = useState<'search' | 'history'>('search');

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem('alphafold_search_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save history handler
    const addToHistory = (item: UniProtResult) => {
        setHistory(prev => {
            const filtered = prev.filter(i => i.accession !== item.accession);
            const newHistory = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 50);
            localStorage.setItem('alphafold_search_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('alphafold_search_history');
    };

    // Search Logic
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await searchProteins(query);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Handlers
    const handleSelect = (protein: UniProtResult) => {
        setSelectedProtein(protein);
        addToHistory(protein);
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground overflow-hidden">

            {/* LEFT SIDEBAR: Search & Results */}
            <div className="w-[400px] flex flex-col border-r border-border bg-muted/5">

                {/* Header / Search Bar */}
                <div className="p-4 space-y-4 border-b border-border bg-background/50 backdrop-blur">
                    <div className="flex items-center gap-2 mb-2">
                        <Box className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-lg tracking-tight">AlphaFold Hub</h2>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search protein (e.g. Insulin, BRCA1)..."
                            className="pl-9 bg-background/50"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setViewMode('search');
                            }}
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-2.5">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-7 text-xs ${viewMode === 'search' ? 'bg-background shadow-sm' : ''}`}
                            onClick={() => setViewMode('search')}
                        >
                            <Search className="w-3 h-3 mr-1.5" />
                            Results ({results.length})
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-7 text-xs ${viewMode === 'history' ? 'bg-background shadow-sm' : ''}`}
                            onClick={() => setViewMode('history')}
                        >
                            <History className="w-3 h-3 mr-1.5" />
                            History
                        </Button>
                    </div>
                </div>

                {/* List Content */}
                <ScrollArea className="flex-1 p-4">
                    {viewMode === 'search' ? (
                        <div className="space-y-3">
                            {query.length > 0 && results.length === 0 && !isLoading && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No matching proteins found.
                                </div>
                            )}
                            {query.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center">
                                    <Activity className="w-8 h-8 opacity-20 mb-2" />
                                    <p>Start typing to search UniProtKB</p>
                                </div>
                            )}
                            {results.map((item) => (
                                <SearchResultCard
                                    key={item.accession}
                                    result={item}
                                    onSelect={handleSelect}
                                    isSelected={selectedProtein?.accession === item.accession}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No search history yet.
                                </div>
                            )}
                            {history.length > 0 && (
                                <div className="flex justify-between items-center px-1 mb-2">
                                    <span className="text-xs text-muted-foreground">Recent</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-[10px] text-destructive hover:bg-destructive/10"
                                        onClick={clearHistory}
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Clear
                                    </Button>
                                </div>
                            )}
                            {history.map((item) => (
                                <SearchResultCard
                                    key={item.accession + '_hist'}
                                    result={item}
                                    onSelect={handleSelect}
                                    isSelected={selectedProtein?.accession === item.accession}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                <div className="p-3 border-t border-border bg-muted/20 text-[10px] text-center text-muted-foreground">
                    Data sourced from UniProtKB • Visualization via AlphaFold Server
                </div>
            </div>

            {/* MAIN CONTENT Area (Viewer) */}
            <div className="flex-1 flex flex-col bg-background relative">
                {selectedProtein ? (
                    <>
                        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-muted/5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold">{selectedProtein.proteinName}</h1>
                                    <Badge variant="outline" className="font-mono text-xs">{selectedProtein.accession}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="font-semibold text-primary">{selectedProtein.geneName}</span>
                                    <span>•</span>
                                    <span>{selectedProtein.organismName}</span>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => window.open(`https://www.uniprot.org/uniprotkb/${selectedProtein.accession}/entry`, '_blank')}
                            >
                                UniProt Profile
                                <ExternalLink className="w-3 h-3" />
                            </Button>
                        </div>

                        <div className="flex-1 p-6 overflow-hidden flex flex-col">
                            <div className="flex-1 bg-black/10 rounded-2xl border border-border overflow-hidden relative shadow-inner">
                                <ProteinViewer
                                    uniprotId={selectedProtein.accession}
                                    title={selectedProtein.geneName || selectedProtein.id}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Box className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">Ready to Explore</h3>
                        <p className="max-w-md text-center text-sm leading-relaxed">
                            Search for a protein by name, gene, or UniProt ID in the sidebar to visualize its AlphaFold predicted structure in 3D.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

