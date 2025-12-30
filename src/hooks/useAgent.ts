import { useCallback, useRef, useState } from "react";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ChatMessage } from "@/lib/chat-types";

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

        const body = JSON.stringify({
          // Some backends require assistant_id at the top-level of the run payload
          assistant_id: assistantTop,
          input: { messages: lcMessages },
          config: {
            assistant_id: assistantTop,
            configurable: {
              thread_id: threadId,
              assistant_id: assistantTop,
            },
            ...extraConfig,
          }
        });

        // Try using fetch stream directly for the agent.
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        if (!res.body) throw new Error("No streaming body from server");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Read streamed chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = decoder.decode(value, { stream: true });

          // Try parsing as SSE-style data lines
          const parts = chunkText.split(/\r?\n/).filter(Boolean);
          for (const part of parts) {
            let contentPiece: unknown = part;

            // SSE lines commonly start with "data:"
            const sseMatch = part.match(/^data:\s*(.*)$/s);
            if (sseMatch) {
              const payload = sseMatch[1];
              try {
                contentPiece = JSON.parse(payload);
              } catch {
                contentPiece = payload;
              }
            } else {
              // Try JSON otherwise
              try {
                contentPiece = JSON.parse(part);
              } catch {
                contentPiece = part;
              }
            }

            options.onUpdateEvent?.(contentPiece);

            // If backend sends full messages array (common in LangGraph state updates), prefer replacing buffer.
            const maybeMessages =
              contentPiece && typeof contentPiece === "object"
                ? (contentPiece as any).messages ?? (contentPiece as any).output?.messages ?? (contentPiece as any).result?.messages
                : null;

            // Also check for LangGraph node outputs like { "node_name": { "messages": [...] } }
            let foundMessages = maybeMessages;
            let nodeName = "agent";
            if (!foundMessages && contentPiece && typeof contentPiece === "object") {
              for (const key in contentPiece as any) {
                const val = (contentPiece as any)[key];
                if (val && typeof val === "object" && Array.isArray(val.messages)) {
                  foundMessages = val.messages;
                  nodeName = key;
                  break;
                }
              }
            }

            if (Array.isArray(foundMessages) && foundMessages.length > 0) {
              setMessages((prev) => {
                let next = [...prev];
                foundMessages.forEach((m: any) => {
                  if (m.type === "human" || m.role === "user") return;
                  const mId = m.id || aiId;
                  const content = extractTextFromChunk(m);
                  const existingIdx = next.findIndex((ex) => ex.id === mId);
                  
                  const newMsg: ChatMessage = {
                    id: mId,
                    type: "ai",
                    content,
                    metadata: {
                      source: m.name || nodeName,
                      ts: new Date().toISOString(),
                      raw: contentPiece,
                      ...(m.metadata || {}),
                    },
                  };

                  if (existingIdx >= 0) {
                    next[existingIdx] = { 
                      ...next[existingIdx], 
                      ...newMsg,
                      // Preserve existing metadata if any, but update with new
                      metadata: { ...(next[existingIdx].metadata as any || {}), ...(newMsg.metadata as any || {}) }
                    };
                  } else {
                    next.push(newMsg);
                  }
                });

                // If we have real messages with content, and the initial placeholder is still empty, remove it
                const hasRealContent = next.some(m => m.id !== aiId && m.content);
                if (hasRealContent) {
                  next = next.filter(m => m.id !== aiId || m.content !== "");
                }
                return next;
              });
              continue;
            }

            const delta = extractTextFromChunk(contentPiece);
            if (delta) {
              buffer += delta;
              setMessages((prev) => {
                const next = [...prev];
                const idx = next.findIndex((m) => m.id === aiId);
                if (idx >= 0) {
                  next[idx] = { 
                    ...next[idx], 
                    content: buffer,
                    metadata: { 
                      ...(next[idx].metadata as any || {}), 
                      ts: new Date().toISOString(), 
                      raw: contentPiece,
                      source: nodeName 
                    }
                  };
                } else {
                  // If placeholder was removed or doesn't exist, add it
                  next.push({
                    id: aiId,
                    type: "ai",
                    content: buffer,
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

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistant_id: assistantTopInvoke,
          input: { messages: lcMessages },
          config: {
            assistant_id: assistantTopInvoke,
            configurable: {
              thread_id: threadId,
              assistant_id: assistantTopInvoke,
            },
            ...extraConfigInvoke,
          }
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Invoke failed: ${resp.status} ${resp.statusText} - ${errorText}`);
      }

      return resp.json();
    },
  };
}
