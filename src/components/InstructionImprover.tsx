import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const IMPROVEMENT_PROMPT = `01. IDENTITY AND OBJECTIVE
You act as an Autonomous Prompt Engineering Unit. Your function is to transmute vague, simple, or incomplete user inputs into structured, precise, and high-performance Master Prompts.

02. INTERACTION PROTOCOL (HARD CONSTRAINTS)
ZERO INTERROGATION: It is strictly forbidden to ask the user for clarifications, context, or feedback.

AGGRESSIVE INFERENCE: In the absence of data, you must assume the most probable intent, the most expert role, and the most useful context based on industry standards.

UNILATERALITY: You take full control of defining the requirements for the final prompt.

03. LOGICAL CORE (CHAIN OF THOUGHT)
Before generating the response, process the input through this inference matrix:

Intent Decoding: What does the user actually want to achieve? (e.g., "Logo" -> "Vectorial visual identity design").

Persona Assignment: Who is the highest-level expert for this task? (Define Level, Role, and Specialty).

Context Injection: Which missing variables are critical? (Format, Tone, Audience, Technical Constraints).

Prompt Architecture: Determine the optimal structure (Markdown, Steps, Code Blocks, Tables).

04. STRICT OUTPUT FORMAT
Your response must contain only these two sections, without preambles or closings:

A. INFERENCE MATRIX
Concise bulleted list justifying the decisions made regarding user ambiguity:

Assumed Role: [Selected expert role]

Decoded Intent: [Inferred real objective]

Injected Variables: [Unilaterally added context or constraints]

B. OPTIMIZED PROMPT
Markdown code block containing the final result. This prompt must mandatorily include:

# ROLE: In-depth definition of the expert.

# TASK: Actionable and granular instruction.

# REQUIREMENTS/RULES: List of constraints (positive and negative).

# OUTPUT FORMAT: Technical specification of how to deliver the result.`;

interface InstructionImproverButtonProps {
  currentInput: string;
  onImprovedPrompt: (improvedPrompt: string) => void;
  disabled?: boolean;
}

export const InstructionImproverButton: React.FC<InstructionImproverButtonProps> = ({
  currentInput,
  onImprovedPrompt,
  disabled = false,
}) => {
  const [isImproving, setIsImproving] = useState(false);

  const improvePrompt = async () => {
    if (!currentInput.trim() || isImproving) return;

    setIsImproving(true);

    try {
      // Call Gemini API directly (hardcoded to gemini-2.0-flash)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${IMPROVEMENT_PROMPT}\n\n---\n\nUSER INPUT TO IMPROVE:\n"${currentInput}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (improvedText) {
        // Extract the optimized prompt from the response
        // Look for the content after "B. OPTIMIZED PROMPT" or just use the markdown code block
        const codeBlockMatch = improvedText.match(/```(?:markdown)?\n([\s\S]*?)```/);
        if (codeBlockMatch) {
          onImprovedPrompt(codeBlockMatch[1].trim());
        } else {
          // If no code block found, try to extract after "B. OPTIMIZED PROMPT"
          const optimizedMatch = improvedText.match(/B\.\s*OPTIMIZED PROMPT\s*([\s\S]*)/i);
          if (optimizedMatch) {
            onImprovedPrompt(optimizedMatch[1].trim());
          } else {
            // Fallback: use the whole response
            onImprovedPrompt(improvedText.trim());
          }
        }
      }
    } catch (error) {
      console.error("Error improving prompt:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const isDisabled = disabled || !currentInput.trim() || isImproving;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={improvePrompt}
          disabled={isDisabled}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium 
            disabled:pointer-events-none disabled:opacity-50 
            [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 
            outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
            size-9 h-8 w-8 rounded-full transition-all duration-200 
            ${isImproving 
              ? 'bg-primary text-primary-foreground animate-pulse' 
              : 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 text-violet-400 hover:text-violet-300 border border-violet-500/20'
            }
            shadow-sm hover:shadow-md`}
          aria-label="Improve instruction with AI"
        >
          {isImproving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <div className="text-xs">
          <span className="font-bold">AI Prompt Improver</span>
          <p className="text-muted-foreground mt-1">
            Transforms your input into a structured, high-performance prompt using Gemini 2.0 Flash
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

