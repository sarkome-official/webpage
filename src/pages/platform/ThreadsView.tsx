import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Database, Link as LinkIcon } from "lucide-react";

type ThreadListItem = {
  thread_id?: string;
  id?: string;
} & Record<string, unknown>;

type MessageLike = {
  type?: string;
  content?: unknown;
  id?: string;
  name?: string;
} & Record<string, unknown>;

function getLangGraphApiUrl() {
  return import.meta.env.DEV ? "http://localhost:2024" : "http://localhost:8123";
}

function asThreadId(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;
  const threadId = typeof obj.thread_id === "string" ? obj.thread_id : null;
  if (threadId) return threadId;
  const id = typeof obj.id === "string" ? obj.id : null;
  return id;
}

function extractThreads(payload: unknown): ThreadListItem[] {
  if (Array.isArray(payload)) return payload as ThreadListItem[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.threads)) return obj.threads as ThreadListItem[];
  }
  return [];
}

function extractMessages(payload: unknown): MessageLike[] {
  const candidates: unknown[] = [];

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    // Common LangGraph shapes
    candidates.push(obj.messages);
    candidates.push(obj.values);
    candidates.push(obj.state);
    candidates.push(obj.checkpoint);

    if (obj.values && typeof obj.values === "object") {
      candidates.push((obj.values as Record<string, unknown>).messages);
    }
    if (obj.state && typeof obj.state === "object") {
      candidates.push((obj.state as Record<string, unknown>).messages);
    }
    if (obj.checkpoint && typeof obj.checkpoint === "object") {
      const cp = obj.checkpoint as Record<string, unknown>;
      if (cp.values && typeof cp.values === "object") {
        candidates.push((cp.values as Record<string, unknown>).messages);
      }
    }
  }

  for (const c of candidates) {
    if (Array.isArray(c)) return c as MessageLike[];
    if (c && typeof c === "object") {
      const maybe = c as Record<string, unknown>;
      if (Array.isArray(maybe.messages)) return maybe.messages as MessageLike[];
    }
  }

  return [];
}

function stringifyContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (content == null) return "";
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return String(content);
  }
}

export const ThreadsView = () => {
  const apiUrl = useMemo(() => getLangGraphApiUrl(), []);

  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState<string | null>(null);

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadState, setThreadState] = useState<unknown>(null);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateError, setStateError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadThreads() {
      setThreadsLoading(true);
      setThreadsError(null);
      try {
        const res = await fetch(`${apiUrl}/threads`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`GET /threads failed (${res.status}): ${text || res.statusText}`);
        }
        const json = (await res.json()) as unknown;
        const items = extractThreads(json);
        setThreads(items);
        if (!selectedThreadId) {
          const first = items.map(asThreadId).find(Boolean) as string | undefined;
          if (first) setSelectedThreadId(first);
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setThreadsError(e?.message || "Failed to load threads");
      } finally {
        setThreadsLoading(false);
      }
    }

    loadThreads();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  useEffect(() => {
    if (!selectedThreadId) return;

    const controller = new AbortController();
    async function loadState() {
      setStateLoading(true);
      setStateError(null);
      setThreadState(null);
      try {
        const res = await fetch(`${apiUrl}/threads/${encodeURIComponent(selectedThreadId)}/state`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`GET /threads/{id}/state failed (${res.status}): ${text || res.statusText}`);
        }
        const json = (await res.json()) as unknown;
        setThreadState(json);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setStateError(e?.message || "Failed to load thread state");
      } finally {
        setStateLoading(false);
      }
    }

    loadState();
    return () => controller.abort();
  }, [apiUrl, selectedThreadId]);

  const extractedMessages = useMemo(() => extractMessages(threadState), [threadState]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-sans">
      <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Hilos (Threads) & Historial del Agente</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Historial de conversaciones guardado automáticamente en Postgres (LangGraph).
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 rounded-xl bg-muted/20 border border-border">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm text-foreground font-semibold">Cómo funciona la persistencia</div>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Hilos (Threads): Cada conversación nueva que inicias con el agente se guarda con un <span className="font-mono text-foreground">thread_id</span> único en Postgres.</li>
                  <li>Persistencia Automática: LangGraph guarda automáticamente cada mensaje del usuario y cada respuesta del agente dentro de ese <span className="font-mono text-foreground">thread_id</span>.</li>
                  <li>API Lista para Usar: El contenedor <span className="font-mono text-foreground">langgraph-api</span> expone endpoints para el Frontend.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/20 border border-border">
            <div className="flex items-start gap-3">
              <LinkIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="text-sm text-foreground font-semibold">Endpoints</div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-mono text-foreground">GET /threads</div>
                  <div className="font-mono text-foreground">GET /threads/{`{id}`}/state</div>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Base URL actual: <span className="font-mono text-foreground">{apiUrl}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Threads list */}
          <section className="lg:col-span-4 h-full rounded-xl border border-border bg-muted/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="text-sm font-bold text-foreground">Threads</div>
              <div className="text-xs text-muted-foreground mt-1">Selecciona un thread_id para ver el historial.</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threadsLoading ? (
                <div className="p-4 text-sm text-muted-foreground">Cargando threads…</div>
              ) : threadsError ? (
                <div className="p-4">
                  <div className="text-sm text-red-400 font-semibold">Error</div>
                  <div className="text-xs text-muted-foreground mt-1 break-words">{threadsError}</div>
                </div>
              ) : threads.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No hay threads todavía.</div>
              ) : (
                <div className="p-2">
                  {threads.map((t, idx) => {
                    const id = asThreadId(t) || `thread-${idx}`;
                    const isActive = id === selectedThreadId;
                    return (
                      <button
                        key={`${id}-${idx}`}
                        onClick={() => setSelectedThreadId(id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          isActive
                            ? "bg-white/5 border-primary/30"
                            : "bg-background/20 border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs font-mono text-foreground truncate">{id}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{t.thread_id ? "thread_id" : t.id ? "id" : "thread"}</div>
                          </div>
                          {isActive ? <div className="size-1.5 rounded-full bg-primary" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Thread state */}
          <section className="lg:col-span-8 h-full rounded-xl border border-border bg-muted/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="text-sm font-bold text-foreground">Historial</div>
              <div className="text-xs text-muted-foreground mt-1">
                Thread seleccionado: <span className="font-mono text-foreground">{selectedThreadId || "—"}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!selectedThreadId ? (
                <div className="text-sm text-muted-foreground">Selecciona un thread para ver su estado.</div>
              ) : stateLoading ? (
                <div className="text-sm text-muted-foreground">Cargando historial…</div>
              ) : stateError ? (
                <div>
                  <div className="text-sm text-red-400 font-semibold">Error</div>
                  <div className="text-xs text-muted-foreground mt-1 break-words">{stateError}</div>
                </div>
              ) : extractedMessages.length > 0 ? (
                <div className="space-y-3">
                  {extractedMessages.map((m, i) => {
                    const role = m.type || (typeof (m as any).role === "string" ? (m as any).role : "message");
                    const content = stringifyContent(m.content ?? (m as any).text ?? (m as any).message);
                    return (
                      <div key={`${m.id || i}`} className="rounded-xl border border-border bg-background/30 p-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{role}</div>
                          {m.id ? <div className="text-[10px] text-muted-foreground font-mono truncate">{m.id}</div> : null}
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-sm text-foreground/90 font-sans leading-relaxed">
                          {content}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">No se encontraron mensajes en el estado devuelto.</div>
                  <div className="text-xs text-muted-foreground">Mostrando el JSON completo para inspección:</div>
                  <pre className="text-xs bg-background/30 border border-border rounded-xl p-3 overflow-x-auto">
                    {stringifyContent(threadState)}
                  </pre>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
