/**
 * Firestore Threads Service
 * -------------------------
 * Replaces localStorage-based thread storage with Firestore.
 * Maintains backwards compatibility with local-threads.ts interface.
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { ChatMessage } from './chat-types';

// -----------------------------------------------------------------------------
// Types (matching existing StoredThread interface)
// -----------------------------------------------------------------------------

export interface FirestoreThread {
    id: string;
    title: string;
    patientId?: string;
    ownerId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: 'active' | 'archived';
    messageCount: number;
}

// -----------------------------------------------------------------------------
// Collection References
// -----------------------------------------------------------------------------

const getUserThreadsCollection = (userId: string) =>
    collection(db, 'users', userId, 'chat_threads');

const getThreadMessagesCollection = (userId: string, threadId: string) =>
    collection(db, 'users', userId, 'chat_threads', threadId, 'messages');

// -----------------------------------------------------------------------------
// CRUD Operations
// -----------------------------------------------------------------------------

/**
 * List all threads for a user (sorted by updatedAt desc)
 */
export async function listUserThreads(userId: string): Promise<FirestoreThread[]> {
    const q = query(
        getUserThreadsCollection(userId),
        orderBy('updatedAt', 'desc'),
        limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as FirestoreThread));
}

/**
 * Get a specific thread by ID
 */
export async function getThread(userId: string, threadId: string): Promise<FirestoreThread | null> {
    const docRef = doc(getUserThreadsCollection(userId), threadId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as FirestoreThread;
}

/**
 * Create or update a thread
 */
export async function upsertThread(
    userId: string,
    threadId: string,
    data: Partial<Omit<FirestoreThread, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
    const docRef = doc(getUserThreadsCollection(userId), threadId);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } else {
        await setDoc(docRef, {
            ...data,
            ownerId: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'active',
            messageCount: 0
        });
    }
}

/**
 * Delete a thread and all its messages
 */
export async function deleteThread(userId: string, threadId: string): Promise<void> {
    // Note: In production, use a Cloud Function to delete subcollections
    const docRef = doc(getUserThreadsCollection(userId), threadId);
    await deleteDoc(docRef);
}

/**
 * Save messages to a thread
 */
export async function saveThreadMessages(
    userId: string,
    threadId: string,
    messages: ChatMessage[]
): Promise<void> {
    const messagesRef = getThreadMessagesCollection(userId, threadId);

    // Batch write messages
    for (const msg of messages) {
        const msgDoc = doc(messagesRef, msg.id || `msg_${Date.now()}`);
        await setDoc(msgDoc, {
            type: msg.type,
            content: msg.content,
            createdAt: serverTimestamp()
        });
    }

    // Update thread message count
    await upsertThread(userId, threadId, {
        messageCount: messages.length
    });
}

/**
 * Load messages from a thread
 */
export async function loadThreadMessages(
    userId: string,
    threadId: string
): Promise<ChatMessage[]> {
    const q = query(
        getThreadMessagesCollection(userId, threadId),
        orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type,
        content: doc.data().content
    }) as ChatMessage);
}

// -----------------------------------------------------------------------------
// Real-time Subscriptions
// -----------------------------------------------------------------------------

/**
 * Subscribe to thread list updates
 */
export function subscribeToThreads(
    userId: string,
    callback: (threads: FirestoreThread[]) => void
): () => void {
    const q = query(
        getUserThreadsCollection(userId),
        orderBy('updatedAt', 'desc'),
        limit(100)
    );

    return onSnapshot(q, (snapshot) => {
        const threads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as FirestoreThread));
        callback(threads);
    });
}
