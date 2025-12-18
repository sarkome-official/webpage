---
title: The Platform
description: Discovery Engine - A Neuro-Symbolic pipeline.
---

## Discovery Engine

A Neuro-Symbolic pipeline designed to ingest unstructured data, reason about it logically, and validate findings via simulation.

### 1. Ingestion
NLP agents extract semantic "triplets" from literature. We transform unstructured text into structured data points.

### 2. The Brain
The **Biomedical Knowledge Graph (BKG)** serves as our "Ground Truth," mapping the complex relationships between genes, proteins, and drugs.

### 3. Reasoning: DeepProbLog
Standard AI (like Large Language Models) often "hallucinates": it might fluently invent a biological mechanism that doesn't exist. **DeepProbLog** prevents this by enforcing inviolable biological rules. It acts as a strict logic filter over the neural network's predictions.

#### Example of Sarkome's Logic:
*   **Neural Input**: The NLP model reads a paper and mistakenly guesses: *"The ASPSCR1-TFE3 fusion protein is exported from the nucleus."*
*   **DeepProbLog Rule**: `IF protein_is_transcription_factor THEN protein_must_be_in_nucleus`.
*   **Result**: The logic engine detects the contradiction (Transcription Factors cannot function if exported) and rejects the neural network's guess as a "hallucination" or low-probability event.

This capability allows Sarkome to replace "statistical probability" (what is likely to be said) with **"biological truth"** (what is physically possible).

### 4. Causal Inference (The "Why")
Sarkome uses DeepProbLog to go beyond just finding patterns (Correlation) to finding drivers (Causation).

*   **Correlation**: "Patients with ASPS often have high levels of protein X." (Passive observation)
*   **Causation (DeepProbLog)**: "Blocking protein X causes the tumor to shrink." (Active intervention)

The system utilizes **Do-Calculus** (Probability of Outcome given Inhibition) to simulate "counterfactuals": essentially asking the AI, "What would happen if we destroyed this specific protein?" before any physical lab tests are conducted. This helps identify **SAR-001** (our target drug candidate) with high confidence by asking these "what if" questions in silico.

### 5. Validation
Candidates are filtered through structural validation (AlphaFold-Multimer) and causal inference before moving to wet-lab validation.
