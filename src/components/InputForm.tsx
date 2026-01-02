import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu, Users, Search, Activity, Box, Plus, ArrowUp, Loader2, Database } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EFFORT_SUMMARY: Record<
  string,
  {
    depth: string;
    latency: string;
    tokens: string;
    hallucinationRisk: string;
  }
> = {
  low: {
    depth: "Surface",
    latency: "Very Low",
    tokens: "Low",
    hallucinationRisk: "Moderate (complex tasks)",
  },
  medium: {
    depth: "Structured",
    latency: "Medium",
    tokens: "Medium",
    hallucinationRisk: "Low",
  },
  high: {
    depth: "Recursive / Critical",
    latency: "High",
    tokens: "Very High",
    hallucinationRisk: "Minimal",
  },
};

function EffortTooltipBody({ level }: { level: string }) {
  const info = EFFORT_SUMMARY[level] ?? EFFORT_SUMMARY.medium;
  const label = level.toUpperCase();

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-black tracking-[0.2em]">{label}</div>
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px]">
        <div className="opacity-80">Depth / CoT</div>
        <div className="font-semibold">{info.depth}</div>
        <div className="opacity-80">Latency</div>
        <div className="font-semibold">{info.latency}</div>
        <div className="opacity-80">Tokens (inference)</div>
        <div className="font-semibold">{info.tokens}</div>
        <div className="opacity-80">Logic Hallucination Risk</div>
        <div className="font-semibold">{info.hallucinationRisk}</div>
      </div>
    </div>
  );
}

// Quick tools are represented by agent ids: 'web_search', 'primekg', 'alphafold_rag'

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (
    inputValue: string,
    effort: string,
    models: { queryModel: string; answerModel: string },
    activeAgents: string[]
  ) => void;
  onCancel?: () => void;
  isLoading: boolean;
  hasHistory: boolean;
  setInputControl?: string;
}

export const InputForm = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
  setInputControl,
}: InputFormProps) => {
  const [internalInputValue, setInternalInputValue] = useState("");

  useEffect(() => {
    if (setInputControl) {
      setInternalInputValue(setInputControl);
      // Focus the textarea when value is set programmatically
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [setInputControl]);
  const [effort, setEffort] = useState("medium");
  const [queryModel, setQueryModel] = useState("gemini-3-flash-preview");
  const [answerModel, setAnswerModel] = useState("gemini-3-pro-preview");
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [hoveredEffort, setHoveredEffort] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleAgent = (id: string) => {
    setActiveAgents((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id);
      } else {
        if (prev.length < 3) {
          return [...prev, id];
        }
        return prev;
      }
    });
  };

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    const agentsToSend = activeAgents.length > 0 ? activeAgents : ['web_search'];
    onSubmit(internalInputValue, effort, { queryModel, answerModel }, agentsToSend);
    setInternalInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent focus if clicking on buttons or their children
    if ((e.target as HTMLElement).closest('button')) return;
    textareaRef.current?.focus();
  };



  const isSubmitDisabled = !internalInputValue.trim() || isLoading;
  const isCollaborating = activeAgents.length > 0;

  return (
    <>
      <form
        onSubmit={handleInternalSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex items-start justify-between mt-1 w-full">
          <div
            onClick={handleContainerClick}
            className={`relative flex flex-col rounded-2xl flex-1 min-w-0 overflow-hidden transition-all duration-200 search-bar-container 
              ${isCollaborating ? 'ring-1 ring-primary/20' : ''} 
              ${isLoading
                ? 'animate-pulse ring-1 ring-primary/30 bg-muted/20 border border-transparent'
                : 'bg-background shadow-sm border border-border hover:shadow-md'
              }
            `}
          >
            <Textarea
              ref={textareaRef}
              value={internalInputValue}
              onChange={(e) => setInternalInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Thinking..." : "Type a message..."}
              disabled={isLoading}
              className="w-full bg-transparent dark:bg-transparent border-0 shadow-none focus-visible:ring-0 resize-none text-[14px] py-3 px-4 min-h-[44px] max-h-[200px] leading-relaxed search-bar-input no-scrollbar overflow-y-auto"
              rows={1}
              aria-label="Scientific query input"
            />

            <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
              <button
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-9 h-8 w-8 rounded-full transition-colors search-bar-button"
                type="button"
                aria-label="Add attachment or extra tool"
              >
                <Plus className="size-4" />
              </button>

              {isLoading ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={onCancel}
                  disabled={!onCancel}
                  aria-label="Cancel run"
                  title="Cancel"
                >
                  <span className="sr-only">Thinking</span>
                  <Loader2 className="size-4 animate-spin" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className={`h-8 w-8 rounded-full transition-all duration-200 ${isSubmitDisabled
                    ? 'opacity-50 cursor-not-allowed search-bar-button'
                    : 'search-bar-button-active shadow-sm hover:opacity-90'}`}
                  disabled={isSubmitDisabled}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center bg-accent/30 border border-border rounded-full px-4 py-1 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-r border-border pr-4 mr-2">
              <Brain className="size-3" />
              EFFORT
            </div>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="h-7 w-[100px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2" aria-label="Select effort level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <Tooltip open={hoveredEffort === 'low'} onOpenChange={(open) => !open && setHoveredEffort(null)}>
                  <TooltipTrigger asChild>
                    <div onMouseEnter={() => setHoveredEffort('low')} onMouseLeave={() => setHoveredEffort(null)}>
                      <SelectItem value="low" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Low</SelectItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                    <EffortTooltipBody level="low" />
                  </TooltipContent>
                </Tooltip>
                <Tooltip open={hoveredEffort === 'medium'} onOpenChange={(open) => !open && setHoveredEffort(null)}>
                  <TooltipTrigger asChild>
                    <div onMouseEnter={() => setHoveredEffort('medium')} onMouseLeave={() => setHoveredEffort(null)}>
                      <SelectItem value="medium" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Medium</SelectItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                    <EffortTooltipBody level="medium" />
                  </TooltipContent>
                </Tooltip>
                <Tooltip open={hoveredEffort === 'high'} onOpenChange={(open) => !open && setHoveredEffort(null)}>
                  <TooltipTrigger asChild>
                    <div onMouseEnter={() => setHoveredEffort('high')} onMouseLeave={() => setHoveredEffort(null)}>
                      <SelectItem value="high" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">High</SelectItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                    <EffortTooltipBody level="high" />
                  </TooltipContent>
                </Tooltip>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center bg-accent/30 border border-border rounded-2xl sm:rounded-full px-5 py-3.5 sm:py-1.5 gap-4 sm:gap-4 backdrop-blur-sm w-full sm:w-auto">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 sm:border-r border-border sm:pr-4 sm:mr-2 shrink-0">
              <Cpu className="size-3" />
              MODEL
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-start gap-x-8 gap-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap shrink-0 text-left">Query & Reflection</span>
                <Select value={queryModel} onValueChange={setQueryModel}>
                  <SelectTrigger className="h-7 w-auto min-w-[140px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2 text-left justify-start" aria-label="Select query model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="gemini-3-pro-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Pro</SelectItem>
                    <SelectItem value="gemini-3-flash-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Flash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap shrink-0 text-left">Answer</span>
                <Select value={answerModel} onValueChange={setAnswerModel}>
                  <SelectTrigger className="h-7 w-auto min-w-[140px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2 text-left justify-start" aria-label="Select answer model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="gemini-3-pro-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Pro</SelectItem>
                    <SelectItem value="gemini-3-flash-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Flash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>

    </>
  );
};
