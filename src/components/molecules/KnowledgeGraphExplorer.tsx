import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchSemantic, getNeighbors, getSubgraph, NodeItem, EdgeItem } from '@/lib/knowledge-graph-api';
import ForceGraph3D from 'react-force-graph-3d';
import { Search, Loader2, Network, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function KnowledgeGraphExplorer() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('entities') || '');
  const [results, setResults] = useState<NodeItem[]>([]);
  const [neighbors, setNeighbors] = useState<EdgeItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  useEffect(() => {
    const entities = searchParams.get('entities');
    if (entities) {
      setQuery(entities);
      handleSearch(entities);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await searchSemantic(q, 10);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (nodeName: string) => {
    setSelectedNode(nodeName);
    setLoading(true);
    try {
      const data = await getNeighbors(nodeName);
      setNeighbors(data);
    } catch (error) {
      console.error('Failed to get neighbors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg font-medium">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              Knowledge Graph Explorer
            </div>
            <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'graph')} className="h-8">
                    <TabsList className="h-8">
                        <TabsTrigger value="list" className="text-xs h-7">List</TabsTrigger>
                        <TabsTrigger value="graph" className="text-xs h-7">Graph</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4 pt-0">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search (e.g., 'cancer treatment drugs')"
                className="pl-9"
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
            {/* Results List */}
            <div className={`flex-1 flex flex-col gap-2 min-w-[300px] ${viewMode === 'graph' ? 'hidden md:flex md:max-w-[300px]' : ''}`}>
                {results.length > 0 ? (
                    <ScrollArea className="flex-1 pr-4">
                        <div className="flex flex-col gap-2">
                            {results.map((node) => (
                            <div
                                key={node.name}
                                onClick={() => handleNodeClick(node.name)}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedNode === node.name ? 'bg-muted border-primary/50' : 'border-border/50'}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium truncate" title={node.name}>{node.name}</span>
                                    {node.score && (
                                        <Badge variant="secondary" className="text-[10px] h-5">
                                            {(node.score * 100).toFixed(0)}%
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                                    {node.type}
                                </div>
                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm p-4 text-center border border-dashed rounded-lg">
                        <Search className="w-8 h-8 mb-2 opacity-20" />
                        <p>Search for biomedical entities to explore the graph</p>
                    </div>
                )}
            </div>

            {/* Details / Graph View */}
            <div className={`flex-[2] flex flex-col overflow-hidden rounded-lg border border-border/50 bg-muted/10 ${viewMode === 'list' ? 'hidden md:flex' : ''}`}>
                {selectedNode ? (
                    viewMode === 'graph' ? (
                        <GraphVisualization entity={selectedNode} />
                    ) : (
                        <ScrollArea className="flex-1">
                            <div className="p-4">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Connections for: <span className="text-primary">{selectedNode}</span>
                                </h3>
                                {neighbors.length > 0 ? (
                                    <div className="space-y-1">
                                        {neighbors.map((edge, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm p-2 hover:bg-muted/50 rounded border-b border-border/40 last:border-0">
                                                <Badge variant="outline" className="w-24 justify-center shrink-0">{edge.relation}</Badge>
                                                <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                                                <span 
                                                    className="font-medium text-primary cursor-pointer hover:underline truncate"
                                                    onClick={() => handleNodeClick(edge.target)}
                                                >
                                                    {edge.target}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-auto shrink-0">{edge.target_type}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 text-muted-foreground">No connections found</div>
                                )}
                            </div>
                        </ScrollArea>
                    )
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm">
                        <Network className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a node to view details and connections</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GraphVisualization({ entity }: { entity: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });

  useEffect(() => {
    if (!entity) return;

    const loadGraph = async () => {
      const data = await getSubgraph(entity, 1, 50); // Reduced hops/limit for performance
      
      setGraphData({
        nodes: data.nodes.map(n => ({
          id: n.name,
          name: n.name,
          group: n.type,
          val: n.name === entity ? 20 : 5 // Highlight central node
        })),
        links: data.edges.map(e => ({
          source: e.source,
          target: e.target,
          label: e.relation,
        })),
      });
    };

    loadGraph();
  }, [entity]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black/90">
        <ForceGraph3D
            graphData={graphData}
            nodeLabel="name"
            nodeAutoColorBy="group"
            linkLabel="label"
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            nodeVal="val"
            backgroundColor="rgba(0,0,0,0)"
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-white/50 pointer-events-none">
            3D Force Graph
        </div>
    </div>
  );
}

// Helper component for the arrow icon
function ArrowRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
