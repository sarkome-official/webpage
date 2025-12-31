import type React from "react";
import rehypeSanitize from 'rehype-sanitize';
import type { ChatMessage } from "@/lib/chat-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Copy, CopyCheck, Database, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ActivityTimeline,
  ProcessedEvent,
} from "@/components/ActivityTimeline";
import { RunLogs } from "@/components/RunLogs";
import { ProteinViewer } from "@/components/molecules";

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
  const raw = typeof content === "string" ? content : JSON.stringify(content, null, 2);

  // Normalize simple LaTeX-like macros to Unicode to avoid Markdown/math parsing issues
  // Examples: "$\\Delta^9$" -> "Δ^9", "\\Delta" -> "Δ"
  const macroMap: Record<string, string> = {
    Delta: "Δ",
    delta: "Δ",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    mu: "μ",
    lambda: "λ",
    Omega: "Ω",
    omega: "ω",
    pi: "π",
  };

  let normalized = raw;

  // Replace $\Macro^n$ patterns
  normalized = normalized.replace(/\$\\([A-Za-z]+)(\^[-+]?\d+)?\$/g, (_m, macro: string, sup: string) => {
    const sym = macroMap[macro] ?? macro;
    return sup ? `${sym}${sup}` : `${sym}`;
  });

  // Replace bare \Macro occurrences
  normalized = normalized.replace(/\\([A-Za-z]+)/g, (_m, macro: string) => {
    return macroMap[macro] ?? macro;
  });

  return normalized;
}

function extractUniProtIds(content: string, metadata?: any): string[] {
  const ids = new Set<string>();

  // 1. Check metadata for explicit artifact
  if (metadata?.artifact?.type === 'protein_3d' && metadata.artifact.id) {
    ids.add(metadata.artifact.id);
  }

  // 2. Check raw metadata for AlphaFold results
  const raw = metadata?.raw;
  if (raw?.query_alphafold?.results) {
    const results = Array.isArray(raw.query_alphafold.results) ? raw.query_alphafold.results : [];
    results.forEach((r: any) => {
      if (r.uniprot_id) ids.add(r.uniprot_id);
      else if (r.uniprotId) ids.add(r.uniprotId);
    });
  }

  // 3. Regex fallback for UniProt IDs in text
  // UniProt IDs: [OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}
  const uniprotRegex = /\b([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})\b/g;
  const matches = content.match(uniprotRegex);
  if (matches) {
    matches.forEach(id => ids.add(id));
  }

  return Array.from(ids);
}

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: ChatMessage;
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
      <ReactMarkdown components={mdComponents} rehypePlugins={[rehypeSanitize]}>
        {formatted}
      </ReactMarkdown>
    </div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: ChatMessage;
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

  const metadata = (message.metadata || {}) as any;
  const source = metadata.source;
  const raw = metadata.raw;
  const ts = metadata.ts;

  const uniProtIds = extractUniProtIds(formatted, metadata);

  return (
    <div className={`relative break-words flex flex-col w-full`}>
      {source && (
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-mono py-0 px-1.5 bg-primary/5 border-primary/20 text-primary/80">
            {source.replace(/_/g, ' ')}
          </Badge>
          {ts && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {new Date(ts).toLocaleTimeString()}
            </span>
          )}
          {raw && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-primary">
                  <Database className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 bg-black border-border">
                <div className="p-2 bg-muted/50 border-b border-border flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Raw Node Output</span>
                </div>
                <ScrollArea className="h-[300px] w-full p-4">
                  <pre className="text-[10px] font-mono text-green-400/90 whitespace-pre-wrap">
                    {JSON.stringify(raw, null, 2)}
                  </pre>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {activityForThisBubble && activityForThisBubble.length > 0 && (
        <div className="mt-3 border-t border-border pt-3 text-xs">
          <ActivityTimeline
            processedEvents={activityForThisBubble}
            isLoading={isLiveActivityForThisBubble}
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown components={mdComponents} rehypePlugins={[rehypeSanitize]}>
          {formatted}
        </ReactMarkdown>
      </div>

      {uniProtIds.length > 0 && (
        <div className="mt-4 space-y-4">
          {uniProtIds.map(id => (
            <ProteinViewer key={id} uniprotId={id} />
          ))}
        </div>
      )}

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

      {/* transform buttons removed */}
    </div>
  );
};

interface ChatMessagesViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (
    inputValue: string,
    effort: string,
    models: { queryModel: string; answerModel: string },
    activeAgents: string[]
  ) => void;
  historicalActivities: Record<string, ProcessedEvent[]>;
  sourcesListByMessageId?: Record<string, Array<{ label?: string; url: string; id?: string }>>;
  rawEvents?: any[];
  onCancel?: () => void;
  liveActivityEvents?: ProcessedEvent[];
  sourcesByMessageId?: Record<string, Record<string, string>>;
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
  rawEvents = [],

}: ChatMessagesViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

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
              <div className="flex flex-col gap-3 mt-3 w-full">
                <div className="flex items-center gap-3 px-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground animate-pulse">Agent is Thinking...</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLogs(!showLogs)}
                    className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary h-7"
                  >
                    <Terminal className="h-3 w-3 mr-1.5" />
                    {showLogs ? "Hide Logs" : "Show Logs"}
                    {showLogs ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                  </Button>
                </div>

                <div className="relative group max-w-full rounded-2xl p-4 shadow-sm break-words bg-muted/10 border border-border/50 text-foreground w-full min-h-[100px] backdrop-blur-sm">
                  {showLogs ? (
                    <div className="h-[300px] rounded-lg overflow-hidden border border-border/50">
                      <RunLogs events={rawEvents} />
                    </div>
                  ) : liveActivityEvents && liveActivityEvents.length > 0 ? (
                    <div className="text-xs">
                      <ActivityTimeline
                        processedEvents={liveActivityEvents}
                        isLoading={true}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-50">
                      <div className="relative h-12 w-12 mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">Initializing Neural Pathways...</span>
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
