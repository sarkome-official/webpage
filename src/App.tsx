import { useState, useEffect, useRef, useCallback } from "react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/molecules";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { KnowledgeGraphView as KnowledgeGraph } from "@/pages/platform/KnowledgeGraphView";
import LandingPage from "@/pages/LandingPage";
import { AgentPerformanceView } from "@/pages/platform/AgentPerformanceView";
import { SimulationView } from "@/pages/platform/SimulationView";
import { AlphaFoldView } from "@/pages/platform/AlphaFoldView";
import { ReportView } from "@/pages/platform/ReportView";
import { ConstitutionEditor } from "@/pages/platform/ConstitutionEditor";
import { DataIngestionView } from "@/pages/platform/DataIngestionView";
import { KnowledgeExportView } from "@/pages/platform/KnowledgeExportView";
import { WhiteboardView } from "@/pages/platform/WhiteboardView";
import { ThreadsView } from "@/pages/platform/ThreadsView";
import ProgramDetail from "@/pages/programs/ProgramDetail";
import { DocsLayout } from "@/pages/docs/DocsLayout";
import DocPage from "@/pages/docs/DocPage";
import { docsConfig } from "@/lib/docs-config";
import { Navigate } from "react-router-dom";
import { getLangServeUrl } from "@/lib/langgraph-api";
import type { ChatMessage } from "@/lib/chat-types";
import { useLangServeAgent } from "@/hooks/useLangServeAgent";
import { deriveThreadTitle, getOrCreateActiveThreadId, getThread, upsertThread } from "@/lib/local-threads";

export default function App() {
  const location = useLocation();
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const [activeThreadId] = useState(() => getOrCreateActiveThreadId());
  const [initialThreadMessages] = useState<ChatMessage[]>(() => {
    const existing = getThread(activeThreadId);
    return Array.isArray(existing?.messages) ? existing!.messages : [];
  });

  const isPlatformRoute = location.pathname.startsWith("/platform") ||
    location.pathname === "/knowledge-graph" ||
    location.pathname === "/whiteboard" ||
    location.pathname === "/status" ||
    location.pathname === "/sim" ||
    location.pathname === "/alphafold" ||
    location.pathname === "/audit" ||
    location.pathname === "/constitution" ||
    location.pathname === "/ingestion" ||
    location.pathname === "/api" ||
    location.pathname === "/threads";

  const thread = useLangServeAgent({
    url: getLangServeUrl(),
    threadId: activeThreadId,
    initialMessages: initialThreadMessages,
    onUpdateEvent: (event: any) => {
      let processedEvent: ProcessedEvent | null = null;
      if (event.generate_query) {
        processedEvent = {
          title: "Generating Search Queries",
          data: event.generate_query?.search_query?.join(", ") || "",
        };
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
        };
      } else if (event.reflection) {
        processedEvent = {
          title: "Reflection",
          data: "Analysing Web Research Results",
        };
      } else if (event.finalize_answer) {
        processedEvent = {
          title: "Finalizing Answer",
          data: "Composing and presenting the final answer.",
        };
        hasFinalizeEventOccurredRef.current = true;
      }
      if (processedEvent) {
        setProcessedEventsTimeline((prevEvents) => [
          ...prevEvents,
          processedEvent!,
        ]);
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
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [thread.messages]);

  useEffect(() => {
    if (
      hasFinalizeEventOccurredRef.current &&
      !thread.isLoading &&
      thread.messages.length > 0
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
      thread.submit({
        messages: newMessages,
        initial_search_query_count: initial_search_query_count,
        max_research_loops: max_research_loops,
        reasoning_model: models.answerModel,
        reflection_model: models.queryModel,
      });
    },
    [thread, processedEventsTimeline]
  );

  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  if (!isPlatformRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/programs/:id" element={<ProgramDetail />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Navigate to={`/docs/${docsConfig[0].slug}`} replace />} />
          <Route path=":slug" element={<DocPage />} />
        </Route>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground font-sans antialiased w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background/50 px-6 backdrop-blur-xl sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <span className="text-muted-foreground uppercase tracking-widest">Sarkome OS</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground capitalize">
                {(() => {
                  if (location.pathname === "/platform") return "Query Builder";
                  if (location.pathname === "/") return "Sarkome Institute";

                  const lastPart = location.pathname.split("/").pop() || "";
                  const routeMap: Record<string, string> = {
                    'knowledge-graph': 'Knowledge Substrate',
                    'whiteboard': 'Whiteboard',
                    'status': 'Agent Performance',
                    'sim': 'Simulation Lab',
                    'alphafold': 'AlphaFold 3',
                    'audit': 'Investigation Audit',
                    'constitution': 'System Constitution',
                    'ingestion': 'Data Refinery',
                    'api': 'Developer Hub',
                    'threads': 'Threads'
                  };

                  return routeMap[lastPart] || lastPart.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                })()}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
            </div>
          </header>
          <main className="h-full w-full mx-auto overflow-y-auto no-scrollbar">
            <Routes>
              <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="/whiteboard" element={<WhiteboardView />} />
              <Route path="/status" element={<AgentPerformanceView />} />
              <Route path="/sim" element={<SimulationView />} />
              <Route path="/alphafold" element={<AlphaFoldView />} />
              <Route path="/audit" element={<ReportView />} />
              <Route path="/constitution" element={<ConstitutionEditor />} />
              <Route path="/ingestion" element={<DataIngestionView />} />
              <Route path="/api" element={<KnowledgeExportView />} />
              <Route path="/threads" element={<ThreadsView />} />
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
                    />
                  )}
                </div>
              } />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
