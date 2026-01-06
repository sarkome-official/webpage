import * as React from "react";
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { useAgent as useAgentHook } from "@/hooks/useAgent";
import { getAgentUrl } from "@/lib/langgraph-api";
import {
    deriveThreadTitle,
    getOrCreateActiveThreadId,
    getThread,
    upsertThread,
    setActiveThreadId as persistActiveThreadId
} from "@/lib/local-threads";
import type { ChatMessage } from "@/lib/chat-types";
import type { ProcessedEvent } from "@/components/ActivityTimeline";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AgentContextValue {
    // Thread management
    activeThreadId: string;
    setActiveThreadId: (id: string) => void;

    // Agent state (from useAgent hook)
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;

    // Agent actions
    submit: (
        input: string,
        effort: string,
        models: { queryModel: string; answerModel: string },
        activeAgents: string[],
        patientContext?: string
    ) => void;
    stop: () => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;

    // Events and sources (for activity timeline)
    processedEventsTimeline: ProcessedEvent[];
    liveSourcesByLabel: Record<string, string>;
    liveSourcesList: Array<{ label?: string; url: string; id?: string }>;
    sourcesByMessageId: Record<string, Record<string, string>>;
    sourcesListByMessageId: Record<string, Array<{ label?: string; url: string; id?: string }>>;
    historicalActivities: Record<string, ProcessedEvent[]>;
    rawEvents: any[];

    // Utility
    resetForNewChat: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

interface AgentProviderProps {
    children: React.ReactNode;
    patientId?: string;
    patientContext?: string;
}

export function AgentProvider({ children, patientId, patientContext }: AgentProviderProps) {
    // -------------------------------------------------------------------------
    // State: Thread & Events
    // -------------------------------------------------------------------------
    const [activeThreadId, setInternalActiveThreadId] = useState(() => getOrCreateActiveThreadId());
    const [processedEventsTimeline, setProcessedEventsTimeline] = useState<ProcessedEvent[]>([]);
    const [liveSourcesByLabel, setLiveSourcesByLabel] = useState<Record<string, string>>({});
    const [liveSourcesList, setLiveSourcesList] = useState<Array<{ label?: string; url: string; id?: string }>>([]);
    const [sourcesByMessageId, setSourcesByMessageId] = useState<Record<string, Record<string, string>>>({});
    const [sourcesListByMessageId, setSourcesListByMessageId] = useState<Record<string, Array<{ label?: string; url: string; id?: string }>>>({});
    const [historicalActivities, setHistoricalActivities] = useState<Record<string, ProcessedEvent[]>>({});
    const [rawEvents, setRawEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const hasFinalizeEventOccurredRef = useRef(false);
    const wasLoadingRef = useRef(false);

    // -------------------------------------------------------------------------
    // Initial messages from localStorage
    // -------------------------------------------------------------------------
    const initialThreadMessages = React.useMemo<ChatMessage[]>(() => {
        const existing = getThread(activeThreadId);
        return Array.isArray(existing?.messages) ? existing!.messages : [];
    }, [activeThreadId]);

    // -------------------------------------------------------------------------
    // Agent Hook (the core connection to backend)
    // -------------------------------------------------------------------------
    const thread = useAgentHook({
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
                const sources = Array.isArray(rawSources) ? rawSources : Object.values(rawSources);

                processedEvent = {
                    title: "Web Research",
                    data: `Gathered ${sources.length} sources`,
                    raw: event,
                    ts: new Date().toISOString(),
                    type: "web_research",
                } as any;

                // Update live sources
                setLiveSourcesByLabel((prev) => {
                    const next = { ...prev };
                    for (const s of sources) {
                        if (!s || typeof s !== "object") continue;
                        const label = s.label || s.title;
                        const url = s.url || s.link || s.href || s.source;
                        if (label && url) {
                            next[label] = url;
                            next[label.toLowerCase()] = url;
                        }
                        if (s.id && url) next[s.id] = url;
                    }
                    return next;
                });

                setLiveSourcesList((prev) => {
                    const next = [...prev];
                    const existingUrls = new Set(prev.map((p) => p.url));
                    for (const s of sources) {
                        if (!s || typeof s !== "object") continue;
                        const label = s.label || s.title;
                        const url = s.url || s.link || s.href || s.source;
                        if (!url || existingUrls.has(url)) continue;
                        existingUrls.add(url);
                        next.push({ label, url, id: s.id });
                    }
                    return next;
                });
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
                setProcessedEventsTimeline((prev) => [...prev, processedEvent!]);
            }

            // AlphaFold logs
            if (event?.query_alphafold?.alphafold_logs?.length > 0) {
                const afEvent = {
                    title: "AlphaFold Logs",
                    data: event.query_alphafold.alphafold_logs.join("\n"),
                    raw: event,
                    ts: new Date().toISOString(),
                    type: "alphafold_logs",
                } as ProcessedEvent;
                setProcessedEventsTimeline((prev) => [...prev, afEvent]);
            }
        },
        onError: (err) => {
            setError(String(err));
        },
    });

    // -------------------------------------------------------------------------
    // Persist messages to localStorage
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (thread.messages.length > 0) {
            const title = deriveThreadTitle(thread.messages);
            upsertThread({
                id: activeThreadId,
                messages: thread.messages,
                title,
                updatedAt: Date.now(),
                createdAt: getThread(activeThreadId)?.createdAt || Date.now(),
                patientId,
            });
        }
    }, [thread.messages, activeThreadId, patientId]);

    // -------------------------------------------------------------------------
    // Archive activities when loading finishes
    // -------------------------------------------------------------------------
    useEffect(() => {
        const justFinishedLoading = wasLoadingRef.current && !thread.isLoading;
        wasLoadingRef.current = thread.isLoading;

        if (justFinishedLoading && thread.messages.length > 0 && processedEventsTimeline.length > 0) {
            const lastMessage = thread.messages[thread.messages.length - 1];
            if (lastMessage?.type === "ai" && lastMessage.id) {
                setHistoricalActivities((prev) => ({
                    ...prev,
                    [lastMessage.id!]: [...processedEventsTimeline],
                }));
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

    // -------------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------------
    const setActiveThreadId = useCallback((id: string) => {
        setInternalActiveThreadId(id);
        persistActiveThreadId(id);
        // Reset events for new thread
        setProcessedEventsTimeline([]);
        setRawEvents([]);
        setLiveSourcesByLabel({});
        setLiveSourcesList([]);
        setError(null);
    }, []);

    const submit = useCallback(
        (
            submittedInputValue: string,
            effort: string,
            models: { queryModel: string; answerModel: string },
            activeAgents: string[],
            inputPatientContext?: string
        ) => {
            if (!submittedInputValue.trim()) return;

            // Reset events for new submission
            setProcessedEventsTimeline([]);
            setRawEvents([]);
            setLiveSourcesByLabel({});
            setLiveSourcesList([]);
            setError(null);
            hasFinalizeEventOccurredRef.current = false;

            // Calculate effort parameters
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

            const newMessages: ChatMessage[] = [...(thread.messages || [])];

            // Add patient context if this is the first message
            const contextToUse = inputPatientContext || patientContext;
            if (contextToUse && newMessages.length === 0) {
                newMessages.push({
                    type: "system",
                    content: contextToUse,
                    id: "system_context",
                });
            }

            newMessages.push({
                type: "human",
                content: submittedInputValue,
                id: Date.now().toString(),
            });

            thread.submit({
                messages: newMessages,
                initial_search_query_count,
                max_research_loops,
                reasoning_model: models.answerModel,
                reflection_model: models.queryModel,
                enable_web_search: activeAgents.includes("web_search"),
                enable_kg: activeAgents.includes("primekg"),
                enable_alphafold: activeAgents.includes("alphafold_rag"),
                tools: activeAgents,
            });
        },
        [thread, patientContext]
    );

    const stop = useCallback(() => {
        thread.stop();
    }, [thread]);

    const resetForNewChat = useCallback(() => {
        // Create a new thread
        const newId = `thread_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        setActiveThreadId(newId);
        thread.setMessages([]);
    }, [thread, setActiveThreadId]);

    // -------------------------------------------------------------------------
    // Context Value
    // -------------------------------------------------------------------------
    const value: AgentContextValue = {
        activeThreadId,
        setActiveThreadId,
        messages: thread.messages,
        isLoading: thread.isLoading,
        error,
        submit,
        stop,
        setMessages: thread.setMessages,
        processedEventsTimeline,
        liveSourcesByLabel,
        liveSourcesList,
        sourcesByMessageId,
        sourcesListByMessageId,
        historicalActivities,
        rawEvents,
        resetForNewChat,
    };

    return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAgentContext() {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error("useAgentContext must be used within an AgentProvider");
    }
    return context;
}
