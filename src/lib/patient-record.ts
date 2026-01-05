// ═══════════════════════════════════════════════════════════════
// EXPEDIENTE MÉDICO DIGITAL DE PACIENTE - SARKOME
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// DATOS PERSONALES (Identidad del paciente)
// ─────────────────────────────────────────────────────────────────
export type PatientIdentity = {
  firstName: string;                // Nombre
  lastName: string;                 // Apellido
  secondLastName?: string;          // Segundo apellido (opcional)
  patientId?: string;               // Número de expediente / ID interno
  dateOfBirth: string;              // YYYY-MM-DD
  sex: 'M' | 'F' | 'Other';
  heightCm?: number;                // Altura en cm
  weightKg?: number;                // Peso en kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  email?: string;
  phone?: string;
  photoUrl?: string;
};

// ─────────────────────────────────────────────────────────────────
// DIAGNÓSTICO ONCOLÓGICO
// ─────────────────────────────────────────────────────────────────
export type OncologyDiagnosis = {
  cancerType: string;               // Ej: "Leiomyosarcoma"
  cancerSubtype?: string;           // Ej: "NSCLC"
  primarySite: string;              // Ej: "Útero"
  stage?: string;                   // Ej: "IIIA"
  tnmT?: string;                    // T1, T2, T3, T4
  tnmN?: string;                    // N0, N1, N2, N3
  tnmM?: string;                    // M0, M1
  histology?: string;               // Tipo histológico
  grade?: string;                   // G1, G2, G3
  dateOfDiagnosis: string;          // YYYY-MM-DD
  dateOfFirstSymptoms?: string;
  metastasisSites?: string[];       // ["Hígado", "Pulmón"]
  diagnosticNotes?: string;
};

// ─────────────────────────────────────────────────────────────────
// DOCUMENTOS MÉDICOS
// ─────────────────────────────────────────────────────────────────
export type DocumentType = 'pdf' | 'image' | 'vcf' | 'csv' | 'txt' | 'other';

export type DocumentCategory =
  | 'lab_blood' | 'lab_tumor_markers' | 'pathology_biopsy' | 'pathology_ihc'
  | 'genomic_ngs' | 'genomic_wes' | 'genomic_vcf' | 'imaging_ct'
  | 'imaging_pet' | 'imaging_mri' | 'imaging_xray' | 'imaging_ultrasound'
  | 'clinical_note' | 'clinical_summary' | 'referral' | 'other';

export type MedicalDocument = {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  documentDate: string;
  uploadedAt: number;
  mimeType: string;
  sizeBytes: number;
  base64Data?: string;
  storageUrl?: string;
  extractedText?: string;
  extractedData?: Record<string, any>;
  notes?: string;
};

// ─────────────────────────────────────────────────────────────────
// LABORATORIOS
// ─────────────────────────────────────────────────────────────────
export type LabValue = {
  name: string;
  value: number | string;
  unit: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  interpretation?: string;
};

export type LabResult = {
  id: string;
  date: string;
  category: 'blood' | 'tumor_markers' | 'chemistry' | 'other';
  values: LabValue[];
  sourceDocumentId?: string;
};

// ─────────────────────────────────────────────────────────────────
// PERFIL GENÓMICO
// ─────────────────────────────────────────────────────────────────
export type GeneVariant = {
  gene: string;
  variant?: string;
  hgvs?: string;
  type: 'snv' | 'indel' | 'cnv' | 'fusion' | 'rearrangement' | 'other';
  pathogenicity: 'pathogenic' | 'likely_pathogenic' | 'vus' | 'likely_benign' | 'benign';
  vaf?: number;
  clinicalSignificance?: string;
  actionability?: 'tier1' | 'tier2' | 'tier3' | 'none';
  associatedDrugs?: string[];
  cosmicId?: string;
  dbSnpId?: string;
  clinvarId?: string;
};

export type GenomicProfile = {
  studyDate: string;
  studyType: 'ngs_panel' | 'wes' | 'wgs' | 'pcr' | 'fish' | 'other';
  laboratory?: string;
  variants: GeneVariant[];
  tmb?: number;
  msi?: 'MSI-H' | 'MSI-L' | 'MSS';
  pdl1Tps?: number;
  pdl1Cps?: number;
  sourceDocumentId?: string;
  fullReportText?: string;
};

// ─────────────────────────────────────────────────────────────────
// TRATAMIENTOS
// ─────────────────────────────────────────────────────────────────
export type AdverseEvent = {
  name: string;
  grade: 1 | 2 | 3 | 4 | 5;
  startDate?: string;
  resolvedDate?: string;
  management?: string;
};

export type Treatment = {
  id: string;
  type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted' | 'immunotherapy' | 'hormone' | 'other';
  name: string;
  regimen?: string;
  dose?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  cyclesPlanned?: number;
  cyclesCompleted?: number;
  bestResponse?: 'CR' | 'PR' | 'SD' | 'PD' | 'NE';
  responseDate?: string;
  adverseEvents?: AdverseEvent[];
  discontinuationReason?: 'completed' | 'progression' | 'toxicity' | 'patient_decision' | 'other';
  notes?: string;
};

// ─────────────────────────────────────────────────────────────────
// COMORBILIDADES
// ─────────────────────────────────────────────────────────────────
export type Comorbidity = {
  name: string;
  icdCode?: string;
  dateOfDiagnosis?: string;
  status: 'active' | 'controlled' | 'resolved';
  notes?: string;
};

export type ChronicMedication = {
  name: string;
  dose: string;
  indication: string;
  startDate?: string;
};

// ─────────────────────────────────────────────────────────────────
// HIPÓTESIS
// ─────────────────────────────────────────────────────────────────
export type Citation = {
  pmid?: string;
  doi?: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  url?: string;
};

export type Hypothesis = {
  id: string;
  createdAt: number;
  updatedAt: number;
  claim: string;
  type: 'drug_repurposing' | 'target_therapy' | 'mechanism' | 'biomarker' | 'clinical_trial' | 'other';
  mechanism?: string;
  kgEntities?: string[];
  kgPaths?: any[];
  citations?: Citation[];
  confidence: 'high' | 'medium' | 'low';
  status: 'generated' | 'reviewing' | 'validated' | 'rejected' | 'actionable';
  nextSteps?: string[];
  sourceThreadId?: string;
  physicianNotes?: string;
};

// ─────────────────────────────────────────────────────────────────
// EXPEDIENTE COMPLETO
// ─────────────────────────────────────────────────────────────────
export type PatientRecord = {
  id: string;
  createdAt: number;
  updatedAt: number;
  identity: PatientIdentity;
  diagnosis: OncologyDiagnosis;
  documents: MedicalDocument[];
  labResults: LabResult[];
  genomicProfiles: GenomicProfile[];
  treatments: Treatment[];
  comorbidities: Comorbidity[];
  chronicMedications: ChronicMedication[];
  hypotheses: Hypothesis[];
  threadIds: string[];
  owner?: string;
  collaborators?: string[];
  tags?: string[];
  notes?: string;
};

// ═══════════════════════════════════════════════════════════════
// STORAGE LOGIC (LocalStorage)
// ═══════════════════════════════════════════════════════════════

const PATIENTS_KEY = "sarkome.patients.v1";
const ACTIVE_PATIENT_KEY = "sarkome.activePatientId.v1";

export function listPatients(): PatientRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PATIENTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing patients from localStorage", e);
    return [];
  }
}

export function getPatient(id: string): PatientRecord | null {
  const patients = listPatients();
  return patients.find(p => p.id === id) || null;
}

export function upsertPatient(patient: PatientRecord): void {
  if (typeof window === 'undefined') return;
  const patients = listPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index >= 0) {
    patients[index] = { ...patient, updatedAt: Date.now() };
  } else {
    patients.push({ ...patient, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  window.dispatchEvent(new CustomEvent('sarkome:patients', { detail: { action: 'upsert', patientId: patient.id } }));
}

export function deletePatient(id: string): void {
  if (typeof window === 'undefined') return;
  const patients = listPatients().filter(p => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  
  if (getActivePatientId() === id) {
    setActivePatientId(null);
  }
  
  window.dispatchEvent(new CustomEvent('sarkome:patients', { detail: { action: 'delete', patientId: id } }));
}

export function getActivePatientId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PATIENT_KEY);
}

export function setActivePatientId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_PATIENT_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PATIENT_KEY);
  }
  window.dispatchEvent(new CustomEvent('sarkome:activePatient', { detail: { patientId: id } }));
}

export function createPatientId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function getPatientFullName(patient: PatientRecord): string {
  const { firstName, lastName, secondLastName } = patient.identity;
  return [firstName, lastName, secondLastName].filter(Boolean).join(' ');
}

export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg) return 0;
  return weightKg / ((heightCm / 100) ** 2);
}
