import * as React from "react"
import { 
    FileText, 
    Trash2, 
    Eye, 
    Download, 
    Search,
    Filter,
    MoreVertical,
    FileCode,
    FileImage,
    FileSpreadsheet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
    type MedicalDocument, 
    type PatientRecord, 
    upsertPatient 
} from "@/lib/patient-record"
import { DocumentUploader } from "./DocumentUploader"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocumentsManagerProps {
    patient: PatientRecord;
}

export function DocumentsManager({ patient }: DocumentsManagerProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showUploader, setShowUploader] = React.useState(false);
    const [viewingDoc, setViewingDoc] = React.useState<MedicalDocument | null>(null);

    const handleUploadComplete = (doc: MedicalDocument) => {
        const updatedPatient = {
            ...patient,
            documents: [doc, ...patient.documents],
            updatedAt: Date.now()
        };
        upsertPatient(updatedPatient);
        setShowUploader(false);
    };

    const handleDelete = (docId: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este documento?")) {
            const updatedPatient = {
                ...patient,
                documents: patient.documents.filter(d => d.id !== docId),
                updatedAt: Date.now()
            };
            upsertPatient(updatedPatient);
        }
    };

    const filteredDocs = patient.documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="size-5 text-red-400" />;
            case 'image': return <FileImage className="size-5 text-blue-400" />;
            case 'vcf': return <FileCode className="size-5 text-purple-400" />;
            case 'csv': return <FileSpreadsheet className="size-5 text-green-400" />;
            default: return <FileText className="size-5 text-gray-400" />;
        }
    };

    const formatCategory = (cat: string) => {
        return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar documentos..." 
                        className="pl-10 bg-white/5 border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setShowUploader(!showUploader)}>
                    {showUploader ? "Cancelar" : "Subir Documento"}
                </Button>
            </div>

            {showUploader && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <DocumentUploader onUploadComplete={handleUploadComplete} />
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-3">
                {filteredDocs.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl">
                        <FileText className="size-12 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground">No se encontraron documentos.</p>
                    </div>
                ) : (
                    filteredDocs.map((doc) => (
                        <Card key={doc.id} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    {getIcon(doc.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                                        <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white/5">
                                            {formatCategory(doc.category)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                        <span>{new Date(doc.documentDate).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="size-8" title="Ver">
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(doc.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
                                            <DropdownMenuItem className="text-xs gap-2">
                                                <Download className="size-3.5" /> Descargar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-xs gap-2"
                                                onClick={() => setViewingDoc(doc)}
                                            >
                                                <FileText className="size-3.5" /> Ver texto extraído
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col bg-zinc-950 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="size-5 text-primary" />
                            {viewingDoc?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 mt-4 rounded-md border border-white/5 bg-white/5 p-4">
                        <div className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">
                            {viewingDoc?.extractedText || "No se extrajo texto de este documento."}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
