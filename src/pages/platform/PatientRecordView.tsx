import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    getPatient,
    getPatientFullName,
    calculateAge,
    calculateBMI,
    type PatientRecord
} from "@/lib/patient-record"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FileText,
    Beaker,
    Dna,
    Pill,
    Lightbulb,
    MessageSquare,
    ArrowLeft,
    Calendar,
    User,
    Activity
} from "lucide-react"
import { DocumentsManager } from "@/components/DocumentsManager"
import { HypothesisManager } from "@/components/HypothesisManager"
import { GenomicsManager } from "@/components/GenomicsManager"
import { TreatmentsManager } from "@/components/TreatmentsManager"

export default function PatientRecordView() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = React.useState<PatientRecord | null>(null);

    React.useEffect(() => {
        if (patientId) {
            const data = getPatient(patientId);
            setPatient(data);
        }
    }, [patientId]);

    if (!patient) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Paciente no encontrado</h2>
                    <Button variant="link" onClick={() => navigate("/platform")}>
                        Volver al inicio
                    </Button>
                </div>
            </div>
        );
    }

    const fullName = getPatientFullName(patient);
    const age = calculateAge(patient.identity.dateOfBirth);
    const bmi = calculateBMI(patient.identity.heightCm || 0, patient.identity.weightKg || 0);

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            {/* Header del Paciente */}
            <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
                <div className="container max-w-6xl mx-auto">


                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="size-20 border-2 border-primary/20">
                            <AvatarImage src={patient.identity.photoUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                {patient.identity.firstName[0]}{patient.identity.lastName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {patient.diagnosis.cancerType}
                                </Badge>
                                <Badge variant="secondary">
                                    Estadio {patient.diagnosis.stage || 'N/A'}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-4" />
                                    <span>{age} años ({patient.identity.dateOfBirth})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="size-4" />
                                    <span>{patient.identity.sex === 'M' ? 'Masculino' : patient.identity.sex === 'F' ? 'Femenino' : 'Otro'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Activity className="size-4" />
                                    <span>IMC: {bmi > 0 ? bmi.toFixed(1) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 overflow-auto p-6">
                <div className="container max-w-6xl mx-auto">
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-white/5 border border-white/10 p-1">
                            <TabsTrigger value="overview" className="gap-2">
                                <FileText className="size-4" />
                                Resumen
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="gap-2">
                                <FileText className="size-4" />
                                Documentos
                            </TabsTrigger>
                            <TabsTrigger value="labs" className="gap-2">
                                <Beaker className="size-4" />
                                Laboratorios
                            </TabsTrigger>
                            <TabsTrigger value="genomics" className="gap-2">
                                <Dna className="size-4" />
                                Genómica
                            </TabsTrigger>
                            <TabsTrigger value="treatments" className="gap-2">
                                <Pill className="size-4" />
                                Tratamientos
                            </TabsTrigger>
                            <TabsTrigger value="hypotheses" className="gap-2">
                                <Lightbulb className="size-4" />
                                Hipótesis
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="md:col-span-2 border-white/10 bg-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Activity className="size-5 text-primary" />
                                            Estado Actual
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Diagnóstico</p>
                                                <p className="text-sm font-medium">{patient.diagnosis.cancerType}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Sitio Primario</p>
                                                <p className="text-sm font-medium">{patient.diagnosis.primarySite}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                            <p className="text-sm italic text-muted-foreground">
                                                {patient.notes || "No hay notas clínicas adicionales para este paciente."}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-white/10 bg-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Resumen Molecular</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Dna className="size-12 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No se han cargado perfiles genómicos aún.</p>
                                            <Button variant="link" size="sm" className="mt-2">Cargar NGS</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <DocumentsManager patient={patient} />
                        </TabsContent>

                        <TabsContent value="labs">
                            <div className="text-center py-20 text-muted-foreground">
                                <Beaker className="size-12 mx-auto mb-3 opacity-20" />
                                <p>No hay resultados de laboratorio registrados.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="genomics">
                            <GenomicsManager patient={patient} />
                        </TabsContent>

                        <TabsContent value="treatments">
                            <TreatmentsManager patient={patient} />
                        </TabsContent>

                        <TabsContent value="hypotheses">
                            <HypothesisManager patient={patient} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
