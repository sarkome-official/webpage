# Sarkome — Patient Digital Record + AI
## Expedientes de Paciente con Inteligencia Oncológica

---

## 🎯 Visión del Producto

**Sarkome Patient Record** = El expediente médico digital de UN PACIENTE REAL que alimenta al LLM con todo su contexto:

### Datos del Paciente (Identidad Completa)
- **Personales**: Nombre, apellido, fecha de nacimiento, sexo, altura, peso, IMC
- **Contacto**: Teléfono, email, dirección (opcional)
- **Seguro/ID**: Número de paciente, aseguradora

### Documentos Médicos (Archivos Subidos)
- **Laboratorios**: Hemogramas, química sanguínea, marcadores tumorales (PDF/imagen)
- **Patología**: Biopsias, inmunohistoquímica, reportes de patología
- **Genómica**: Paneles NGS, WES/WGS, VCF files
- **Imágenes**: TAC, PET-CT, MRI (reportes, no DICOM por ahora)
- **Otros**: Notas clínicas, resúmenes de hospitalización, cartas de referencia

### Datos Estructurados (Formularios)
- **Diagnóstico**: Tipo de cáncer, estadio TNM, fecha de diagnóstico
- **Historial de tratamientos**: Cirugías, quimioterapia, radioterapia, inmunoterapia
- **Respuestas**: RECIST, marcadores, eventos adversos
- **Comorbilidades**: Otras enfermedades, medicamentos crónicos

### Inteligencia (Lo que genera Sarkome)
- **Chats contextualizados**: El LLM "conoce" TODO del paciente
- **Hipótesis personalizadas**: Basadas en SU perfil molecular + historial
- **Evidencia trazable**: PrimeKG + literatura + estructuras

> **Analogía**: Es como tener un **oncólogo AI personal** que ha leído y memorizado TODA la historia clínica del paciente, y puede responder preguntas, generar hipótesis y sugerir tratamientos basados en evidencia.

---

## 🔑 Coexistencia: Chats vs. Expedientes

El sistema está diseñado para que ambos coexistan de forma independiente o vinculada:

1.  **Chats Generales (Independientes)**:
    *   Funcionan como hasta ahora.
    *   No requieren un paciente.
    *   Ideales para investigación rápida, consultas generales o exploración de literatura.
    *   Se guardan en el historial general.

2.  **Expedientes de Paciente (Estructurados)**:
    *   Contienen toda la data clínica (Labs, Biopsias, Genómica).
    *   Pueden tener **sus propios chats vinculados** que heredan todo el contexto del expediente.
    *   Un chat iniciado dentro de un expediente se marca con el `patientId`.

3.  **Vinculación Flexible**:
    *   Puedes convertir un chat general en un chat de paciente en cualquier momento vinculándolo a un expediente existente.

---

## 📊 Estado Actual (Inventario)

### ✅ Ya tenemos
| Componente | Ubicación | Estado |
|------------|-----------|--------|
| Sistema de chats con threads | `src/lib/local-threads.ts` | Funcional (localStorage) |
| Sidebar con "Recent Chats" | `src/components/AppSidebar.tsx` | Funcional |
| Agente de razonamiento | `useAgent.ts` + LangGraph | Funcional |
| Knowledge Graph API | `src/lib/knowledge-graph-api.ts` | Funcional |
| Visualización de grafo | `KnowledgeGraphView.tsx` | Funcional |
| AlphaFold integration | `AlphaFoldView.tsx` | Funcional |
| Historial de chats | `HistoryView.tsx` | Básico |
| Auth (Google) | `AuthProvider.tsx` | Funcional |

### ❌ Falta
- **Expediente de Paciente** = entidad con TODOS sus datos médicos
- Carga de documentos (PDFs de labs, biopsias, genómica)
- Extracción automática de datos de documentos
- Persistencia en backend (hoy todo es localStorage)
- Exportación de reportes
- Colaboración entre médicos

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│                     SARKOME PATIENT WORKSPACE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────────────────────────────┐   │
│  │   SIDEBAR    │    │         PATIENT RECORD VIEW          │   │
│  │              │    │                                      │   │
│  │ ┌──────────┐ │    │  ┌────────────────────────────────┐  │   │
│  │ │ Patients │ │    │  │  JUAN PÉREZ GARCÍA (58, M)     │  │   │
│  │ │ (lista)  │ │    │  │  Dx: Leiomyosarcoma Stage IIIA │  │   │
│  │ │          │ │    │  └────────────────────────────────┘  │   │
│  │ │ • Juan P │ │    │                                      │   │
│  │ │ • María R│ │    │  ┌─────┬──────┬──────┬──────┬─────┐  │   │
│  │ │ • Carlos │ │    │  │Info │ Labs │Biopsy│Genomic│Chat │  │   │
│  │ │          │ │    │  └─────┴──────┴──────┴──────┴─────┘  │   │
│  │ │ + Nuevo  │ │    │                                      │   │
│  │ └──────────┘ │    │  [Tab Content: documentos, datos,    │   │
│  │              │    │   formularios, archivos subidos]     │   │
│  │ ┌──────────┐ │    │                                      │   │
│  │ │ Tools    │ │    └──────────────────────────────────────┘   │
│  │ │ • KG     │ │                                               │
│  │ │ • Alpha  │ │    ┌──────────────────────────────────────┐   │
│  │ │ • API    │ │    │         CHAT (contexto total)        │   │
│  │ └──────────┘ │    │  "Dado el perfil de Juan, ¿qué       │   │
│  └──────────────┘    │   opciones de tratamiento hay?"      │   │
│                      └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📅 FASES DE IMPLEMENTACIÓN

---

## FASE 0: Preparación (1-2 días)
> **Objetivo**: Definir la estructura de datos del EXPEDIENTE DE PACIENTE completo.

### Paso 0.1: Definir tipos de datos
**Archivo**: `src/lib/patient-record.ts`

```typescript
// ═══════════════════════════════════════════════════════════════
// EXPEDIENTE MÉDICO DIGITAL DE PACIENTE
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// DATOS PERSONALES (Identidad del paciente)
// ─────────────────────────────────────────────────────────────────
export type PatientIdentity = {
  // Identificación
  firstName: string;                // Nombre
  lastName: string;                 // Apellido
  secondLastName?: string;          // Segundo apellido (opcional)
  patientId?: string;               // Número de expediente / ID interno
  
  // Demográficos
  dateOfBirth: string;              // YYYY-MM-DD
  sex: 'M' | 'F' | 'Other';
  
  // Físicos
  heightCm?: number;                // Altura en cm
  weightKg?: number;                // Peso en kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  
  // Contacto (opcional, para recordatorios/seguimiento)
  email?: string;
  phone?: string;
  
  // Foto (base64 o URL)
  photoUrl?: string;
};

// ─────────────────────────────────────────────────────────────────
// DIAGNÓSTICO ONCOLÓGICO
// ─────────────────────────────────────────────────────────────────
export type OncologyDiagnosis = {
  // Diagnóstico principal
  cancerType: string;               // Ej: "Leiomyosarcoma", "Adenocarcinoma de pulmón"
  cancerSubtype?: string;           // Ej: "NSCLC", "Triple negativo"
  primarySite: string;              // Ej: "Útero", "Pulmón", "Colon"
  
  // Estadificación
  stage?: string;                   // Ej: "IIIA", "IV"
  tnmT?: string;                    // T1, T2, T3, T4
  tnmN?: string;                    // N0, N1, N2, N3
  tnmM?: string;                    // M0, M1
  
  // Histología
  histology?: string;               // Tipo histológico
  grade?: string;                   // G1, G2, G3
  
  // Fechas
  dateOfDiagnosis: string;          // YYYY-MM-DD
  dateOfFirstSymptoms?: string;
  
  // Metástasis
  metastasisSites?: string[];       // ["Hígado", "Pulmón", "Hueso"]
  
  // Notas del diagnóstico
  diagnosticNotes?: string;
};

// ─────────────────────────────────────────────────────────────────
// DOCUMENTOS MÉDICOS (Archivos subidos)
// ─────────────────────────────────────────────────────────────────
export type MedicalDocument = {
  id: string;
  
  // Metadata
  name: string;                     // Nombre del archivo
  type: DocumentType;
  category: DocumentCategory;
  
  // Fechas
  documentDate: string;             // Fecha del documento (no de subida)
  uploadedAt: number;               // Timestamp de subida
  
  // Almacenamiento
  mimeType: string;                 // "application/pdf", "image/png", etc.
  sizeBytes: number;
  
  // Para Fase 0-1: base64 en localStorage
  base64Data?: string;
  
  // Para Fase 2+: URL a cloud storage
  storageUrl?: string;
  
  // Texto extraído (para alimentar al LLM)
  extractedText?: string;
  
  // Datos estructurados extraídos (si aplica)
  extractedData?: Record<string, any>;
  
  // Notas del usuario
  notes?: string;
};

export type DocumentType = 
  | 'pdf' 
  | 'image' 
  | 'vcf' 
  | 'csv' 
  | 'txt' 
  | 'other';

export type DocumentCategory =
  | 'lab_blood'           // Hemograma, química sanguínea
  | 'lab_tumor_markers'   // CA-125, CEA, PSA, etc.
  | 'pathology_biopsy'    // Reporte de biopsia
  | 'pathology_ihc'       // Inmunohistoquímica
  | 'genomic_ngs'         // Panel NGS
  | 'genomic_wes'         // Whole Exome Sequencing
  | 'genomic_vcf'         // Archivo VCF
  | 'imaging_ct'          // TAC
  | 'imaging_pet'         // PET-CT
  | 'imaging_mri'         // MRI
  | 'imaging_xray'        // Rayos X
  | 'imaging_ultrasound'  // Ultrasonido
  | 'clinical_note'       // Nota clínica
  | 'clinical_summary'    // Resumen de hospitalización
  | 'referral'            // Carta de referencia
  | 'other';

// ─────────────────────────────────────────────────────────────────
// LABORATORIOS (Datos estructurados)
// ─────────────────────────────────────────────────────────────────
export type LabResult = {
  id: string;
  date: string;                     // YYYY-MM-DD
  category: 'blood' | 'tumor_markers' | 'chemistry' | 'other';
  
  // Valores individuales
  values: LabValue[];
  
  // Documento fuente (si fue subido)
  sourceDocumentId?: string;
};

export type LabValue = {
  name: string;                     // Ej: "Hemoglobina", "CA-125"
  value: number | string;
  unit: string;                     // Ej: "g/dL", "U/mL"
  referenceRange?: string;          // Ej: "12.0 - 16.0"
  isAbnormal?: boolean;
  interpretation?: string;
};

// ─────────────────────────────────────────────────────────────────
// PERFIL GENÓMICO / MOLECULAR
// ─────────────────────────────────────────────────────────────────
export type GenomicProfile = {
  // Fecha del estudio
  studyDate: string;
  studyType: 'ngs_panel' | 'wes' | 'wgs' | 'pcr' | 'fish' | 'other';
  laboratory?: string;              // Ej: "Foundation Medicine", "Guardant"
  
  // Variantes detectadas
  variants: GeneVariant[];
  
  // Biomarcadores
  tmb?: number;                     // Tumor Mutational Burden (mut/Mb)
  msi?: 'MSI-H' | 'MSI-L' | 'MSS';  // Microsatellite Instability
  
  // Expresión (si aplica)
  pdl1Tps?: number;                 // PD-L1 TPS %
  pdl1Cps?: number;                 // PD-L1 CPS
  
  // Documento fuente
  sourceDocumentId?: string;
  
  // Reporte completo (texto)
  fullReportText?: string;
};

export type GeneVariant = {
  gene: string;                     // Ej: "TP53"
  variant?: string;                 // Ej: "R273H", "p.Arg273His"
  hgvs?: string;                    // Nomenclatura HGVS
  
  type: 'snv' | 'indel' | 'cnv' | 'fusion' | 'rearrangement' | 'other';
  
  // Clasificación
  pathogenicity: 'pathogenic' | 'likely_pathogenic' | 'vus' | 'likely_benign' | 'benign';
  
  // Frecuencia alélica
  vaf?: number;                     // Variant Allele Frequency (0-1)
  
  // Implicaciones clínicas
  clinicalSignificance?: string;
  actionability?: 'tier1' | 'tier2' | 'tier3' | 'none';
  associatedDrugs?: string[];       // Fármacos asociados
  
  // Referencias
  cosmicId?: string;
  dbSnpId?: string;
  clinvarId?: string;
};

// ─────────────────────────────────────────────────────────────────
// HISTORIAL DE TRATAMIENTOS
// ─────────────────────────────────────────────────────────────────
export type Treatment = {
  id: string;
  
  // Tipo de tratamiento
  type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted' | 'immunotherapy' | 'hormone' | 'other';
  
  // Detalles
  name: string;                     // Ej: "Doxorrubicina + Ifosfamida", "Pembrolizumab"
  regimen?: string;                 // Ej: "AI q3w", "Nivo + Ipi"
  dose?: string;                    // Ej: "75 mg/m²"
  
  // Fechas
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  
  // Ciclos (para quimio)
  cyclesPlanned?: number;
  cyclesCompleted?: number;
  
  // Respuesta
  bestResponse?: 'CR' | 'PR' | 'SD' | 'PD' | 'NE';  // RECIST
  responseDate?: string;
  
  // Eventos adversos
  adverseEvents?: AdverseEvent[];
  
  // Motivo de discontinuación
  discontinuationReason?: 'completed' | 'progression' | 'toxicity' | 'patient_decision' | 'other';
  
  // Notas
  notes?: string;
};

export type AdverseEvent = {
  name: string;                     // Ej: "Neutropenia", "Fatiga"
  grade: 1 | 2 | 3 | 4 | 5;         // CTCAE grade
  startDate?: string;
  resolvedDate?: string;
  management?: string;
};

// ─────────────────────────────────────────────────────────────────
// COMORBILIDADES Y MEDICACIÓN CRÓNICA
// ─────────────────────────────────────────────────────────────────
export type Comorbidity = {
  name: string;                     // Ej: "Diabetes tipo 2", "Hipertensión"
  icdCode?: string;
  dateOfDiagnosis?: string;
  status: 'active' | 'controlled' | 'resolved';
  notes?: string;
};

export type ChronicMedication = {
  name: string;                     // Ej: "Metformina"
  dose: string;                     // Ej: "850 mg BID"
  indication: string;               // Ej: "Diabetes"
  startDate?: string;
};

// ─────────────────────────────────────────────────────────────────
// HIPÓTESIS GENERADAS POR SARKOME
// ─────────────────────────────────────────────────────────────────
export type Hypothesis = {
  id: string;
  createdAt: number;
  updatedAt: number;
  
  // Claim
  claim: string;                    // "TP53 R273H podría responder a APR-246"
  type: 'drug_repurposing' | 'target_therapy' | 'mechanism' | 'biomarker' | 'clinical_trial' | 'other';
  
  // Evidencia
  kgEntities?: string[];            // IDs de entidades en PrimeKG
  kgPaths?: any[];                  // Rutas en el grafo
  citations?: Citation[];
  confidence: 'high' | 'medium' | 'low';
  
  // Estado
  status: 'generated' | 'reviewing' | 'validated' | 'rejected' | 'actionable';
  
  // Acciones sugeridas
  nextSteps?: string[];
  
  // Chat que la generó
  sourceThreadId?: string;
  
  // Notas del médico
  physicianNotes?: string;
};

export type Citation = {
  pmid?: string;
  doi?: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  url?: string;
};

// ─────────────────────────────────────────────────────────────────
// EXPEDIENTE COMPLETO DEL PACIENTE
// ─────────────────────────────────────────────────────────────────
export type PatientRecord = {
  id: string;
  createdAt: number;
  updatedAt: number;
  
  // ═══ IDENTIDAD ═══
  identity: PatientIdentity;
  
  // ═══ DIAGNÓSTICO ONCOLÓGICO ═══
  diagnosis: OncologyDiagnosis;
  
  // ═══ DOCUMENTOS MÉDICOS ═══
  documents: MedicalDocument[];
  
  // ═══ LABORATORIOS ═══
  labResults: LabResult[];
  
  // ═══ PERFIL GENÓMICO ═══
  genomicProfiles: GenomicProfile[];
  
  // ═══ TRATAMIENTOS ═══
  treatments: Treatment[];
  
  // ═══ COMORBILIDADES ═══
  comorbidities: Comorbidity[];
  chronicMedications: ChronicMedication[];
  
  // ═══ INTELIGENCIA SARKOME ═══
  hypotheses: Hypothesis[];
  threadIds: string[];              // Chats asociados a este paciente
  
  // ═══ METADATA ═══
  owner?: string;                   // userId del médico responsable
  collaborators?: string[];         // Otros médicos con acceso
  tags?: string[];
  
  // Notas generales
  notes?: string;
};
```

### Paso 0.2: Crear funciones de storage para expedientes
**Archivo**: `src/lib/patient-record.ts` (continúa)

```typescript
const PATIENTS_KEY = "sarkome.patients.v1";
const ACTIVE_PATIENT_KEY = "sarkome.activePatientId.v1";

// ═══ CRUD DE EXPEDIENTES ═══
export function listPatients(): PatientRecord[] { ... }
export function getPatient(id: string): PatientRecord | null { ... }
export function upsertPatient(patient: PatientRecord): void { ... }
export function deletePatient(id: string): void { ... }

// ═══ PACIENTE ACTIVO ═══
export function getActivePatientId(): string | null { ... }
export function setActivePatientId(id: string): void { ... }
export function createPatientId(): string { ... }

// ═══ HELPERS ═══
export function addDocumentToPatient(patientId: string, doc: MedicalDocument): void { ... }
export function addLabResultToPatient(patientId: string, lab: LabResult): void { ... }
export function addGenomicProfileToPatient(patientId: string, profile: GenomicProfile): void { ... }
export function addTreatmentToPatient(patientId: string, treatment: Treatment): void { ... }
export function addHypothesisToPatient(patientId: string, hypothesis: Hypothesis): void { ... }
export function addThreadToPatient(patientId: string, threadId: string): void { ... }

// ═══ CONTEXTO PARA LLM ═══
export function buildPatientContextForLLM(patient: PatientRecord): string {
  // Genera un resumen estructurado del paciente para inyectar en el system prompt
  // Incluye: identidad, diagnóstico, variantes, tratamientos, labs relevantes
}

export function getPatientFullName(patient: PatientRecord): string {
  const { firstName, lastName, secondLastName } = patient.identity;
  return [firstName, lastName, secondLastName].filter(Boolean).join(' ');
}

export function calculateAge(dateOfBirth: string): number {
  // Calcula edad actual
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  return weightKg / ((heightCm / 100) ** 2);
}
```

### Paso 0.3: Migrar threads existentes
- Los threads sin notebook quedan como "chats sueltos" (comportamiento actual)
- Añadir campo opcional `notebookId` a `StoredThread`

---

## FASE 1: UI de Expedientes de Paciente (3-5 días)
> **Objetivo**: Crear la interfaz del expediente médico digital.

### Paso 1.1: Sidebar con lista de Pacientes
**Archivo**: `src/components/AppSidebar.tsx`

Reemplazar "Recent Chats" genérico por lista de pacientes:
```
👤 Mis Pacientes
  └ Juan Pérez G. (Leiomyosarcoma)
  └ María Rodríguez (NSCLC)
  └ Carlos López (Colorectal)
  └ ➕ Nuevo Paciente
  
💬 Chats sin paciente
  └ (chats generales/exploración)
```

### Paso 1.2: Vista de Expediente de Paciente
**Archivo**: `src/pages/platform/PatientRecordView.tsx`

**Header del paciente:**
```tsx
<div className="patient-header">
  <Avatar src={patient.identity.photoUrl} />
  <div>
    <h1>{getPatientFullName(patient)}</h1>
    <p>{calculateAge(patient.identity.dateOfBirth)} años, {patient.identity.sex}</p>
    <Badge>{patient.diagnosis.cancerType} - Stage {patient.diagnosis.stage}</Badge>
  </div>
  <div className="vitals">
    <span>Altura: {patient.identity.heightCm} cm</span>
    <span>Peso: {patient.identity.weightKg} kg</span>
    <span>IMC: {calculateBMI(...).toFixed(1)}</span>
  </div>
</div>
```

**Tabs del expediente:**
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">📋 Resumen</TabsTrigger>
    <TabsTrigger value="documents">📄 Documentos ({docs.length})</TabsTrigger>
    <TabsTrigger value="labs">🧪 Laboratorios ({labs.length})</TabsTrigger>
    <TabsTrigger value="genomics">🧬 Genómica</TabsTrigger>
    <TabsTrigger value="treatments">💊 Tratamientos</TabsTrigger>
    <TabsTrigger value="hypotheses">💡 Hipótesis ({hypos.length})</TabsTrigger>
    <TabsTrigger value="chat">💬 Consultar</TabsTrigger>
  </TabsList>
  
  <TabsContent value="overview">
    <PatientOverview patient={patient} />
  </TabsContent>
  
  <TabsContent value="documents">
    <DocumentsManager patient={patient} onUpload={...} />
  </TabsContent>
  
  <TabsContent value="labs">
    <LabResultsTimeline patient={patient} />
  </TabsContent>
  
  <TabsContent value="genomics">
    <GenomicProfileView patient={patient} />
  </TabsContent>
  
  <TabsContent value="treatments">
    <TreatmentTimeline patient={patient} />
  </TabsContent>
  
  <TabsContent value="hypotheses">
    <HypothesesList patient={patient} />
  </TabsContent>
  
  <TabsContent value="chat">
    <PatientChat patient={patient} />
    {/* Chat con contexto TOTAL del paciente */}
  </TabsContent>
</Tabs>
```

### Paso 1.3: Tab "Resumen" (Overview)
Vista rápida con cards:
- **Diagnóstico**: Tipo, estadio, fecha, sitios de metástasis
- **Perfil Molecular**: Top variantes, TMB, MSI, PD-L1
- **Tratamiento Actual**: Qué está recibiendo ahora
- **Últimos Labs**: Hemoglobina, marcadores tumorales (trend)
- **Hipótesis Activas**: Las más recientes/relevantes

### Paso 1.4: Tab "Documentos"
**Componente**: `src/components/DocumentsManager.tsx`

```tsx
<div className="documents-grid">
  {/* Categorías de documentos */}
  <DocumentCategory title="🔬 Laboratorios" category="lab_*" />
  <DocumentCategory title="🔬 Patología" category="pathology_*" />
  <DocumentCategory title="🧬 Genómica" category="genomic_*" />
  <DocumentCategory title="📷 Imágenes" category="imaging_*" />
  <DocumentCategory title="📝 Notas Clínicas" category="clinical_*" />
  
  {/* Drag & drop upload */}
  <DropZone onDrop={handleUpload}>
    Arrastra archivos aquí o haz clic para subir
  </DropZone>
</div>
```

Cada documento muestra:
- Nombre + fecha del documento
- Preview (si es imagen/PDF)
- Botón "Ver texto extraído"
- Botón "Preguntar sobre este documento"

### Paso 1.5: Tab "Chat" (Consulta con contexto)
**El corazón de Sarkome:**

Cuando el usuario escribe en este chat:
1. El system prompt incluye TODO el contexto del paciente
2. El LLM "conoce" todos los documentos, labs, variantes, tratamientos
3. Puede responder preguntas específicas del caso
4. Puede generar hipótesis personalizadas

```typescript
const systemPrompt = buildPatientContextForLLM(patient);
// Este string incluye:
// - Datos demográficos
// - Diagnóstico completo
// - Todas las variantes genéticas
// - Historial de tratamientos y respuestas
// - Últimos valores de lab
// - Texto extraído de documentos relevantes
```

### Paso 1.6: Formulario de Nuevo Paciente
**Componente**: `src/components/NewPatientForm.tsx`

Modal o página con formulario estructurado:
1. **Datos personales** (obligatorio): Nombre, fecha de nacimiento, sexo
2. **Datos físicos** (opcional): Altura, peso
3. **Diagnóstico** (obligatorio): Tipo de cáncer, estadio
4. **Genómica** (opcional): Subir VCF o llenar manualmente
5. **Documentos** (opcional): Subir archivos iniciales

### Paso 1.7: Routing
**Archivo**: `src/App.tsx`

```tsx
<Route path="/patient/:patientId" element={<PatientRecordView />} />
<Route path="/patient/:patientId/chat" element={<PatientChatView />} />
<Route path="/patient/:patientId/chat/:threadId" element={<PatientChatView />} />
<Route path="/patient/new" element={<NewPatientForm />} />
```

---

## FASE 2: Contexto Inteligente (5-7 días)
> **Objetivo**: El LLM "conoce" TODO del paciente y genera hipótesis personalizadas.

### Paso 2.1: Generador de Contexto para LLM
**Archivo**: `src/lib/patient-context-builder.ts`

```typescript
export function buildPatientContextForLLM(patient: PatientRecord): string {
  const { identity, diagnosis, genomicProfiles, treatments, labResults, documents } = patient;
  
  return `
## EXPEDIENTE MÉDICO DEL PACIENTE

### IDENTIFICACIÓN
- Nombre: ${getPatientFullName(patient)}
- Edad: ${calculateAge(identity.dateOfBirth)} años
- Sexo: ${identity.sex}
- Altura: ${identity.heightCm} cm | Peso: ${identity.weightKg} kg | IMC: ${calculateBMI(identity.heightCm, identity.weightKg).toFixed(1)}

### DIAGNÓSTICO ONCOLÓGICO
- Tipo: ${diagnosis.cancerType} (${diagnosis.cancerSubtype || 'N/A'})
- Sitio primario: ${diagnosis.primarySite}
- Estadio: ${diagnosis.stage} (T${diagnosis.tnmT}N${diagnosis.tnmN}M${diagnosis.tnmM})
- Grado histológico: ${diagnosis.grade}
- Fecha de diagnóstico: ${diagnosis.dateOfDiagnosis}
- Metástasis: ${diagnosis.metastasisSites?.join(', ') || 'No documentadas'}

### PERFIL MOLECULAR
${genomicProfiles.map(gp => `
**Estudio: ${gp.studyType} (${gp.studyDate})**
- TMB: ${gp.tmb ?? 'N/A'} mut/Mb
- MSI: ${gp.msi ?? 'N/A'}
- PD-L1 TPS: ${gp.pdl1Tps ?? 'N/A'}%

**Variantes detectadas:**
${gp.variants.map(v => `- ${v.gene} ${v.variant || ''} (${v.pathogenicity}) - VAF: ${v.vaf ? (v.vaf * 100).toFixed(1) + '%' : 'N/A'}`).join('\n')}
`).join('\n')}

### HISTORIAL DE TRATAMIENTOS
${treatments.map(t => `
- **${t.name}** (${t.type})
  - Período: ${t.startDate} - ${t.endDate || 'En curso'}
  - Mejor respuesta: ${t.bestResponse || 'N/A'}
  - Eventos adversos: ${t.adverseEvents?.map(ae => `${ae.name} G${ae.grade}`).join(', ') || 'Ninguno'}
`).join('\n')}

### LABORATORIOS RECIENTES
${getRecentLabsSummary(labResults)}

### DOCUMENTOS DISPONIBLES
${documents.map(d => `- [${d.category}] ${d.name} (${d.documentDate})`).join('\n')}

---
INSTRUCCIONES: Usa TODA esta información para responder preguntas sobre este paciente específico.
Genera hipótesis basadas en SU perfil molecular y SU historial de tratamientos.
Siempre considera las interacciones entre variantes, tratamientos previos y comorbilidades.
`.trim();
}

function getRecentLabsSummary(labs: LabResult[]): string {
  // Obtiene los últimos valores de labs clave
  const recent = labs.slice(0, 3); // Últimos 3 estudios
  return recent.map(l => 
    `${l.date}: ${l.values.map(v => `${v.name}: ${v.value} ${v.unit}`).join(', ')}`
  ).join('\n');
}
```

### Paso 2.2: "Preguntar sobre este documento"
Cuando el usuario selecciona un documento específico:

```typescript
function buildDocumentQueryContext(patient: PatientRecord, docId: string): string {
  const doc = patient.documents.find(d => d.id === docId);
  
  const baseContext = buildPatientContextForLLM(patient);
  
  return `
${baseContext}

---
## DOCUMENTO EN ANÁLISIS
**Nombre:** ${doc.name}
**Tipo:** ${doc.category}
**Fecha:** ${doc.documentDate}

**CONTENIDO DEL DOCUMENTO:**
${doc.extractedText}
---

El usuario tiene preguntas específicas sobre este documento.
Responde basándote en el contenido del documento Y el contexto completo del paciente.
`;
}
```

### Paso 2.3: Extracción Automática de Hipótesis
**Archivo**: `src/lib/hypothesis-extractor.ts`

Cuando el LLM menciona posibles tratamientos, dianas, o repurposing:

```typescript
// Prompt especial para extracción
const EXTRACTION_PROMPT = `
Analiza la respuesta anterior y extrae hipótesis clínicas en formato JSON:
{
  "hypotheses": [
    {
      "claim": "Descripción de la hipótesis",
      "type": "drug_repurposing | target_therapy | mechanism | biomarker | clinical_trial",
      "confidence": "high | medium | low",
      "evidence": ["Lista de evidencia citada"],
      "nextSteps": ["Acciones sugeridas"]
    }
  ]
}
`;
```

### Paso 2.4: KG Queries basadas en perfil del paciente
Cuando se abre el expediente de un paciente:

```typescript
async function preloadPatientKGContext(patient: PatientRecord) {
  const genes = patient.genomicProfiles.flatMap(gp => gp.variants.map(v => v.gene));
  const disease = patient.diagnosis.cancerType;
  
  // Pre-cargar subgrafo relevante
  for (const gene of genes) {
    await kgApi.findPath(gene, disease);
    await kgApi.getNeighbors(gene);
  }
  
  // Buscar drugs asociados a las variantes
  const drugs = await kgApi.getRepurposingCandidates(disease);
}
```

---

## FASE 3: Carga y Extracción de Documentos (5-7 días)
> **Objetivo**: Subir cualquier documento médico y extraer información útil.

### Paso 3.1: Componente de Upload Universal
**Archivo**: `src/components/DocumentUploader.tsx`

```tsx
<DropZone 
  accept={{
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'text/plain': ['.txt', '.vcf'],
    'text/csv': ['.csv'],
  }}
  onDrop={handleDocumentUpload}
>
  <div className="upload-zone">
    <Upload className="w-12 h-12" />
    <p>Arrastra documentos médicos aquí</p>
    <p className="text-sm text-muted">
      PDFs de laboratorio, biopsias, imágenes, archivos VCF
    </p>
  </div>
</DropZone>
```

### Paso 3.2: Categorización automática
Al subir un documento, intentar detectar su categoría:

```typescript
async function categorizeDocument(file: File, extractedText: string): Promise<DocumentCategory> {
  // Reglas simples basadas en palabras clave
  const text = extractedText.toLowerCase();
  
  if (text.includes('hemograma') || text.includes('biometría hemática')) return 'lab_blood';
  if (text.includes('ca-125') || text.includes('cea') || text.includes('psa')) return 'lab_tumor_markers';
  if (text.includes('biopsia') || text.includes('patología')) return 'pathology_biopsy';
  if (text.includes('inmunohistoquímica') || text.includes('ihc')) return 'pathology_ihc';
  if (text.includes('ngs') || text.includes('secuenciación')) return 'genomic_ngs';
  if (file.name.endsWith('.vcf')) return 'genomic_vcf';
  if (text.includes('tomografía') || text.includes('tac')) return 'imaging_ct';
  if (text.includes('pet-ct') || text.includes('pet/ct')) return 'imaging_pet';
  
  // Fallback: preguntar al usuario o usar 'other'
  return 'other';
}
```

### Paso 3.3: Extracción de texto de PDFs
**Opción A: Cliente (pdf.js)**
```typescript
import * as pdfjsLib from 'pdfjs-dist';

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return fullText;
}
```

**Opción B: Servidor (con OCR)**
Para documentos escaneados, necesitas OCR en el backend.

### Paso 3.4: Parser de VCF
**Archivo**: `src/lib/vcf-parser.ts`

```typescript
export function parseVCF(content: string): GeneVariant[] {
  const lines = content.split('\n').filter(l => !l.startsWith('#') && l.trim());
  
  return lines.map(line => {
    const [chrom, pos, id, ref, alt, qual, filter, info] = line.split('\t');
    
    // Extraer gene del campo INFO (varía según el VCF)
    const geneMatch = info.match(/GENE=([^;]+)/);
    const gene = geneMatch ? geneMatch[1] : 'Unknown';
    
    // Extraer otros campos relevantes...
    
    return {
      gene,
      variant: `${ref}>${alt}`,
      type: determineVariantType(ref, alt),
      pathogenicity: 'vus', // Requiere anotación externa
    };
  });
}
```

### Paso 3.5: Extracción estructurada de labs
Usar el LLM para extraer valores de laboratorio de PDFs:

```typescript
const LAB_EXTRACTION_PROMPT = `
Extrae los valores de laboratorio del siguiente texto en formato JSON:
{
  "values": [
    {"name": "Nombre del analito", "value": "número", "unit": "unidad", "referenceRange": "rango"}
  ]
}

TEXTO DEL DOCUMENTO:
${extractedText}
`;
```

---

## FASE 4: Hipótesis como First-Class Citizens (3-5 días)
> **Objetivo**: Las hipótesis se pueden revisar, validar, exportar.

### Paso 4.1: Hypothesis Cards mejoradas
```tsx
<HypothesisCard hypothesis={h}>
  <Badge variant={h.confidence}>{h.confidence}</Badge>
  <p>{h.claim}</p>
  
  <Collapsible title="Mechanism">
    {h.mechanism}
  </Collapsible>
  
  <Collapsible title="Evidence">
    <KGPathViewer paths={h.kgPaths} />
    <CitationsList citations={h.citations} />
  </Collapsible>
  
  <div className="actions">
    <Button onClick={() => setStatus('validated')}>✓ Validate</Button>
    <Button onClick={() => setStatus('rejected')}>✗ Reject</Button>
    <Button onClick={() => openInGraph(h.kgEntities)}>Open in Graph</Button>
    <Button onClick={() => exportHypothesis(h)}>Export</Button>
  </div>
</HypothesisCard>
```

### Paso 4.2: Workflow de Revisión
Estados: `generated` → `reviewing` → `validated` / `rejected` → `actionable`

### Paso 4.3: Exportación
- **Markdown**: Reporte completo del paciente + hipótesis
- **PDF**: Formato para tumor board
- **JSON**: Para integración con otros sistemas

---

## FASE 5: Persistencia en Backend (7-10 días)
> **Objetivo**: Migrar de localStorage a base de datos real.

### Paso 5.1: API Endpoints
```
POST   /api/notebooks              # Crear notebook
GET    /api/notebooks              # Listar notebooks del usuario
GET    /api/notebooks/:id          # Obtener notebook
PUT    /api/notebooks/:id          # Actualizar notebook
DELETE /api/notebooks/:id          # Eliminar notebook

POST   /api/notebooks/:id/threads  # Añadir thread
POST   /api/notebooks/:id/hypotheses # Añadir hipótesis
POST   /api/notebooks/:id/files    # Subir archivo
```

### Paso 5.2: Base de Datos
Opciones:
- **Supabase** (PostgreSQL + Storage + Auth) — Recomendado para MVP
- **Firebase** (Firestore + Storage)
- **Self-hosted** (PostgreSQL + S3)

### Paso 5.3: Migración Transparente
- Detectar si hay datos en localStorage
- Ofrecer migrar a la nube
- Sync bidireccional (offline-first)

---

## FASE 6: Colaboración y Sharing (5-7 días)
> **Objetivo**: Múltiples usuarios pueden trabajar en un notebook.

### Paso 6.1: Roles
- **Owner**: Control total
- **Editor**: Puede añadir chats/hipótesis
- **Viewer**: Solo lectura

### Paso 6.2: Invitaciones
- Compartir por email
- Link de solo lectura

### Paso 6.3: Activity Log
- Quién hizo qué y cuándo
- Comentarios en hipótesis

---

## 📊 Roadmap Visual

```
Semana 1-2:  [████████████████████████] FASE 0 + FASE 1 (Base + UI) ✅
Semana 3-4:  [████████████████████████] FASE 2 (Contexto Inteligente) ✅
Semana 5-6:  [████████████████████████] FASE 3 (Documentos) ✅
Semana 7:    [████████████████████████] FASE 4 (Hipótesis) ✅
Semana 8-10: [░░░░░░░░░░░░░░░░░░░░░░░░] FASE 5 (Backend)
Semana 11-12:[░░░░░░░░░░░░░░░░░░░░░░░░] FASE 6 (Colaboración)
```

---

## 🚀 Quick Wins (Implementar YA)

### 1. Renombrar "Query Builder" → "New Chat" ✅ (Ya hecho)

### 2. Añadir botón "Nuevo Paciente" en sidebar
```tsx
<SidebarMenuItem>
  <SidebarMenuButton onClick={handleNewPatient}>
    <UserPlus className="size-4" />
    <span>Nuevo Paciente</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

### 3. Lista de Pacientes en sidebar
Reemplazar "Recent Chats" por "Mis Pacientes":
```tsx
{patients.map(p => (
  <SidebarMenuItem key={p.id}>
    <SidebarMenuButton onClick={() => openPatient(p.id)}>
      <Avatar className="size-6" src={p.identity.photoUrl} />
      <div className="flex flex-col">
        <span className="text-xs font-medium">{getPatientFullName(p)}</span>
        <span className="text-[10px] text-muted">{p.diagnosis.cancerType}</span>
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
))}
```

### 4. Modal de creación rápida de paciente
Formulario mínimo para crear un expediente:
- Nombre completo (obligatorio)
- Fecha de nacimiento (obligatorio)
- Sexo (obligatorio)
- Tipo de cáncer (obligatorio)
- Estadio (opcional)

---

## 📁 Estructura de Archivos Actualizada

```
src/
├── lib/
│   ├── local-threads.ts          # Ya existe (chats)
│   ├── patient-record.ts         # NUEVO: tipos + storage de expedientes
│   ├── patient-context-builder.ts # NUEVO: genera contexto para LLM
│   ├── vcf-parser.ts             # NUEVO: parser de archivos VCF
│   └── hypothesis-extractor.ts   # NUEVO: extrae hipótesis de respuestas
│
├── components/
│   ├── AppSidebar.tsx            # Modificar: lista de pacientes
│   ├── PatientHeader.tsx         # NUEVO: header del expediente
│   ├── DocumentUploader.tsx      # NUEVO: upload de documentos
│   ├── DocumentsManager.tsx      # NUEVO: gestión de documentos
│   ├── LabResultsTimeline.tsx    # NUEVO: timeline de labs
│   ├── GenomicProfileView.tsx    # NUEVO: vista de perfil genómico
│   ├── TreatmentTimeline.tsx     # NUEVO: timeline de tratamientos
│   ├── HypothesisCard.tsx        # NUEVO: card de hipótesis
│   ├── PatientChat.tsx           # NUEVO: chat con contexto
│   └── NewPatientForm.tsx        # NUEVO: formulario de nuevo paciente
│
├── pages/
│   └── platform/
│       ├── PatientRecordView.tsx # NUEVO: vista principal del expediente
│       ├── PatientListView.tsx   # NUEVO: lista de todos los pacientes
│       └── ...
│
└── hooks/
    ├── useAgent.ts               # Ya existe
    └── usePatientContext.ts      # NUEVO: hook para contexto del paciente
```

---

## ✅ Criterios de Éxito

### MVP (Fase 0-2) — "El LLM conoce a mi paciente"
- [x] Puedo crear un expediente de paciente con nombre real y datos médicos
- [x] Puedo llenar: diagnóstico, estadio, variantes genéticas, tratamientos previos
- [x] Puedo chatear y el LLM "conoce" TODO del paciente
- [x] Las respuestas son personalizadas basadas en el perfil específico
- [x] Todo persiste en localStorage

### v1.0 (Fase 0-4) — "Expediente médico digital + AI"
- [x] Puedo subir PDFs de laboratorios y biopsias
- [x] El sistema extrae texto/datos de los documentos
- [x] Puedo preguntar "¿qué dice este documento?" con contexto
- [x] Las hipótesis se extraen y guardan automáticamente
- [x] Puedo exportar un reporte del paciente (Markdown/PDF)

### v2.0 (Fase 5-6) — "Plataforma multi-usuario"
- [ ] Los expedientes se guardan en la nube (no localStorage)
- [ ] Múltiples médicos pueden colaborar en un paciente
- [ ] Historial de cambios y auditoría

---

## 🎯 Siguiente Acción Inmediata

**FASE 5: Persistencia en Backend**
1. Definir estrategia de backend (Supabase vs Firebase vs Custom)
2. Crear endpoints de API o funciones serverless
3. Migrar datos de localStorage a la nube

**¿Continuamos con la Fase 5?**
