# Sarkome Institute: Semantic Causal Discovery Engine

## 1. What the f*ck is this?

**Sarkome** is an autonomous "Venture Institute" built on a **pure LangGraph architecture**. It orchestrates multi-agent, stateful workflows to solve "undruggable" cancers like **Alveolar Soft Part Sarcoma (ASPS)**.

Unlike standard pipelines, this system separates control logic from durable memory, creating a **Council of AI Agents** that perform deep recursive research with mandatory critique loops.

### The Application Architecture
The system is built on specific architectural pillars:
*   **Pure LangGraph Orchestration**: Controls turn-taking, state management, and mandatory critique cycles. It is the "OS" of the research council.
*   **Two-Level Agent Operation**:
    *   **Level 1 (The Council)**: A `StateGraph` coordinating high-level roles: **Investigators** (Research), **The Skeptic** (Critique/Validation), and **The President** (Synthesis/Decision).
    *   **Level 2 (Deep Agents)**: Individual agents that provide file-system persistence and sub-agent spawning for deep work.
*   **Hybrid Execution**: Exists at the node level to support long-running "Deep Research" APIs without timeouts.

### The Memory System: Graph Vector Search
We utilize **Graph Vector Search** to bridge unstructured data (papers) with structured logic (molecular interactions):

*   **Medical Diagnosis**: Linking symptoms, patient histories, and medical literature to uncover rare conditions or drug interactions that simple semantic search might miss.
*   **Drug Discovery**: Finding new drug targets by analyzing the relationships between genes, proteins, and chemical compounds represented as vectors within a biological network.
*   **The Workflow**: Agents assume hypotheses -> The Skeptic challenges them -> The President synthesizes final outputs -> Structured knowledge is inserted into the Neo4j Graph.

---

## 2. What is the Value?

The pharmaceutical industry currently operates on a **stochastic (random) model**: screen millions of compounds and hope one sticks. This fails for rare diseases where data is scarce.

**Sarkome's Value Proposition:**
1.  **Deterministic Discovery**: We replace "screening" with "engineering". The Agent Council filters biological hallucinations through rigorous critique loops before a human ever sees them.
2.  **Risk Reduction**:
    *   **Semantic Firewall**: The "Skeptic" agent ensures no hallucinations enter the Knowledge Graph.
    *   **Physics > Probability**: We validate generative designs with molecular dynamics.
3.  **Explainability**: Every prediction comes with a "Why". The system provides the causal chain of reasoning, moving from "The computer says yes" to "The computer proves it's possible because X, Y, and Z".

---

## 3. What is the Business?

Sarkome operates on a **Venture Institute Model (Hub & Spoke)**.

*   **The Hub (Sarkome Institute)**: This is the asset-light R&D core. It builds the **Causal Engine**, the software, and the discovery pipelines. It retains the IP of the *process*.
*   **The Spokes (Asset Companies)**: When a drug candidate is validated for a specific disease (like ASPS), it is spun out as a separate, single-asset company. This isolates risk.

**In, short:**
*   **Customer**: We are our own first customer. The platform builds the assets we sell/spin out.
*   **Moat**: The proprietary integration of Symbolic Logic (Reasoning) with Generative AI (Creativity), governed by a specialized Agent Council.

---

## Technical Quick Start

The frontend interface for the Sarkome Refinery.

### Setup
```bash
npm install
npm run dev
```

### Stack
*   **Frontend**: Astro + React + TailwindCSS
*   **Orchestration**: LangGraph (Python/JS)
*   **Memory**: Neo4j + LangChain (Graph Vector Search)
*   **Visualization**: React-Force-Graph-3D
