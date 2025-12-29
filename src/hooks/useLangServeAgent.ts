import { useCallback, useMemo, useRef, useState } from "react";
import { RemoteRunnable } from "@langchain/core/runnables/remote";
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
  const agent = useMemo(() => new RemoteRunnable({ url: options.url }), [options.url]);

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
        const lcMessages = nextUiMessages.map(toLangChainMessage);
        const stream = await agent.stream(
          {
            ...input,
            messages: lcMessages,
          },
          {
            signal: controller.signal,
            configurable: options.threadId ? { thread_id: options.threadId } : undefined,
          } as any
        );

        let buffer = "";
        for await (const chunk of stream as any) {
          if (chunk && typeof chunk === "object") {
            options.onUpdateEvent?.(chunk);
          }

          // If backend streams full message history, prefer replacing buffer.
          const maybeMessages =
            chunk && typeof chunk === "object"
              ? (chunk as any).messages ?? (chunk as any).output?.messages ?? (chunk as any).result?.messages
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

          const delta = extractTextFromChunk(chunk);
          if (!delta) continue;
          buffer += delta;
          setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content: buffer } : m)));
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
    [agent, messages, options.onError, options.onUpdateEvent]
  );

  return {
    messages,
    isLoading,
    submit,
    stop,
    setMessages,
    invoke: async (input: SubmitInput) => {
      const lcMessages = (Array.isArray(input.messages) ? input.messages : messages).map(toLangChainMessage);
      return agent.invoke(
        { ...input, messages: lcMessages },
        { configurable: options.threadId ? { thread_id: options.threadId } : undefined } as any
      );
    },
  };
}
