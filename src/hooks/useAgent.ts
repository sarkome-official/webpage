import { useCallback, useRef, useState } from "react";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ChatMessage } from "@/lib/chat-types";
import { getAuthToken } from "@/lib/auth-token";

type UseAgentOptions = {
  url: string;
  threadId?: string;
  assistantId?: string;
  initialMessages?: ChatMessage[];
  onUpdateEvent?: (event: unknown) => void;
  onError?: (error: unknown) => void;
};

type SubmitInput = Record<string, unknown> & {
  messages?: ChatMessage[];
};

function asStringContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (content == null) return "";
  if (Array.isArray(content)) {
    const pieces = content
      .map((p) => {
        if (typeof p === "string") return p;
        if (p && typeof p === "object" && typeof (p as any).text === "string") return (p as any).text;
        return "";
      })
      .filter(Boolean);
    if (pieces.length > 0) return pieces.join("\n\n");
  }
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

function toLangChainMessage(m: ChatMessage) {
  const text = asStringContent(m.content);
  if (m.type === "human") return new HumanMessage(text);
  if (m.type === "ai") return new AIMessage(text);
  if (m.type === "system") return new SystemMessage(text);
  return new HumanMessage(text);
}

function extractTextFromChunk(chunk: unknown): string {
  if (chunk == null) return "";
  if (typeof chunk === "string") return chunk;
  if (typeof chunk === "number") return String(chunk);

  if (typeof chunk === "object") {
    const obj = chunk as any;

    if (typeof obj.content === "string") return obj.content;
    if (Array.isArray(obj.content)) return asStringContent(obj.content);

    if (obj.data) {
      const data = obj.data;
      if (data && typeof data === "object") {
        if (typeof (data as any).content === "string") return (data as any).content;
        if ((data as any).chunk && typeof (data as any).chunk === "object") {
          const c = (data as any).chunk;
          if (typeof c.content === "string") return c.content;
          if (Array.isArray(c.content)) return asStringContent(c.content);
        }
      }
    }

    if (typeof obj.delta === "string") return obj.delta;
    if (typeof obj.text === "string") return obj.text;
  }

  return "";
}

function extractAlphaFoldNames(context?: string): string[] {
  if (!context) return [];
  // Strategy 1: Bold names **Name**
  const boldMatches = Array.from(context.matchAll(/\*\*([^*]+)\*\*/g), (m) => m[1].trim());
  if (boldMatches.length > 0) return Array.from(new Set(boldMatches));

  // Strategy 2: "Name (UniProt:" pattern fallback
  const fallbackMatches = Array.from(context.matchAll(/-\s*([^(]+)\s*\(UniProt:/g), (m) => m[1].trim());
  return Array.from(new Set(fallbackMatches));
}

export function useAgent(options: UseAgentOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(options.initialMessages ?? []);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const submit = useCallback(
    async (input: SubmitInput) => {
      const nextUiMessages: ChatMessage[] = Array.isArray(input.messages) ? input.messages : messages;
      const aiId = `ai_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      setMessages([...nextUiMessages, { type: "ai", content: "", id: aiId }]);
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const lcMessages = nextUiMessages.map(toLangChainMessage).map((m) => ({
          role: (m as any).type === "human" ? "user" : (m as any).type === "ai" ? "assistant" : (m as any).type ?? "user",
          content: (m as any).text ?? (m as any).content ?? String(m)
        }));

        const threadId = typeof options.threadId === "string" ? options.threadId : "default-thread";
        const endpoint = `${options.url.replace(/\/$/, "")}/runs/stream`;

        // Preserve any extra options sent via `input` (e.g. initial_search_query_count)
        const extraConfig: Record<string, unknown> = { ...(input as Record<string, unknown>) };
        delete extraConfig.messages;

        const assistantTop = typeof options.assistantId === "string" ? options.assistantId : "default";

        // Preserve any model hints present in extraConfig and duplicate them
        const reasoning = (extraConfig as any).reasoning_model ?? (extraConfig as any).reasoningModel;
        const reflection = (extraConfig as any).reflection_model ?? (extraConfig as any).reflectionModel;
        const clientRunId = `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;

        const payload: Record<string, any> = {
          assistant_id: assistantTop,
          input: {
            messages: lcMessages,
            ...(reasoning ? { reasoning_model: reasoning } : {}),
            ...(reflection ? { reflection_model: reflection } : {}),
            client_run_id: clientRunId,
          },
          config: {
            assistant_id: assistantTop,
            configurable: {
              thread_id: threadId,
              assistant_id: assistantTop,
              client_run_id: clientRunId,
            },
            ...extraConfig,
            model: {
              ...(reasoning ? { reasoning_model: reasoning } : {}),
              ...(reflection ? { reflection_model: reflection } : {}),
            },
          },
        };

        // Backwards-compat: duplicate to top-level fields some backends expect
        if (reasoning) payload.reasoning_model = reasoning;
        if (reflection) payload.reflection_model = reflection;

        const body = JSON.stringify(payload);

        // Debug: expose the outgoing run payload so developers can verify fields
        try {
          // eslint-disable-next-line no-console
          console.debug("[useAgent] Posting run to endpoint:", endpoint, "client_run_id:", clientRunId, "payload:", payload);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.debug("[useAgent] Posting run (payload stringify failed)", endpoint, body);
        }

        // Try using fetch stream directly for the agent.
        const timeoutMs = 30000; // 30 seconds timeout for initial connection
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // Get Firebase ID token for authenticated requests
        const authToken = await getAuthToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        };

        let res;
        try {
          res = await fetch(endpoint, {
            method: "POST",
            headers,
            body,
            signal: controller.signal,
          });
        } catch (err: any) {
          if (err.name === 'AbortError') {
            throw new Error(`Connection timed out after ${timeoutMs}ms`);
          }
          throw err;
        } finally {
          clearTimeout(timeoutId);
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        if (!res.body) throw new Error("No streaming body from server");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let streamBuffer = ""; // Buffer for raw stream chunks (line splitting)
        let messageContentBuffer = ""; // Buffer for accumulated message text

        // Read streamed chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          console.debug("[Stream Chunk]", chunkText); // Debug log

          streamBuffer += chunkText;
          // Split by either \r\n (Windows), \n (Unix), or just \r (Old Mac/weird streams)
          const lines = streamBuffer.split(/\r\n|\n|\r/);
          streamBuffer = lines.pop() || ""; // Keep the last partial line

          for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines/heartbeats

            let contentPiece: unknown = null;

            // Handle SSE format
            if (line.startsWith("event:")) {
              // We can handle specific events here if needed
              continue;
            } else if (line.startsWith("data:")) {
              const payload = line.slice(5).trim();
              try {
                contentPiece = JSON.parse(payload);
              } catch (e) {
                console.warn("Failed to parse SSE data JSON:", payload, e);
                contentPiece = payload;
              }
            } else {
              // Try parsing line as direct JSON (legacy/fallback)
              try {
                contentPiece = JSON.parse(line);
              } catch (e) {
                // Treat as raw string if not JSON
                contentPiece = line;
              }
            }

            if (!contentPiece) continue;

            // Notify listeners about any update (progress, node outputs, etc.)
            options.onUpdateEvent?.(contentPiece);

            // Determine node name early. Many events will be shaped like { node_name: { messages: [...] } }
            // or include metadata.node/event fields. Use them to decide whether this chunk should
            // be shown as a final assistant message or treated as intermediate reasoning.
            let nodeName = "agent";
            try {
              if (contentPiece && typeof contentPiece === "object") {
                if ((contentPiece as any).node) nodeName = (contentPiece as any).node;
                else if ((contentPiece as any).event) nodeName = (contentPiece as any).event;
                else if ((contentPiece as any).metadata && (contentPiece as any).metadata.node) nodeName = (contentPiece as any).metadata.node;
              }
            } catch (e) {
              nodeName = "agent";
            }

            // If backend sent a wrapper object like { node_name: { messages: [...] } }, dig it out
            const maybeMessages =
              contentPiece && typeof contentPiece === "object"
                ? (contentPiece as any).messages ?? (contentPiece as any).output?.messages ?? (contentPiece as any).result?.messages
                : null;

            let foundMessages = maybeMessages;
            let enrichedNodeData: any = null;
            if (!foundMessages && contentPiece && typeof contentPiece === "object") {
              for (const key in contentPiece as any) {
                const val = (contentPiece as any)[key];
                if (val && typeof val === "object" && Array.isArray(val.messages)) {
                  foundMessages = val.messages;
                  nodeName = key;
                  enrichedNodeData = val;
                  break;
                }
              }
            } else if (contentPiece && typeof contentPiece === "object") {
              enrichedNodeData = contentPiece;
            }

            // Only convert node messages into UI chat messages when they come from the
            // final node that produces the assistant's answer.
            if (Array.isArray(foundMessages) && foundMessages.length > 0) {
              // Map found messages into chat UI. For intermediate nodes (non-finalize),
              // mark them as progress messages so the UI can render them differently if desired.
              setMessages((prev) => {
                let next = [...prev];
                foundMessages.forEach((m: any) => {
                  if (m.type === "human" || m.role === "user") return;
                  const mId = m.id || `${nodeName}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                  let content = extractTextFromChunk(m);

                  // Enrichment for AlphaFold progress messages
                  if (nodeName === "query_alphafold" && enrichedNodeData?.alphafold_context) {
                    const names = extractAlphaFoldNames(enrichedNodeData.alphafold_context);
                    if (names.length > 0) {
                      const suffix = names.join(", ");
                      const trimmed = content.trim();
                      // Remove trailing period if present, then append suffix
                      if (trimmed.endsWith(".")) {
                        content = trimmed.slice(0, -1) + `: ${suffix}`;
                      } else {
                        content = `${trimmed}: ${suffix}`;
                      }
                    }
                  }

                  const existingIdx = next.findIndex((ex) => ex.id === mId);

                  const isFinal = nodeName === "finalize_answer";
                  const newMsg: ChatMessage = {
                    id: mId,
                    type: "ai",
                    content,
                    usage: m.usage_metadata || enrichedNodeData?.usage_metadata, // Capture usage from message or parent node
                    metadata: {
                      source: m.name || nodeName,
                      ts: new Date().toISOString(),
                      raw: contentPiece,
                      progress: !isFinal,
                      ...(m.metadata || {}),
                    },
                  };

                  if (existingIdx >= 0) {
                    next[existingIdx] = {
                      ...next[existingIdx],
                      ...newMsg,
                      metadata: { ...(next[existingIdx].metadata as any || {}), ...(newMsg.metadata as any || {}) }
                    };
                  } else {
                    next.push(newMsg);
                  }
                });

                // If any final content exists (from finalize_answer), remove the placeholder aiId entry
                const hasRealContent = next.some(m => m.id !== aiId && m.content);
                if (hasRealContent) {
                  next = next.filter(m => m.id !== aiId || m.content !== "");
                }
                return next;
              });

              // If this was a finalize node we've already added final messages.
              // For intermediate nodes we still continue the loop but we've appended progress messages.
              continue;
            }

            // Handle streaming deltas. Only accumulate token deltas for the final answer node.
            const delta = extractTextFromChunk(contentPiece);
            if (delta) {
              // If we cannot confidently detect the node, be conservative and only
              // append to chat when nodeName is finalize_answer.
              if (nodeName !== "finalize_answer") {
                // Treat as intermediate chunk; notify through onUpdateEvent already done.
                continue;
              }

              messageContentBuffer += delta;
              setMessages((prev) => {
                const next = [...prev];
                const idx = next.findIndex((m) => m.id === aiId);
                if (idx >= 0) {
                  next[idx] = {
                    ...next[idx],
                    content: messageContentBuffer,
                    metadata: {
                      ...(next[idx].metadata as any || {}),
                      ts: new Date().toISOString(),
                      raw: contentPiece,
                      source: nodeName
                    }
                  };
                } else {
                  next.push({
                    id: aiId,
                    type: "ai",
                    content: messageContentBuffer,
                    metadata: {
                      ts: new Date().toISOString(),
                      raw: contentPiece,
                      source: nodeName
                    }
                  });
                }
                return next;
              });
            }
          }
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        options.onError?.(e);
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, options.onError, options.onUpdateEvent]
  );

  return {
    messages,
    isLoading,
    submit,
    stop,
    setMessages,
    invoke: async (input: SubmitInput) => {
      const lcMessages = (Array.isArray(input.messages) ? input.messages : messages).map(toLangChainMessage).map((m) => ({
        role: (m as any).type === "human" ? "user" : (m as any).type === "ai" ? "assistant" : (m as any).type ?? "user",
        content: (m as any).text ?? (m as any).content ?? String(m)
      }));

      const threadId = typeof options.threadId === "string" ? options.threadId : "default-thread";
      const endpoint = `${options.url.replace(/\/$/, "")}/runs/wait`;

      const extraConfigInvoke: Record<string, unknown> = {};
      if ((input as Record<string, unknown>)) {
        Object.assign(extraConfigInvoke, { ...(input as Record<string, unknown>) });
        delete (extraConfigInvoke as any).messages;
      }

      const assistantTopInvoke = typeof options.assistantId === "string" ? options.assistantId : "default";

      // Duplicate model/reflection hints and add client_run_id for correlation
      const reasoningI = (extraConfigInvoke as any).reasoning_model ?? (extraConfigInvoke as any).reasoningModel;
      const reflectionI = (extraConfigInvoke as any).reflection_model ?? (extraConfigInvoke as any).reflectionModel;
      const clientRunIdInvoke = `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      const payloadInvoke: Record<string, any> = {
        assistant_id: assistantTopInvoke,
        input: {
          messages: lcMessages,
          ...(reasoningI ? { reasoning_model: reasoningI } : {}),
          ...(reflectionI ? { reflection_model: reflectionI } : {}),
          client_run_id: clientRunIdInvoke,
        },
        config: {
          assistant_id: assistantTopInvoke,
          configurable: {
            thread_id: threadId,
            assistant_id: assistantTopInvoke,
            client_run_id: clientRunIdInvoke,
          },
          ...extraConfigInvoke,
          model: {
            ...(reasoningI ? { reasoning_model: reasoningI } : {}),
            ...(reflectionI ? { reflection_model: reflectionI } : {}),
          },
        },
      };

      if (reasoningI) payloadInvoke.reasoning_model = reasoningI;
      if (reflectionI) payloadInvoke.reflection_model = reflectionI;

      // Debug log for invoke
      try {
        // eslint-disable-next-line no-console
        console.debug("[useAgent.invoke] Posting run to endpoint:", endpoint, "client_run_id:", clientRunIdInvoke, "payload:", payloadInvoke);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug("[useAgent.invoke] Posting run (stringify failed)", endpoint, JSON.stringify(payloadInvoke));
      }

      // Get Firebase ID token for authenticated requests
      const authTokenInvoke = await getAuthToken();
      const invokeHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(authTokenInvoke ? { Authorization: `Bearer ${authTokenInvoke}` } : {}),
      };

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: invokeHeaders,
        body: JSON.stringify(payloadInvoke),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Invoke failed: ${resp.status} ${resp.statusText} - ${errorText}`);
      }

      return resp.json();
    },
  };
}
