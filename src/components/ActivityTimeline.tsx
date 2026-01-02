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
    <Card className="border-none rounded-lg bg-neutral-700 max-h-96">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <div
            className="flex items-center justify-start text-sm w-full cursor-pointer gap-2 text-neutral-100"
            onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
          >
            Research
            {isTimelineCollapsed ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronUp className="h-4 w-4 mr-2" />
            )}
          </div>
        </CardDescription>
      </CardHeader>
      {!isTimelineCollapsed && (
        <ScrollArea className="max-h-96 overflow-y-auto">
          <CardContent>
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
              <div className="space-y-0">
                {processedEvents.map((eventItem, index) => (
                  <div key={index} className="relative pl-8 pb-4">
                    {index < processedEvents.length - 1 ||
                      (isLoading && index === processedEvents.length - 1) ? (
                      <div className="absolute left-3 top-3.5 h-full w-0.5 bg-neutral-600" />
                    ) : null}
                    <div className="absolute left-0.5 top-2 h-6 w-6 rounded-full bg-neutral-600 flex items-center justify-center ring-4 ring-neutral-700">
                      {getEventIcon(eventItem.title, index)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-neutral-200 font-medium mb-0.5">
                          {eventItem.title}
                        </p>
                        {eventItem.ts && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(eventItem.ts).toLocaleTimeString()} ({getRelativeTime(eventItem.ts)})
                          </span>
                        )}
                        <button
                          type="button"
                          className="ml-2 text-xs text-neutral-400 hover:text-neutral-200"
                          onClick={() => setExpanded((s) => ({ ...s, [index]: !s[index] }))}
                        >
                          {expanded[index] ? "Hide" : "Details"}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {typeof eventItem.data === "string"
                          ? eventItem.data
                          : Array.isArray(eventItem.data)
                            ? (eventItem.data as string[]).join(", ")
                            : JSON.stringify(eventItem.data)}
                      </p>
                      {expanded[index] && (
                        <pre className="mt-2 p-2 rounded bg-neutral-800 text-xs overflow-auto border border-neutral-700 max-h-64">{JSON.stringify(eventItem.raw ?? eventItem.data, null, 2)}</pre>
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
                      <p className="text-sm text-neutral-300 font-medium">
                        Searching...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading ? ( // Only show "No activity" if not loading and no events
              <div className="flex flex-col items-center justify-center h-full text-neutral-500 pt-10">
                <Info className="h-6 w-6 mb-3" />
                <p className="text-sm">No activity to display.</p>
                <p className="text-xs text-neutral-600 mt-1">
                  Timeline will update during processing.
                </p>
              </div>
            ) : null}
          </CardContent>
        </ScrollArea>
      )}
    </Card>
  );
}
