import * as React from "react"
import { 
    Pill, 
    Plus, 
    Calendar, 
    CheckCircle2, 
    Clock,
    AlertCircle,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    type Treatment, 
    type PatientRecord, 
    upsertPatient 
} from "@/lib/patient-record"

interface TreatmentsManagerProps {
    patient: PatientRecord;
}

export function TreatmentsManager({ patient }: TreatmentsManagerProps) {
    const treatments = patient.treatments || [];

    const getResponseColor = (resp: string) => {
        switch (resp) {
            case 'CR': return 'text-green-400 bg-green-400/10';
            case 'PR': return 'text-blue-400 bg-blue-400/10';
            case 'SD': return 'text-yellow-400 bg-yellow-400/10';
            case 'PD': return 'text-red-400 bg-red-400/10';
            default: return 'text-muted-foreground bg-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Historial de Tratamientos</h3>
                    <p className="text-sm text-muted-foreground">Líneas de tratamiento, cirugías y terapias sistémicas.</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="size-4" /> Añadir Tratamiento
                </Button>
            </div>

            {treatments.length === 0 ? (
                <Card className="border-dashed border-white/10 bg-white/5 py-12">
                    <CardContent className="text-center">
                        <Pill className="size-12 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground">No hay tratamientos registrados.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {treatments.map((t) => (
                        <Card key={t.id} className="border-white/10 bg-white/5 overflow-hidden">
                            <div className="flex">
                                <div className={`w-1.5 ${t.isOngoing ? 'bg-green-500' : 'bg-zinc-700'}`} />
                                <CardContent className="p-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg">{t.name}</h4>
                                                {t.isOngoing && (
                                                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                                                        EN CURSO
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t.regimen || t.type.toUpperCase()}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={`text-[10px] ${getResponseColor(t.bestResponse || '')}`}>
                                                Respuesta: {t.bestResponse || 'N/A'}
                                            </Badge>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {t.startDate} {t.endDate ? `a ${t.endDate}` : '(Actual)'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Ciclos</p>
                                            <p className="text-sm">{t.cyclesCompleted || 0} / {t.cyclesPlanned || '?'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Dosis</p>
                                            <p className="text-sm truncate">{t.dose || 'N/A'}</p>
                                        </div>
                                        {t.adverseEvents && t.adverseEvents.length > 0 && (
                                            <div className="col-span-2 space-y-1">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Eventos Adversos</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {t.adverseEvents.map((ae, i) => (
                                                        <Badge key={i} variant="secondary" className="text-[9px] bg-red-500/5 text-red-400 border-red-500/10">
                                                            {ae.name} (G{ae.grade})
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
