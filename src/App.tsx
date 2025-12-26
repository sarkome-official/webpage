import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
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
import { SarkomeLogsView } from "@/pages/platform/SarkomeLogsView";
import { AgentPerformanceView } from "@/pages/platform/AgentPerformanceView";
import { SimulationView } from "@/pages/platform/SimulationView";
import { AlphaFoldView } from "@/pages/platform/AlphaFoldView";
import { ReportView } from "@/pages/platform/ReportView";
import { ConstitutionEditor } from "@/pages/platform/ConstitutionEditor";
import { DataIngestionView } from "@/pages/platform/DataIngestionView";
import { KnowledgeExportView } from "@/pages/platform/KnowledgeExportView";
import ProgramDetail from "@/pages/programs/ProgramDetail";
import { DocsLayout } from "@/pages/docs/DocsLayout";
import DocPage from "@/pages/docs/DocPage";
import { docsConfig } from "@/lib/docs-config";
import { Navigate } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const isPlatformRoute = location.pathname.startsWith("/platform") ||
    location.pathname === "/knowledge-graph" ||
    location.pathname === "/logs" ||
    location.pathname === "/status" ||
    location.pathname === "/sim" ||
    location.pathname === "/alphafold" ||
    location.pathname === "/audit" ||
    location.pathname === "/constitution" ||
    location.pathname === "/ingestion" ||
    location.pathname === "/api";

  const thread = useStream<{
    messages: Message[];
    initial_search_query_count: number;
    max_research_loops: number;
    reasoning_model: string;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",
    onUpdateEvent: (event: any) => {
      let processedEvent: ProcessedEvent | null = null;
      if (event.generate_query) {
        processedEvent = {
          title: "Generating Search Queries",
          data: event.generate_query?.search_query?.join(", ") || "",
        };
      } else if (event.web_research) {
        const sources = event.web_research.sources_gathered || [];
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
      setError(error.message);
    },
  });

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
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline]);

  const handleSubmit = useCallback(
    (submittedInputValue: string, effort: string, model: string, activeAgents: string[]) => {
      if (!submittedInputValue.trim()) return;
      setProcessedEventsTimeline([]);
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

      const newMessages: Message[] = [
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
        reasoning_model: model,
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
                    'logs': 'Sarkome Logs',
                    'status': 'Agent Performance',
                    'sim': 'Simulation Lab',
                    'alphafold': 'AlphaFold 3',
                    'audit': 'Investigation Audit',
                    'constitution': 'System Constitution',
                    'ingestion': 'Data Refinery',
                    'api': 'Developer Hub'
                  };

                  return routeMap[lastPart] || lastPart.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                })()}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
            </div>
          </header>
          <main className="h-full w-full mx-auto overflow-y-auto">
            <Routes>
              <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="/logs" element={<SarkomeLogsView />} />
              <Route path="/status" element={<AgentPerformanceView />} />
              <Route path="/sim" element={<SimulationView />} />
              <Route path="/alphafold" element={<AlphaFoldView />} />
              <Route path="/audit" element={<ReportView />} />
              <Route path="/constitution" element={<ConstitutionEditor />} />
              <Route path="/ingestion" element={<DataIngestionView />} />
              <Route path="/api" element={<KnowledgeExportView />} />
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
