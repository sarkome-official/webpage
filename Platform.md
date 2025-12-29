# Sarkome In-Silico: Platform Architecture & Design

## Overview
**Sarkome In-Silico** is a state-of-the-art Multi-Agent Graph Reasoning System designed to accelerate therapeutic target identification for Alveolar Soft Part Sarcoma (ASPS). By leveraging the **PrimeKG (Precision Medicine Knowledge Graph)** as its primary knowledge substrate and **Gemini 3.0** as its cognitive engine, the platform transforms complex biological data into actionable scientific insights.

## Core Mission
To provide a high-fidelity, in-silico environment where researchers can interact with autonomous agents to navigate the vast landscape of rare sarcoma genomics, proteomics, and drug-target interactions.

---

## Platform Design & Aesthetic: "Sarkome OS"

The platform follows a design language termed **"Sarkome OS"**—a high-performance, dark-themed interface that prioritizes data density, scientific precision, and real-time observability.

### 1. Visual Identity
- **Theme:** Deep obsidian backgrounds with high-contrast typography and neon-accented data visualizations.
- **Atmosphere:** Professional, clinical, and futuristic.
- **Components:** Utilizes Radix UI and Shadcn for a consistent, accessible, and modular interface.

### 2. Layout Structure
- **Sidebar Navigation:** A persistent command center providing quick access to specialized "Nodes" (Knowledge Substrate, Simulation Lab, AlphaFold 3).
- **Main Workspace:** A flexible viewport that adapts to the current task—whether it's a 3D protein visualization, a complex graph network, or a multi-agent reasoning log.
- **Activity Timeline:** A real-time feed of agent reasoning steps, showing the "thought process" as it traverses the PrimeKG.

---

## Functional Modules (The Reasoning Nodes)

### 1. Knowledge Substrate (PrimeKG Explorer)
- **Purpose:** Interactive visualization of the PrimeKG.
- **Functionality:** Allows researchers to query relationships between genes, diseases, and drugs specific to ASPS.
- **Tech:** Powered by graph-based reasoning to identify non-obvious therapeutic paths.

### 2. Simulation Lab
- **Purpose:** In-silico testing of therapeutic hypotheses.
- **Functionality:** Running predictive models on how specific perturbations affect the ASPS gene network.

### 3. AlphaFold 3 Integration
- **Purpose:** Structural biology at the core.
- **Functionality:** Direct access to protein structure predictions for identified targets, facilitating drug-binding site analysis.

### 4. Data Refinery (Ingestion)
- **Purpose:** Keeping the substrate current.
- **Functionality:** Ingesting the latest research papers and clinical trial data to update the agent's knowledge base.

### 5. System Constitution
- **Purpose:** Governance and Alignment.
- **Functionality:** Defining the ethical and scientific constraints under which the Gemini 3.0 agents operate.

---

## Technical Backbone: Multi-Agent Graph Reasoning

The platform is not a simple chatbot; it is a **LangGraph-powered orchestration layer**.

- **Stateful Reasoning:** Every interaction is tracked in a global state, allowing agents to "remember" previous findings and build upon them.
- **Tool-Augmented Generation (TAG):** Agents can autonomously invoke tools to query the PrimeKG, run simulations, or fetch structural data.
- **Gemini 3.0 Integration:** Utilizes the latest multimodal capabilities for processing both structured data and unstructured scientific literature.

---

## User Experience (UX) Principles
- **Observability:** Users should always see *why* an agent reached a conclusion (via the Sarkome Logs).
- **Interactivity:** The "Query Builder" serves as the primary interface for human-agent collaboration.
- **Speed:** Built on Vite and React 19 for near-instantaneous transitions between complex data views.

---

## Platform Sitemap & Page Specifications

The platform is divided into 11 core views, each serving a specific stage of the in-silico research workflow.

### 1. Query Builder (The Command Center)
- **Route:** `/platform`
- **Content:** Central chat/command interface, effort level selectors (Low/Medium/High), model selection (Reasoning/Reflection), and the real-time Activity Timeline.
- **Purpose:** The primary entry point for initiating research loops and interacting with the multi-agent system.

### 2. Knowledge Substrate (PrimeKG Explorer)
- **Route:** `/platform/knowledge-graph`
- **Content:** 2D/3D force-directed graph visualization of PrimeKG nodes (Genes, Drugs, Diseases, Phenotypes).
- **Purpose:** Visual exploration of the biological network and identification of therapeutic clusters.

### 3. Simulation Lab
- **Route:** `/platform/sim`
- **Content:** Parameter controls for perturbation simulations, predictive outcome charts, and comparative analysis of drug efficacy.
- **Purpose:** Testing "What if" scenarios on the ASPS gene network.

### 4. AlphaFold 3 (Structural Hub)
- **Route:** `/platform/alphafold`
- **Content:** 3D molecular viewer (PDBe-molstar), protein sequence input, and structural alignment tools.
- **Purpose:** Analyzing the physical structure of identified targets and potential binding pockets.

### 5. Sarkome Logs (Reasoning Trace)
- **Route:** `/platform/logs`
- **Content:** Raw and formatted logs of agent thoughts, tool calls, and API responses.
- **Purpose:** Full transparency and auditability of the agent's decision-making process.

### 6. Investigation Audit (Reports)
- **Route:** `/platform/audit`
- **Content:** Generated PDF/Markdown reports, summary of findings, and evidence citations.
- **Purpose:** Formalizing research outputs for clinical or laboratory review.

### 7. System Constitution (Alignment Editor)
- **Route:** `/platform/constitution`
- **Content:** Markdown editor for the agent's "Rules of Engagement," ethical constraints, and scientific priors.
- **Purpose:** Tuning the agent's behavior and ensuring alignment with scientific standards.

### 8. Data Refinery (Ingestion)
- **Route:** `/platform/ingestion`
- **Content:** File upload zone (PDF/CSV), URL scraper, and ingestion status trackers.
- **Purpose:** Expanding the agent's knowledge base with new, user-provided research.

### 9. Agent Performance (Status)
- **Route:** `/platform/status`
- **Content:** Latency metrics, token usage, success rates of tool calls, and agent "health" monitors.
- **Purpose:** Monitoring the technical efficiency of the multi-agent system.

### 10. Research Whiteboard
- **Route:** `/platform/whiteboard`
- **Content:** Infinite canvas for pinning graph snippets, protein structures, and notes.
- **Purpose:** A collaborative space for synthesizing findings from different modules.

### 11. Developer Hub (Knowledge Export)
- **Route:** `/platform/api`
- **Content:** API key management, export tools (JSON/RDF), and documentation for external integrations.
- **Purpose:** Enabling the export of discovered insights into other bioinformatics pipelines.
