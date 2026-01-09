/**
 * PrimeKG Knowledge Graph API Client
 * -----------------------------------
 * TypeScript client for consuming the PrimeKG API from the frontend.
 * Provides type-safe access to biomedical knowledge graph operations.
 */

import { getAuthToken } from '@/lib/auth-token';

// Configuration (from environment)
const API_URL = import.meta.env.VITE_KNOWLEDGE_GRAPH_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_KNOWLEDGE_GRAPH_API_KEY || '';

const baseHeaders: Record<string, string> = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
};

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

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

export interface PathStep {
    node: string;
    node_type: string;
    relation?: string;
}

export interface PathResponse {
    source: string;
    target: string;
    paths_found: number;
    paths: PathStep[][];
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

export interface TargetCandidate {
    target: string;
    target_type: string;
    relation_to_disease: string;
    existing_drugs: number;
}

export interface CombinationCandidate {
    partner_drug: string;
    shared_pathway?: string;
    mechanism: string;
}

export interface MechanismStep {
    entity: string;
    entity_type: string;
    relation: string;
    next_entity: string;
}

export interface ModuleContext {
    name: string;
    version: string;
    description: string;
    status: string;
    capabilities: string[];
    entity_types: string[];
    relationship_types: string[];
    tools: ToolDefinition[];
    usage_examples: Array<{ query: string; tool: string; call: string }>;
}

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Array<{
        name: string;
        type: string;
        description: string;
        required: boolean;
        default?: string;
    }>;
    endpoint: string;
    method: string;
}

export interface GraphStats {
    total_nodes: number;
    total_relationships: number;
    nodes_with_embeddings: number;
}

// -----------------------------------------------------------------------------
// API Client Class
// -----------------------------------------------------------------------------

class KnowledgeGraphClient {
    private baseUrl: string;
    private baseHeaders: Record<string, string>;

    constructor() {
        this.baseUrl = API_URL;
        this.baseHeaders = baseHeaders;
    }

    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        // Get auth token for authenticated requests (optional but recommended)
        const authToken = await getAuthToken();
        const headers = {
            ...this.baseHeaders,
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...options?.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Not found: ${endpoint}`);
            }
            if (response.status === 403) {
                throw new Error('Invalid API key');
            }
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    // ---------------------------------------------------------------------------
    // System Endpoints
    // ---------------------------------------------------------------------------

    async healthCheck(): Promise<{ status: string; neo4j: string }> {
        return this.fetch('/health');
    }

    async getStats(): Promise<GraphStats> {
        return this.fetch('/stats');
    }

    async getContext(): Promise<ModuleContext> {
        return this.fetch('/context');
    }

    async getToolsSchema(): Promise<{ tools: unknown[] }> {
        return this.fetch('/tools/schema');
    }

    // ---------------------------------------------------------------------------
    // Search Endpoints
    // ---------------------------------------------------------------------------

    async searchText(query: string, limit = 10): Promise<NodeItem[]> {
        return this.fetch(`/search/text?q=${encodeURIComponent(query)}&limit=${limit}`);
    }

    async searchSemantic(query: string, limit = 10, threshold = 0.6): Promise<NodeItem[]> {
        return this.fetch(
            `/search/semantic?q=${encodeURIComponent(query)}&limit=${limit}&threshold=${threshold}`
        );
    }

    // ---------------------------------------------------------------------------
    // Graph Traversal Endpoints
    // ---------------------------------------------------------------------------

    async getNeighbors(entityName: string, limit = 50): Promise<EdgeItem[]> {
        return this.fetch(`/neighbors/${encodeURIComponent(entityName)}?limit=${limit}`);
    }

    async findPath(source: string, target: string, maxHops = 2): Promise<PathResponse> {
        return this.fetch(
            `/path/${encodeURIComponent(source)}/${encodeURIComponent(target)}?max_hops=${maxHops}`
        );
    }

    async getSubgraph(entity: string, hops = 2, limit = 100): Promise<SubgraphData> {
        return this.fetch(
            `/subgraph/${encodeURIComponent(entity)}?hops=${hops}&limit=${limit}`
        );
    }

    // ---------------------------------------------------------------------------
    // Hypothesis Generation Endpoints
    // ---------------------------------------------------------------------------

    async findRepurposingCandidates(disease: string, limit = 20): Promise<RepurposingCandidate[]> {
        return this.fetch(
            `/hypothesis/repurposing/${encodeURIComponent(disease)}?limit=${limit}`
        );
    }

    async findTherapeuticTargets(disease: string, limit = 20): Promise<TargetCandidate[]> {
        return this.fetch(
            `/hypothesis/targets/${encodeURIComponent(disease)}?limit=${limit}`
        );
    }

    async findDrugCombinations(drug: string, limit = 20): Promise<CombinationCandidate[]> {
        return this.fetch(
            `/hypothesis/combinations/${encodeURIComponent(drug)}?limit=${limit}`
        );
    }

    async explainMechanism(drug: string, disease: string): Promise<MechanismStep[]> {
        return this.fetch(
            `/hypothesis/mechanisms/${encodeURIComponent(drug)}/${encodeURIComponent(disease)}`
        );
    }
}

// Export singleton instance
export const knowledgeGraphApi = new KnowledgeGraphClient();

// Export class for custom instantiation
export { KnowledgeGraphClient };
