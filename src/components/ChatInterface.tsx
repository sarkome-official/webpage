import * as React from "react";
import { useRef, useCallback } from "react";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Button } from "@/components/ui/button";
import { useAgentContext } from "@/contexts/AgentContext";
import { getPatient, upsertPatient, type Hypothesis } from "@/lib/patient-record";

interface ChatInterfaceProps {
    patientId?: string;
}

export function ChatInterface({ patientId }: ChatInterfaceProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Use the global agent context instead of local state
    const {
        activeThreadId,
        messages,
        isLoading,
        error,
        submit,
        stop,
        processedEventsTimeline,
        historicalActivities,
        sourcesByMessageId,
        sourcesListByMessageId,
        rawEvents,
    } = useAgentContext();

    const handleSubmit = useCallback(
        (
            submittedInputValue: string,
            effort: string,
            models: { queryModel: string; answerModel: string },
            activeAgents: string[],
            inputPatientContext?: string
        ) => {
            submit(submittedInputValue, effort, models, activeAgents, inputPatientContext);
        },
        [submit]
    );

    const handleCancel = useCallback(() => {
        stop();
    }, [stop]);

    const handleSaveHypothesis = useCallback(
        (message: any) => {
            if (!patientId) return;

            const patient = getPatient(patientId);
            if (!patient) return;

            const content =
                typeof message.content === "string"
                    ? message.content
                    : JSON.stringify(message.content);

            const newHypothesis: Hypothesis = {
                id: Math.random().toString(36).substring(2, 15),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                claim: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
                mechanism: content,
                type: "drug_repurposing",
                confidence: "medium",
                status: "generated",
                sourceThreadId: activeThreadId,
                physicianNotes: `Generated from chat on ${new Date().toLocaleDateString()}`,
            };

            const updatedPatient = {
                ...patient,
                hypotheses: [...(patient.hypotheses || []), newHypothesis],
                updatedAt: Date.now(),
            };

            upsertPatient(updatedPatient);
            alert("Hypothesis saved to patient record.");
        },
        [patientId, activeThreadId]
    );

    return (
        <div className="max-w-4xl mx-auto h-full">
            {messages.length === 0 ? (
                <WelcomeScreen
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={handleCancel}
                />
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-2xl text-red-400 font-bold">Error</h1>
                        <p className="text-red-400">{error}</p>
                        <Button variant="destructive" onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </div>
                </div>
            ) : (
                <ChatMessagesView
                    messages={messages}
                    isLoading={isLoading}
                    scrollAreaRef={scrollAreaRef}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    liveActivityEvents={processedEventsTimeline}
                    historicalActivities={historicalActivities}
                    sourcesByMessageId={sourcesByMessageId}
                    sourcesListByMessageId={sourcesListByMessageId}
                    rawEvents={rawEvents}
                    onSaveHypothesis={patientId ? handleSaveHypothesis : undefined}
                />
            )}
        </div>
    );
}

export default ChatInterface;
