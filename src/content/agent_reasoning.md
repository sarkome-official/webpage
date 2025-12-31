# Agent Reasoning Pipeline

Here is a detailed explanation of your agent's Reasoning Pipeline, based on the analysis of `backend/src/agent/graph.py`.

This agent uses a **LangGraph** architecture designed to perform deep research in scientific domains. Its flow is not linear; it combines a deterministic **"Grounding"** phase with a **reflection-action** reasoning loop.

## 🧠 High-Level Architecture
The pipeline is divided into 3 main phases:

1. **Grounding Phase**: Initial contextualization with hard data.
2. **Reasoning Loop**: Iterative web search and self-reflection.
3. **Synthesis (Final Answer)**: Generation of the final response with citations.

---

## 1. Grounding Phase (Deterministic Start)
The agent begins by "anchoring" its knowledge in scientific databases before going out to the open web.

### `query_knowledge_graph` (Knowledge Graph)
*   **Input**: User query.
*   **Action**:
    *   Uses an LLM to extract scientific Entities (genes, proteins, diseases).
    *   Queries the **PrimeKG API** to obtain biomedically validated relationships.
*   **Output**: Structured KG context (`kg_context`).
*   **Transition**: Unconditionally passes to the next scientific node.

### `query_alphafold` (Structural Biology)
*   **Input**: Entities detected in the previous step.
*   **Action**:
    *   Resolves genes to **UniProt IDs**.
    *   Queries the **AlphaFold database** to obtain structural metadata (folding prediction).
*   **Output**: Structure summary (`alphafold_context`).
*   **Transition**: Towards web search generation.

---

## 2. Reasoning Loop (Dynamic Cycle)
This is where the agent "thinks" and explores.

### `generate_query` (Planning)
*   **Model**: Gemini 3.0 Flash 
*   **Action**: Generates multiple optimized search queries, combining the user's question with the context already acquired from the KG and AlphaFold.
*   **Output**: List of queries (`search_query`).

### `web_research` (Parallel Execution)
*   **Parallelism**: Multiple "worker" nodes are launched in parallel (one per query).
*   **Tool**: Google Search API + Gemini with Grounding.
*   **Action**: Searches, reads, and resolves URLs to obtain precise citations.
*   **Converges on**: The reflection node.

### `reflection` (The Brain/Critic)
*   **Model**: Gemini 3.0 Flash (configured for Reasoning).
*   **Action**: Analyzes all information gathered so far.
*   **Decision (`evaluate_research`)**:
    *   **Is the information sufficient?** -> Yes -> Go to `finalize_answer`.
    *   **Is something missing (`knowledge_gap`)?** -> Yes -> Generate new follow-up questions.
    *   **Has the loop limit been reached (`max_research_loops`)?** -> Yes -> Force exit.
*   **Smart Routing**: If it decides to investigate further, the agent prioritizes which tool to return to:
    *   **KG** (if the doubt is about entity relationships).
    *   **AlphaFold** (if structural data is missing).
    *   **Web Search** (if it is general information).

---

## 3. Synthesis Phase

### `finalize_answer` (Final Report)
*   **Model**: Gemini 3.0 Pro (Most powerful model for writing).
*   **Action**:
    *   Takes the original question + KG Context + AlphaFold Context + Web Results.
    *   Drafts a coherent scientific report.
*   **Citation Management**: Replaces internal short URLs with original sources and guarantees that every statement has its reference.
