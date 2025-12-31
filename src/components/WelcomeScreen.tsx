import React, { useState } from "react";
import { InputForm } from "./InputForm";
import { Sparkles, Activity, Network, Layers } from "lucide-react";

interface WelcomeScreenProps {
  handleSubmit: (
    submittedInputValue: string,
    effort: string,
    models: { queryModel: string; answerModel: string },
    activeAgents: string[]
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SAMPLE_QUESTIONS = [
  {
    icon: <Activity className="w-5 h-5 text-purple-400" />,
    text: "Predict structural impact of V600E mutation on BRAF drug binding.",
    short: "Mutation Impact Analysis",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    text: "Validate amyloid-beta toxicity hypothesis against 2024 clinical trial data.",
    short: "Clinical Trial Validation",
  },
  {
    icon: <Network className="w-5 h-5 text-blue-400" />,
    text: "Map protein interactions connecting diabetes mechanisms to cardiovascular disease.",
    short: "Mechanism Mapping",
  },
  {
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
    text: "Complex Synthesis (Recursive Reflection)",
    short: "Recursive Synthesis",
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  handleSubmit,
  onCancel,
  isLoading,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const handleQuestionClick = (text: string) => {
    // Force a slight reset to ensure the effect triggers even if clicking the same one twice (though less common)
    setSelectedQuestion("");
    setTimeout(() => setSelectedQuestion(text), 10);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 flex-1 w-full max-w-4xl mx-auto gap-8">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground tracking-tight">
          Welcome.
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
          How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {SAMPLE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => handleQuestionClick(q.text)}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all text-left group"
          >
            <div className="p-3 rounded-lg bg-background/50 border border-border group-hover:scale-110 transition-transform">
              {q.icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                {q.short}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {q.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl">
        <InputForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onCancel}
          hasHistory={false}
          setInputControl={selectedQuestion}
        />
      </div>
      <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide">
        Powered by Google Gemini and LangChain LangGraph.
      </p>
    </div>
  );
};
