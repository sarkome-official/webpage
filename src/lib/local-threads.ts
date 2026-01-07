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
 * Represents a stored chat thread.
 */
export interface StoredThread {
    id: string;
    title: string;
    patientId?: string;
    createdAt: number;
    updatedAt: number;
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
 */
export function setActiveThreadId(threadId: string): void {
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
            };
            upsertThread(newThread);
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
