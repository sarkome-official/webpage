import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu, Users, Search, Activity, Box } from "lucide-react";
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
    depth: "Superficial",
    latency: "Muy baja",
    tokens: "Bajo",
    hallucinationRisk: "Moderado (en tareas complejas)",
  },
  medium: {
    depth: "Estructurada",
    latency: "Media",
    tokens: "Medio",
    hallucinationRisk: "Bajo",
  },
  high: {
    depth: "Recursiva / Crítica",
    latency: "Alta",
    tokens: "Muy alto",
    hallucinationRisk: "Mínimo",
  },
};

function EffortTooltipBody({ level }: { level: string }) {
  const info = EFFORT_SUMMARY[level] ?? EFFORT_SUMMARY.medium;
  const label = level.toUpperCase();

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-black tracking-[0.2em]">{label}</div>
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px]">
        <div className="opacity-80">Profundidad / CoT</div>
        <div className="font-semibold">{info.depth}</div>
        <div className="opacity-80">Latencia</div>
        <div className="font-semibold">{info.latency}</div>
        <div className="opacity-80">Tokens (inferencia)</div>
        <div className="font-semibold">{info.tokens}</div>
        <div className="opacity-80">Riesgo alucinación lógica</div>
        <div className="font-semibold">{info.hallucinationRisk}</div>
      </div>
    </div>
  );
}

const ADDITIONAL_AGENTS = [
  { id: "researcher", name: "Search Researcher", icon: Search, color: "bg-zinc-500", desc: "Performs deep web-based inquiries" },
  { id: "analyst", name: "Causal Analyst", icon: Activity, color: "bg-zinc-600", desc: "Analyzes causal pathways" },
  { id: "expert", name: "Modality Expert", icon: Box, color: "bg-zinc-700", desc: "Cross-references multiple data sources" },
];

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (
    inputValue: string,
    effort: string,
    models: { queryModel: string; answerModel: string },
    activeAgents: string[]
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [effort, setEffort] = useState("medium");
  const [queryModel, setQueryModel] = useState("gemini-3-flash-preview");
  const [answerModel, setAnswerModel] = useState("gemini-3-pro-preview");
  const [activeAgents, setActiveAgents] = useState<string[]>([]);

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
    onSubmit(internalInputValue, effort, { queryModel, answerModel }, activeAgents);
    setInternalInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;
  const isCollaborating = activeAgents.length > 0;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className="flex flex-col gap-4 w-full"
    >
      <div
        className={`flex flex-row items-center gap-2 bg-muted/20 border border-border rounded-2xl px-6 py-3 transition-all duration-300 focus-within:border-border/50 focus-within:bg-muted/30 ${isCollaborating ? 'ring-1 ring-primary/20' : ''}`}
      >
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Who won the Euro 2024 and scored the most goals?"
          className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-lg text-foreground placeholder:text-muted-foreground/50 min-h-[40px] max-h-[200px] py-2"
          rows={1}
        />
        <div className="flex items-center gap-3 border-l border-border pl-4">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 rounded-full"
              onClick={onCancel}
            >
              <StopCircle className="size-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 font-bold text-[11px] tracking-[0.2em] uppercase transition-all ${isSubmitDisabled ? 'text-muted-foreground/30' : 'text-muted-foreground hover:text-foreground'}`}
              disabled={isSubmitDisabled}
            >
              SEARCH
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${isCollaborating
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              <Users className="size-3.5" />
              COLLABORATE
              {isCollaborating && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px]">
                  {activeAgents.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-popover border-border w-80 p-0 shadow-2xl">
            <div className="p-4 border-b border-border bg-muted/30">
              <h4 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em]">Multi-Agent Protocol</h4>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Distribute query workload across specialized nodes.</p>
            </div>
            <div className="p-2 space-y-1">
              {ADDITIONAL_AGENTS.map((agent) => {
                const isActive = activeAgents.includes(agent.id);
                const isToggleDisabled = !isActive && activeAgents.length >= 3;
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-muted border border-border' : 'border border-transparent'} ${isToggleDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/50'}`}
                    onClick={() => !isToggleDisabled && toggleAgent(agent.id)}
                  >
                    <div className={`size-9 rounded-xl ${agent.color} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}>
                      <agent.icon className="size-4 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col items-start text-left overflow-hidden">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">{agent.name}</span>
                      <span className="text-[9px] text-muted-foreground text-left font-medium leading-tight">{agent.desc}</span>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => !isToggleDisabled && toggleAgent(agent.id)}
                      className="data-[state=checked]:bg-primary"
                      disabled={isToggleDisabled}
                    />
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-4 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-r border-white/10 pr-4 mr-2">
            <Brain className="size-3" />
            EFFORT
          </div>
          <Select value={effort} onValueChange={setEffort}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="h-7 w-[90px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-white/5 transition-all rounded-md px-2 dark:bg-transparent dark:hover:bg-white/5">
                  <SelectValue />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="max-w-[280px]">
                <EffortTooltipBody level={effort} />
              </TooltipContent>
            </Tooltip>
            <SelectContent className="bg-neutral-900 border-white/10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="low" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Low</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                  <EffortTooltipBody level="low" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="medium" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Medium</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                  <EffortTooltipBody level="medium" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="high" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">High</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                  <EffortTooltipBody level="high" />
                </TooltipContent>
              </Tooltip>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 gap-4 flex-wrap backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-r border-white/10 pr-4 mr-2">
            <Cpu className="size-3" />
            MODEL
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">Query & Reflection</span>
            <Select value={queryModel} onValueChange={setQueryModel}>
              <SelectTrigger className="h-7 w-[130px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-white/5 transition-all rounded-md px-2 dark:bg-transparent dark:hover:bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="gemini-3-pro-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Gemini 3 Pro</SelectItem>
                <SelectItem value="gemini-3-flash-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Gemini 3 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">Answer</span>
            <Select value={answerModel} onValueChange={setAnswerModel}>
              <SelectTrigger className="h-7 w-[130px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-white/5 transition-all rounded-md px-2 dark:bg-transparent dark:hover:bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10">
                <SelectItem value="gemini-3-pro-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Gemini 3 Pro</SelectItem>
                <SelectItem value="gemini-3-flash-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-white/10 focus:text-white">Gemini 3 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
};
