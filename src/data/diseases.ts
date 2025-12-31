export interface Disease {
    id: string;
    code: string;
    name: string;
    type: 'active' | 'candidate';
    fusion?: string;
    mechanism?: string;
    description?: string;
    molecular_detail?: string;
}

export const diseases: Disease[] = [
    {
        id: "asps",
        code: "ASPS-01",
        name: "Alveolar Soft Part Sarcoma",
        type: "active",
        fusion: "ASPSCR1-TFE3",
        mechanism: "Epigenetic Dysregulation",
        description: "ASPS is an ultra-rare, highly vascular malignancy with a predictable clinical course but high metastatic potential. It is defined by the t(X;17)(p11;q25) translocation, creating a fusion protein that is uniquely resistant to standard chemotherapy and radiation.",
        molecular_detail: "The ASPSCR1-TFE3 fusion hijacks the MET promoter and upregulates angiogenic pathways through VEGF. Our agent models the protein-protein interface between the fusion and chromatin remodeling complexes, aiming to identify small-molecule disruptors."
    },
    {
        id: "ewing",
        code: "EWS-04",
        name: "Ewing Sarcoma",
        type: "candidate",
        fusion: "EWSR1-FLI1",
        mechanism: "Transcription Factor Hijacking",
        description: "An aggressive pediatric bone and soft tissue cancer. The EWSR1-FLI1 fusion acts as a pioneer transcription factor, creating thousands of neo-enhancers that rewire the entire cellular identity towards a stem-like proliferative state.",
        molecular_detail: "The C-terminal domain of FLI1 provides DNA binding specificity, while the N-terminal EWS domain recruits the BAF complex. We are simulating the 'phase separation' properties of this fusion to find ways to collapse these transcriptional hubs."
    },
    {
        id: "synovial",
        code: "SS-02",
        name: "Synovial Sarcoma",
        type: "candidate",
        fusion: "SS18-SSX",
        mechanism: "BAF Complex Remodeling",
        description: "Characterized by the t(X;18) translocation, this disease is driven by the displacement of wild-type SS18 within the BAF (SWI/SNF) complex, leading to widespread epigenetic silencing of tumor suppressors.",
        molecular_detail: "The SS18-SSX fusion protein integrates into the BAF complex and recruits Polycomb Repressive Complex 2 (PRC2) to unintended genomic loci. Our research focuses on restoring BAF complex integrity through targeted protein degradation."
    },
    {
        id: "osteosarcoma",
        code: "OS-09",
        name: "Osteosarcoma",
        type: "candidate",
        fusion: "TP53/RB1 Loss",
        mechanism: "Chromothripsis",
        description: "The most common primary bone cancer, defined by extreme genomic instability rather than a single fusion. It exhibits massive chromosomal rearrangements and constant evolutionary pressure under treatment.",
        molecular_detail: "Characterized by 'kataegis' and 'chromothripsis' events. We use multi-agent simulations to model the heterogeneous tumor landscape and identify synthetic lethal vulnerabilities linked to the loss of p53 and Rb1 function."
    }
];
