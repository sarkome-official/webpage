import * as pdfjsLib from 'pdfjs-dist';
import { type DocumentCategory, type DocumentType } from './patient-record';

// Configurar el worker de pdf.js
// En una app de Vite, esto suele requerir apuntar al archivo en node_modules o usar un CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n';
    }
    
    return fullText;
}

export function categorizeDocument(fileName: string, text: string): DocumentCategory {
    const content = (fileName + ' ' + text).toLowerCase();
    
    // Reglas de categorización basadas en palabras clave
    if (content.includes('hemograma') || content.includes('biometría hemática') || content.includes('sangre')) {
        if (content.includes('ca-125') || content.includes('cea') || content.includes('psa') || content.includes('marcador')) {
            return 'lab_tumor_markers';
        }
        return 'lab_blood';
    }
    
    if (content.includes('biopsia') || content.includes('patología') || content.includes('histopatológico')) {
        if (content.includes('inmunohistoquímica') || content.includes('ihc')) {
            return 'pathology_ihc';
        }
        return 'pathology_biopsy';
    }
    
    if (content.includes('ngs') || content.includes('secuenciación') || content.includes('foundation') || content.includes('guardant')) {
        return 'genomic_ngs';
    }
    
    if (content.includes('vcf')) return 'genomic_vcf';
    
    if (content.includes('tomografía') || content.includes('tac') || content.includes('ct scan')) return 'imaging_ct';
    if (content.includes('pet-ct') || content.includes('pet/ct')) return 'imaging_pet';
    if (content.includes('resonancia') || content.includes('mri')) return 'imaging_mri';
    
    if (content.includes('nota clínica') || content.includes('evolución')) return 'clinical_note';
    if (content.includes('resumen') || content.includes('epicrisis')) return 'clinical_summary';
    
    return 'other';
}

export function getDocumentType(file: File): DocumentType {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return 'image';
    if (ext === 'vcf') return 'vcf';
    if (ext === 'csv') return 'csv';
    if (ext === 'txt') return 'txt';
    return 'other';
}

export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
