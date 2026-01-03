import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Activity,
  Info,
  Search,
  TextSearch,
  Brain,
  Pen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

export interface ProcessedEvent {
  title: string;
  data: any;
  raw?: any;
  ts?: string;
  type?: string;
}

interface ActivityTimelineProps {
  processedEvents: ProcessedEvent[];
  isLoading: boolean;
}

export function ActivityTimeline({
  processedEvents,
  isLoading,
}: ActivityTimelineProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isTimelineCollapsed, setIsTimelineCollapsed] =
    useState<boolean>(false);

  const firstTs = processedEvents[0]?.ts ? new Date(processedEvents[0].ts).getTime() : null;

  const getRelativeTime = (ts?: string) => {
    if (!ts || !firstTs) return "";
    const diff = new Date(ts).getTime() - firstTs;
    const seconds = (diff / 1000).toFixed(1);
    return `+${seconds}s`;
  };

  const getEventIcon = (title: string, index: number) => {
    if (index === 0 && isLoading && processedEvents.length === 0) {
      return <Loader2 className="h-4 w-4 text-neutral-400 animate-spin" />;
    }
    if (title.toLowerCase().includes("generating")) {
      return <TextSearch className="h-4 w-4 text-neutral-400" />;
    } else if (title.toLowerCase().includes("thinking")) {
      return <Loader2 className="h-4 w-4 text-neutral-400 animate-spin" />;
    } else if (title.toLowerCase().includes("reflection")) {
      return <Brain className="h-4 w-4 text-neutral-400" />;
    } else if (title.toLowerCase().includes("research")) {
      return <Search className="h-4 w-4 text-neutral-400" />;
    } else if (title.toLowerCase().includes("finalizing")) {
      return <Pen className="h-4 w-4 text-neutral-400" />;
    }
    return <Activity className="h-4 w-4 text-neutral-400" />;
  };

  // Auto-collapse removed: Research timeline now stays expanded after conversation ends

  return (
    <Card className="border-none rounded-lg bg-neutral-700 max-h-96 w-full max-w-full overflow-hidden shadow-sm">
      <CardHeader className="p-4 md:px-6 md:pt-6 md:pb-2">
        <CardDescription className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center justify-between text-sm w-full cursor-pointer gap-2 text-neutral-100 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
            onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
            aria-expanded={!isTimelineCollapsed}
          >
            <span className="font-semibold tracking-wide">Research Activity</span>
            {isTimelineCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </CardDescription>
      </CardHeader>
      {!isTimelineCollapsed && (
        <ScrollArea className="max-h-80 overflow-y-auto w-full pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/50">
          <CardContent className="p-4 md:p-6 pt-0">
            {isLoading && processedEvents.length === 0 && (
              <div className="relative pl-8 pb-4">
                <div className="absolute left-3 top-3.5 h-full w-0.5 bg-neutral-800" />
                <div className="absolute left-0.5 top-2 h-5 w-5 rounded-full bg-neutral-800 flex items-center justify-center ring-4 ring-neutral-900">
                  <Loader2 className="h-3 w-3 text-neutral-400 animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300 font-medium">
                    Searching...
                  </p>
                </div>
              </div>
            )}
            {processedEvents.length > 0 ? (
              <div className="space-y-0 w-full">
                {processedEvents.map((eventItem, index) => (
                  <div key={index} className="relative pl-8 pb-4 w-full group">
                    {index < processedEvents.length - 1 ||
                      (isLoading && index === processedEvents.length - 1) ? (
                      <div className="absolute left-3 top-3.5 h-full w-0.5 bg-neutral-600/50 group-hover:bg-neutral-500 transition-colors" />
                    ) : null}
                    <div className="absolute left-0.5 top-2 h-6 w-6 rounded-full bg-neutral-600 flex items-center justify-center ring-4 ring-neutral-700 z-10 shadow-sm">
                      {getEventIcon(eventItem.title, index)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                        <p className="text-sm text-neutral-200 font-medium truncate max-w-[150px] sm:max-w-none">
                          {eventItem.title}
                        </p>
                        <div className="flex items-center gap-2 ml-auto sm:ml-0">
                          {eventItem.ts && (
                            <span className="text-[10px] text-neutral-400 font-mono whitespace-nowrap">
                              {new Date(eventItem.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({getRelativeTime(eventItem.ts)})
                            </span>
                          )}
                          <button
                            type="button"
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-600 transition-all border border-neutral-700"
                            onClick={() => setExpanded((s) => ({ ...s, [index]: !s[index] }))}
                          >
                            {expanded[index] ? "Hide" : "Details"}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed break-words pr-2">
                        {typeof eventItem.data === "string"
                          ? eventItem.data
                          : Array.isArray(eventItem.data)
                            ? (eventItem.data as string[]).join(", ")
                            : JSON.stringify(eventItem.data)}
                      </p>
                      {expanded[index] && (
                        <div className="mt-2 w-full max-w-full min-w-0 overflow-hidden rounded-md border border-neutral-800">
                          <pre className="p-3 bg-neutral-950/50 text-[10px] md:text-xs text-neutral-300 w-full whitespace-pre-wrap break-words block font-mono">
                            {JSON.stringify(eventItem.raw ?? eventItem.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && processedEvents.length > 0 && (
                  <div className="relative pl-8 pb-4">
                    <div className="absolute left-0.5 top-2 h-5 w-5 rounded-full bg-neutral-600 flex items-center justify-center ring-4 ring-neutral-700">
                      <Loader2 className="h-3 w-3 text-neutral-400 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-300 font-medium animate-pulse">
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading ? (
              <div className="flex flex-col items-center justify-center h-32 text-neutral-500">
                <Info className="h-6 w-6 mb-3 opacity-50" />
                <p className="text-sm">No activity recorded.</p>
              </div>
            ) : null}
          </CardContent>
        </ScrollArea>
      )}
    </Card>
  );
}
