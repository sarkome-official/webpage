import type { ChatMessage } from "@/lib/chat-types";

export type StoredThread = {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

const THREADS_KEY = "sarkome.threads.v1";
const ACTIVE_THREAD_KEY = "sarkome.activeThreadId.v1";

function safeJsonParse<T>(raw: string | null): T | null {
  if (typeof raw !== "string" || raw.trim().length === 0) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readThreadsMap(): Record<string, StoredThread> {
  const parsed = safeJsonParse<Record<string, StoredThread>>(localStorage.getItem(THREADS_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

function writeThreadsMap(map: Record<string, StoredThread>) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(map));
}

export function listThreads(): StoredThread[] {
  const map = readThreadsMap();
  return Object.values(map)
    .filter((t) => t && typeof t.id === "string")
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function getThread(id: string): StoredThread | null {
  const map = readThreadsMap();
  return map[id] ?? null;
}

export function upsertThread(next: StoredThread) {
  const map = readThreadsMap();
  map[next.id] = next;
  writeThreadsMap(map);
}

export function deleteThread(id: string) {
  const map = readThreadsMap();
  if (map[id]) {
    delete map[id];
    writeThreadsMap(map);
  }
  const active = getActiveThreadId();
  if (active === id) {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  }
}

export function getActiveThreadId(): string | null {
  const raw = localStorage.getItem(ACTIVE_THREAD_KEY);
  if (typeof raw !== "string" || raw.trim().length === 0) return null;
  return raw;
}

export function setActiveThreadId(id: string) {
  localStorage.setItem(ACTIVE_THREAD_KEY, id);
}

export function createThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateActiveThreadId(): string {
  const existing = getActiveThreadId();
  if (existing) return existing;
  const created = createThreadId();
  setActiveThreadId(created);
  return created;
}

export function deriveThreadTitle(messages: ChatMessage[]): string | undefined {
  const firstHuman = messages.find((m) => m?.type === "human");
  const raw = typeof firstHuman?.content === "string" ? firstHuman.content : null;
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const singleLine = trimmed.replace(/\s+/g, " ");
  return singleLine.length > 64 ? `${singleLine.slice(0, 64)}…` : singleLine;
}
