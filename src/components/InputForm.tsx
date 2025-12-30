import { useState, useRef } from "react";
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

// Quick tools are represented by agent ids: 'web_search', 'primekg', 'alphafold_rag'

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
    <form
      onSubmit={handleInternalSubmit}
      className="flex flex-col gap-4 w-full"
    >
      <div
        onClick={handleContainerClick}
        className={`flex flex-col gap-2 bg-muted/30 border border-border rounded-[22px] px-4 py-3 transition-all duration-300 focus-within:border-border/50 focus-within:bg-muted/50 shadow-sm cursor-text ${isCollaborating ? 'ring-1 ring-primary/20' : ''}`}
      >
        <Textarea
          ref={textareaRef}
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Asigna una tarea o pregunta cualquier cosa"
          className="flex-1 bg-transparent dark:bg-transparent border-0 focus-visible:ring-0 resize-none text-[15px] text-foreground placeholder:text-muted-foreground/50 min-h-[40px] max-h-[200px] p-0 shadow-none leading-relaxed"
          rows={1}
        />
        <div className="flex items-center justify-between mt-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Plus className="size-4" />
          </Button>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                onClick={onCancel}
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
                  ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                  : 'bg-foreground text-background hover:opacity-90 shadow-sm'}`}
                disabled={isSubmitDisabled}
              >
                <ArrowUp className="size-4" />
              </Button>
            )}
          </div>
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
              TOOLS
              {isCollaborating && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px]">
                  {activeAgents.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-popover border-border w-80 p-0 shadow-2xl">
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em]">Quick Tools</h4>
                <span className="text-[10px] text-muted-foreground">Minimum: 1</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAgent('web_search')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold border transition-colors ${activeAgents.includes('web_search') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground hover:bg-muted/30'}`}
                >
                  <Search className="size-4" />
                  <span className="hidden sm:inline">Web Search</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAgent('primekg')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold border transition-colors ${activeAgents.includes('primekg') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground hover:bg-muted/30'}`}
                >
                  <Database className="size-4" />
                  <span className="hidden sm:inline">PrimeKG</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAgent('alphafold_rag')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold border transition-colors ${activeAgents.includes('alphafold_rag') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground hover:bg-muted/30'}`}
                >
                  <Box className="size-4" />
                  <span className="hidden sm:inline">AlphaFold RAG</span>
                </Button>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-md bg-muted/5 border border-border">
                  <Search className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Web Search</div>
                    <div className="text-[11px] text-muted-foreground">Live web queries</div>
                  </div>
                  <Switch checked={activeAgents.includes('web_search')} onCheckedChange={() => toggleAgent('web_search')} />
                </label>

                <label className="flex items-center gap-2 p-2 rounded-md bg-muted/5 border border-border">
                  <Database className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">PrimeKG</div>
                    <div className="text-[11px] text-muted-foreground">GraphRAG retrieval</div>
                  </div>
                  <Switch checked={activeAgents.includes('primekg')} onCheckedChange={() => toggleAgent('primekg')} />
                </label>

                <label className="flex items-center gap-2 p-2 rounded-md bg-muted/5 border border-border">
                  <Box className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">AlphaFold RAG</div>
                    <div className="text-[11px] text-muted-foreground">Protein model retrieval</div>
                  </div>
                  <Switch checked={activeAgents.includes('alphafold_rag')} onCheckedChange={() => toggleAgent('alphafold_rag')} />
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center bg-accent/30 border border-border rounded-full px-4 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-r border-border pr-4 mr-2">
            <Brain className="size-3" />
            EFFORT
          </div>
          <Select value={effort} onValueChange={setEffort}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="h-7 w-[90px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2">
                  <SelectValue />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="max-w-[280px]">
                <EffortTooltipBody level={effort} />
              </TooltipContent>
            </Tooltip>
            <SelectContent className="bg-popover border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="low" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Low</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                  <EffortTooltipBody level="low" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="medium" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Medium</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                  <EffortTooltipBody level="medium" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value="high" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">High</SelectItem>
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
              <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap w-[110px] shrink-0 text-left">Query & Reflection</span>
              <Select value={queryModel} onValueChange={setQueryModel}>
                <SelectTrigger className="h-7 min-w-[140px] sm:w-[130px] md:w-[160px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2 text-left justify-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="gemini-3-pro-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Pro</SelectItem>
                  <SelectItem value="gemini-3-flash-preview" className="text-[10px] font-bold uppercase tracking-widest focus:bg-accent focus:text-accent-foreground">Gemini 3 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap w-[110px] shrink-0 text-left">Answer</span>
              <Select value={answerModel} onValueChange={setAnswerModel}>
                <SelectTrigger className="h-7 min-w-[140px] sm:w-[130px] md:w-[160px] bg-transparent dark:bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/90 p-0 hover:text-foreground hover:bg-accent/50 transition-all rounded-md px-2 text-left justify-start">
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
  );
};
