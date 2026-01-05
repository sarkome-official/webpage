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
