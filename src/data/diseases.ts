export interface Disease {
    id: string;
    code: string;
    name: string;
    type: 'active' | 'candidate';
    fusion?: string;
    mechanism?: string;
}

export const diseases: Disease[] = [
    {
        id: "asps",
        code: "ASPS-01",
        name: "Alveolar Soft Part Sarcoma",
        type: "active",
        fusion: "ASPSCR1-TFE3",
        mechanism: "Epigenetic Dysregulation"
    },
    {
        id: "ewing",
        code: "EWS-04",
        name: "Ewing Sarcoma",
        type: "candidate",
        fusion: "EWSR1-FLI1",
        mechanism: "Transcription Factor Hijacking"
    },
    {
        id: "synovial",
        code: "SS-02",
        name: "Synovial Sarcoma",
        type: "candidate",
        fusion: "SS18-SSX",
        mechanism: "BAF Complex Remodeling"
    },
    {
        id: "osteosarcoma",
        code: "OS-09",
        name: "Osteosarcoma",
        type: "candidate",
        fusion: "TP53/RB1 Loss",
        mechanism: "Chromothripsis"
    }
];
