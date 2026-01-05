import * as React from "react"
import { useNavigate } from "react-router-dom"
import { 
    Lightbulb, 
    Plus, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ExternalLink,
    MoreVertical,
    Trash2,
    MessageSquare,
    ArrowRight,
    ChevronDown,
    Network,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
    type Hypothesis, 
    type PatientRecord, 
    upsertPatient 
} from "@/lib/patient-record"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface HypothesisManagerProps {
    patient: PatientRecord;
}

export function HypothesisManager({ patient }: HypothesisManagerProps) {
    const hypotheses = patient.hypotheses || [];
    const navigate = useNavigate();

    const getStatusIcon = (status: Hypothesis['status']) => {
        switch (status) {
            case 'validated': return <CheckCircle2 className="size-4 text-green-400" />;
            case 'rejected': return <XCircle className="size-4 text-red-400" />;
            case 'actionable': return <ArrowRight className="size-4 text-blue-400" />;
            case 'reviewing': return <Clock className="size-4 text-yellow-400" />;
            default: return <Lightbulb className="size-4 text-primary" />;
        }
    };

    const getConfidenceColor = (conf: Hypothesis['confidence']) => {
        switch (conf) {
            case 'high': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'low': return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Eliminar esta hipótesis?")) {
            const updatedPatient = {
                ...patient,
                hypotheses: hypotheses.filter(h => h.id !== id),
                updatedAt: Date.now()
            };
            upsertPatient(updatedPatient);
        }
    };

    const updateStatus = (id: string, status: Hypothesis['status']) => {
        const updatedPatient = {
            ...patient,
            hypotheses: hypotheses.map(h => h.id === id ? { ...h, status, updatedAt: Date.now() } : h),
            updatedAt: Date.now()
        };
        upsertPatient(updatedPatient);
    };

    const handleOpenInGraph = (entities: string[]) => {
        if (!entities || entities.length === 0) return;
        const query = encodeURIComponent(entities.join(','));
        navigate(`/knowledge-graph?entities=${query}`);
    };

    const handleExport = (h: Hypothesis) => {
        const content = `
# Hipótesis: ${h.claim}

**Tipo:** ${h.type}
**Confianza:** ${h.confidence}
**Estado:** ${h.status}

## Mecanismo
${h.mechanism || "No especificado"}

## Entidades Relacionadas
${h.kgEntities?.join(', ') || "Ninguna"}

## Evidencia
${h.citations?.map(c => `- [${c.title}](${c.url || '#'})`).join('\n') || "Ninguna"}

## Notas
${h.physicianNotes || "Ninguna"}
        `;
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hypothesis-${h.id}.md`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Hipótesis de Tratamiento</h3>
                    <p className="text-sm text-muted-foreground">Propuestas generadas por AI basadas en el perfil molecular y clínico.</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="size-4" /> Nueva Hipótesis
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hypotheses.length === 0 ? (
                    <Card className="md:col-span-2 border-dashed border-white/10 bg-white/5 py-12">
                        <CardContent className="text-center">
                            <Lightbulb className="size-12 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground">No hay hipótesis generadas aún.</p>
                            <p className="text-xs text-muted-foreground mt-1">Usa el chat para explorar opciones terapéuticas con la AI.</p>
                        </CardContent>
                    </Card>
                ) : (
                    hypotheses.map((h) => (
                        <Card key={h.id} className="border-white/10 bg-white/5 flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(h.status)}
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                            {h.type.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8 -mr-2">
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
                                            <DropdownMenuItem onClick={() => updateStatus(h.id, 'validated')}>Validar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(h.id, 'rejected')}>Rechazar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(h.id, 'actionable')}>Marcar como Accionable</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleExport(h)}>
                                                <Download className="size-3.5 mr-2" /> Exportar
                                            </DropdownMenuItem>
                                            {h.kgEntities && h.kgEntities.length > 0 && (
                                                <DropdownMenuItem onClick={() => handleOpenInGraph(h.kgEntities!)}>
                                                    <Network className="size-3.5 mr-2" /> Ver en Grafo
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-400" onClick={() => handleDelete(h.id)}>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-base mt-2 leading-tight">
                                    {h.claim}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={`text-[10px] ${getConfidenceColor(h.confidence)}`}>
                                        Confianza: {h.confidence}
                                    </Badge>
                                    {h.kgEntities?.map(entity => (
                                        <Badge key={entity} variant="secondary" className="text-[10px] bg-primary/5 text-primary/80 border-primary/10">
                                            {entity}
                                        </Badge>
                                    ))}
                                </div>

                                {h.mechanism && (
                                    <Collapsible>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground w-full justify-start">
                                                <ChevronDown className="size-3 mr-1" /> Ver Mecanismo Propuesto
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-2 text-sm text-muted-foreground bg-white/5 p-3 rounded-md border border-white/5">
                                            {h.mechanism}
                                        </CollapsibleContent>
                                    </Collapsible>
                                )}
                                
                                {h.citations && h.citations.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Evidencia</p>
                                        {h.citations.slice(0, 2).map((cite, i) => (
                                            <a 
                                                key={i} 
                                                href={cite.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-blue-400 hover:underline truncate"
                                            >
                                                <ExternalLink className="size-3 shrink-0" />
                                                {cite.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0 border-t border-white/5 mt-auto">
                                <div className="flex items-center justify-between w-full pt-3">
                                    <span className="text-[10px] text-muted-foreground">
                                        Actualizado: {new Date(h.updatedAt).toLocaleDateString()}
                                    </span>
                                    {h.sourceThreadId && (
                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1">
                                            <MessageSquare className="size-3" /> Ver Chat
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
