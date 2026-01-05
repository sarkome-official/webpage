# PrimeKG Integration Guide

## Migration from NetworkX to Neo4j API

This guide explains how to integrate the PrimeKG Knowledge Graph API into your LangGraph agent (backend) and React frontend.

---

## Architecture Overview

### Before (NetworkX - In-Memory)
```
Agent -> NetworkX (Local) -> kg.csv (2GB in RAM)
         ❌ Slow startup
         ❌ No semantic search
         ❌ Memory intensive
```

### After (Neo4j API - Cloud)
```
Agent -> HTTP API -> Neo4j (Cloud VM)
         ✅ Instant queries
         ✅ Semantic search with AI
         ✅ Scalable
         ✅ Shared by frontend and backend
```

---

## Backend Integration (LangGraph / Python)

### 1. Configuration

Add to your `.env` or environment variables:

```bash
KNOWLEDGE_GRAPH_URL=http://<VM_IP>:8000
KNOWLEDGE_GRAPH_API_KEY=your-api-key-here
```

### 2. Create API Client

Create `backend/src/knowledge_graph/client.py`:

```python
"""
PrimeKG Knowledge Graph API Client
----------------------------------
Replaces the old NetworkX-based local graph with API calls.
"""
import os
import httpx
from typing import List, Dict, Any, Optional
from functools import lru_cache

class KnowledgeGraphClient:
    """Client for the PrimeKG Knowledge Graph API."""
    
    def __init__(self):
        self.base_url = os.getenv("KNOWLEDGE_GRAPH_URL", "http://localhost:8000")
        self.api_key = os.getenv("KNOWLEDGE_GRAPH_API_KEY", "")
        self.timeout = 30.0
    
    @property
    def headers(self) -> Dict[str, str]:
        return {"X-API-Key": self.api_key}
    
    async def health_check(self) -> Dict[str, str]:
        """Check if the API is online."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/health")
            return response.json()
    
    async def get_stats(self) -> Dict[str, int]:
        """Get graph statistics."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/stats",
                headers=self.headers
            )
            return response.json()
    
    # =========================================================================
    # SEARCH METHODS
    # =========================================================================
    
    async def search_text(self, query: str, limit: int = 10) -> List[Dict]:
        """
        Search entities by name (exact/partial match).
        Replaces: [n for n in G.nodes() if query.lower() in n.lower()]
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search/text",
                params={"q": query, "limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            return response.json()
    
    async def search_semantic(self, query: str, limit: int = 10) -> List[Dict]:
        """
        AI-powered semantic search.
        Example: "pain medication" finds Aspirin, Ibuprofen, etc.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search/semantic",
                params={"q": query, "limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            return response.json()
    
    # =========================================================================
    # GRAPH TRAVERSAL METHODS
    # =========================================================================
    
    async def get_neighbors(self, node_name: str, limit: int = 50) -> List[Dict]:
        """
        Get 1-hop neighbors of a node.
        Replaces: list(G.neighbors(node_name))
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/neighbors/{node_name}",
                params={"limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return []
            return response.json()
    
    async def find_path(
        self, 
        source: str, 
        target: str, 
        max_hops: int = 2
    ) -> Dict[str, Any]:
        """
        Find shortest paths between two entities.
        Replaces: nx.shortest_path(G, source, target)
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/path/{source}/{target}",
                params={"max_hops": max_hops},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return {"paths_found": 0, "paths": []}
            return response.json()
    
    async def get_subgraph(
        self, 
        entity: str, 
        hops: int = 2, 
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Extract a subgraph around an entity for visualization.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/subgraph/{entity}",
                params={"hops": hops, "limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return {"nodes": [], "edges": []}
            return response.json()
    
    # =========================================================================
    # HYPOTHESIS GENERATION METHODS
    # =========================================================================
    
    async def find_repurposing_candidates(
        self, 
        disease: str, 
        limit: int = 20
    ) -> List[Dict]:
        """
        Find drugs that could be repurposed for a disease.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/hypothesis/repurposing/{disease}",
                params={"limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return []
            return response.json()
    
    async def find_therapeutic_targets(
        self, 
        disease: str, 
        limit: int = 20
    ) -> List[Dict]:
        """
        Find potential therapeutic targets for a disease.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/hypothesis/targets/{disease}",
                params={"limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return []
            return response.json()
    
    async def find_drug_combinations(
        self, 
        drug: str, 
        limit: int = 20
    ) -> List[Dict]:
        """
        Find drugs that could synergize with a given drug.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/hypothesis/combinations/{drug}",
                params={"limit": limit},
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return []
            return response.json()
    
    async def explain_mechanism(
        self, 
        drug: str, 
        disease: str
    ) -> List[Dict]:
        """
        Explain the molecular mechanism connecting a drug to a disease.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/hypothesis/mechanisms/{drug}/{disease}",
                headers=self.headers,
                timeout=self.timeout
            )
            if response.status_code == 404:
                return []
            return response.json()


# Singleton instance
kg_client = KnowledgeGraphClient()
```

### 3. Create LangGraph Tools

Create `backend/src/agent/tools/knowledge_graph_tools.py`:

```python
"""
Knowledge Graph Tools for LangGraph Agent
------------------------------------------
These tools allow the agent to query the PrimeKG knowledge graph.
"""
from langchain_core.tools import tool
from typing import List, Dict, Any
import asyncio

from knowledge_graph.client import kg_client


@tool
async def search_biomedical_entities(query: str) -> str:
    """
    Search for biomedical entities (drugs, diseases, genes, proteins, pathways).
    Use semantic search to find entities by concept, not just name.
    
    Args:
        query: Natural language query (e.g., "cancer treatment drugs", "pain relief")
    
    Returns:
        List of matching entities with type and relevance score.
    """
    results = await kg_client.search_semantic(query, limit=10)
    if not results:
        return f"No entities found for '{query}'"
    
    output = f"Found {len(results)} entities for '{query}':\n\n"
    for r in results:
        output += f"- **{r['name']}** ({r['type']}) - Score: {r.get('score', 'N/A'):.2f}\n"
    return output


@tool
async def get_entity_relationships(entity_name: str) -> str:
    """
    Get all relationships (neighbors) of a biomedical entity.
    Shows what drugs treat what diseases, what genes are targeted, etc.
    
    Args:
        entity_name: Name of the entity (e.g., "Aspirin", "TP53", "Lung Cancer")
    
    Returns:
        List of relationships with type and connected entity.
    """
    results = await kg_client.get_neighbors(entity_name, limit=30)
    if not results:
        return f"Entity '{entity_name}' not found or has no relationships."
    
    output = f"Relationships for **{entity_name}**:\n\n"
    
    # Group by relationship type
    by_type = {}
    for r in results:
        rel = r['relation']
        if rel not in by_type:
            by_type[rel] = []
        by_type[rel].append(r)
    
    for rel_type, edges in by_type.items():
        output += f"**{rel_type}**:\n"
        for e in edges[:5]:  # Limit to 5 per type
            output += f"  - {e['target']} ({e['target_type']})\n"
        if len(edges) > 5:
            output += f"  - ... and {len(edges) - 5} more\n"
        output += "\n"
    
    return output


@tool
async def find_connection(entity1: str, entity2: str) -> str:
    """
    Find how two biomedical entities are connected.
    Useful for understanding drug-disease relationships.
    
    Args:
        entity1: First entity name (e.g., "Aspirin")
        entity2: Second entity name (e.g., "Headache")
    
    Returns:
        The path(s) connecting the two entities.
    """
    result = await kg_client.find_path(entity1, entity2, max_hops=3)
    
    if result['paths_found'] == 0:
        return f"No connection found between '{entity1}' and '{entity2}' within 3 hops."
    
    output = f"Found {result['paths_found']} path(s) from **{entity1}** to **{entity2}**:\n\n"
    
    for i, path in enumerate(result['paths'][:3], 1):
        output += f"**Path {i}:**\n"
        for step in path:
            rel = step.get('relation', '')
            if rel:
                output += f"  {step['node']} ({step['node_type']}) --[{rel}]--> "
            else:
                output += f"  {step['node']} ({step['node_type']})\n"
        output += "\n"
    
    return output


@tool
async def find_drug_repurposing_candidates(disease: str) -> str:
    """
    Find existing drugs that could potentially treat a disease.
    Based on shared molecular targets with approved drugs.
    
    Args:
        disease: Disease name (e.g., "Sarcoma", "Lung Cancer")
    
    Returns:
        List of drug candidates with evidence.
    """
    results = await kg_client.find_repurposing_candidates(disease, limit=10)
    if not results:
        return f"No repurposing candidates found for '{disease}'"
    
    output = f"Drug repurposing candidates for **{disease}**:\n\n"
    for r in results:
        output += f"- **{r['drug']}**\n"
        output += f"  - Original indication: {r['original_indication']}\n"
        output += f"  - Shared target: {r['shared_target']}\n"
        output += f"  - Confidence: {r['confidence']}\n\n"
    
    return output


@tool
async def find_therapeutic_targets(disease: str) -> str:
    """
    Find potential therapeutic targets (genes/proteins) for a disease.
    Ranked by how many existing drugs target them.
    
    Args:
        disease: Disease name (e.g., "Breast Cancer")
    
    Returns:
        List of target candidates with drug count.
    """
    results = await kg_client.find_therapeutic_targets(disease, limit=10)
    if not results:
        return f"No targets found for '{disease}'"
    
    output = f"Therapeutic targets for **{disease}**:\n\n"
    for r in results:
        drugs_info = f"{r['existing_drugs']} existing drugs" if r['existing_drugs'] > 0 else "No drugs yet (novel target)"
        output += f"- **{r['target']}** ({r['target_type']})\n"
        output += f"  - Relation: {r['relation_to_disease']}\n"
        output += f"  - {drugs_info}\n\n"
    
    return output


@tool
async def explain_drug_mechanism(drug: str, disease: str) -> str:
    """
    Explain the molecular mechanism of how a drug affects a disease.
    Shows the step-by-step pathway from drug to disease.
    
    Args:
        drug: Drug name (e.g., "Imatinib")
        disease: Disease name (e.g., "Leukemia")
    
    Returns:
        Step-by-step mechanism explanation.
    """
    results = await kg_client.explain_mechanism(drug, disease)
    if not results:
        return f"No mechanism found connecting '{drug}' to '{disease}'"
    
    output = f"Mechanism: **{drug}** -> **{disease}**\n\n"
    output += "Molecular pathway:\n"
    
    for i, step in enumerate(results, 1):
        output += f"{i}. {step['entity']} ({step['entity_type']})\n"
        output += f"   --[{step['relation']}]-->\n"
    output += f"{len(results)+1}. {results[-1]['next_entity']}\n"
    
    return output


# Export all tools
KNOWLEDGE_GRAPH_TOOLS = [
    search_biomedical_entities,
    get_entity_relationships,
    find_connection,
    find_drug_repurposing_candidates,
    find_therapeutic_targets,
    explain_drug_mechanism,
]
```

### 4. Add Tools to Your Agent

In your `backend/src/agent/graph.py`:

```python
from agent.tools.knowledge_graph_tools import KNOWLEDGE_GRAPH_TOOLS

# Add to your existing tools
tools = [
    # ... your existing tools
    *KNOWLEDGE_GRAPH_TOOLS,
]

# Create agent with tools
agent = create_react_agent(llm, tools)
```

### 5. Remove Old NetworkX Code

Delete or comment out:
- Old `kg.csv` loading code
- NetworkX graph initialization
- Any `import networkx as nx` that's no longer needed

---

## Frontend Integration (React)

### 1. Configuration

Add to your `.env`:

```bash
VITE_KNOWLEDGE_GRAPH_URL=http://<VM_IP>:8000
VITE_KNOWLEDGE_GRAPH_API_KEY=your-api-key
```

### 2. Create API Service

Create `frontend/src/services/knowledgeGraphApi.ts`:

```typescript
/**
 * PrimeKG Knowledge Graph API Client
 */

const API_URL = import.meta.env.VITE_KNOWLEDGE_GRAPH_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_KNOWLEDGE_GRAPH_API_KEY || '';

const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
};

// Types
export interface NodeItem {
  name: string;
  type: string;
  db_id?: string;
  score?: number;
}

export interface EdgeItem {
  source: string;
  target: string;
  relation: string;
  target_type: string;
}

export interface SubgraphData {
  entity: string;
  hops: number;
  nodes: Array<{ name: string; type: string; db_id?: string }>;
  edges: Array<{ source: string; target: string; relation: string }>;
  node_count: number;
  edge_count: number;
}

export interface RepurposingCandidate {
  drug: string;
  original_indication: string;
  shared_target: string;
  confidence: string;
}

// API Functions
export async function healthCheck(): Promise<{ status: string; neo4j: string }> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}

export async function getStats(): Promise<{
  total_nodes: number;
  total_relationships: number;
  nodes_with_embeddings: number;
}> {
  const response = await fetch(`${API_URL}/stats`, { headers });
  return response.json();
}

export async function searchText(query: string, limit = 10): Promise<NodeItem[]> {
  const response = await fetch(
    `${API_URL}/search/text?q=${encodeURIComponent(query)}&limit=${limit}`,
    { headers }
  );
  return response.json();
}

export async function searchSemantic(query: string, limit = 10): Promise<NodeItem[]> {
  const response = await fetch(
    `${API_URL}/search/semantic?q=${encodeURIComponent(query)}&limit=${limit}`,
    { headers }
  );
  return response.json();
}

export async function getNeighbors(nodeName: string, limit = 50): Promise<EdgeItem[]> {
  const response = await fetch(
    `${API_URL}/neighbors/${encodeURIComponent(nodeName)}?limit=${limit}`,
    { headers }
  );
  if (response.status === 404) return [];
  return response.json();
}

export async function getSubgraph(
  entity: string,
  hops = 2,
  limit = 100
): Promise<SubgraphData> {
  const response = await fetch(
    `${API_URL}/subgraph/${encodeURIComponent(entity)}?hops=${hops}&limit=${limit}`,
    { headers }
  );
  if (response.status === 404) {
    return { entity, hops, nodes: [], edges: [], node_count: 0, edge_count: 0 };
  }
  return response.json();
}

export async function findPath(
  source: string,
  target: string,
  maxHops = 2
): Promise<{
  source: string;
  target: string;
  paths_found: number;
  paths: Array<Array<{ node: string; node_type: string; relation?: string }>>;
}> {
  const response = await fetch(
    `${API_URL}/path/${encodeURIComponent(source)}/${encodeURIComponent(target)}?max_hops=${maxHops}`,
    { headers }
  );
  if (response.status === 404) {
    return { source, target, paths_found: 0, paths: [] };
  }
  return response.json();
}

export async function findRepurposingCandidates(
  disease: string,
  limit = 20
): Promise<RepurposingCandidate[]> {
  const response = await fetch(
    `${API_URL}/hypothesis/repurposing/${encodeURIComponent(disease)}?limit=${limit}`,
    { headers }
  );
  if (response.status === 404) return [];
  return response.json();
}

export async function findTherapeuticTargets(
  disease: string,
  limit = 20
): Promise<Array<{
  target: string;
  target_type: string;
  relation_to_disease: string;
  existing_drugs: number;
}>> {
  const response = await fetch(
    `${API_URL}/hypothesis/targets/${encodeURIComponent(disease)}?limit=${limit}`,
    { headers }
  );
  if (response.status === 404) return [];
  return response.json();
}

export async function explainMechanism(
  drug: string,
  disease: string
): Promise<Array<{
  entity: string;
  entity_type: string;
  relation: string;
  next_entity: string;
}>> {
  const response = await fetch(
    `${API_URL}/hypothesis/mechanisms/${encodeURIComponent(drug)}/${encodeURIComponent(disease)}`,
    { headers }
  );
  if (response.status === 404) return [];
  return response.json();
}
```

### 3. Example React Component

Create `frontend/src/components/KnowledgeGraphExplorer.tsx`:

```tsx
import { useState } from 'react';
import { searchSemantic, getNeighbors, NodeItem, EdgeItem } from '@/services/knowledgeGraphApi';

export function KnowledgeGraphExplorer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NodeItem[]>([]);
  const [neighbors, setNeighbors] = useState<EdgeItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchSemantic(query, 10);
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Knowledge Graph Explorer</h2>
      
      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search (e.g., 'cancer treatment drugs')"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Results:</h3>
          <div className="grid gap-2">
            {results.map((node) => (
              <div
                key={node.name}
                onClick={() => handleNodeClick(node.name)}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              >
                <span className="font-medium">{node.name}</span>
                <span className="text-gray-500 ml-2">({node.type})</span>
                {node.score && (
                  <span className="text-green-600 ml-2">
                    {(node.score * 100).toFixed(0)}% match
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neighbors (when a node is selected) */}
      {selectedNode && neighbors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">
            Connections for: {selectedNode}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Relationship</th>
                <th className="p-2 text-left">Connected Entity</th>
                <th className="p-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {neighbors.slice(0, 20).map((edge, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{edge.relation}</td>
                  <td
                    className="p-2 text-blue-600 cursor-pointer"
                    onClick={() => handleNodeClick(edge.target)}
                  >
                    {edge.target}
                  </td>
                  <td className="p-2 text-gray-500">{edge.target_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

### 4. Graph Visualization with D3/Cytoscape

For visualizing subgraphs, use the `/subgraph` endpoint:

```tsx
import { useEffect, useRef } from 'react';
import { getSubgraph } from '@/services/knowledgeGraphApi';
import ForceGraph3D from '3d-force-graph';

export function GraphVisualization({ entity }: { entity: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !entity) return;

    const loadGraph = async () => {
      const data = await getSubgraph(entity, 2, 100);
      
      // Transform for 3d-force-graph
      const graphData = {
        nodes: data.nodes.map(n => ({
          id: n.name,
          name: n.name,
          group: n.type,
        })),
        links: data.edges.map(e => ({
          source: e.source,
          target: e.target,
          label: e.relation,
        })),
      };

      const graph = ForceGraph3D()(containerRef.current!)
        .graphData(graphData)
        .nodeLabel('name')
        .linkLabel('label')
        .nodeColor(node => {
          const colors: Record<string, string> = {
            Drug: '#ff6b6b',
            Disease: '#4ecdc4',
            GeneProtein: '#45b7d1',
            Pathway: '#96ceb4',
          };
          return colors[(node as any).group] || '#999';
        });

      return () => graph._destructor();
    };

    loadGraph();
  }, [entity]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

---

## Migration Checklist

### Backend

- [ ] Create `knowledge_graph/client.py`
- [ ] Create `agent/tools/knowledge_graph_tools.py`
- [ ] Add tools to agent graph
- [ ] Add environment variables (`KNOWLEDGE_GRAPH_URL`, `KNOWLEDGE_GRAPH_API_KEY`)
- [ ] Remove NetworkX imports and code
- [ ] Remove local `kg.csv` dependency
- [ ] Test all tools with the agent

### Frontend

- [ ] Create `services/knowledgeGraphApi.ts`
- [ ] Add environment variables
- [ ] Replace any local graph code with API calls
- [ ] Test search and visualization components

---

## Testing

### Backend (Python)

```python
import asyncio
from knowledge_graph.client import kg_client

async def test():
    # Health check
    health = await kg_client.health_check()
    print(f"API Status: {health}")
    
    # Search
    results = await kg_client.search_semantic("cancer drugs")
    print(f"Found {len(results)} results")
    
    # Repurposing
    candidates = await kg_client.find_repurposing_candidates("Sarcoma")
    print(f"Found {len(candidates)} repurposing candidates")

asyncio.run(test())
```

### Frontend (Browser Console)

```javascript
import { searchSemantic, getNeighbors } from './services/knowledgeGraphApi';

// Test search
const results = await searchSemantic('cancer treatment');
console.log('Search results:', results);

// Test neighbors
const neighbors = await getNeighbors('Aspirin');
console.log('Aspirin neighbors:', neighbors);
```

---

## Troubleshooting

### "Connection refused"
- Check if the VM is running: `gcloud compute instances list`
- Check if the API is running: `curl http://<IP>:8000/health`

### "Invalid API key"
- Verify the API key in Secret Manager
- Check environment variable is set correctly

### "Timeout"
- Reduce `limit` parameter
- Use more specific search terms
- Check VM resources (might need more RAM)

### "No results"
- Use partial names (e.g., "Aspirin" not "aspirin tablet")
- Try semantic search instead of text search
- Check if the entity exists in the graph
