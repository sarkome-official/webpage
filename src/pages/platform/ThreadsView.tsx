import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Database, Link as LinkIcon } from "lucide-react";
import { getAgentUrl } from "@/lib/langgraph-api";
import type { ChatMessage } from "@/lib/chat-types";
import { getThread, listThreads, type StoredThread } from "@/lib/local-threads";



function asThreadLabel(t: StoredThread): string {
  if (t.title && t.title.trim().length > 0) return t.title;
  return t.id;
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
  const [showWipDialog, setShowWipDialog] = useState(true);
  const agentUrl = useMemo(() => getAgentUrl(), []);


  const [threads, setThreads] = useState<StoredThread[]>(() => listThreads());
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
    const first = listThreads()[0];
    return first?.id ?? null;
  });

  useEffect(() => {
    // Refresh list on mount and when the browser storage changes (other tabs).
    setThreads(listThreads());
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.includes("sarkome.threads")) setThreads(listThreads());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (selectedThreadId) return;
    const first = listThreads()[0];
    if (first?.id) setSelectedThreadId(first.id);
  }, [selectedThreadId]);

  const selectedThread = useMemo(() => (selectedThreadId ? getThread(selectedThreadId) : null), [selectedThreadId]);
  const extractedMessages = useMemo(() => (Array.isArray(selectedThread?.messages) ? (selectedThread!.messages as ChatMessage[]) : []), [selectedThread]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-sans">
      <div className="p-4 md:p-8 border-b border-border bg-muted/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Agent Threads & History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Conversation history saved locally (backend does not expose /threads).
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 rounded-xl bg-muted/20 border border-border">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm text-foreground font-semibold">How persistence works</div>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Threads: Each conversation is saved locally with a <span className="font-mono text-foreground">thread_id</span>.</li>
                  <li>Auto Persistence: The frontend saves every user message and agent response to <span className="font-mono text-foreground">localStorage</span>.</li>
                  <li>Backend: The agent is invoked via FastAPI at <span className="font-mono text-foreground">/runs</span> (invoke/stream).</li>
                </ul>
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
              <div className="text-xs text-muted-foreground mt-1">Select a thread_id to view history.</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No threads yet.</div>
              ) : (
                <div className="p-2">
                  {threads.map((t, idx) => {
                    const id = t.id || `thread-${idx}`;
                    const isActive = id === selectedThreadId;
                    return (
                      <button
                        key={`${id}-${idx}`}
                        onClick={() => setSelectedThreadId(id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${isActive
                          ? "bg-white/5 border-primary/30"
                          : "bg-background/20 border-border hover:bg-muted/30"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs font-mono text-foreground truncate">{asThreadLabel(t)}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{t.id}</div>
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
              <div className="text-sm font-bold text-foreground">History</div>
              <div className="text-xs text-muted-foreground mt-1">
                Selected Thread: <span className="font-mono text-foreground">{selectedThreadId || "—"}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!selectedThreadId ? (
                <div className="text-sm text-muted-foreground">Select a thread to view its state.</div>
              ) : extractedMessages.length > 0 ? (
                <div className="space-y-3">
                  {extractedMessages.map((m, i) => {
                    const role = m.type || (typeof (m as any).role === "string" ? (m as any).role : "message");
                    const content = stringifyContent((m as any).content ?? (m as any).text ?? (m as any).message);
                    return (
                      <div key={`${(m as any).id || i}`} className="rounded-xl border border-border bg-background/30 p-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{role}</div>
                          {(m as any).id ? <div className="text-[10px] text-muted-foreground font-mono truncate">{(m as any).id}</div> : null}
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
                  <div className="text-sm text-muted-foreground">No messages in this thread yet.</div>
                </div>
              )}
            </div>
          </section>
          {showWipDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-background border border-border p-6 rounded-xl shadow-2xl max-w-sm w-full mx-auto relative animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">We are working here</h2>
                  <p className="text-sm text-muted-foreground">
                    Chat history is currently saved here and in local storage.
                  </p>
                </div>
                <div className="mt-6 flex justify-center w-full">
                  <button
                    onClick={() => setShowWipDialog(false)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
