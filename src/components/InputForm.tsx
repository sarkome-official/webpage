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

const ADDITIONAL_AGENTS = [
  { id: "researcher", name: "Search Researcher", icon: Search, color: "bg-zinc-500", desc: "Performs deep web-based inquiries" },
  { id: "analyst", name: "Causal Analyst", icon: Activity, color: "bg-zinc-600", desc: "Analyzes causal pathways" },
  { id: "expert", name: "Modality Expert", icon: Box, color: "bg-zinc-700", desc: "Cross-references multiple data sources" },
];

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string, activeAgents: string[]) => void;
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
  const [model, setModel] = useState("gemini-2.5-flash-preview-04-17");
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
    onSubmit(internalInputValue, effort, model, activeAgents);
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

        <div className="flex items-center bg-muted/40 border border-border rounded-full px-5 py-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-r border-border pr-4 mr-2">
            <Brain className="size-3.5" />
            EFFORT
          </div>
          <Select value={effort} onValueChange={setEffort}>
            <SelectTrigger className="h-8 w-[100px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground p-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="low" className="text-[10px] font-bold uppercase tracking-widest">Low</SelectItem>
              <SelectItem value="medium" className="text-[10px] font-bold uppercase tracking-widest">Medium</SelectItem>
              <SelectItem value="high" className="text-[10px] font-bold uppercase tracking-widest">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center bg-muted/40 border border-border rounded-full px-5 py-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-r border-border pr-4 mr-2">
            <Cpu className="size-3.5" />
            MODEL
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 w-[120px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.15em] text-foreground p-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="gemini-2.0-flash" className="text-[10px] font-bold uppercase tracking-widest">2.0 Flash</SelectItem>
              <SelectItem value="gemini-2.5-flash-preview-04-17" className="text-[10px] font-bold uppercase tracking-widest">2.5 Flash</SelectItem>
              <SelectItem value="gemini-2.5-pro-preview-05-06" className="text-[10px] font-bold uppercase tracking-widest">2.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};
