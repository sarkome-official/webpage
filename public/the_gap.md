## 🛑 The Problem: The Epistemological Gap

### Why "Search" is Not "Discovery"

In the context of ultra-rare diseases like ASPS, our current operating model, facilitating bibliographic search and data retrieval, is **epistemologically insufficient** for the urgent demands of precision oncology.

While modern AI tools like Large Language Models (LLMs) excel at processing text, they face critical limitations when applied to scientific discovery:

1. **Stochastic Hallucination:** LLMs operate on statistical probability, not biological truth. Without symbolic constraints, they are prone to scientific hallucination, inventing plausible-sounding interactions (e.g., suggesting a kinase inhibitor for a transcription factor) that are biologically impossible. In biomedicine, a statistical probability of truth is insufficient; verifiable veracity is required.


2. 
**Fragmented Causality:** A search engine can retrieve documents mentioning "ASPSCR1-TFE3" and "Cyclin D1," but it cannot independently infer that upregulation of Cyclin D1 is a necessary downstream effector of the fusion unless that specific statement exists verbatim in the corpus. It lacks the logical framework to deduce causality from scattered correlation.


3. **Inability to Reason:** Standard Vector RAG systems fail at **multi-hop reasoning**. Discovery often requires connecting distant nodes (Fact A + Fact B \rightarrow Inference C) that never appear together in a single document.



