import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
    extractTextFromPDF, 
    categorizeDocument, 
    getDocumentType, 
    fileToBase64 
} from "@/lib/document-processor"
import { type MedicalDocument } from "@/lib/patient-record"

interface DocumentUploaderProps {
    onUploadComplete: (doc: MedicalDocument) => void;
}

export function DocumentUploader({ onUploadComplete }: DocumentUploaderProps) {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [status, setStatus] = React.useState<string>("");

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);
        setProgress(10);
        setStatus("Leyendo archivo...");

        try {
            const type = getDocumentType(file);
            let extractedText = "";
            
            if (type === 'pdf') {
                setStatus("Extrayendo texto del PDF...");
                setProgress(30);
                extractedText = await extractTextFromPDF(file);
            } else if (type === 'txt' || type === 'csv' || type === 'vcf') {
                extractedText = await file.text();
            }

            setProgress(60);
            setStatus("Categorizando documento...");
            const category = categorizeDocument(file.name, extractedText);

            setProgress(80);
            setStatus("Preparando almacenamiento local...");
            const base64 = await fileToBase64(file);

            const newDoc: MedicalDocument = {
                id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                type,
                category,
                documentDate: new Date().toISOString().split('T')[0],
                uploadedAt: Date.now(),
                mimeType: file.type,
                sizeBytes: file.size,
                base64Data: base64,
                extractedText: extractedText,
            };

            setProgress(100);
            setStatus("¡Completado!");
            
            setTimeout(() => {
                onUploadComplete(newDoc);
                setIsProcessing(false);
                setProgress(0);
                setStatus("");
            }, 1000);

        } catch (error) {
            console.error("Error processing document:", error);
            setStatus("Error al procesar el documento");
            setIsProcessing(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg'],
            'text/plain': ['.txt', '.vcf'],
            'text/csv': ['.csv'],
        },
        multiple: false,
        disabled: isProcessing
    });

    return (
        <div className="w-full">
            {!isProcessing ? (
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer
                        flex flex-col items-center justify-center text-center gap-4
                        ${isDragActive 
                            ? "border-primary bg-primary/5 scale-[0.99]" 
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Upload className="size-8" />
                    </div>
                    <div>
                        <p className="text-lg font-medium">
                            {isDragActive ? "Suelta el archivo aquí" : "Sube un documento médico"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            PDFs de laboratorio, biopsias, imágenes o archivos VCF
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                        Seleccionar Archivo
                    </Button>
                </div>
            ) : (
                <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-6">
                    {progress < 100 ? (
                        <Loader2 className="size-12 text-primary animate-spin" />
                    ) : (
                        <CheckCircle2 className="size-12 text-green-500" />
                    )}
                    
                    <div className="w-full max-w-xs space-y-3">
                        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <span>{status}</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            )}
        </div>
    );
}
