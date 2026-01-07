# SARKOME Data Architecture: Clinical Records & Privacy Framework

## Executive Summary

This document outlines the data architecture for Sarkome's ambitious goal of creating a **global oncology knowledge base** while maintaining individual privacy. The system is designed to:

1. **Encapsulate complete patient journeys** as clinical cases
2. **Contribute anonymized data** to a research database upon patient death
3. **Log all platform interactions** for quality improvement
4. **Respect privacy regulations** (HIPAA, GDPR, local laws)

---

## 1. Data Tiers Architecture

We propose a **three-tier data model**:

```
+------------------------+------------------------+------------------------+
|      TIER 1: PRIVATE   |   TIER 2: PSEUDONYMIZED|    TIER 3: PUBLIC      |
|   (Patient Records)    |    (Research Ready)    |   (Platform Analytics) |
+------------------------+------------------------+------------------------+
| - Full PII             | - No direct PII        | - Fully anonymized     |
| - Complete medical     | - Clinical UUID only   | - Aggregated stats     |
|   history              | - All clinical data    | - Chat logs (no PII)   |
| - Identifiable dates   | - Relative timestamps  | - Query patterns       |
| - Doctor notes         | - Anonymized notes     | - Model usage          |
+------------------------+------------------------+------------------------+
|   Access: Patient +    |   Access: Approved     |   Access: Public API   |
|   Treating Physician   |   Researchers          |   (rate limited)       |
+------------------------+------------------------+------------------------+
```

---

## 2. Database Schema Design (Firestore/NoSQL)

### 2.1 Private Collections (Encrypted at Rest)

```typescript
// Collection: /patients/{patientId}
interface PrivatePatientRecord {
  // === IDENTITY (PII - Encrypted) ===
  id: string;                          // Internal UUID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // PII Fields (Encrypted with per-patient key)
  identity: {
    firstName: string;                 // ENCRYPTED
    lastName: string;                  // ENCRYPTED
    dateOfBirth: string;               // ENCRYPTED (YYYY-MM-DD)
    nationalId?: string;               // ENCRYPTED
    email?: string;                    // ENCRYPTED
    phone?: string;                    // ENCRYPTED
    address?: string;                  // ENCRYPTED
    photoUrl?: string;                 // ENCRYPTED reference
  };
  
  // === CLINICAL DATA (Pseudonymizable) ===
  diagnosis: OncologyDiagnosis;
  treatments: Treatment[];
  genomicProfiles: GenomicProfile[];
  labResults: LabResult[];
  documents: MedicalDocument[];        // References to encrypted storage
  hypotheses: Hypothesis[];
  
  // === CASE METADATA ===
  caseStatus: 'active' | 'remission' | 'palliative' | 'deceased' | 'lost_to_followup';
  dateOfDeath?: Timestamp;             // ENCRYPTED
  causeOfDeath?: string;               // Standardized ICD-10 code
  autopsyPerformed?: boolean;
  
  // === CONSENT & PERMISSIONS ===
  consent: {
    dataCollectionConsent: boolean;
    researchContributionConsent: boolean;
    publicChatConsent: boolean;
    consentDate: Timestamp;
    consentVersion: string;
    withdrawnAt?: Timestamp;
  };
  
  // === OWNERSHIP ===
  ownerId: string;                     // Physician's UID
  collaboratorIds: string[];           // Other physicians with access
  institutionId?: string;
}

// Subcollection: /patients/{patientId}/conversations/{threadId}
interface PatientConversation {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  title?: string;
  
  // Message array
  messages: {
    id: string;
    type: 'human' | 'ai' | 'system';
    content: string;
    timestamp: Timestamp;
    authorId?: string;                 // Physician UID
    authorEmail?: string;              // ENCRYPTED
    
    // AI Response metadata
    model?: string;
    tokensUsed?: number;
    cost?: number;
    responseTimeMs?: number;
  }[];
  
  // Clinical context
  contextSnapshot?: {
    activeTreatments: string[];
    recentLabAbnormalities: string[];
    currentHypotheses: string[];
  };
}
```

### 2.2 Research Collection (Pseudonymized)

```typescript
// Collection: /research_cases/{caseId}
interface ResearchClinicalCase {
  // NO PII - Only clinical value
  id: string;                          // Different from patient ID
  contributedAt: Timestamp;
  contributingInstitution?: string;    // Optional, anonymized
  
  // === DEMOGRAPHICS (Anonymized) ===
  demographics: {
    ageAtDiagnosis: number;            // Age, not DOB
    sex: 'M' | 'F' | 'Other';
    ethnicity?: string;                // Standardized categories
    country?: string;                  // Country only, no address
    bmiCategory?: 'underweight' | 'normal' | 'overweight' | 'obese';
  };
  
  // === CLINICAL JOURNEY ===
  diagnosis: {
    cancerType: string;                // Standardized (SNOMED/ICD-O)
    cancerSubtype?: string;
    primarySite: string;               // Standardized
    stage: string;
    tnm: { t: string; n: string; m: string };
    histology: string;
    grade?: string;
    metastasisSites: string[];
  };
  
  genomicProfile: {
    variants: {
      gene: string;
      variant: string;
      type: string;
      pathogenicity: string;
      actionability?: string;
    }[];
    tmb?: number;
    msi?: string;
    pdl1?: { tps?: number; cps?: number };
  };
  
  treatmentHistory: {
    sequence: number;
    type: string;
    regimen: string;
    durationWeeks: number;
    bestResponse: string;
    discontinuationReason?: string;
    gradeThreePlusAEs?: string[];      // Only severe AEs
  }[];
  
  // === OUTCOME ===
  outcome: {
    survivalMonths: number;            // From diagnosis
    eventType: 'death' | 'last_followup';
    causeOfDeath?: string;             // ICD-10
    progressionFreeMonths?: number;
  };
  
  // === METADATA ===
  dataQualityScore: number;            // 0-100
  completenessScore: number;           // 0-100
  validatedBy?: string;                // Research curator
}
```

### 2.3 Public Analytics Collection

```typescript
// Collection: /public_analytics/platform_usage
interface PlatformAnalytics {
  period: string;                      // '2026-01' (monthly)
  
  usage: {
    totalQueries: number;
    uniqueUsers: number;
    tokensConsumed: number;
    averageResponseTime: number;
  };
  
  queryPatterns: {
    topGenes: { gene: string; count: number }[];
    topCancerTypes: { type: string; count: number }[];
    topDrugQueries: { drug: string; count: number }[];
  };
  
  modelUsage: {
    [modelName: string]: number;
  };
}

// Collection: /public_chats/{chatId}
// For users who consent to public logging
interface PublicChatLog {
  id: string;
  timestamp: Timestamp;
  
  // User info (ONLY if consented)
  user: {
    displayName: string;               // Can be pseudonym
    profession?: string;               // 'oncologist', 'researcher', etc.
    institution?: string;              // Optional
  };
  
  // Chat content
  query: string;
  response: string;
  
  // Context (no PII)
  context?: {
    cancerType?: string;
    genesDiscussed?: string[];
  };
  
  // Quality metrics
  userRating?: 1 | 2 | 3 | 4 | 5;
  flagged?: boolean;
}
```

---

## 3. Privacy & Compliance Framework

### 3.1 Data Classification

| Data Type | Classification | Storage | Access |
|-----------|---------------|---------|--------|
| Patient Name, DOB, Contact | **PII** | Encrypted, Private | Patient + Doctor |
| Medical Diagnoses | **PHI** | Encrypted, Private | Patient + Doctor |
| Genomic Variants | **Sensitive PHI** | Encrypted, Private | Patient + Doctor |
| Anonymized Clinical Data | **De-identified** | Research DB | Approved Researchers |
| Aggregated Stats | **Public** | Public DB | Anyone |
| Chat Logs (consented) | **Quasi-Public** | Public DB | Anyone |

### 3.2 Consent Workflow

```
+------------------+     +-------------------+     +--------------------+
|  USER SIGNUP     | --> | BASIC CONSENT     | --> | RESEARCH CONSENT   |
|                  |     | (Required)        |     | (Optional)         |
+------------------+     +-------------------+     +--------------------+
                               |                          |
                               v                          v
                    [x] I consent to data          [x] I consent to my
                        collection for             anonymized data being
                        improving Sarkome          used for cancer research
                                                   
                                +----------------------+
                                |   PUBLIC CHAT OPT-IN |
                                |      (Optional)      |
                                +----------------------+
                                          |
                                          v
                               [x] I consent to my chats
                                   being visible to the
                                   research community
```

### 3.3 Anonymization Pipeline

When a patient's case is contributed to research:

```python
def anonymize_patient_for_research(patient: PrivatePatientRecord) -> ResearchClinicalCase:
    """
    Transform private patient data into research-ready format.
    Called when:
    1. Patient explicitly donates their case
    2. Patient status changes to 'deceased' (with prior consent)
    """
    
    # Step 1: Generate new, unlinked ID
    research_id = generate_uuid()  # No link to original patient ID
    
    # Step 2: Calculate derived demographics
    age_at_diagnosis = calculate_age(
        patient.identity.dateOfBirth,
        patient.diagnosis.dateOfDiagnosis
    )
    
    # Step 3: Remove all dates, convert to durations
    treatment_history = []
    diagnosis_date = parse_date(patient.diagnosis.dateOfDiagnosis)
    
    for treatment in patient.treatments:
        treatment_history.append({
            'sequence': len(treatment_history) + 1,
            'type': treatment.type,
            'regimen': standardize_regimen(treatment.regimen),
            'durationWeeks': calculate_weeks(treatment.startDate, treatment.endDate),
            'bestResponse': treatment.bestResponse,
            'discontinuationReason': treatment.discontinuationReason,
            'gradeThreePlusAEs': [ae.name for ae in treatment.adverseEvents if ae.grade >= 3]
        })
    
    # Step 4: Calculate survival
    survival_months = None
    if patient.dateOfDeath:
        survival_months = calculate_months(diagnosis_date, patient.dateOfDeath)
    elif patient.lastFollowup:
        survival_months = calculate_months(diagnosis_date, patient.lastFollowup)
    
    # Step 5: Assemble research case
    return ResearchClinicalCase(
        id=research_id,
        contributedAt=now(),
        demographics={
            'ageAtDiagnosis': age_at_diagnosis,
            'sex': patient.identity.sex,
            'ethnicity': patient.identity.ethnicity,  # Standardized
            'country': patient.identity.country,      # Country only
            'bmiCategory': calculate_bmi_category(patient)
        },
        diagnosis=standardize_diagnosis(patient.diagnosis),
        genomicProfile=extract_genomic_profile(patient.genomicProfiles),
        treatmentHistory=treatment_history,
        outcome={
            'survivalMonths': survival_months,
            'eventType': 'death' if patient.dateOfDeath else 'last_followup',
            'causeOfDeath': patient.causeOfDeath
        },
        dataQualityScore=calculate_quality_score(patient),
        completenessScore=calculate_completeness(patient)
    )
```

---

## 4. Public Chat Logging Architecture

### 4.1 How Public Chats Work

```
+----------------+     +------------------+     +-------------------+
| User sends     | --> | Check consent    | --> | Log to public_    |
| chat message   |     | settings         |     | chats collection  |
+----------------+     +------------------+     +-------------------+
                              |
                              | If no consent
                              v
                       +------------------+
                       | Log anonymously  |
                       | (stats only)     |
                       +------------------+
```

### 4.2 What Gets Logged

**With Full Consent:**
```json
{
  "user": {
    "displayName": "Dr. Martinez",
    "profession": "oncologist",
    "institution": "Hospital Universitario"
  },
  "query": "What are the best treatment options for ASPS with ASPSCR1-TFE3 fusion?",
  "response": "For Alveolar Soft Part Sarcoma with ASPSCR1-TFE3 fusion...",
  "context": {
    "cancerType": "Alveolar Soft Part Sarcoma",
    "genesDiscussed": ["ASPSCR1", "TFE3", "VEGF", "MET"]
  }
}
```

**Without Consent (Anonymous):**
```json
{
  "timestamp": "2026-01-06T21:00:00Z",
  "queryCategory": "treatment_options",
  "cancerType": "soft_tissue_sarcoma",
  "genesDiscussed": ["ASPSCR1", "TFE3"],
  "responseQuality": null
}
```

---

## 5. The "Clinical Case Legacy" Feature

When a patient passes away (and had research consent):

### 5.1 Automated Workflow

```
+------------------+
| Doctor updates   |
| patient status   |
| to 'deceased'    |
+--------+---------+
         |
         v
+------------------+
| System checks    |
| research consent |
+--------+---------+
         |
    +----+----+
    |         |
    v         v
[CONSENT]  [NO CONSENT]
    |         |
    v         v
+------------------+     +------------------+
| Run anonymization|     | Archive locally  |
| pipeline         |     | only (encrypted) |
+--------+---------+     +------------------+
         |
         v
+------------------+
| Create Research  |
| Clinical Case    |
+--------+---------+
         |
         v
+------------------+
| Add to Global    |
| Research DB      |
+--------+---------+
         |
         v
+------------------+
| Notify physician |
| "Case contributed|
|  to research"    |
+------------------+
```

### 5.2 Research Contribution Certificate

```typescript
interface ResearchContributionCertificate {
  certificateId: string;
  contributedAt: Timestamp;
  
  // Anonymized summary
  caseSummary: {
    cancerType: string;
    survivalMonths: number;
    treatmentsReceived: number;
    genomicVariantsDocumented: number;
  };
  
  // Attribution (if physician consents)
  contributingPhysician?: {
    name: string;
    institution: string;
  };
  
  // Impact tracking
  citationsInResearch: number;
  viewsInPlatform: number;
}
```

---

## 6. Implementation Phases

### Phase 1: Local MVP (Current)
- [x] LocalStorage-based patient records
- [x] Basic chat history
- [ ] Consent UI components
- [ ] Export functionality

### Phase 2: Cloud Migration
- [ ] Firestore integration
- [ ] End-to-end encryption for PII
- [ ] Multi-physician collaboration
- [ ] Audit logging

### Phase 3: Research Platform
- [ ] Anonymization pipeline
- [ ] Research API
- [ ] Public chat logging
- [ ] Data quality scoring

### Phase 4: Global Knowledge Base
- [ ] Multi-institution federation
- [ ] Research contribution dashboard
- [ ] Citation tracking
- [ ] Public research API

---

## 7. Security Considerations

### 7.1 Encryption Strategy

```
+------------------------------------------+
|          CLIENT (Browser)                |
|  +------------------------------------+  |
|  |  Encryption Key Derivation         |  |
|  |  (User password + salt -> AES key) |  |
|  +------------------------------------+  |
|                    |                     |
|                    v                     |
|  +------------------------------------+  |
|  |  Encrypt PII before sending        |  |
|  |  to Firestore                      |  |
|  +------------------------------------+  |
+------------------------------------------+
                     |
                     v
+------------------------------------------+
|          FIRESTORE (Cloud)               |
|  +------------------------------------+  |
|  |  Encrypted PII blobs               |  |
|  |  (Server never sees plaintext)     |  |
|  +------------------------------------+  |
+------------------------------------------+
```

### 7.2 Access Control

```typescript
// Firestore Security Rules (simplified)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Private patient records
    match /patients/{patientId} {
      allow read, write: if request.auth.uid == resource.data.ownerId
                      || request.auth.uid in resource.data.collaboratorIds;
    }
    
    // Research cases (read-only for approved researchers)
    match /research_cases/{caseId} {
      allow read: if request.auth.token.researcher == true;
      allow write: if false; // Only server can write
    }
    
    // Public chats
    match /public_chats/{chatId} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 8. Ethical Considerations

1. **Informed Consent**: Always explain exactly what data is collected and how it's used
2. **Right to Withdraw**: Patients can withdraw consent at any time
3. **Data Minimization**: Only collect what's necessary
4. **Purpose Limitation**: Research data only used for stated purposes
5. **Transparency**: Provide access to anonymized data contributed
6. **No Re-identification**: Never attempt to link research cases back to individuals

---

## Next Steps

1. **Legal Review**: Have privacy counsel review this architecture
2. **Ethics Board**: Submit to institutional review board if applicable
3. **Consent UI**: Design and implement consent workflow
4. **Encryption**: Implement client-side encryption for PII
5. **Pilot**: Test with small cohort before full rollout

---

*Document Version: 1.0*
*Last Updated: 2026-01-06*
*Author: Sarkome Engineering Team*
