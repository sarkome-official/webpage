/**
 * usePersistentRun - Hook for background runs with reconnection support
 * --------------------------------------------------------------------
 * 
 * This hook manages agent runs that persist independently of the client connection.
 * If the user closes the browser, the run continues on the server.
 * When they return, they can reconnect and see the result.
 * 
 * Usage:
 *   const { startRun, reconnect, status, events, isLoading } = usePersistentRun({ url });
 *   
 *   // Start a new run
 *   const runId = await startRun(messages, config);
 *   
 *   // Reconnect to an existing run
 *   await reconnect(runId, fromStep);
 */

import { useCallback, useRef, useState } from "react";
import { getAuthToken } from "@/lib/auth-token";

export type RunStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface RunEvent {
    step?: number;
    node?: string;
    state?: Record<string, unknown>;
    replayed?: boolean;
    status?: RunStatus;
    completed?: boolean;
    keepalive?: boolean;
    error?: string;
}

export interface PersistentRunState {
    runId: string | null;
    status: RunStatus | null;
    events: RunEvent[];
    lastStep: number;
    error: string | null;
}

interface UsePersistentRunOptions {
    url: string;
    onEvent?: (event: RunEvent) => void;
    onComplete?: (runId: string) => void;
    onError?: (error: string) => void;
}

export function usePersistentRun(options: UsePersistentRunOptions) {
    const [state, setState] = useState<PersistentRunState>({
        runId: null,
        status: null,
        events: [],
        lastStep: 0,
        error: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * Start a new background run.
     * Returns the run_id immediately - the run continues on the server.
     */
    const startRun = useCallback(
        async (
            messages: Array<{ role: string; content: string }>,
            config?: Record<string, unknown>
        ): Promise<string | null> => {
            setIsLoading(true);
            setState((prev) => ({
                ...prev,
                runId: null,
                status: "pending",
                events: [],
                lastStep: 0,
                error: null,
            }));

            try {
                const authToken = await getAuthToken();
                if (!authToken) {
                    throw new Error("Authentication required");
                }

                const endpoint = `${options.url.replace(/\/$/, "")}/api/runs/background`;

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        input: { messages },
                        config: config || {},
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to start run: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                const runId = data.run_id;

                setState((prev) => ({
                    ...prev,
                    runId,
                    status: "running",
                }));

                // Automatically connect to the stream
                await connectToStream(runId, 0);

                return runId;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setState((prev) => ({ ...prev, error: errorMessage, status: "failed" }));
                options.onError?.(errorMessage);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [options]
    );

    /**
     * Connect (or reconnect) to a run's event stream.
     * Use fromStep to resume from a specific point.
     */
    const connectToStream = useCallback(
        async (runId: string, fromStep: number = 0) => {
            // Abort any existing connection
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            setIsConnected(true);
            setState((prev) => ({
                ...prev,
                runId,
                status: prev.status || "running",
            }));

            try {
                const authToken = await getAuthToken();
                if (!authToken) {
                    throw new Error("Authentication required");
                }

                const endpoint = `${options.url.replace(/\/$/, "")}/api/runs/${runId}/stream?from_step=${fromStep}`;

                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to connect to stream: ${response.status} - ${errorText}`);
                }

                if (!response.body) {
                    throw new Error("No stream body");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.trim()) continue;

                        try {
                            const event: RunEvent = JSON.parse(line);

                            // Skip keepalives
                            if (event.keepalive) continue;

                            // Track the last step for reconnection
                            if (event.step && event.step > state.lastStep) {
                                setState((prev) => ({ ...prev, lastStep: event.step! }));
                            }

                            // Add event to list
                            setState((prev) => ({
                                ...prev,
                                events: [...prev.events, event],
                            }));

                            // Notify listener
                            options.onEvent?.(event);

                            // Check if run completed
                            if (event.completed) {
                                setState((prev) => ({
                                    ...prev,
                                    status: event.status || "completed",
                                }));
                                options.onComplete?.(runId);
                            }

                            // Check for errors
                            if (event.error) {
                                setState((prev) => ({
                                    ...prev,
                                    error: event.error || "Unknown error",
                                    status: "failed",
                                }));
                                options.onError?.(event.error);
                            }
                        } catch (e) {
                            console.warn("[usePersistentRun] Failed to parse event:", line, e);
                        }
                    }
                }
            } catch (err) {
                if ((err as Error).name === "AbortError") {
                    // Intentional abort, ignore
                    return;
                }
                const errorMessage = err instanceof Error ? err.message : String(err);
                setState((prev) => ({ ...prev, error: errorMessage }));
                options.onError?.(errorMessage);
            } finally {
                setIsConnected(false);
            }
        },
        [options, state.lastStep]
    );

    /**
     * Reconnect to an existing run.
     * Resumes from the last known step.
     */
    const reconnect = useCallback(
        async (runId: string, fromStep?: number) => {
            const step = fromStep ?? state.lastStep;
            await connectToStream(runId, step);
        },
        [connectToStream, state.lastStep]
    );

    /**
     * Disconnect from the stream (doesn't cancel the run).
     */
    const disconnect = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setIsConnected(false);
    }, []);

    /**
     * Cancel a running run on the server.
     */
    const cancelRun = useCallback(
        async (runId: string) => {
            try {
                const authToken = await getAuthToken();
                if (!authToken) return false;

                const endpoint = `${options.url.replace(/\/$/, "")}/api/runs/${runId}/cancel`;

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    setState((prev) => ({ ...prev, status: "cancelled" }));
                    disconnect();
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        },
        [options, disconnect]
    );

    /**
     * Get the status of a run from the server.
     */
    const getRunStatus = useCallback(
        async (runId: string): Promise<PersistentRunState | null> => {
            try {
                const authToken = await getAuthToken();
                if (!authToken) return null;

                const endpoint = `${options.url.replace(/\/$/, "")}/api/runs/${runId}`;

                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) return null;

                const data = await response.json();
                return {
                    runId: data.run_id,
                    status: data.status,
                    events: [],
                    lastStep: 0,
                    error: data.error || null,
                };
            } catch {
                return null;
            }
        },
        [options]
    );

    /**
     * List recent runs for the user.
     */
    const listRuns = useCallback(
        async (limit: number = 20) => {
            try {
                const authToken = await getAuthToken();
                if (!authToken) return [];

                const endpoint = `${options.url.replace(/\/$/, "")}/api/runs?limit=${limit}`;

                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) return [];

                const data = await response.json();
                return data.runs || [];
            } catch {
                return [];
            }
        },
        [options]
    );

    return {
        // State
        runId: state.runId,
        status: state.status,
        events: state.events,
        lastStep: state.lastStep,
        error: state.error,
        isLoading,
        isConnected,

        // Actions
        startRun,
        reconnect,
        disconnect,
        cancelRun,
        getRunStatus,
        listRuns,
    };
}
