export const diseases = [
  {
    id: "srk-101",
    code: "SRK-101",
    name: "Alveolar Soft Part Sarcoma (ASPS)",
    fusion: "ASPSCR1–TFE3",
    mechanism: "transcriptional reprogramming",
    type: "active",
    description: "Alveolar Soft Part Sarcoma (ASPS) is a rare, chemotherapy-resistant malignancy driven by the ASPSCR1-TFE3 fusion protein. This oncoprotein arises from a t(X;17)(p11;q25) translocation and functions as an aberrant transcription factor. It reprograms the cell by super-enhancing targets involved in angiogenesis (MET, VEGF), autophagy, and immune evasion, effectively locking the cell in a self-renewing, proliferative state.",
    molecular_detail: "The ASPSCR1-TFE3 fusion lacks the physiological regulation of native TFE3. It retains the DNA-binding domain but gains a novel transactivation domain from ASPSCR1. This results in constitutive nuclear localization and interactions with epigenetic modifiers, leading to the aberrant upregulation of the TFE3 transcriptional program."
  },
  {
    id: "ewing",
    code: "SRK-201",
    name: "Ewing Sarcoma",
    fusion: "EWSR1–FLI1",
    mechanism: "aberrant enhancer activation",
    type: "candidate",
    description: "Ewing Sarcoma is an aggressive bone and soft tissue tumor driven by the EWSR1-FLI1 fusion. This chimera acts as a pioneer factor, recruiting chromatin remodelers to GGAA microsatellites, creating 'neo-enhancers' that drive a specific oncogenic program (IGF1R, NKX2-2) while simultaneously repressing mesenchymal differentiation genes.",
    molecular_detail: "EWSR1-FLI1 alters chromatin structure by inducing phase separation and recruiting the BAF complex to closed chromatin regions. This 'enhancer hijacking' creates a neomorphic transcriptional state that is solely dependent on the continuous activity of the fusion protein."
  },
  {
    id: "synovial",
    code: "SRK-202",
    name: "Synovial Sarcoma",
    fusion: "SS18–SSX",
    mechanism: "chromatin remodeling hijack",
    type: "candidate",
    description: "Synovial Sarcoma is driven by the SS18-SSX fusion, which fundamentally alters the BAF (SWI/SNF) chromatin remodeling complex. The fusion protein displaces the wild-type SS18 subunit and ejects the tumor suppressor SMARCB1 (SNF5), converting the BAF complex from a differentiation enforcer into a driver of proliferation.",
    molecular_detail: "The incorporation of SS18-SSX into BAF complexes leads to genome-wide redistribution of the complex to polycomb-repressed domains, effectively reversing epigenetic silencing at specific oncogenic loci (like SOX2) while losing antagonism against PRC2."
  },
  {
    id: "cml",
    code: "SRK-203",
    name: "Chronic Myeloid Leukemia (CML)",
    fusion: "BCR–ABL",
    mechanism: "constitutive kinase signaling",
    type: "candidate",
    description: "CML is the classic example of a fusion-driven cancer, caused by the t(9;22) Philadelphia chromosome. The BCR-ABL fusion creates a constitutively active tyrosine kinase that signals downstream through RAS/MAPK, PI3K/AKT, and STAT5 pathways, driving uncontrolled proliferation and survival of myeloid cells.",
    molecular_detail: "Unlike transcription factor fusions, BCR-ABL is a signaling engine. The fusion allows for autophosphorylation and independence from cytokine signaling. Tyrosine kinase inhibitors (TKIs) target the ATP-binding pocket, but resistance mutations (e.g., T315I) remain a challenge."
  },
  {
    id: "ael",
    code: "SRK-204",
    name: "Acute Erythroid Leukemia (AEL)",
    fusion: "NUP98–KDM5A",
    mechanism: "epigenetic dysregulation",
    type: "candidate",
    description: "A subset of high-risk AEL is driven by NUP98-KDM5A. This fusion recruits chromatin-modifying enzymes to HOX gene clusters, locking cells in an undifferentiated, stem-like state. It effectively prevents erythroid differentiation and promotes leukemogenesis.",
    molecular_detail: "NUP98 fusions function by tethering epigenetic writers/erasers (like KDM5A, a histone demethylase) to specific genomic loci, creating aberrant chromatin loops and enforcing a 'stemness' transcriptional program."
  },
  {
    id: "ccs",
    code: "SRK-205",
    name: "Clear Cell Sarcoma",
    fusion: "EWSR1–ATF1",
    mechanism: "melanocytic transcriptional activation",
    type: "candidate",
    description: "Clear Cell Sarcoma is often driven by EWSR1-ATF1, which acts as a super-transcription factor for melanocytic differentiation antigens (MITF). It mimics the activity of cAMP-response element binding protein (CREB) but is uncoupled from upstream signaling regulation.",
    molecular_detail: "The fusion protein constitutively activates promoters containing cAMP-response elements (CREs). It drives the expression of MITF and its downstream targets, conferring a melanocytic phenotype to mesenchymal cells while maintaining proliferative capacity."
  },
  {
    id: "dsrct",
    code: "SRK-206",
    name: "Desmoplastic Small Round Cell Tumor",
    fusion: "EWSR1–WT1",
    mechanism: "lineage-inappropriate transcription",
    type: "candidate",
    description: "DSRCT is a highly aggressive sarcoma defined by the EWSR1-WT1 fusion. This protein combines the potent transactivation domain of EWSR1 with the zinc-finger DNA binding domain of WT1. It binds to WT1 targets but, instead of repressing them (as WT1 often does), it strongly activates them.",
    molecular_detail: "EWSR1-WT1 drives an ectopic gene expression signature, including PDGFRA and IL-2RB, which typically do not belong in the same cell type. It creates a conflicting cellular identity that relies on the fusion for survival."
  },
  {
    id: "arms",
    code: "SRK-207",
    name: "Alveolar Rhabdomyosarcoma",
    fusion: "PAX3–FOXO1",
    mechanism: "myogenic differentiation arrest",
    type: "candidate",
    description: "Alveolar Rhabdomyosarcoma is driven by PAX3-FOXO1, a fusion that acts as a super-activator of the myogenic lineage program but prevents terminal differentiation. It locks cells in a committed but non-differentiating myoblast state.",
    molecular_detail: "PAX3-FOXO1 has a significantly higher transcriptional potency than wild-type PAX3. It creates de novo super-enhancers at myogenic loci (like MYOD1, MYOG) and collaborates with chromatin remodelers to maintain an open chromatin state at these driver genes."
  }
];
