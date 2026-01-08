# Remediation Plan: Frontend Firebase Integration

> **Module:** `sarkome_frontend_react`
> **Priority:** P1 (Critical for Data Persistence)
> **Estimated Time:** 3-5 days
> **Dependencies:** Firebase project deployed (already done via `sarkome_firebase/`)

---

## Executive Summary

This plan addresses the critical gap where the frontend stores all data in `localStorage` instead of Firebase Firestore. While the infrastructure exists (deployed via Pulumi), the frontend SDK is not installed or configured.

### Current State
- Threads stored in `localStorage` via `lib/local-threads.ts`
- Patients stored in `localStorage` via `lib/patient-record.ts`
- Auth handled by custom JWT via Vercel Edge Functions
- No Firebase SDK installed

### Target State
- Threads synced to Firestore with offline-first capability
- Patients synced to Firestore with real-time updates
- Auth migrated to Firebase Authentication (Phase 3)
- Cross-device data synchronization

---

## Phase 1: Firebase SDK Setup (Day 1)

### Step 1.1: Install Dependencies

```bash
cd sarkome_frontend_react
npm install firebase
```

**Packages:**
| Package | Purpose |
|---------|---------|
| `firebase` | Core SDK (Auth, Firestore, Analytics) |

### Step 1.2: Create Firebase Configuration

Create `src/lib/firebase.ts`:

```typescript
/**
 * Firebase Configuration
 * ----------------------
 * Initializes Firebase SDK for the Sarkome frontend.
 * Uses environment variables for configuration.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sarkome',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] Browser does not support persistence');
    }
  });
}

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
```

### Step 1.3: Update Environment Variables

Add to `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=sarkome.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sarkome
VITE_FIREBASE_STORAGE_BUCKET=sarkome.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Development
VITE_USE_FIREBASE_EMULATOR=false
```

### Step 1.4: Validation Checkpoint

```typescript
// Test in browser console
import { db } from '@/lib/firebase';
console.log('Firestore initialized:', db.type); // Should print 'firestore'
```

---

## Phase 2: Firestore Threads Migration (Days 2-3)

### Step 2.1: Create Firestore Threads Service

Create `src/lib/firestore-threads.ts`:

```typescript
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
  where, 
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

export interface ThreadMessage {
  id: string;
  type: 'human' | 'ai' | 'system';
  content: string;
  createdAt: Timestamp;
}

// -----------------------------------------------------------------------------
// Collection References
// -----------------------------------------------------------------------------

const getUserThreadsCollection = (userId: string) => 
  collection(db, 'users', userId, 'chat_threads');

const getPatientThreadsCollection = (patientId: string) => 
  collection(db, 'patients', patientId, 'chat_threads');

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
  }));
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
```

### Step 2.2: Create Hybrid Storage Manager

Create `src/lib/thread-storage-manager.ts`:

```typescript
/**
 * Thread Storage Manager
 * ----------------------
 * Hybrid storage that syncs between localStorage and Firestore.
 * Provides offline-first behavior with cloud sync.
 */

import * as localThreads from './local-threads';
import * as firestoreThreads from './firestore-threads';
import { auth } from './firebase';
import type { ChatMessage } from './chat-types';

// -----------------------------------------------------------------------------
// Storage Strategy
// -----------------------------------------------------------------------------

type StorageMode = 'local' | 'firestore' | 'hybrid';

function getStorageMode(): StorageMode {
  const user = auth.currentUser;
  if (!user) return 'local';
  
  // TODO: Check user preference or feature flag
  return 'hybrid';
}

// -----------------------------------------------------------------------------
// Unified API
// -----------------------------------------------------------------------------

export async function listThreads() {
  const mode = getStorageMode();
  
  if (mode === 'local') {
    return localThreads.listThreads();
  }
  
  const userId = auth.currentUser?.uid;
  if (!userId) return localThreads.listThreads();
  
  try {
    const firestoreList = await firestoreThreads.listUserThreads(userId);
    
    // Convert Firestore format to local format
    return firestoreList.map(t => ({
      id: t.id,
      title: t.title,
      patientId: t.patientId,
      createdAt: t.createdAt.toMillis(),
      updatedAt: t.updatedAt.toMillis(),
      messages: [] // Loaded on demand
    }));
  } catch (err) {
    console.warn('[ThreadManager] Firestore unavailable, falling back to localStorage');
    return localThreads.listThreads();
  }
}

export async function getThread(threadId: string) {
  const mode = getStorageMode();
  const userId = auth.currentUser?.uid;
  
  if (mode === 'local' || !userId) {
    return localThreads.getThread(threadId);
  }
  
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
        messages
      };
    }
    // Fallback to local
    return localThreads.getThread(threadId);
  } catch {
    return localThreads.getThread(threadId);
  }
}

export async function saveThread(
  threadId: string, 
  title: string, 
  messages: ChatMessage[],
  patientId?: string
) {
  const mode = getStorageMode();
  const userId = auth.currentUser?.uid;
  
  // Always save locally first (offline-first)
  localThreads.upsertThread({
    id: threadId,
    title,
    patientId,
    messages,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  
  // Sync to Firestore if available
  if ((mode === 'firestore' || mode === 'hybrid') && userId) {
    try {
      await firestoreThreads.upsertThread(userId, threadId, { title, patientId });
      await firestoreThreads.saveThreadMessages(userId, threadId, messages);
    } catch (err) {
      console.warn('[ThreadManager] Failed to sync to Firestore:', err);
      // Data is safe in localStorage, will sync later
    }
  }
}

export async function deleteThread(threadId: string) {
  const userId = auth.currentUser?.uid;
  
  // Delete from local
  localThreads.deleteThread(threadId);
  
  // Delete from Firestore
  if (userId) {
    try {
      await firestoreThreads.deleteThread(userId, threadId);
    } catch {
      // Ignore errors
    }
  }
}

// -----------------------------------------------------------------------------
// Migration Helper
// -----------------------------------------------------------------------------

export async function migrateLocalToFirestore(): Promise<number> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User must be authenticated to migrate');
  
  const localList = localThreads.listThreads();
  let migrated = 0;
  
  for (const thread of localList) {
    try {
      await firestoreThreads.upsertThread(userId, thread.id, {
        title: thread.title,
        patientId: thread.patientId
      });
      
      if (thread.messages && thread.messages.length > 0) {
        await firestoreThreads.saveThreadMessages(userId, thread.id, thread.messages);
      }
      
      migrated++;
    } catch (err) {
      console.error(`[Migration] Failed to migrate thread ${thread.id}:`, err);
    }
  }
  
  return migrated;
}
```

### Step 2.3: Update AgentContext

Modify `src/contexts/AgentContext.tsx` to use the new storage manager:

```typescript
// Replace imports
import * as threadStorage from '@/lib/thread-storage-manager';

// Update the useEffect that saves messages
useEffect(() => {
  if (thread.messages.length > 0) {
    const title = deriveThreadTitle(thread.messages);
    
    // Use async storage (fire and forget)
    threadStorage.saveThread(
      activeThreadId,
      title,
      thread.messages,
      patientId
    ).catch(err => console.error('[AgentContext] Save failed:', err));
  }
}, [thread.messages, activeThreadId, patientId]);
```

---

## Phase 3: Firestore Patients Migration (Day 4)

### Step 3.1: Create Firestore Patients Service

Create `src/lib/firestore-patients.ts`:

```typescript
/**
 * Firestore Patients Service
 * --------------------------
 * Syncs patient records to Firestore with security rules enforcement.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { PatientRecord } from './patient-record';

// -----------------------------------------------------------------------------
// Collection Reference
// -----------------------------------------------------------------------------

const patientsCollection = collection(db, 'patients');

// -----------------------------------------------------------------------------
// CRUD Operations
// -----------------------------------------------------------------------------

export async function listPatients(ownerId: string): Promise<PatientRecord[]> {
  const q = query(
    patientsCollection,
    where('ownerId', '==', ownerId),
    orderBy('updatedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis() || Date.now(),
    updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
  } as PatientRecord));
}

export async function getPatient(patientId: string): Promise<PatientRecord | null> {
  const docRef = doc(patientsCollection, patientId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toMillis() || Date.now(),
    updatedAt: snapshot.data().updatedAt?.toMillis() || Date.now()
  } as PatientRecord;
}

export async function upsertPatient(patient: PatientRecord, ownerId: string): Promise<void> {
  const docRef = doc(patientsCollection, patient.id);
  const existing = await getDoc(docRef);
  
  const { createdAt, updatedAt, ...patientData } = patient;
  
  if (existing.exists()) {
    await setDoc(docRef, {
      ...patientData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } else {
    await setDoc(docRef, {
      ...patientData,
      ownerId,
      collaboratorIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

export async function deletePatient(patientId: string): Promise<void> {
  const docRef = doc(patientsCollection, patientId);
  await deleteDoc(docRef);
}

// -----------------------------------------------------------------------------
// Real-time Subscription
// -----------------------------------------------------------------------------

export function subscribeToPatients(
  ownerId: string,
  callback: (patients: PatientRecord[]) => void
): () => void {
  const q = query(
    patientsCollection,
    where('ownerId', '==', ownerId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis() || Date.now(),
      updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
    } as PatientRecord));
    callback(patients);
  });
}
```

### Step 3.2: Create Patient Storage Manager

Apply the same hybrid pattern as threads (omitted for brevity, same structure as `thread-storage-manager.ts`).

---

## Phase 4: Testing & Validation (Day 5)

### Step 4.1: Unit Tests

Create `src/lib/__tests__/firestore-threads.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  listUserThreads, 
  upsertThread, 
  deleteThread 
} from '../firestore-threads';

// Use Firebase emulator for testing
describe('Firestore Threads', () => {
  const testUserId = 'test-user-123';
  
  beforeEach(async () => {
    // Clear test data
  });
  
  it('should create and retrieve a thread', async () => {
    const threadId = `thread_${Date.now()}`;
    
    await upsertThread(testUserId, threadId, {
      title: 'Test Thread',
      ownerId: testUserId
    });
    
    const threads = await listUserThreads(testUserId);
    expect(threads.find(t => t.id === threadId)).toBeTruthy();
  });
});
```

### Step 4.2: Manual Testing Checklist

- [ ] Create new thread (should appear in Firestore)
- [ ] Send message (should sync to Firestore)
- [ ] Refresh page (should load from Firestore)
- [ ] Open in another browser (should see same threads)
- [ ] Go offline (should still work with localStorage)
- [ ] Come back online (should sync pending changes)
- [ ] Delete thread (should remove from both storages)

### Step 4.3: Migration Dry Run

```typescript
// Run in browser console to test migration
import { migrateLocalToFirestore } from '@/lib/thread-storage-manager';

const count = await migrateLocalToFirestore();
console.log(`Migrated ${count} threads to Firestore`);
```

---

## Rollback Plan

If issues are detected:

1. Set `VITE_USE_FIRESTORE=false` in environment
2. The hybrid manager will fall back to localStorage only
3. Data in localStorage is never deleted during migration

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Firestore write latency | < 500ms |
| Offline capability | 100% functional |
| Data sync on reconnect | < 5 seconds |
| Zero data loss during migration | 100% |

---

## Next Steps After Completion

1. Proceed to **Phase 3: Unify Auth** to migrate from JWT to Firebase Auth
2. Enable real-time collaboration features
3. Implement backup/export functionality

---

> **END OF REMEDIATION PLAN: FRONTEND FIREBASE INTEGRATION**
