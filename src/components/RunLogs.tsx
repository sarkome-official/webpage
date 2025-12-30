import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface RunLogsProps {
  events: any[];
}

export function RunLogs({ events }: RunLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
      if (viewport) {
        const threshold = 100;
        const isAtBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < threshold;
        if (isAtBottom) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-black/60 font-mono text-[10px]">
      <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-white/5">
        <Terminal className="h-3 w-3 text-primary" />
        <span className="uppercase tracking-widest text-muted-foreground font-bold">Live Execution Stream</span>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1 p-2">
        <div className="space-y-1">
          {events.map((ev, i) => {
            const ts = new Date().toLocaleTimeString();
            
            // Filter out noisy heartbeats if they are too many, or style them differently
            const isHeartbeat = typeof ev === 'string' && ev.includes('heartbeat');
            
            // Try to find a node name or event type
            let node = "stream";
            let content: string | null = null;

            // Special rendering for AlphaFold logs if present
            if (ev && typeof ev === 'object' && (ev as any).query_alphafold && Array.isArray((ev as any).query_alphafold.alphafold_logs)) {
              node = 'query_alphafold';
              content = null; // handled below as a list
            } else if (typeof ev === 'object' && ev !== null) {
              const keys = Object.keys(ev);
              node = keys[0] || "data";
              content = JSON.stringify(ev[node] || ev).substring(0, 500);
            } else {
              content = String(ev);
            }
            
            return (
              <div key={i} className={cn(
                "flex gap-2 border-b border-white/5 pb-1 last:border-0",
                isHeartbeat ? "opacity-30" : "opacity-100"
              )}>
                <span className="text-muted-foreground shrink-0">[{ts}]</span>
                <span className={cn(
                  "shrink-0 font-bold",
                  node === "error" ? "text-red-400" : "text-primary"
                )}>[{node}]</span>
                <div className="text-neutral-400 break-all">
                  {node === 'query_alphafold' && ev && typeof ev === 'object' ? (
                    <div className="space-y-1">
                      {((ev as any).query_alphafold.alphafold_logs as string[]).map((line: string, idx: number) => (
                        <div key={idx} className="text-[11px] leading-snug text-neutral-300">{line}</div>
                      ))}
                    </div>
                  ) : (
                    <span>{content}</span>
                  )}
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground opacity-50">
              <Cpu className="h-8 w-8 mb-2 animate-pulse" />
              <p>Waiting for agent execution...</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
