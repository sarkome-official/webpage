# Discovery Engine: The Neuro-Symbolic Pipeline

**Target Audience:** Developers, Computational Biologists, and Data Scientists.

GenDiscovery is not a standard web application; it is a **Neuro-Symbolic pipeline** designed to ingest unstructured data, reason about it logically, and validate findings via simulation.

### The Data Flow Pipeline

`[Architecture Diagram: Unstructured Data -> NLP Agents -> Knowledge Graph -> Inference Engine -> Simulation]`

#### 1. Ingestion: From Text to Structure

We cannot reason on raw text. We deploy a fleet of NLP agents (fine-tuned **BioBERT** models) to mine scientific literature and clinical trials.

* 
**Task:** Extract semantic "triplets" (Subject \rightarrow Predicate \rightarrow Object) from unstructured papers (e.g., "ASPSCR1 *physically_interacts_with* VCP").


* 
**Normalization:** Entities are mapped to strict ontologies (Mondo, ChEMBL, Gene Ontology) to ensure interoperability.



#### 2. The Brain: Biomedical Knowledge Graph (BKG)

The core truth of the system is hosted on a scalable **Graph Database**. Unlike vector stores that only know semantic proximity, the BKG understands network topology.

* 
**Structure:** Nodes represent biological entities (Genes, Drugs, Pathways), and edges represent functional relationships (Inhibits, Upregulates, Synthetically Lethal).


* 
**Function:** This graph serves as the "Ground Truth" that anchors our AI, preventing hallucination by restricting generation to existing nodes.



#### 3. Reasoning: The Neuro-Symbolic Layer

We utilize **DeepProbLog** to fuse the pattern-matching power of Neural Networks with the rigor of Symbolic Logic.

* 
**Neural Component:** Handles noisy data and predicts link probabilities (e.g., "Drug A *might* bind to Target B").


* **Symbolic Component:** Enforces inviolable biological rules. For example, if a drug targets a gene that is essential for normal tissue survival, the Logic Layer rejects the hypothesis regardless of the neural score.



#### 4. Validation: *In Silico* Filtering

Before any hypothesis reaches a wet lab, it must survive two virtual gauntlets:

* 
**Structural Docking:** We trigger **AlphaFold-Multimer** pipelines to verify if a proposed molecule can physically bind to the fusion protein interface.


* **Causal Inference:** We employ **Do-Calculus** to simulate counterfactuals ("What happens if we inhibit X?"). This distinguishes true drivers from mere passengers, ensuring we target the root cause.



### 🛠️ Tech Stack

* **Language:** Python (PyTorch/DeepProbLog)
* **Compute:** Serverless Functions
* **Database:** Managed Graph Database 
* **Frontend:** Astro