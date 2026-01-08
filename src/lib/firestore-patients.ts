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
