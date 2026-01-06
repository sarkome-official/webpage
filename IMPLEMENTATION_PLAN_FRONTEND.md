# Sarkome Frontend - Persistent Runs Implementation Plan

**Objetivo:** Actualizar el frontend para soportar runs persistentes, permitiendo que el usuario navegue libremente sin perder el progreso de una consulta activa.

**Dependencia:** Requiere que el backend implemente los endpoints descritos en `IMPLEMENTATION_PLAN_BACKEND.md`.

---

## Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              RUN CONTEXT (Global State)                     │ │
│  │  - activeRunId: string | null                               │ │
│  │  - runStatus: "pending" | "running" | "completed" | ...    │ │
│  │  - events: array                                            │ │
│  │  - reconnectToRun(): Promise<void>                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              COMPONENTS                                     │ │
│  │  - ChatInterface: Usa RunContext                           │ │
│  │  - RunStatusBanner: Muestra run activo en cualquier pagina │ │
│  │  - HistoryView: Lista runs pasados                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Run Service (API Client)

### 1.1 Crear Run Service

Crear archivo: `src/lib/run-service.ts`

```typescript
/**
 * Run Service - API client for persistent runs.
 */

import { getAgentUrl } from "./langgraph-api";

export interface RunStatus {
  run_id: string;
  thread_id: string;
  user_id?: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  completed_at?: string;
  input_messages: Array<{ role: string; content: string }>;
  config: Record<string, unknown>;
  current_node?: string;
  events: Array<{ timestamp: string; data: unknown }>;
  output_messages: Array<{ role: string; content: string }>;
  final_state?: Record<string, unknown>;
  error?: string;
  usage_metadata: Record<string, unknown>;
  sources_gathered: Record<string, unknown>;
}

export interface CreateRunInput {
  messages: Array<{ role: string; content: string }>;
  config: {
    effort_level?: string;
    reasoning_model?: string;
    reflection_model?: string;
    web_search?: boolean;
    prime_kg?: boolean;
    enable_alphafold?: boolean;
    thread_id?: string;
  };
}

const API_BASE = getAgentUrl();

/**
 * Create a new run. Returns immediately with run_id.
 * The run executes in the background on the server.
 */
export async function createRun(input: CreateRunInput): Promise<{ run_id: string; thread_id: string }> {
  const response = await fetch(`${API_BASE}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { messages: input.messages },
      config: { configurable: input.config },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create run: ${response.status} ${error}`);
  }

  return response.json();
}

/**
 * Get the current status of a run.
 */
export async function getRunStatus(runId: string): Promise<RunStatus> {
  const response = await fetch(`${API_BASE}/runs/${runId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Run not found");
    }
    throw new Error(`Failed to get run status: ${response.status}`);
  }

  return response.json();
}

/**
 * Cancel an active run.
 */
export async function cancelRun(runId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/runs/${runId}/cancel`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel run: ${response.status}`);
  }
}

/**
 * Stream events from a run (SSE).
 * Works for both active and completed runs.
 */
export async function* streamRunEvents(runId: string): AsyncGenerator<unknown> {
  const response = await fetch(`${API_BASE}/runs/${runId}/stream`);

  if (!response.ok) {
    throw new Error(`Failed to stream run: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          return;
        }
        try {
          yield JSON.parse(data);
        } catch {
          // Ignore malformed JSON
        }
      }
    }
  }
}

/**
 * List recent runs.
 */
export async function listRuns(limit = 50): Promise<{ runs: RunStatus[] }> {
  const response = await fetch(`${API_BASE}/runs?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to list runs: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Local Storage Helpers
// ============================================================================

const ACTIVE_RUN_KEY = "sarkome_active_run";

export function getStoredActiveRun(): { run_id: string; thread_id: string } | null {
  try {
    const stored = localStorage.getItem(ACTIVE_RUN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setStoredActiveRun(run: { run_id: string; thread_id: string } | null): void {
  if (run) {
    localStorage.setItem(ACTIVE_RUN_KEY, JSON.stringify(run));
  } else {
    localStorage.removeItem(ACTIVE_RUN_KEY);
  }
}
```

---

## Fase 2: Run Context (Global State)

### 2.1 Crear Run Context

Crear archivo: `src/contexts/RunContext.tsx`

```tsx
/**
 * RunContext - Global state for managing persistent runs.
 * Allows the user to navigate away and return to an active run.
 */
import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  createRun,
  getRunStatus,
  cancelRun as apiCancelRun,
  streamRunEvents,
  getStoredActiveRun,
  setStoredActiveRun,
  type RunStatus,
  type CreateRunInput,
} from "@/lib/run-service";
import type { ChatMessage } from "@/lib/chat-types";
import type { ProcessedEvent } from "@/components/ActivityTimeline";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface RunContextValue {
  // Current run state
  activeRunId: string | null;
  runStatus: RunStatus | null;
  isLoading: boolean;
  error: string | null;

  // Messages derived from run
  messages: ChatMessage[];
  
  // Events for activity timeline
  events: ProcessedEvent[];
  currentNode: string | null;

  // Actions
  startRun: (input: CreateRunInput) => Promise<string>;
  cancelRun: () => Promise<void>;
  reconnectToRun: () => Promise<void>;
  clearRun: () => void;
}

const RunContext = createContext<RunContextValue | null>(null);

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

interface RunProviderProps {
  children: React.ReactNode;
}

export function RunProvider({ children }: RunProviderProps) {
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<RunStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);

  const streamAbortRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  // -------------------------------------------------------------------------
  // On mount: Check for stored active run
  // -------------------------------------------------------------------------
  useEffect(() => {
    const stored = getStoredActiveRun();
    if (stored) {
      // Attempt to reconnect
      checkAndReconnect(stored.run_id);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Check run status and reconnect if still active
  // -------------------------------------------------------------------------
  const checkAndReconnect = useCallback(async (runId: string) => {
    try {
      const status = await getRunStatus(runId);
      setRunStatus(status);
      setActiveRunId(runId);

      // Load messages from completed run
      if (status.status === "completed") {
        const chatMessages: ChatMessage[] = [
          ...status.input_messages.map((m, i) => ({
            id: `input_${i}`,
            type: m.role === "user" ? "human" as const : "ai" as const,
            content: m.content,
          })),
          ...status.output_messages.map((m, i) => ({
            id: `output_${i}`,
            type: "ai" as const,
            content: m.content,
            usage: status.usage_metadata,
          })),
        ];
        setMessages(chatMessages);
        setIsLoading(false);
        // Clear stored run since it's completed
        setStoredActiveRun(null);
      } else if (status.status === "running" || status.status === "pending") {
        // Reconnect to stream
        setIsLoading(true);
        await streamEvents(runId);
      } else if (status.status === "failed") {
        setError(status.error || "Run failed");
        setStoredActiveRun(null);
      } else if (status.status === "cancelled") {
        setStoredActiveRun(null);
      }
    } catch (err) {
      console.error("Failed to reconnect to run:", err);
      setStoredActiveRun(null);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Stream events from run
  // -------------------------------------------------------------------------
  const streamEvents = useCallback(async (runId: string) => {
    try {
      for await (const event of streamRunEvents(runId)) {
        if ((event as any).keepalive) continue;

        // Process event into ProcessedEvent
        const processedEvent = processEvent(event);
        if (processedEvent) {
          setEvents((prev) => [...prev, processedEvent]);
        }

        // Update current node
        if (event && typeof event === "object") {
          const nodeNames = Object.keys(event as object).filter(
            (k) => !k.startsWith("__")
          );
          if (nodeNames.length > 0) {
            setCurrentNode(nodeNames[0]);
          }

          // Check for finalize_answer
          const nodeData = (event as any)[nodeNames[0]];
          if (nodeNames[0] === "finalize_answer" && nodeData?.messages) {
            const finalMessages = nodeData.messages.map((m: any, i: number) => ({
              id: `final_${i}`,
              type: "ai" as const,
              content: typeof m.content === "string" ? m.content : String(m),
              usage: nodeData.usage_metadata,
            }));
            setMessages((prev) => [...prev.filter((m) => m.type === "human"), ...finalMessages]);
          }
        }
      }

      // Stream ended - fetch final status
      const finalStatus = await getRunStatus(runId);
      setRunStatus(finalStatus);
      setIsLoading(false);
      setStoredActiveRun(null);
    } catch (err) {
      console.error("Stream error:", err);
      setError(String(err));
      setIsLoading(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Process raw event into ProcessedEvent
  // -------------------------------------------------------------------------
  const processEvent = (event: unknown): ProcessedEvent | null => {
    if (!event || typeof event !== "object") return null;

    const e = event as Record<string, unknown>;

    if (e.generate_query) {
      return {
        title: "Generating Search Queries",
        data: ((e.generate_query as any)?.search_query || []).join(", "),
        raw: event,
        ts: new Date().toISOString(),
        type: "generate_query",
      };
    }

    if (e.web_research) {
      const sources = (e.web_research as any)?.sources_gathered || {};
      const count = Array.isArray(sources) ? sources.length : Object.keys(sources).length;
      return {
        title: "Web Research",
        data: `Gathered ${count} sources`,
        raw: event,
        ts: new Date().toISOString(),
        type: "web_research",
      };
    }

    if (e.reflection) {
      return {
        title: "Reflection",
        data: "Analyzing research results",
        raw: event,
        ts: new Date().toISOString(),
        type: "reflection",
      };
    }

    if (e.finalize_answer) {
      return {
        title: "Finalizing Answer",
        data: "Composing final response",
        raw: event,
        ts: new Date().toISOString(),
        type: "finalize_answer",
      };
    }

    if (e.query_knowledge_graph) {
      return {
        title: "Knowledge Graph",
        data: "Querying PrimeKG",
        raw: event,
        ts: new Date().toISOString(),
        type: "knowledge_graph",
      };
    }

    if (e.query_alphafold) {
      return {
        title: "AlphaFold",
        data: "Analyzing protein structures",
        raw: event,
        ts: new Date().toISOString(),
        type: "alphafold",
      };
    }

    return null;
  };

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const startRun = useCallback(async (input: CreateRunInput): Promise<string> => {
    setError(null);
    setEvents([]);
    setMessages([]);
    setIsLoading(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `human_${Date.now()}`,
      type: "human",
      content: input.messages[input.messages.length - 1]?.content || "",
    };
    setMessages([userMessage]);

    try {
      const { run_id, thread_id } = await createRun(input);
      setActiveRunId(run_id);
      setStoredActiveRun({ run_id, thread_id });

      // Start streaming
      streamEvents(run_id);

      return run_id;
    } catch (err) {
      setError(String(err));
      setIsLoading(false);
      throw err;
    }
  }, [streamEvents]);

  const cancelActiveRun = useCallback(async () => {
    if (!activeRunId) return;

    try {
      await apiCancelRun(activeRunId);
      setIsLoading(false);
      setStoredActiveRun(null);
      
      // Add cancellation message
      setMessages((prev) => [
        ...prev,
        {
          id: `cancel_${Date.now()}`,
          type: "ai",
          content: "Run cancelled by user.",
        },
      ]);
    } catch (err) {
      console.error("Failed to cancel run:", err);
    }
  }, [activeRunId]);

  const reconnectToRun = useCallback(async () => {
    const stored = getStoredActiveRun();
    if (stored) {
      await checkAndReconnect(stored.run_id);
    }
  }, [checkAndReconnect]);

  const clearRun = useCallback(() => {
    setActiveRunId(null);
    setRunStatus(null);
    setMessages([]);
    setEvents([]);
    setError(null);
    setIsLoading(false);
    setCurrentNode(null);
    setStoredActiveRun(null);
  }, []);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------
  const value: RunContextValue = {
    activeRunId,
    runStatus,
    isLoading,
    error,
    messages,
    events,
    currentNode,
    startRun,
    cancelRun: cancelActiveRun,
    reconnectToRun,
    clearRun,
  };

  return <RunContext.Provider value={value}>{children}</RunContext.Provider>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useRunContext() {
  const context = useContext(RunContext);
  if (!context) {
    throw new Error("useRunContext must be used within a RunProvider");
  }
  return context;
}
```

---

## Fase 3: Run Status Banner

### 3.1 Crear Banner Componente

Este banner aparece en todas las paginas platform cuando hay un run activo:

Crear archivo: `src/components/RunStatusBanner.tsx`

```tsx
/**
 * RunStatusBanner - Shows active run status across all platform pages.
 * Allows user to navigate back to chat or cancel the run.
 */
import { useRunContext } from "@/contexts/RunContext";
import { Button } from "@/components/ui/button";
import { Loader2, X, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function RunStatusBanner() {
  const { activeRunId, isLoading, currentNode, cancelRun } = useRunContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on /platform (chat page)
  if (location.pathname === "/platform") return null;

  // Don't show if no active run
  if (!activeRunId || !isLoading) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">
          {currentNode ? `Processing: ${currentNode}` : "Agent running..."}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 hover:bg-white/20"
          onClick={() => navigate("/platform")}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-white/20"
          onClick={cancelRun}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
```

---

## Fase 4: Actualizar App.tsx

### 4.1 Integrar Providers y Banner

Actualizar `src/App.tsx`:

```tsx
import { RunProvider } from "@/contexts/RunContext";
import { RunStatusBanner } from "@/components/RunStatusBanner";

// ... existing imports ...

export default function App() {
  // ... existing code ...

  // Protected platform routes
  return (
    <ProtectedRoute>
      <RunProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex h-screen bg-background text-foreground font-sans antialiased w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
              {/* ... header ... */}
              <main className="h-full w-full mx-auto overflow-y-auto no-scrollbar">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* ... routes ... */}
                  </Routes>
                </Suspense>
              </main>
            </SidebarInset>
          </div>
          
          {/* Global run status banner */}
          <RunStatusBanner />
        </SidebarProvider>
      </RunProvider>
    </ProtectedRoute>
  );
}
```

---

## Fase 5: Actualizar ChatInterface

### 5.1 Usar RunContext

Actualizar `src/components/ChatInterface.tsx`:

```tsx
import { useRunContext } from "@/contexts/RunContext";

export function ChatInterface({ patientId }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    events,
    startRun,
    cancelRun,
    activeRunId,
  } = useRunContext();

  const handleSubmit = useCallback(
    async (
      submittedInputValue: string,
      effort: string,
      models: { queryModel: string; answerModel: string },
      activeAgents: string[],
      inputPatientContext?: string
    ) => {
      if (!submittedInputValue.trim()) return;

      const runMessages = [
        ...(inputPatientContext ? [{ role: "system", content: inputPatientContext }] : []),
        { role: "user", content: submittedInputValue },
      ];

      await startRun({
        messages: runMessages,
        config: {
          effort_level: effort,
          reasoning_model: models.answerModel,
          reflection_model: models.queryModel,
          web_search: activeAgents.includes("web_search"),
          prime_kg: activeAgents.includes("primekg"),
          enable_alphafold: activeAgents.includes("alphafold_rag"),
        },
      });
    },
    [startRun]
  );

  const handleCancel = useCallback(() => {
    cancelRun();
  }, [cancelRun]);

  // ... rest of component
}
```

---

## Fase 6: History View con Runs

### 6.1 Actualizar HistoryView

El componente de historial ahora muestra runs del servidor:

```tsx
import { listRuns, type RunStatus } from "@/lib/run-service";

export function HistoryView() {
  const [runs, setRuns] = useState<RunStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      const { runs } = await listRuns(50);
      setRuns(runs);
    } catch (err) {
      console.error("Failed to load runs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Run History</h1>
      
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <RunCard key={run.run_id} run={run} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Resumen de Cambios

| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `src/lib/run-service.ts` | **Crear** | Cliente API para runs |
| `src/contexts/RunContext.tsx` | **Crear** | Estado global de runs |
| `src/components/RunStatusBanner.tsx` | **Crear** | Banner de run activo |
| `src/components/ChatInterface.tsx` | **Modificar** | Usar RunContext |
| `src/App.tsx` | **Modificar** | Agregar RunProvider |
| `src/pages/platform/HistoryView.tsx` | **Modificar** | Mostrar runs del servidor |
| `src/contexts/AgentContext.tsx` | **Eliminar** | Reemplazado por RunContext |

---

## Flujo de Usuario Final

1. **Usuario hace pregunta en /platform**
   - Frontend llama `POST /runs` → recibe `run_id`
   - Guarda `run_id` en localStorage
   - Inicia streaming de eventos

2. **Usuario navega a /alphafold**
   - El run sigue ejecutandose en el backend
   - Banner muestra "Agent running..."
   - Usuario puede hacer clic en "View" para volver

3. **Usuario vuelve a /platform**
   - Frontend detecta `run_id` en localStorage
   - Llama `GET /runs/{run_id}` para verificar estado
   - Si "running": reconecta al stream
   - Si "completed": muestra resultado final

4. **Usuario cierra el browser y vuelve**
   - Frontend detecta `run_id` en localStorage
   - Recupera resultado del servidor

---

## Timeline de Implementacion

| Fase | Tiempo Estimado | Dependencia |
|------|-----------------|-------------|
| **Backend Fase 1** (Run Store) | 2-3 horas | - |
| **Backend Fase 2** (Endpoints) | 1-2 horas | Fase 1 |
| **Frontend Fase 1** (Run Service) | 1 hora | Backend |
| **Frontend Fase 2** (RunContext) | 2 horas | Fase 1 |
| **Frontend Fase 3-6** (Components) | 2-3 horas | Fase 2 |

**Total estimado:** 8-11 horas de desarrollo

---

**Nota:** Este plan asume que el backend de LangGraph ya soporta ejecucion asincrona. Si no, se requiere la implementacion completa del `run_manager.py` descrito en `IMPLEMENTATION_PLAN_BACKEND.md`.
