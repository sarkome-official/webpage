import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/molecules";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy loaded components
const KnowledgeGraph = lazy(() => import("@/pages/platform/KnowledgeGraphView").then(m => ({ default: m.KnowledgeGraphView })));
const KnowledgeGraphNodes = lazy(() => import("@/pages/platform/KnowledgeGraphNodes").then(m => ({ default: m.KnowledgeGraphNodes })));
const AlphaFoldView = lazy(() => import("@/pages/platform/AlphaFoldView").then(m => ({ default: m.AlphaFoldView })));
const ApiView = lazy(() => import("@/pages/platform/ApiView").then(m => ({ default: m.ApiView })));
const HistoryView = lazy(() => import("@/pages/platform/HistoryView").then(m => ({ default: m.HistoryView })));
const SimulationView = lazy(() => import("@/pages/platform/SimulationView").then(m => ({ default: m.SimulationView })));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const ProgramDetail = lazy(() => import("@/pages/programs/ProgramDetail"));
const DocsLayout = lazy(() => import("@/pages/docs/DocsLayout").then(m => ({ default: m.DocsLayout })));
const DocPage = lazy(() => import("@/pages/docs/DocPage"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

import { docsConfig } from "@/lib/docs-config";
import { Navigate } from "react-router-dom";
import { getAgentUrl } from "@/lib/langgraph-api";
import type { ChatMessage } from "@/lib/chat-types";
import { useAgent } from "@/hooks/useAgent";
import { deriveThreadTitle, getOrCreateActiveThreadId, getThread, upsertThread } from "@/lib/local-threads";
import { RunLogs } from "@/components/RunLogs";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [liveSourcesByLabel, setLiveSourcesByLabel] = useState<Record<string, string>>({});
  const [liveSourcesList, setLiveSourcesList] = useState<Array<{ label?: string; url: string; id?: string }>>([]);
  const [sourcesByMessageId, setSourcesByMessageId] = useState<Record<string, Record<string, string>>>({});
  const [sourcesListByMessageId, setSourcesListByMessageId] = useState<Record<string, Array<{ label?: string; url: string; id?: string }>>>({});
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const [rawEvents, setRawEvents] = useState<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const [activeThreadId] = useState(() => {
    const id = getOrCreateActiveThreadId();
    return id;
  });

  const [initialThreadMessages] = useState<ChatMessage[]>(() => {
    const existing = getThread(activeThreadId);
    return Array.isArray(existing?.messages) ? existing!.messages : [];
  });

  const isPlatformRoute = location.pathname.startsWith("/platform") ||
    location.pathname === "/knowledge-graph" ||

    location.pathname === "/alphafold" ||

    location.pathname === "/knowledge-graph-nodes" ||
    location.pathname === "/api" ||

    location.pathname === "/history";

  const thread = useAgent({
    url: getAgentUrl(),
    threadId: activeThreadId,
    assistantId: "agent",
    initialMessages: initialThreadMessages,
    onUpdateEvent: (event: any) => {
      setRawEvents((prev) => [...prev, event]);
      let processedEvent: ProcessedEvent | null = null;
      if (event.generate_query) {
        processedEvent = {
          title: "Generating Search Queries",
          data: event.generate_query?.search_query?.join(", ") || "",
          raw: event,
          ts: new Date().toISOString(),
          type: "generate_query",
        } as any;
      } else if (event.web_research) {
        const rawSources = event.web_research.sources_gathered || {};
        // Handle both array (legacy) and dictionary (new) formats
        const sources = Array.isArray(rawSources) ? rawSources : Object.values(rawSources);

        // Capture label -> real URL map for later link rewriting.
        // We keep multiple keys (label + id when available) to increase match chance.
        setLiveSourcesByLabel((prev) => {
          const next = { ...prev };
          for (const s of sources) {
            if (!s || typeof s !== "object") continue;
            const label: string | undefined =
              typeof (s as any).label === "string"
                ? (s as any).label
                : typeof (s as any).title === "string"
                  ? (s as any).title
                  : undefined;
            const url: string | undefined =
              typeof (s as any).url === "string"
                ? (s as any).url
                : typeof (s as any).link === "string"
                  ? (s as any).link
                  : typeof (s as any).href === "string"
                    ? (s as any).href
                    : typeof (s as any).source === "string"
                      ? (s as any).source
                      : undefined;

            if (label && url) {
              next[label] = url;
              next[label.toLowerCase()] = url;
            }

            if (typeof (s as any).id === "string" && url) {
              next[(s as any).id] = url;
            }
          }
          return next;
        });

        // Also keep an ordered list (best-effort) to resolve ids like "0-2" by index.
        setLiveSourcesList((prev) => {
          const next = [...prev];
          const existingUrls = new Set(prev.map((p) => p.url));
          for (const s of sources) {
            if (!s || typeof s !== "object") continue;
            const label: string | undefined =
              typeof (s as any).label === "string"
                ? (s as any).label
                : typeof (s as any).title === "string"
                  ? (s as any).title
                  : undefined;
            const url: string | undefined =
              typeof (s as any).url === "string"
                ? (s as any).url
                : typeof (s as any).link === "string"
                  ? (s as any).link
                  : typeof (s as any).href === "string"
                    ? (s as any).href
                    : typeof (s as any).source === "string"
                      ? (s as any).source
                      : undefined;
            const id: string | undefined = typeof (s as any).id === "string" ? (s as any).id : undefined;
            if (!url) continue;
            if (existingUrls.has(url)) continue;
            existingUrls.add(url);
            next.push({ label, url, id });
          }
          return next;
        });

        const numSources = sources.length;
        const uniqueLabels = [
          ...new Set(sources.map((s: any) => s.label).filter(Boolean)),
        ];
        const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
        processedEvent = {
          title: "Web Research",
          data: `Gathered ${numSources} sources. Related to: ${exampleLabels || "N/A"}.`,
          raw: event,
          ts: new Date().toISOString(),
          type: "web_research",
        } as any;
      } else if (event.reflection) {
        processedEvent = {
          title: "Reflection",
          data: "Analysing Web Research Results",
          raw: event,
          ts: new Date().toISOString(),
          type: "reflection",
        } as any;
      } else if (event.finalize_answer) {
        processedEvent = {
          title: "Finalizing Answer",
          data: "Composing and presenting the final answer.",
          raw: event,
          ts: new Date().toISOString(),
          type: "finalize_answer",
        } as any;
        hasFinalizeEventOccurredRef.current = true;
      }
      if (processedEvent) {
        setProcessedEventsTimeline((prevEvents) => [
          ...prevEvents,
          processedEvent!,
        ]);
      }
      // Special-case: AlphaFold node logs (backend returns alphafold_logs array)
      try {
        if (event && typeof event === 'object' && (event as any).query_alphafold) {
          const af = (event as any).query_alphafold;
          if (af.alphafold_logs && Array.isArray(af.alphafold_logs) && af.alphafold_logs.length > 0) {
            const afEvent = {
              title: 'AlphaFold Logs',
              data: af.alphafold_logs.join('\n'),
              raw: event,
              ts: new Date().toISOString(),
              type: 'alphafold_logs',
            } as ProcessedEvent;
            setProcessedEventsTimeline((prev) => [...prev, afEvent]);
          }
        }
      } catch {
        // ignore
      }
    },
    onError: (error: any) => {
      setError(error?.message || String(error));
    },
  });

  useEffect(() => {
    const now = Date.now();
    upsertThread({
      id: activeThreadId,
      createdAt: getThread(activeThreadId)?.createdAt ?? now,
      updatedAt: now,
      title: deriveThreadTitle(thread.messages),
      messages: thread.messages,
    });
  }, [activeThreadId, thread.messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;

      if (scrollViewport) {
        const threshold = 150; // pixels from bottom to consider "at bottom"
        const isAtBottom =
          scrollViewport.scrollHeight - scrollViewport.scrollTop - scrollViewport.clientHeight < threshold;

        if (isAtBottom) {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
      }
    }
  }, [thread.messages]);

  // Track previous loading state to detect when loading ends
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    // Detect when loading transitions from true to false (run completed)
    const justFinishedLoading = wasLoadingRef.current && !thread.isLoading;
    wasLoadingRef.current = thread.isLoading;

    if (
      justFinishedLoading &&
      thread.messages.length > 0 &&
      processedEventsTimeline.length > 0
    ) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.id) {
        setHistoricalActivities((prev) => ({
          ...prev,
          [lastMessage.id!]: [...processedEventsTimeline],
        }));

        // Persist the sources gathered during this run for this AI message.
        setSourcesByMessageId((prev) => ({
          ...prev,
          [lastMessage.id!]: { ...liveSourcesByLabel },
        }));

        setSourcesListByMessageId((prev) => ({
          ...prev,
          [lastMessage.id!]: [...liveSourcesList],
        }));
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline, liveSourcesByLabel, liveSourcesList]);

  const handleSubmit = useCallback(
    (
      submittedInputValue: string,
      effort: string,
      models: { queryModel: string; answerModel: string },
      activeAgents: string[]
    ) => {
      if (!submittedInputValue.trim()) return;
      setProcessedEventsTimeline([]);
      setRawEvents([]);
      setLiveSourcesByLabel({});
      setLiveSourcesList([]);
      hasFinalizeEventOccurredRef.current = false;

      let initial_search_query_count = 0;
      let max_research_loops = 0;
      switch (effort) {
        case "low":
          initial_search_query_count = 1;
          max_research_loops = 1;
          break;
        case "medium":
          initial_search_query_count = 3;
          max_research_loops = 3;
          break;
        case "high":
          initial_search_query_count = 5;
          max_research_loops = 10;
          break;
      }

      const newMessages: ChatMessage[] = [
        ...(thread.messages || []),
        {
          type: "human",
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      console.log("Co-Research Nodes Active:", activeAgents.length > 0 ? activeAgents.join(", ") : "None");

      // Force scroll to bottom on new submission
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
          if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);

      thread.submit({
        messages: newMessages,
        initial_search_query_count: initial_search_query_count,
        max_research_loops: max_research_loops,
        reasoning_model: models.answerModel,
        reflection_model: models.queryModel,
        // Tool routing flags derived from UI toggles
        enable_web_search: activeAgents.includes('web_search'),
        enable_kg: activeAgents.includes('primekg'),
        enable_alphafold: activeAgents.includes('alphafold_rag'),
        tools: activeAgents,
      });
    },
    [thread, processedEventsTimeline]
  );



  const handleCancel = useCallback(() => {
    // Abort the running stream and record a cancellation event without reloading.
    thread.stop();
    const cancelEvent = {
      title: 'Run Cancelled',
      data: 'User aborted the run (frontend abort called).',
      raw: null,
      ts: new Date().toISOString(),
      type: 'cancel',
    } as ProcessedEvent;
    setProcessedEventsTimeline((prev) => [...prev, cancelEvent]);

    // Append a short AI/system message indicating cancellation so timeline and UI reflect it
    try {
      const cancelMsg: ChatMessage = {
        id: `cancel_${Date.now()}`,
        type: 'ai',
        content: 'Run cancelled by user.',
        metadata: { source: 'client', ts: new Date().toISOString() },
      };
      thread.setMessages([...(thread.messages || []), cancelMsg]);
    } catch (e) {
      // best-effort - if setMessages isn't available, ignore
      // eslint-disable-next-line no-console
      console.debug('Could not append cancel message', e);
    }
  }, [thread]);

  if (!isPlatformRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<Navigate to={`/docs/${docsConfig[0].slug}`} replace />} />
            <Route path=":slug" element={<DocPage />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-screen bg-background text-foreground font-sans antialiased w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
            <header className="flex h-14 items-center gap-3 border-b border-border bg-background/50 px-4 sm:px-6 backdrop-blur-xl sticky top-0 z-10">
              <SidebarTrigger className="text-[#7E22CE] hover:text-[#7E22CE] transition-colors" />

              {/* App branding - visible on mobile */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-foreground">Sarkome</span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <ThemeToggle />
              </div>
            </header>
            <main className="h-full w-full mx-auto overflow-y-auto no-scrollbar">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
                  <Route path="/knowledge-graph-nodes" element={<KnowledgeGraphNodes />} />

                  <Route path="/alphafold" element={<AlphaFoldView />} />
                  <Route path="/api" element={<ApiView />} />
                  <Route path="/sim" element={<SimulationView />} />

                  <Route path="/history" element={<HistoryView />} />
                  <Route path="/platform" element={
                    <div className="max-w-4xl mx-auto h-full">
                      {thread.messages.length === 0 ? (
                        <WelcomeScreen
                          handleSubmit={handleSubmit}
                          isLoading={thread.isLoading}
                          onCancel={handleCancel}
                        />
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <h1 className="text-2xl text-red-400 font-bold">Error</h1>
                            <p className="text-red-400">{JSON.stringify(error)}</p>

                            <Button
                              variant="destructive"
                              onClick={() => window.location.reload()}
                            >
                              Retry
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ChatMessagesView
                          messages={thread.messages}
                          isLoading={thread.isLoading}
                          scrollAreaRef={scrollAreaRef}
                          onSubmit={handleSubmit}
                          onCancel={handleCancel}
                          liveActivityEvents={processedEventsTimeline}
                          historicalActivities={historicalActivities}
                          sourcesByMessageId={sourcesByMessageId}
                          sourcesListByMessageId={sourcesListByMessageId}
                          rawEvents={rawEvents}

                        />
                      )}
                    </div>
                  } />
                </Routes>
              </Suspense>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
