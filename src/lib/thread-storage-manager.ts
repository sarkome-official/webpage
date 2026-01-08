/**
 * Thread Storage Manager
 * ----------------------
 * Primary storage manager using Firebase Firestore as the source of truth.
 * Uses Firebase's native offline persistence for caching.
 * localStorage is used ONLY to track the active thread session ID.
 */

import * as firestoreThreads from './firestore-threads';
import { auth } from './firebase';
import type { ChatMessage } from './chat-types';

// Track if we've already warned about auth
let hasWarnedAboutAuth = false;

// -----------------------------------------------------------------------------
// Types (previously in local-threads.ts)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Unified API (Exclusively Firestore-first)
// -----------------------------------------------------------------------------

/**
 * List all threads. Returns an empty array if not authenticated.
 */
export async function listThreads(): Promise<StoredThread[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        if (!hasWarnedAboutAuth) {
            console.info('[ThreadManager] User not authenticated. Sign in to sync threads to cloud.');
            hasWarnedAboutAuth = true;
        }
        return [];
    }

    try {
        const firestoreList = await firestoreThreads.listUserThreads(userId);

        return firestoreList.map(t => ({
            id: t.id,
            title: t.title,
            patientId: t.patientId,
            createdAt: t.createdAt.toMillis(),
            updatedAt: t.updatedAt.toMillis(),
            messages: []
        }));
    } catch (err) {
        console.error('[ThreadManager] Error listing threads from Firestore:', err);
        return [];
    }
}

/**
 * Get a specific thread and its messages.
 */
export async function getThread(threadId: string): Promise<StoredThread | null> {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    try {
        const thread = await firestoreThreads.getThread(userId, threadId);
        if (thread) {
            const messages = await firestoreThreads.loadThreadMessages(userId, threadId);
            return {
                id: thread.id,
                title: thread.title,
                patientId: thread.patientId,
                createdAt: thread.createdAt.toMillis(),
                updatedAt: thread.updatedAt.toMillis(),
                messages: messages.map(m => ({
                    type: m.type as "human" | "ai" | "system",
                    content: m.content,
                    id: m.id
                }))
            };
        }
        return null;
    } catch (err) {
        console.error(`[ThreadManager] Error getting thread ${threadId}:`, err);
        return null;
    }
}

/**
 * Persist a thread directly to Firestore.
 */
export async function saveThread(
    threadId: string,
    title: string,
    messages: ChatMessage[],
    patientId?: string
) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        await firestoreThreads.upsertThread(userId, threadId, { title, patientId });
        await firestoreThreads.saveThreadMessages(userId, threadId, messages);
    } catch (err) {
        console.error('[ThreadManager] Failed to save thread to Firestore:', err);
    }
}

/**
 * Delete a thread from Firestore.
 */
export async function deleteThread(threadId: string) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        await firestoreThreads.deleteThread(userId, threadId);
    } catch (err) {
        console.error('[ThreadManager] Failed to delete thread:', err);
    }
}

// -----------------------------------------------------------------------------
// Session State (Runtime - uses localStorage only for active thread ID)
// -----------------------------------------------------------------------------

export function getActiveThreadId(): string | null {
    return localStorage.getItem('sarkome:active_thread_id');
}

export function setActiveThreadId(id: string, patientId?: string): void {
    localStorage.setItem('sarkome:active_thread_id', id);
    if (patientId) {
        localStorage.setItem('sarkome:active_patient_id', patientId);
    }
}

export function createThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateActiveThreadId(): string {
    let id = getActiveThreadId();
    if (!id) {
        id = createThreadId();
        setActiveThreadId(id);
    }
    return id;
}

export function deriveThreadTitle(messages: ChatMessage[]): string {
    if (messages.length === 0) return "New Conversation";
    const firstUserMsg = messages.find(m => m.type === 'human');
    if (!firstUserMsg) return "System-initiated Chat";

    const content = firstUserMsg.content;
    return content.length > 40 ? content.substring(0, 40) + "..." : content;
}

/**
 * Compatibility wrapper for upsertThread (used by UI components)
 */
export async function upsertThread(thread: StoredThread): Promise<void> {
    return saveThread(
        thread.id,
        thread.title,
        thread.messages || [],
        thread.patientId
    );
}
