export type UserGraphNodeType = "phase" | "problem";

export type UserGraphNode = {
  id: string;
  type: UserGraphNodeType;
  label: string;
  phase?: string;
  source?: string;
  createdAt: number;
};

export type UserGraphEdgeType = "belongs_to";

export type UserGraphEdge = {
  id: string;
  from: string;
  to: string;
  type: UserGraphEdgeType;
  createdAt: number;
};

export type UserKnowledgeGraph = {
  version: 1;
  nodes: UserGraphNode[];
  edges: UserGraphEdge[];
  updatedAt: number;
};

const STORAGE_KEY = "sarkome.userKnowledgeGraph.v1";

const now = () => Date.now();

export function loadUserKnowledgeGraph(): UserKnowledgeGraph {
  if (typeof window === "undefined") {
    return { version: 1, nodes: [], edges: [], updatedAt: now() };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, nodes: [], edges: [], updatedAt: now() };

    const parsed = JSON.parse(raw) as Partial<UserKnowledgeGraph>;
    if (parsed.version !== 1) {
      return { version: 1, nodes: [], edges: [], updatedAt: now() };
    }

    return {
      version: 1,
      nodes: Array.isArray(parsed.nodes) ? (parsed.nodes as UserGraphNode[]) : [],
      edges: Array.isArray(parsed.edges) ? (parsed.edges as UserGraphEdge[]) : [],
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : now(),
    };
  } catch {
    return { version: 1, nodes: [], edges: [], updatedAt: now() };
  }
}

export function saveUserKnowledgeGraph(graph: UserKnowledgeGraph) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
}

function uniqById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of items) map.set(item.id, item);
  return Array.from(map.values());
}

export function upsertUserKnowledgeGraph(payload: {
  nodes?: UserGraphNode[];
  edges?: UserGraphEdge[];
}) {
  const existing = loadUserKnowledgeGraph();

  const nodes = uniqById([...(existing.nodes || []), ...((payload.nodes || []) as UserGraphNode[])]);
  const edges = uniqById([...(existing.edges || []), ...((payload.edges || []) as UserGraphEdge[])]);

  saveUserKnowledgeGraph({
    version: 1,
    nodes,
    edges,
    updatedAt: now(),
  });
}

export function makeDeterministicId(prefix: string, value: string) {
  // Keep it simple + URL-safe. Deterministic IDs prevent duplicates across saves.
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${prefix}:${normalized}`;
}
