import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChatMessagesView } from "@/components/ChatMessagesView"
import { WelcomeScreen } from "@/components/WelcomeScreen"
import { Button } from "@/components/ui/button"
import { useAgent } from "@/hooks/useAgent"
import { getAgentUrl } from "@/lib/langgraph-api"
import { 
    deriveThreadTitle, 
    getOrCreateActiveThreadId, 
    getThread, 
    upsertThread,
    setActiveThreadId
} from "@/lib/local-threads"
import { getPatient, upsertPatient, type Hypothesis } from "@/lib/patient-record"
import type { ChatMessage } from "@/lib/chat-types"
import type { ProcessedEvent } from "@/components/ActivityTimeline"

interface ChatInterfaceProps {
    patientContext?: string;
    patientId?: string;
    initialThreadId?: string;
}

export function ChatInterface({ patientContext, patientId, initialThreadId }: ChatInterfaceProps) {
    const [processedEventsTimeline, setProcessedEventsTimeline] = useState<ProcessedEvent[]>([]);
    const [liveSourcesByLabel, setLiveSourcesByLabel] = useState<Record<string, string>>({});
    const [liveSourcesList, setLiveSourcesList] = useState<Array<{ label?: string; url: string; id?: string }>>([]);
    const [sourcesByMessageId, setSourcesByMessageId] = useState<Record<string, Record<string, string>>>({});
    const [sourcesListByMessageId, setSourcesListByMessageId] = useState<Record<string, Array<{ label?: string; url: string; id?: string }>>>({});
    const [historicalActivities, setHistoricalActivities] = useState<Record<string, ProcessedEvent[]>>({});
    const [rawEvents, setRawEvents] = useState<any[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const hasFinalizeEventOccurredRef = useRef(false);
    const [error, setError] = useState<string | null>(null);

    const [activeThreadId, setInternalActiveThreadId] = useState(() => {
        if (initialThreadId) return initialThreadId;
        return getOrCreateActiveThreadId();
    });

    const [initialThreadMessages] = useState<ChatMessage[]>(() => {
        const existing = getThread(activeThreadId);
        return Array.isArray(existing?.messages) ? existing!.messages : [];
    });

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
                const sources = Array.isArray(rawSources) ? rawSources : Object.values(rawSources);
                processedEvent = {
                    title: "Web Research",
                    data: `Gathered ${sources.length} sources`,
                    raw: event,
                    ts: new Date().toISOString(),
                    type: "web_research",
                } as any;
                
                const newSources: Record<string, string> = {};
                const newList: any[] = [];
                sources.forEach((s: any) => {
                    if (s.title && s.url) {
                        newSources[s.title] = s.url;
                        newList.push({ label: s.title, url: s.url, id: s.id });
                    }
                });
                setLiveSourcesByLabel(prev => ({ ...prev, ...newSources }));
                setLiveSourcesList(prev => [...prev, ...newList]);
            } else if (event.finalize) {
                hasFinalizeEventOccurredRef.current = true;
            }
            
            if (processedEvent) {
                setProcessedEventsTimeline((prev) => [...prev, processedEvent!]);
            }
        },
        onError: (err) => {
            setError(String(err));
        }
    });

    // Persist messages to localStorage
    useEffect(() => {
        if (thread.messages.length > 0) {
            const title = deriveThreadTitle(thread.messages);
            upsertThread({
                id: activeThreadId,
                messages: thread.messages,
                title,
                updatedAt: Date.now(),
                createdAt: getThread(activeThreadId)?.createdAt || Date.now(),
                patientId: patientId // Vincular al paciente si existe
            });
        }
    }, [thread.messages, activeThreadId, patientId]);

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

            const newMessages: ChatMessage[] = [...(thread.messages || [])];
            
            // Si hay contexto de paciente y es el primer mensaje, inyectar system prompt
            if (patientContext && newMessages.length === 0) {
                newMessages.push({
                    type: "system",
                    content: patientContext,
                    id: "system_context"
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
                enable_web_search: activeAgents.includes('web_search'),
                enable_kg: activeAgents.includes('primekg'),
                enable_alphafold: activeAgents.includes('alphafold_rag'),
                tools: activeAgents,
            });
        },
        [thread, patientContext]
    );

    const handleCancel = useCallback(() => {
        thread.stop();
    }, [thread]);

    const handleSaveHypothesis = useCallback((message: ChatMessage) => {
        if (!patientId) return;
        
        const patient = getPatient(patientId);
        if (!patient) return;

        // Crear una hipótesis básica a partir del mensaje
        const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
        const newHypothesis: Hypothesis = {
            id: Math.random().toString(36).substring(2, 15),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            claim: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
            mechanism: content, // Usar el contenido completo como mecanismo/explicación
            type: 'drug_repurposing', // Default
            confidence: 'medium',
            status: 'generated',
            sourceThreadId: activeThreadId,
            physicianNotes: `Generado desde chat el ${new Date().toLocaleDateString()}`
        };

        const updatedPatient = {
            ...patient,
            hypotheses: [...(patient.hypotheses || []), newHypothesis],
            updatedAt: Date.now()
        };

        upsertPatient(updatedPatient);
        alert("Hipótesis guardada en el expediente del paciente.");
    }, [patientId, activeThreadId]);

    return (
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
                        <p className="text-red-400">{error}</p>
                        <Button variant="destructive" onClick={() => window.location.reload()}>
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
                    onSaveHypothesis={patientId ? handleSaveHypothesis : undefined}
                />
            )}
        </div>
    );
}
