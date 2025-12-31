export interface UniProtResult {
    accession: string;
    id: string;
    proteinName?: string;
    geneName?: string;
    organismName?: string;
    length?: number;
}

export interface UniProtSearchResponse {
    results: Array<{
        primaryAccession: string;
        uniProtkbId: string;
        proteinDescription?: {
            recommendedName?: {
                fullName: { value: string };
            };
            submissionNames?: Array<{
                fullName: { value: string };
            }>;
        };
        genes?: Array<{
            geneName?: { value: string };
        }>;
        organism?: {
            scientificName: string;
            commonName?: string;
        };
        sequence?: {
            value: string;
            length: number;
        };
    }>;
}

export async function searchProteins(query: string): Promise<UniProtResult[]> {
    if (!query || query.trim().length < 2) return [];

    // UniProtKB search API
    // We request specific fields to minimize payload
    const params = new URLSearchParams({
        query: query,
        fields: 'accession,id,protein_name,gene_names,organism_name,length',
        size: '50'
    });

    try {
        const response = await fetch(`https://rest.uniprot.org/uniprotkb/search?${params}`);
        if (!response.ok) {
            throw new Error(`UniProt API error: ${response.statusText}`);
        }

        const data: UniProtSearchResponse = await response.json();

        return data.results.map(item => {
            // Extract best available name
            const recName = item.proteinDescription?.recommendedName?.fullName?.value;
            const subName = item.proteinDescription?.submissionNames?.[0]?.fullName?.value;

            // Extract gene
            const gene = item.genes?.[0]?.geneName?.value;

            return {
                accession: item.primaryAccession,
                id: item.uniProtkbId, // e.g. INS_HUMAN
                proteinName: recName || subName || 'Unknown Protein',
                geneName: gene,
                organismName: item.organism?.commonName || item.organism?.scientificName,
                length: item.sequence?.length
            };
        });
    } catch (error) {
        console.error("Failed to search UniProt:", error);
        return [];
    }
}
