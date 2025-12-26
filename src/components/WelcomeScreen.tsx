import { InputForm } from "./InputForm";

interface WelcomeScreenProps {
  handleSubmit: (
    submittedInputValue: string,
    effort: string,
    model: string,
    activeAgents: string[]
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  handleSubmit,
  onCancel,
  isLoading,
}) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-4 flex-1 w-full max-w-4xl mx-auto gap-8">
    <div className="space-y-4">
      <h1 className="text-6xl md:text-7xl font-bold text-foreground tracking-tight">
        Welcome.
      </h1>
      <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
        How can I help you today?
      </p>
    </div>
    <div className="w-full max-w-3xl">
      <InputForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={onCancel}
        hasHistory={false}
      />
    </div>
    <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide">
      Powered by Google Gemini and LangChain LangGraph.
    </p>
  </div>
);
