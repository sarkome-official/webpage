import type React from "react";
import type { Message } from "@langchain/langgraph-sdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Copy, CopyCheck } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ActivityTimeline,
  ProcessedEvent,
} from "@/components/ActivityTimeline"; // Assuming ActivityTimeline is in the same dir or adjust path

function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  // React element
  if (typeof node === "object" && (node as any).props?.children != null) {
    return extractText((node as any).props.children);
  }
  return "";
}

function resolveRealHref(
  href: string | undefined,
  linkText: string,
  sourcesByLabel?: Record<string, string>,
  sourcesList?: Array<{ label?: string; url: string; id?: string }>
): string | undefined {
  if (!href) return undefined;

  const isVertexId = /https?:\/\/vertexaisearch\.cloud\.google\.com\/id\//i.test(href);
  if (!isVertexId) return href;

  if (!sourcesByLabel) return href;

  const textKey = linkText.trim();
  if (textKey && sourcesByLabel[textKey]) return sourcesByLabel[textKey];
  if (textKey && sourcesByLabel[textKey.toLowerCase()]) return sourcesByLabel[textKey.toLowerCase()];

  // Best-effort: try mapping by the trailing id token.
  const idTokenRaw = href.split("/id/")[1];
  const idToken = idTokenRaw ? idTokenRaw.split(/[?#]/)[0] : undefined;
  if (idToken && sourcesByLabel[idToken]) return sourcesByLabel[idToken];

  // Fallback: interpret ids like "0-2" (or "0_2") as an index into sources list.
  // Commonly the second number is 1-based source index.
  if (idToken && sourcesList && sourcesList.length > 0) {
    const match = idToken.match(/^(\d+)[-_](\d+)$/);
    if (match) {
      const idx2 = Number(match[2]);
      if (Number.isFinite(idx2)) {
        const oneBased = idx2 - 1;
        if (oneBased >= 0 && oneBased < sourcesList.length) return sourcesList[oneBased].url;
        if (idx2 >= 0 && idx2 < sourcesList.length) return sourcesList[idx2].url;
      }
    }
  }

  return href;
}

// Markdown component props type from former ReportView
type MdComponentProps = {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
};

// Markdown components factory (allows link rewriting per-message)
const makeMdComponents = (options?: {
  sourcesByLabel?: Record<string, string>;
  sourcesList?: Array<{ label?: string; url: string; id?: string }>;
}) => ({
  h1: ({ className, children, ...props }: MdComponentProps) => (
    <h1 className={cn("text-2xl font-bold mt-4 mb-2 text-foreground", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: MdComponentProps) => (
    <h2 className={cn("text-xl font-bold mt-3 mb-2 text-foreground", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: MdComponentProps) => (
    <h3 className={cn("text-lg font-bold mt-3 mb-1 text-foreground", className)} {...props}>
      {children}
    </h3>
  ),
  p: ({ className, children, ...props }: MdComponentProps) => (
    <p className={cn("mb-3 leading-7 text-muted-foreground", className)} {...props}>
      {children}
    </p>
  ),
  a: ({ className, children, href, node: _node, ...props }: MdComponentProps) => {
    const linkText = extractText(children);
    const resolvedHref = resolveRealHref(href, linkText, options?.sourcesByLabel, options?.sourcesList);
    return (
      <Badge className="text-xs mx-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
        <a
          className={cn("text-primary hover:text-primary/80 text-xs", className)}
          href={resolvedHref}
          target="_blank"
          rel="noopener noreferrer"
          title={resolvedHref}
          {...props}
        >
          {children}
        </a>
      </Badge>
    );
  },
  ul: ({ className, children, ...props }: MdComponentProps) => (
    <ul className={cn("list-disc pl-6 mb-3 text-muted-foreground", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ className, children, ...props }: MdComponentProps) => (
    <ol className={cn("list-decimal pl-6 mb-3 text-muted-foreground", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }: MdComponentProps) => (
    <li className={cn("mb-1", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ className, children, ...props }: MdComponentProps) => (
    <blockquote
      className={cn(
        "border-l-4 border-border pl-4 italic my-3 text-sm text-muted-foreground/80",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: MdComponentProps) => (
    <code
      className={cn(
        "bg-muted/30 rounded px-1 py-0.5 font-mono text-xs text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...props }: MdComponentProps) => (
    <pre
      className={cn(
        "bg-muted/20 p-3 rounded-lg overflow-x-auto font-mono text-xs my-3 border border-border",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ className, ...props }: MdComponentProps) => (
    <hr className={cn("border-border my-4", className)} {...props} />
  ),
  table: ({ className, children, ...props }: MdComponentProps) => (
    <div className="my-3 overflow-x-auto">
      <table className={cn("border-collapse w-full border border-border", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ className, children, ...props }: MdComponentProps) => (
    <th
      className={cn(
        "border border-border px-3 py-2 text-left font-bold bg-muted/20 text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ className, children, ...props }: MdComponentProps) => (
    <td
      className={cn("border border-border px-3 py-2 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </td>
  ),
});

function formatContent(content: any): string {
  const tryParse = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  // If it's already a string, attempt to parse JSON; if parse fails, return as-is.
  if (typeof content === "string") {
    const parsed = tryParse(content);
    if (!parsed) return content;
    content = parsed;
  }

  // If it's an array of Gemini-style parts, extract their text.
  if (Array.isArray(content)) {
    const pieces = content
      .map((item) => {
        if (item && typeof item === "object" && typeof item.text === "string") {
          return item.text;
        }
        if (typeof item === "string") return item;
        return "";
      })
      .filter(Boolean);
    if (pieces.length > 0) return pieces.join("\n\n");
  }

  // If it's an object with a text field
  if (content && typeof content === "object" && typeof content.text === "string") {
    return content.text;
  }

  // Fallback
  return typeof content === "string" ? content : JSON.stringify(content, null, 2);
}

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: Message;
  mdComponents: ReturnType<typeof makeMdComponents>;
}

// HumanMessageBubble Component
const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  mdComponents,
}) => {
  const formatted = formatContent(message.content);
  return (
    <div
      className={`text-foreground rounded-3xl break-words min-h-7 bg-muted/30 border border-border max-w-[100%] sm:max-w-[90%] px-4 pt-3 rounded-br-lg`}
    >
      <ReactMarkdown components={mdComponents}>
        {formatted}
      </ReactMarkdown>
    </div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: Message;
  historicalActivity: ProcessedEvent[] | undefined;
  liveActivity: ProcessedEvent[] | undefined;
  isLastMessage: boolean;
  isOverallLoading: boolean;
  mdComponents: ReturnType<typeof makeMdComponents>;
  handleCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

// AiMessageBubble Component
const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  historicalActivity,
  liveActivity,
  isLastMessage,
  isOverallLoading,
  mdComponents,
  handleCopy,
  copiedMessageId,
}) => {
  // Determine which activity events to show and if it's for a live loading message
  const activityForThisBubble =
    isLastMessage && isOverallLoading ? liveActivity : historicalActivity;
  const isLiveActivityForThisBubble = isLastMessage && isOverallLoading;
  const formatted = formatContent(message.content);

  return (
    <div className={`relative break-words flex flex-col w-full`}>
      {activityForThisBubble && activityForThisBubble.length > 0 && (
        <div className="mb-3 border-b border-border pb-3 text-xs">
          <ActivityTimeline
            processedEvents={activityForThisBubble}
            isLoading={isLiveActivityForThisBubble}
          />
        </div>
      )}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown components={mdComponents}>
          {formatted}
        </ReactMarkdown>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={`cursor-pointer text-muted-foreground hover:text-foreground self-end mt-2 ${formatted.length > 0 ? "visible" : "hidden"
          }`}
        onClick={() =>
          handleCopy(formatted, message.id!)
        }
      >
        {copiedMessageId === message.id ? "Copied" : "Copy"}
        {copiedMessageId === message.id ? <CopyCheck className="ml-2 h-4 w-4" /> : <Copy className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (
    inputValue: string,
    effort: string,
    models: { queryModel: string; answerModel: string },
    activeAgents: string[]
  ) => void;
  onCancel: () => void;
  liveActivityEvents: ProcessedEvent[];
  historicalActivities: Record<string, ProcessedEvent[]>;
  sourcesByMessageId?: Record<string, Record<string, string>>;
  sourcesListByMessageId?: Record<string, Array<{ label?: string; url: string; id?: string }>>;
}

export function ChatMessagesView({
  messages,
  isLoading,
  scrollAreaRef,
  onSubmit,
  onCancel,
  liveActivityEvents,
  historicalActivities,
  sourcesByMessageId,
  sourcesListByMessageId,
}: ChatMessagesViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const mdComponents = makeMdComponents();

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-2 max-w-4xl mx-auto pt-16">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const mdForMessage =
              message.type === "ai" && message.id
                ? makeMdComponents({ sourcesByLabel: sourcesByMessageId?.[message.id] })
                : mdComponents;
            const mdForMessageResolved =
              message.type === "ai" && message.id
                ? makeMdComponents({
                  sourcesByLabel: sourcesByMessageId?.[message.id],
                  sourcesList: sourcesListByMessageId?.[message.id],
                })
                : mdForMessage;
            return (
              <div key={message.id || `msg-${index}`} className="space-y-3">
                <div
                  className={`flex items-start gap-3 ${message.type === "human" ? "justify-end" : ""
                    }`}
                >
                  {message.type === "human" ? (
                    <HumanMessageBubble
                      message={message}
                      mdComponents={mdForMessageResolved}
                    />
                  ) : (
                    <AiMessageBubble
                      message={message}
                      historicalActivity={historicalActivities[message.id!]}
                      liveActivity={liveActivityEvents} // Pass global live events
                      isLastMessage={isLast}
                      isOverallLoading={isLoading} // Pass global loading state
                      mdComponents={mdForMessageResolved}
                      handleCopy={handleCopy}
                      copiedMessageId={copiedMessageId}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {isLoading &&
            (messages.length === 0 ||
              messages[messages.length - 1].type === "human") && (
              <div className="flex items-start gap-3 mt-3">
                {" "}
                {/* AI message row structure */}
                <div className="relative group max-w-[85%] md:max-w-[80%] rounded-xl p-3 shadow-sm break-words bg-muted/20 border border-border text-foreground rounded-bl-none w-full min-h-[56px]">
                  {liveActivityEvents.length > 0 ? (
                    <div className="text-xs">
                      <ActivityTimeline
                        processedEvents={liveActivityEvents}
                        isLoading={true}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-start h-full">
                      <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                      <span className="text-muted-foreground">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </ScrollArea>
      <InputForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={onCancel}
        hasHistory={messages.length > 0}
      />
    </div>
  );
}
