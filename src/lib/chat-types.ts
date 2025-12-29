export type ChatMessageType = "human" | "ai" | "system" | (string & {});

export type ChatMessage = {
  type: ChatMessageType;
  content: unknown;
  id?: string;
  name?: string;
} & Record<string, unknown>;
