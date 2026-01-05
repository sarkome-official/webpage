import { 
    type PatientRecord, 
    getPatientFullName, 
    calculateAge, 
    calculateBMI 
} from "./patient-record";

export function buildPatientContextForLLM(patient: PatientRecord): string {
    const { identity, diagnosis, genomicProfiles, treatments, labResults, documents } = patient;
    
    const recentLabs = labResults.slice(0, 3).map(l => 
        `${l.date}: ${l.values.map(v => `${v.name}: ${v.value} ${v.unit}`).join(', ')}`
    ).join('\n');

    return `
## EXPEDIENTE MÉDICO DEL PACIENTE

### IDENTIFICACIÓN
- Nombre: ${getPatientFullName(patient)}
- Edad: ${calculateAge(identity.dateOfBirth)} años
- Sexo: ${identity.sex}
- Altura: ${identity.heightCm || 'N/A'} cm | Peso: ${identity.weightKg || 'N/A'} kg | IMC: ${calculateBMI(identity.heightCm || 0, identity.weightKg || 0).toFixed(1)}

### DIAGNÓSTICO ONCOLÓGICO
- Tipo: ${diagnosis.cancerType} (${diagnosis.cancerSubtype || 'N/A'})
- Sitio primario: ${diagnosis.primarySite}
- Estadio: ${diagnosis.stage || 'N/A'} (T${diagnosis.tnmT || '?'}N${diagnosis.tnmN || '?'}M${diagnosis.tnmM || '?'})
- Grado histológico: ${diagnosis.grade || 'N/A'}
- Fecha de diagnóstico: ${diagnosis.dateOfDiagnosis}
- Metástasis: ${diagnosis.metastasisSites?.join(', ') || 'No documentadas'}

### PERFIL MOLECULAR
${genomicProfiles.length > 0 ? genomicProfiles.map(gp => `
**Estudio: ${gp.studyType} (${gp.studyDate})**
- TMB: ${gp.tmb ?? 'N/A'} mut/Mb
- MSI: ${gp.msi ?? 'N/A'}
- PD-L1 TPS: ${gp.pdl1Tps ?? 'N/A'}%

**Variantes detectadas:**
${gp.variants.map(v => `- ${v.gene} ${v.variant || ''} (${v.pathogenicity}) - VAF: ${v.vaf ? (v.vaf * 100).toFixed(1) + '%' : 'N/A'}`).join('\n')}
`).join('\n') : "No hay perfiles genómicos registrados."}

### HISTORIAL DE TRATAMIENTOS
${treatments.length > 0 ? treatments.map(t => `
- **${t.name}** (${t.type})
  - Período: ${t.startDate} - ${t.endDate || 'En curso'}
  - Mejor respuesta: ${t.bestResponse || 'N/A'}
  - Eventos adversos: ${t.adverseEvents?.map(ae => `${ae.name} G${ae.grade}`).join(', ') || 'Ninguno'}
`).join('\n') : "No hay tratamientos registrados."}

### LABORATORIOS RECIENTES
${recentLabs || 'No hay laboratorios registrados.'}

### DOCUMENTOS DISPONIBLES
${documents.length > 0 ? documents.map(d => `- [${d.category}] ${d.name} (${d.documentDate})`).join('\n') : "No hay documentos cargados."}

---
INSTRUCCIONES: Usa TODA esta información para responder preguntas sobre este paciente específico.
Genera hipótesis basadas en SU perfil molecular y SU historial de tratamientos.
Siempre considera las interacciones entre variantes, tratamientos previos y comorbilidades.
`.trim();
}
