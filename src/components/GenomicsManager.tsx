import * as React from "react"
import { 
    Dna, 
    Plus, 
    AlertTriangle, 
    CheckCircle2, 
    Info,
    ExternalLink,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    type GenomicProfile, 
    type PatientRecord, 
    upsertPatient 
} from "@/lib/patient-record"

interface GenomicsManagerProps {
    patient: PatientRecord;
}

export function GenomicsManager({ patient }: GenomicsManagerProps) {
    const profiles = patient.genomicProfiles || [];

    const getPathogenicityColor = (path: string) => {
        switch (path) {
            case 'pathogenic': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'likely_pathogenic': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'vus': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-green-400 bg-green-400/10 border-green-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Perfil Genómico y Molecular</h3>
                    <p className="text-sm text-muted-foreground">Variantes detectadas mediante NGS, WES o paneles específicos.</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="size-4" /> Cargar NGS
                </Button>
            </div>

            {profiles.length === 0 ? (
                <Card className="border-dashed border-white/10 bg-white/5 py-12">
                    <CardContent className="text-center">
                        <Dna className="size-12 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground">No hay perfiles genómicos registrados.</p>
                        <Button variant="link" size="sm" className="mt-2">Importar desde Documentos</Button>
                    </CardContent>
                </Card>
            ) : (
                profiles.map((profile, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Dna className="size-4" />
                            <span>{profile.studyType.toUpperCase()} - {new Date(profile.studyDate).toLocaleDateString()}</span>
                            <Badge variant="outline" className="ml-auto">{profile.laboratory || 'Laboratorio Desconocido'}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profile.variants.map((v, vIdx) => (
                                <Card key={vIdx} className="border-white/10 bg-white/5 hover:border-primary/30 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-primary">{v.gene}</h4>
                                                <p className="text-xs font-mono text-muted-foreground">{v.hgvs || v.variant}</p>
                                            </div>
                                            <Badge variant="outline" className={`text-[10px] uppercase ${getPathogenicityColor(v.pathogenicity)}`}>
                                                {v.pathogenicity.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {v.vaf && (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    VAF: {(v.vaf * 100).toFixed(1)}%
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="text-[10px]">
                                                {v.type.toUpperCase()}
                                            </Badge>
                                        </div>

                                        {v.clinicalSignificance && (
                                            <p className="mt-3 text-xs text-muted-foreground line-clamp-2 italic">
                                                "{v.clinicalSignificance}"
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
