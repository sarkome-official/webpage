import { useCallback, useRef, useState } from "react";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ChatMessage } from "@/lib/chat-types";

type UseLangServeAgentOptions = {
  url: string;
  threadId?: string;
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

export function useLangServeAgent(options: UseLangServeAgentOptions) {
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
        const lcMessages = nextUiMessages.map(toLangChainMessage).map((m) => ({ role: (m as any).type ?? "user", content: (m as any).text ?? (m as any).content ?? String(m) }));

        // Map local thread IDs to server thread IDs so we don't send arbitrary
        // local IDs to the LangGraph server (which will 404).
        async function getOrCreateServerThreadId(localId?: string) {
          const mapKey = "sarkome.serverThreadMap.v1";
          let map: Record<string, string> = {};
          try {
            const raw = localStorage.getItem(mapKey);
            if (raw) map = JSON.parse(raw);
          } catch {
            map = {};
          }

          if (localId && typeof map[localId] === "string" && map[localId].trim().length > 0) {
            return map[localId];
          }

          // Create a server thread and persist mapping to the local id (if present).
          const createResp = await fetch(`${options.url.replace(/\/$/, "")}/threads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            signal: controller.signal,
          });
          if (!createResp.ok) {
            throw new Error(`Failed to create server thread: ${createResp.status} ${createResp.statusText}`);
          }
          const createJson = await createResp.json();
          const serverId = (createJson as any).id ?? (createJson as any).thread_id ?? (createJson as any).threadId;
          if (!serverId) throw new Error("Server did not return a thread id");

          if (localId) {
            map[localId] = serverId;
            try {
              localStorage.setItem(mapKey, JSON.stringify(map));
            } catch {
              // ignore storage errors
            }
          }
          return serverId;
        }

        const threadId = await getOrCreateServerThreadId(options.threadId);

        const endpoint = `${options.url.replace(/\/$/, "")}/threads/${threadId}/runs/stream`;

        const body = JSON.stringify({ input: { messages: lcMessages } });

        // Try using SDK client if available; fallback to fetch stream if not.
        let usedSdk = false;
        try {
          const sdkModule: any = await import("@langchain/langgraph-sdk");
          const ClientClass = sdkModule?.Client ?? sdkModule?.default ?? sdkModule;
          const client = new (ClientClass as any)({ apiUrl: options.url });

          // Some SDKs expose a `runs.stream` method that returns an async iterable.
          if (client.runs && typeof client.runs.stream === "function") {
            const stream = await client.runs.stream({ thread_id: threadId, input: { messages: lcMessages } }, { signal: controller.signal } as any);
            for await (const chunk of stream as any) {
              options.onUpdateEvent?.(chunk);
              const maybeMessages = chunk && typeof chunk === "object" ? (chunk as any).messages ?? (chunk as any).output?.messages ?? (chunk as any).result?.messages : null;
              if (Array.isArray(maybeMessages) && maybeMessages.length > 0) {
                const last = maybeMessages[maybeMessages.length - 1];
                const full = last ? asStringContent((last as any).content ?? last) : "";
                if (full) {
                  setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: full } : m)));
                  continue;
                }
              }
              const delta = extractTextFromChunk(chunk);
              if (!delta) continue;
              setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: (prev.find((x) => x.id === aiId)?.content ?? "") + delta } : m)));
            }
            usedSdk = true;
          } else if (typeof client.stream === "function") {
            const stream = await client.stream({ thread_id: threadId, input: { messages: lcMessages } }, { signal: controller.signal } as any);
            for await (const chunk of stream as any) {
              options.onUpdateEvent?.(chunk);
              const delta = extractTextFromChunk(chunk);
              if (!delta) continue;
              setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: (prev.find((x) => x.id === aiId)?.content ?? "") + delta } : m)));
            }
            usedSdk = true;
          }
        } catch {
          // Ignore SDK errors and fallback to fetch-based streaming below.
        }

        if (!usedSdk) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            signal: controller.signal,
          });

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

              // If backend sends full messages array, prefer replacing buffer.
              const maybeMessages =
                contentPiece && typeof contentPiece === "object"
                  ? (contentPiece as any).messages ?? (contentPiece as any).output?.messages ?? (contentPiece as any).result?.messages
                  : null;
              if (Array.isArray(maybeMessages) && maybeMessages.length > 0) {
                const last = maybeMessages[maybeMessages.length - 1];
                const full = last ? asStringContent((last as any).content ?? last) : "";
                if (full) {
                  buffer = full;
                  setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: buffer } : m)));
                  continue;
                }
              }

              const delta = extractTextFromChunk(contentPiece);
              if (!delta) continue;
              buffer += delta;
              setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: buffer } : m)));
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
      const lcMessages = (Array.isArray(input.messages) ? input.messages : messages).map(toLangChainMessage).map((m) => ({ role: (m as any).type ?? "user", content: (m as any).text ?? (m as any).content ?? String(m) }));

      // Map local thread IDs to server thread IDs (same helper as in submit).
      async function getOrCreateServerThreadId(localId?: string) {
        const mapKey = "sarkome.serverThreadMap.v1";
        let map: Record<string, string> = {};
        try {
          const raw = localStorage.getItem(mapKey);
          if (raw) map = JSON.parse(raw);
        } catch {
          map = {};
        }

        if (localId && typeof map[localId] === "string" && map[localId].trim().length > 0) {
          return map[localId];
        }

        const createResp = await fetch(`${options.url.replace(/\/$/, "")}/threads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!createResp.ok) {
          throw new Error(`Failed to create server thread: ${createResp.status} ${createResp.statusText}`);
        }
        const createJson = await createResp.json();
        const serverId = (createJson as any).id ?? (createJson as any).thread_id ?? (createJson as any).threadId;
        if (!serverId) throw new Error("Server did not return a thread id");

        if (localId) {
          map[localId] = serverId;
          try {
            localStorage.setItem(mapKey, JSON.stringify(map));
          } catch {
            // ignore storage errors
          }
        }
        return serverId;
      }

      const threadId = await getOrCreateServerThreadId(options.threadId);

      // Try SDK for non-streaming runs, fallback to fetch if SDK not available.
      try {
        const sdkModule: any = await import("@langchain/langgraph-sdk");
        const ClientClass = sdkModule?.Client ?? sdkModule?.default ?? sdkModule;
        const client = new (ClientClass as any)({ apiUrl: options.url });

        // Try common SDK invocation patterns
        if (client.runs && typeof client.runs.create === "function") {
          return client.runs.create({ thread_id: threadId, input: { messages: lcMessages } });
        }
        if (typeof client.createRun === "function") {
          return client.createRun({ thread_id: threadId, input: { messages: lcMessages } });
        }
        if (typeof client.run === "function") {
          return client.run({ thread_id: threadId, input: { messages: lcMessages } });
        }
      } catch {
        // ignore and fallback to fetch
      }

      const endpoint = `${options.url.replace(/\/$/, "")}/threads/${threadId}/runs`;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { messages: lcMessages } }),
      });
      return resp.json();
    },
  };
}
