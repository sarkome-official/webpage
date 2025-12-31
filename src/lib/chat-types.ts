export type ChatMessageType = "human" | "ai" | "system" | (string & {});

export type ChatMessage = {
  type: ChatMessageType;
  content: unknown;
  id?: string;
  name?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
} & Record<string, unknown>;
