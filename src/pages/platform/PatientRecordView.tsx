import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    getPatientFullName,
    calculateAge,
    calculateBMI,
    type PatientRecord
} from "@/lib/patient-record"
import { getPatient } from "@/lib/patient-storage-manager"
import { listThreads, deleteThread, setActiveThreadId, type StoredThread } from "@/lib/thread-storage-manager"
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
    Activity,
    Trash2
} from "lucide-react"
import { DocumentsManager } from "@/components/DocumentsManager"
import { HypothesisManager } from "@/components/HypothesisManager"
import { GenomicsManager } from "@/components/GenomicsManager"
import { TreatmentsManager } from "@/components/TreatmentsManager"

export default function PatientRecordView() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = React.useState<PatientRecord | null>(null);
    const [patientThreads, setPatientThreads] = React.useState<StoredThread[]>([]);

    React.useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (patientId) {
                const data = await getPatient(patientId);
                if (isMounted) setPatient(data);

                const allThreads = await listThreads();
                if (isMounted) {
                    setPatientThreads(allThreads.filter(t => t.patientId === patientId));
                }
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [patientId]);

    // Listen for thread updates
    React.useEffect(() => {
        let isMounted = true;
        const refreshThreads = async () => {
            if (patientId) {
                const allThreads = await listThreads();
                if (isMounted) {
                    setPatientThreads(allThreads.filter(t => t.patientId === patientId));
                }
            }
        };

        window.addEventListener("sarkome:threads", refreshThreads as EventListener);
        return () => {
            isMounted = false;
            window.removeEventListener("sarkome:threads", refreshThreads as EventListener);
        };
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
                            <TabsTrigger value="chats" className="gap-2">
                                <MessageSquare className="size-4" />
                                Chats
                                {patientThreads.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full">
                                        {patientThreads.length}
                                    </span>
                                )}
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

                        <TabsContent value="chats">
                            <Card className="border-white/10 bg-white/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <MessageSquare className="size-5 text-primary" />
                                        Patient Conversations
                                    </CardTitle>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            const newThreadId = `thread_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                                            // Pass patientId to associate the thread with this patient
                                            setActiveThreadId(newThreadId, patientId);
                                            navigate("/platform");
                                        }}
                                    >
                                        <MessageSquare className="size-4 mr-2" />
                                        New Chat
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {patientThreads.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <MessageSquare className="size-12 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No conversations assigned to this patient yet.</p>
                                            <p className="text-xs mt-1 text-muted-foreground/70">
                                                Start a new chat or assign existing chats from the sidebar.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {patientThreads.map((thread) => (
                                                <div
                                                    key={thread.id}
                                                    role="button"
                                                    tabIndex={0}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group cursor-pointer"
                                                    onClick={() => {
                                                        setActiveThreadId(thread.id);
                                                        navigate("/platform");
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            setActiveThreadId(thread.id);
                                                            navigate("/platform");
                                                        }
                                                    }}
                                                >
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <MessageSquare className="size-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">
                                                            {thread.title || thread.id}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {thread.messages?.length ?? 0} messages
                                                            {thread.updatedAt && (
                                                                <span> - {new Date(thread.updatedAt).toLocaleDateString()}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-xs text-primary">Open</span>
                                                        <button
                                                            className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm("Are you sure you want to permanently delete this conversation? This action cannot be undone.")) {
                                                                    await deleteThread(thread.id);
                                                                    // Refresh threads list
                                                                    const allThreads = await listThreads();
                                                                    setPatientThreads(allThreads.filter(t => t.patientId === patientId));
                                                                }
                                                            }}
                                                            title="Delete conversation"
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
