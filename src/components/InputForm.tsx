import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu, Users, Search, Activity, Box, Plus, ArrowUp, Loader2, Database, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { InstructionImproverButton } from "@/components/InstructionImprover";
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
    }
  }, [setInputControl]);
  const [effort, setEffort] = useState("medium");
  const [queryModel, setQueryModel] = useState("gemini-3-flash-preview");
  const [answerModel, setAnswerModel] = useState("gemini-3-pro-preview");
  
  // Primary tools (main categories)
  const [primaryTools, setPrimaryTools] = useState<Record<string, boolean>>({
    web_search: true,
    primekg: true,
    alphafold_rag: false,
  });
  
  // KG sub-tools (only active when primekg is enabled)
  const [kgSubTools, setKgSubTools] = useState<Record<string, boolean>>({
    kg_search_text: true,
    kg_search_semantic: true,
    kg_neighbors: true,
    kg_subgraph: true,
    kg_path: true,
    kg_repurposing: true,
    kg_targets: true,
    kg_combinations: true,
    kg_mechanisms: true,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Toggle primary tool
  const togglePrimaryTool = (id: string) => {
    setPrimaryTools(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle KG sub-tool (only works if primekg is enabled)
  const toggleKgSubTool = (id: string) => {
    if (!primaryTools.primekg) return;
    setKgSubTools(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Build the list of active agents/tools for submission
  const getActiveAgents = (): string[] => {
    const agents: string[] = [];
    
    if (primaryTools.web_search) agents.push('web_search');
    if (primaryTools.alphafold_rag) agents.push('alphafold_rag');
    
    if (primaryTools.primekg) {
      agents.push('primekg');
      // Add active KG sub-tools
      Object.entries(kgSubTools).forEach(([id, active]) => {
        if (active) agents.push(id);
      });
    }
    
    return agents;
  };

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    const agentsToSend = getActiveAgents();
    if (agentsToSend.length === 0) agentsToSend.push('web_search');
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
  const activeAgentCount = getActiveAgents().length;
  const isCollaborating = activeAgentCount > 0;

  return (
    <>
      <form
        onSubmit={handleInternalSubmit}
        className="flex flex-col gap-4 w-full px-3 sm:px-4 pb-4 sm:pb-6"
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

            {/* Bottom bar with controls */}
            <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
              {/* Left side: Controls that may wrap on very small screens */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <button
                  data-slot="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-9 h-8 w-8 rounded-full transition-colors search-bar-button"
                  type="button"
                  aria-label="Add attachment or extra tool"
                >
                  <Plus className="size-4" />
                </button>

                {/* Effort selector - compact */}
                <div className="flex items-center bg-accent/30 border border-border rounded-full px-2 py-0.5 backdrop-blur-sm">
                  <Brain className="hidden sm:block size-3 text-muted-foreground/60 mr-1.5" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-between h-6 w-[55px] sm:w-[70px] bg-transparent border-none focus:ring-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-foreground/90 p-0 hover:text-foreground transition-all"
                      >
                        <span>{effort}</span>
                        <ChevronDown className="size-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3 bg-popover border-border" align="center">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                          <Brain className="size-3" />
                          Effort Level
                        </div>
                        <div className="space-y-1">
                          {(['low', 'medium', 'high'] as const).map((level) => (
                            <Tooltip key={level}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => setEffort(level)}
                                  className={`w-full text-left px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${effort === level
                                    ? 'bg-accent text-accent-foreground'
                                    : 'hover:bg-accent/50'
                                    }`}
                                >
                                  {level}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" sideOffset={10} className="max-w-[280px]">
                                <EffortTooltipBody level={level} />
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Models selector - compact */}
                <div className="flex items-center bg-accent/30 border border-border rounded-full px-2 py-0.5 backdrop-blur-sm">
                  <Cpu className="hidden sm:block size-3 text-muted-foreground/60 mr-1.5" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-between h-6 w-[50px] sm:w-[70px] bg-transparent border-none focus:ring-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-foreground/90 p-0 hover:text-foreground transition-all"
                      >
                        <span>Model</span>
                        <ChevronDown className="size-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4 bg-popover border-border" align="center">
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                          <Cpu className="size-3" />
                          Model Configuration
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">Query & Reflection</span>
                            <Select value={queryModel} onValueChange={setQueryModel}>
                              <SelectTrigger className="h-8 w-full bg-accent/30 border-border text-xs font-semibold" aria-label="Select query model">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                <SelectItem value="gemini-3-pro-preview" className="text-xs">Gemini 3 Pro</SelectItem>
                                <SelectItem value="gemini-3-flash-preview" className="text-xs">Gemini 3 Flash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">Answer</span>
                            <Select value={answerModel} onValueChange={setAnswerModel}>
                              <SelectTrigger className="h-8 w-full bg-accent/30 border-border text-xs font-semibold" aria-label="Select answer model">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                <SelectItem value="gemini-3-pro-preview" className="text-xs">Gemini 3 Pro</SelectItem>
                                <SelectItem value="gemini-3-flash-preview" className="text-xs">Gemini 3 Flash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Tools selector - compact */}
                <div className="flex items-center bg-accent/30 border border-border rounded-full px-2 py-0.5 backdrop-blur-sm">
                  <Box className="hidden sm:block size-3 text-muted-foreground/60 mr-1.5" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-between h-6 w-[50px] sm:w-[70px] bg-transparent border-none focus:ring-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-foreground/90 p-0 hover:text-foreground transition-all"
                      >
                        <span>Tools</span>
                        <ChevronDown className="size-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-popover border-border max-h-[70vh] overflow-y-auto" align="center">
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                          <Box className="size-3" />
                          Active Tools ({activeAgentCount})
                        </div>
                        
                        {/* Primary Tools */}
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 px-1">Data Sources</div>
                          {[
                            { id: 'web_search', label: 'Web Search', desc: 'Real-time web access. Searches PubMed, clinical trials, and biomedical literature for the latest research and evidence.' },
                            { id: 'primekg', label: 'PrimeKG', desc: 'Biomedical Knowledge Graph with 129K+ nodes and 4M+ relationships. Enables drug repurposing, target discovery, and mechanism analysis.' },
                            { id: 'alphafold_rag', label: 'AlphaFold', desc: 'Protein structure database. Access 200M+ predicted protein structures for structural analysis and drug-target interactions.' },
                          ].map((tool) => (
                            <Tooltip key={tool.id}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => togglePrimaryTool(tool.id)}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors border ${primaryTools[tool.id]
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-transparent border-transparent hover:bg-accent/50 text-muted-foreground'
                                    }`}
                                >
                                  <span>{tool.label}</span>
                                  <div className={`size-2.5 rounded-full transition-colors ${primaryTools[tool.id] ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[250px] text-xs p-3">
                                <p className="font-semibold mb-1">{tool.label}</p>
                                <p className="text-muted-foreground">{tool.desc}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>

                        {/* KG Sub-tools - Only visible when PrimeKG is enabled */}
                        {primaryTools.primekg && (
                          <div className="space-y-2 pt-2 border-t border-border/50">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 px-1 flex items-center gap-2">
                              <Database className="size-3" />
                              PrimeKG Endpoints
                            </div>
                            
                            {/* Search APIs */}
                            <div className="space-y-1">
                              <div className="text-[8px] font-bold uppercase tracking-wider text-primary/60 px-3 pt-1">Search</div>
                              {[
                                { id: 'kg_search_text', label: 'Text Search', desc: 'GET /search/text — Exact and partial text matching. Fast lookup for known entity names like "Aspirin" or "TP53".' },
                                { id: 'kg_search_semantic', label: 'Semantic Search', desc: 'GET /search/semantic — AI-powered vector search. Finds conceptually similar entities even with different terminology.' },
                              ].map((tool) => (
                                <Tooltip key={tool.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => toggleKgSubTool(tool.id)}
                                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${kgSubTools[tool.id]
                                        ? 'bg-primary/5 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                                        }`}
                                    >
                                      <span>{tool.label}</span>
                                      <div className={`size-1.5 rounded-full transition-colors ${kgSubTools[tool.id] ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[280px] text-xs p-3">
                                    <p className="font-mono text-[10px] text-primary mb-1">{tool.desc.split(' — ')[0]}</p>
                                    <p className="text-muted-foreground">{tool.desc.split(' — ')[1]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>

                            {/* Graph Traversal APIs */}
                            <div className="space-y-1">
                              <div className="text-[8px] font-bold uppercase tracking-wider text-primary/60 px-3 pt-1">Graph Traversal</div>
                              {[
                                { id: 'kg_neighbors', label: 'Neighbors', desc: 'GET /neighbors/{node} — Get 1-hop connections. Returns all directly connected entities (drugs, diseases, genes, etc.).' },
                                { id: 'kg_path', label: 'Path Finding', desc: 'GET /path/{source}/{target} — Find shortest paths between two entities. Reveals hidden connections and mechanisms.' },
                                { id: 'kg_subgraph', label: 'Subgraph', desc: 'GET /subgraph/{entity} — Extract local neighborhood for visualization. Returns nodes and edges for graph rendering.' },
                              ].map((tool) => (
                                <Tooltip key={tool.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => toggleKgSubTool(tool.id)}
                                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${kgSubTools[tool.id]
                                        ? 'bg-primary/5 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                                        }`}
                                    >
                                      <span>{tool.label}</span>
                                      <div className={`size-1.5 rounded-full transition-colors ${kgSubTools[tool.id] ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[280px] text-xs p-3">
                                    <p className="font-mono text-[10px] text-primary mb-1">{tool.desc.split(' — ')[0]}</p>
                                    <p className="text-muted-foreground">{tool.desc.split(' — ')[1]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>

                            {/* Hypothesis Generation APIs */}
                            <div className="space-y-1">
                              <div className="text-[8px] font-bold uppercase tracking-wider text-primary/60 px-3 pt-1">Hypothesis Generation</div>
                              {[
                                { id: 'kg_repurposing', label: 'Drug Repurposing', desc: 'GET /hypothesis/repurposing/{disease} — Find existing drugs that could treat a disease based on shared molecular targets and pathways.' },
                                { id: 'kg_targets', label: 'Target Discovery', desc: 'GET /hypothesis/targets/{disease} — Identify therapeutic targets (genes/proteins) for a disease using network analysis.' },
                                { id: 'kg_combinations', label: 'Drug Combinations', desc: 'GET /hypothesis/combinations/{drug} — Discover synergistic drug combinations based on complementary mechanisms.' },
                                { id: 'kg_mechanisms', label: 'Mechanism Analysis', desc: 'GET /hypothesis/mechanisms/{drug}/{disease} — Explain HOW a drug treats a disease through molecular pathways.' },
                              ].map((tool) => (
                                <Tooltip key={tool.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => toggleKgSubTool(tool.id)}
                                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${kgSubTools[tool.id]
                                        ? 'bg-primary/5 text-foreground'
                                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                                        }`}
                                    >
                                      <span>{tool.label}</span>
                                      <div className={`size-1.5 rounded-full transition-colors ${kgSubTools[tool.id] ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[280px] text-xs p-3">
                                    <p className="font-mono text-[10px] text-primary mb-1">{tool.desc.split(' — ')[0]}</p>
                                    <p className="text-muted-foreground">{tool.desc.split(' — ')[1]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Right side: Action buttons - always visible and grouped */}
              <div className="flex items-center gap-2 shrink-0">
                <InstructionImproverButton
                  currentInput={internalInputValue}
                  onImprovedPrompt={(improved) => setInternalInputValue(improved)}
                  disabled={isLoading}
                />
                
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
        </div>
      </form>

    </>
  );
};
