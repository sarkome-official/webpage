/**
 * Patient Storage Manager
 * ----------------------
 * Hybrid storage that syncs between localStorage and Firestore.
 * Provides offline-first behavior with cloud sync.
 */

import * as localPatients from './patient-record';
import * as firestorePatients from './firestore-patients';
import { auth } from './firebase';
import type { PatientRecord } from './patient-record';

// -----------------------------------------------------------------------------
// Storage Strategy
// -----------------------------------------------------------------------------

type StorageMode = 'local' | 'firestore' | 'hybrid';

function getStorageMode(): StorageMode {
    const user = auth.currentUser;
    if (!user) return 'local';
    return 'hybrid';
}

// -----------------------------------------------------------------------------
// Unified API
// -----------------------------------------------------------------------------

export async function listPatients(): Promise<PatientRecord[]> {
    const mode = getStorageMode();

    if (mode === 'local') {
        return localPatients.listPatients();
    }

    const userId = auth.currentUser?.uid;
    if (!userId) return localPatients.listPatients();

    try {
        const firestoreList = await firestorePatients.listPatients(userId);
        // If no patients in firestore yet, maybe try migrating? 
        // For now, just return what we have in Firestore if successful
        return firestoreList;
    } catch (err) {
        console.warn('[PatientManager] Firestore unavailable, falling back to localStorage');
        return localPatients.listPatients();
    }
}

export async function getPatient(patientId: string): Promise<PatientRecord | null> {
    const mode = getStorageMode();
    const userId = auth.currentUser?.uid;

    if (mode === 'local' || !userId) {
        return localPatients.getPatient(patientId);
    }

    try {
        const patient = await firestorePatients.getPatient(patientId);
        if (patient) return patient;
        return localPatients.getPatient(patientId);
    } catch {
        return localPatients.getPatient(patientId);
    }
}

export async function upsertPatient(patient: PatientRecord): Promise<void> {
    const mode = getStorageMode();
    const userId = auth.currentUser?.uid;

    // Always save locally first (offline-first)
    localPatients.upsertPatient(patient);

    // Sync to Firestore if available
    if ((mode === 'firestore' || mode === 'hybrid') && userId) {
        try {
            await firestorePatients.upsertPatient(patient, userId);
        } catch (err) {
            console.warn('[PatientManager] Failed to sync to Firestore:', err);
        }
    }
}

export async function deletePatient(patientId: string): Promise<void> {
    const userId = auth.currentUser?.uid;

    // Delete from local
    localPatients.deletePatient(patientId);

    // Delete from Firestore
    if (userId) {
        try {
            await firestorePatients.deletePatient(patientId);
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

    const localList = localPatients.listPatients();
    let migrated = 0;

    for (const patient of localList) {
        try {
            await firestorePatients.upsertPatient(patient, userId);
            migrated++;
        } catch (err) {
            console.error(`[Migration] Failed to migrate patient ${patient.id}:`, err);
        }
    }

    return migrated;
}
