/**
 * Local Threads Management
 *
 * This module handles the persistence of chat threads (conversations)
 * in the browser's localStorage. It provides CRUD operations for threads
 * and manages the active thread state.
 */

const THREADS_STORAGE_KEY = "sarkome.threads";
const ACTIVE_THREAD_KEY = "sarkome.activeThreadId";

/**
 * Represents a chat message (simplified for storage).
 */
export interface ChatMessage {
    type: "human" | "ai" | "system";
    content: string;
    id?: string;
}

/**
 * Represents a stored chat thread.
 */
export interface StoredThread {
    id: string;
    title: string;
    patientId?: string;
    createdAt: number;
    updatedAt: number;
    messages?: ChatMessage[];
}

/**
 * Generates a unique thread ID using timestamp and random suffix.
 */
export function createThreadId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `thread-${timestamp}-${randomSuffix}`;
}

/**
 * Retrieves all stored threads from localStorage.
 * Returns threads sorted by updatedAt (most recent first).
 */
export function listThreads(): StoredThread[] {
    try {
        const data = localStorage.getItem(THREADS_STORAGE_KEY);
        if (!data) return [];
        const threads: StoredThread[] = JSON.parse(data);
        return threads.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
        console.error("[local-threads] Error reading threads:", error);
        return [];
    }
}

/**
 * Retrieves a specific thread by its ID.
 */
export function getThread(threadId: string): StoredThread | null {
    const threads = listThreads();
    return threads.find((t) => t.id === threadId) || null;
}

/**
 * Creates or updates a thread in localStorage.
 * If the thread exists, it updates it; otherwise, it creates a new one.
 */
export function upsertThread(thread: StoredThread): void {
    try {
        const threads = listThreads();
        const existingIndex = threads.findIndex((t) => t.id === thread.id);

        if (existingIndex >= 0) {
            threads[existingIndex] = thread;
        } else {
            threads.push(thread);
        }

        localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
        dispatchThreadsEvent();
    } catch (error) {
        console.error("[local-threads] Error upserting thread:", error);
    }
}

/**
 * Deletes a thread by its ID.
 */
export function deleteThread(threadId: string): void {
    try {
        const threads = listThreads();
        const filteredThreads = threads.filter((t) => t.id !== threadId);
        localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(filteredThreads));

        // If the deleted thread was active, clear the active thread
        const activeId = getActiveThreadId();
        if (activeId === threadId) {
            clearActiveThreadId();
        }

        dispatchThreadsEvent();
    } catch (error) {
        console.error("[local-threads] Error deleting thread:", error);
    }
}

/**
 * Gets the currently active thread ID.
 */
export function getActiveThreadId(): string | null {
    try {
        return localStorage.getItem(ACTIVE_THREAD_KEY);
    } catch (error) {
        console.error("[local-threads] Error getting active thread ID:", error);
        return null;
    }
}

/**
 * Sets the active thread ID.
 * If the thread doesn't exist yet, it creates a new one with a default title.
 * Optionally associates the thread with a patient.
 */
export function setActiveThreadId(threadId: string, patientId?: string): void {
    try {
        localStorage.setItem(ACTIVE_THREAD_KEY, threadId);

        // Create thread if it doesn't exist
        const existingThread = getThread(threadId);
        if (!existingThread) {
            const now = Date.now();
            const newThread: StoredThread = {
                id: threadId,
                title: "",
                createdAt: now,
                updatedAt: now,
                patientId,
            };
            upsertThread(newThread);
        } else if (patientId && !existingThread.patientId) {
            // Update existing thread with patientId if it wasn't set before
            upsertThread({
                ...existingThread,
                patientId,
                updatedAt: Date.now(),
            });
        }

        dispatchThreadsEvent();
    } catch (error) {
        console.error("[local-threads] Error setting active thread ID:", error);
    }
}

/**
 * Clears the active thread ID.
 */
export function clearActiveThreadId(): void {
    try {
        localStorage.removeItem(ACTIVE_THREAD_KEY);
    } catch (error) {
        console.error("[local-threads] Error clearing active thread ID:", error);
    }
}

/**
 * Dispatches a custom event to notify components of thread changes.
 */
function dispatchThreadsEvent(): void {
    window.dispatchEvent(new CustomEvent("sarkome:threads"));
}

/**
 * Derives a thread title from the first human message in the conversation.
 * Truncates to a reasonable length for display purposes.
 */
export function deriveThreadTitle(messages: ChatMessage[]): string {
    const firstHumanMessage = messages.find((m) => m.type === "human");
    if (!firstHumanMessage || !firstHumanMessage.content) {
        return "New Conversation";
    }

    const content = typeof firstHumanMessage.content === "string"
        ? firstHumanMessage.content
        : JSON.stringify(firstHumanMessage.content);

    // Truncate to 50 characters max
    const maxLength = 50;
    if (content.length <= maxLength) {
        return content;
    }
    return content.substring(0, maxLength).trim() + "...";
}

/**
 * Gets the active thread ID or creates a new one if none exists.
 * This ensures there's always an active thread for the user session.
 */
export function getOrCreateActiveThreadId(): string {
    const existingId = getActiveThreadId();
    if (existingId) {
        return existingId;
    }

    // Create a new thread ID and set it as active
    const newId = createThreadId();
    setActiveThreadId(newId);
    return newId;
}
