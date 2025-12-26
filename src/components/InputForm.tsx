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
  { id: "researcher", name: "Search Researcher", icon: Search, color: "bg-blue-500", desc: "Performs deep web-based inquiries" },
  { id: "analyst", name: "Causal Analyst", icon: Activity, color: "bg-purple-500", desc: "Analyzes causal pathways" },
  { id: "expert", name: "Modality Expert", icon: Box, color: "bg-orange-500", desc: "Cross-references multiple data sources" },
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
      className={`flex flex-col gap-2 p-3 pb-4`}
    >
      <div
        className={`flex flex-row items-center justify-between text-white rounded-3xl rounded-bl-sm animated-fadeInUpSmooth ${hasHistory ? "rounded-br-sm" : ""
          } break-words min-h-7 bg-neutral-700 px-4 pt-3 transition-colors duration-300 ${isCollaborating ? 'ring-1 ring-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : ''}`}
      >
        <div className="flex flex-col w-full">
          {isCollaborating && (
            <div className="flex items-center gap-2 mb-2 px-3 animate-fadeIn">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-neutral-600 border-2 border-neutral-700 flex items-center justify-center z-40">
                  <Cpu className="h-3 w-3 text-white" />
                </div>
                {activeAgents.map((agentId, idx) => {
                  const agent = ADDITIONAL_AGENTS.find(a => a.id === agentId);
                  return (
                    <div
                      key={agentId}
                      className={`w-5 h-5 rounded-full ${agent?.color} border-2 border-neutral-700 flex items-center justify-center animate-in zoom-in-50 duration-300`}
                      style={{ zIndex: 30 - idx }}
                    >
                      {agent && <agent.icon className="h-2.5 w-2.5 text-white" />}
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                {activeAgents.length === 1 ? '1 Agent Joining' : `${activeAgents.length} Agents Joining`}
              </span>
            </div>
          )}
          <Textarea
            value={internalInputValue}
            onChange={(e) => setInternalInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Who won the Euro 2024 and scored the most goals?"
            className={`w-full text-neutral-100 placeholder-neutral-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none
                          md:text-base min-h-[56px] max-h-[200px] bg-transparent pb-4`}
            rows={1}
          />
        </div>
        <div className="-mt-3 flex items-center gap-1">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 cursor-pointer rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className={`${isSubmitDisabled
                  ? "text-neutral-500 cursor-not-allowed"
                  : isCollaborating
                    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    : "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                } p-2 cursor-pointer rounded-full transition-all duration-200 text-base flex items-center gap-2`}
              disabled={isSubmitDisabled}
            >
              <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-widest px-2">
                {isCollaborating ? "Collaborative Run" : "Search"}
              </span>
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between overflow-x-auto pb-1 no-scrollbar">
        <div className="flex flex-row gap-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`flex flex-row items-center text-xs font-bold uppercase tracking-wider px-4 h-10 rounded-xl rounded-t-sm transition-all duration-300 border-none cursor-pointer ${isCollaborating
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                  }`}
              >
                <Users className={`h-4 w-4 mr-2 ${isCollaborating ? "animate-pulse" : ""}`} />
                <span className="whitespace-nowrap">Collaborate</span>
                {isCollaborating && (
                  <div className="ml-2 px-1.5 py-0.5 rounded-md bg-purple-500 text-[10px] text-white font-bold leading-none">
                    {activeAgents.length}
                  </div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="bg-neutral-800 border-neutral-700 w-80 p-0 shadow-2xl animate-in slide-in-from-bottom-2 duration-300"
              side="top"
              align="start"
              sideOffset={12}
            >
              <div className="p-4 border-b border-neutral-700/50 bg-neutral-800/50">
                <h4 className="text-[11px] font-bold text-neutral-100 uppercase tracking-[0.2em]">Multi-Agent Protocol</h4>
                <p className="text-[10px] text-neutral-500 mt-1 font-medium italic">Distribute query workload across specialized nodes.</p>
              </div>
              <div className="p-2 space-y-1 bg-neutral-800/30">
                {ADDITIONAL_AGENTS.map((agent) => {
                  const isActive = activeAgents.includes(agent.id);
                  const isToggleDisabled = !isActive && activeAgents.length >= 3;
                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-neutral-700/40 border border-neutral-600/50' : 'border border-transparent'} ${isToggleDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-700/50'}`}
                      onClick={() => !isToggleDisabled && toggleAgent(agent.id)}
                    >
                      <div className={`size-9 rounded-xl ${agent.color} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}>
                        <agent.icon className="size-4 text-white" />
                      </div>
                      <div className="flex-1 flex flex-col items-start text-left overflow-hidden">
                        <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-tight truncate">{agent.name}</span>
                        <span className="text-[9px] text-neutral-500 text-left font-medium leading-tight">{agent.desc}</span>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => !isToggleDisabled && toggleAgent(agent.id)}
                        className="data-[state=checked]:bg-purple-500"
                        disabled={isToggleDisabled}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="p-3 bg-neutral-900/80 rounded-b-lg border-t border-neutral-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">Protocol Ready</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                    {activeAgents.length}/3 NODES
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex flex-row gap-2 bg-neutral-700 border-neutral-600 text-neutral-300 rounded-xl rounded-t-sm pl-2">
            <div className="flex flex-row items-center text-xs font-bold uppercase tracking-wider">
              <Brain className="h-4 w-4 mr-2 text-neutral-500" />
              Effort
            </div>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[110px] bg-transparent border-none cursor-pointer focus:ring-0 text-xs font-bold uppercase tracking-tight">
                <SelectValue placeholder="Effort" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-300">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-2 bg-neutral-700 border-neutral-600 text-neutral-300 rounded-xl rounded-t-sm pl-2">
            <div className="flex flex-row items-center text-xs font-bold uppercase tracking-wider ml-1">
              <Cpu className="h-4 w-4 mr-2 text-neutral-500" />
              Model
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[140px] bg-transparent border-none cursor-pointer focus:ring-0 text-xs font-bold uppercase tracking-tight">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-300">
                <SelectItem value="gemini-2.0-flash">
                  <div className="flex items-center"><Zap className="h-3 w-3 mr-2 text-yellow-400" /> 2.0 Flash</div>
                </SelectItem>
                <SelectItem value="gemini-2.5-flash-preview-04-17">
                  <div className="flex items-center"><Zap className="h-3 w-3 mr-2 text-orange-400" /> 2.5 Flash</div>
                </SelectItem>
                <SelectItem value="gemini-2.5-pro-preview-05-06">
                  <div className="flex items-center"><Cpu className="h-3 w-3 mr-2 text-purple-400" /> 2.5 Pro</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasHistory && (
          <Button
            className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer rounded-xl rounded-t-sm px-4 shrink-0 ml-2 h-10 text-xs font-bold uppercase tracking-widest"
            variant="default"
            onClick={() => window.location.reload()}
          >
            <SquarePen size={14} className="mr-2" />
            New
          </Button>
        )}
      </div>
    </form>
  );
};
