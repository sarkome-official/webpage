import * as React from "react"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router-dom"
import { getPatient, getPatientFullName } from "@/lib/patient-record"
import { buildPatientContextForLLM } from "@/lib/patient-context-builder"
import { ChatInterface } from "@/components/ChatInterface"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PatientChatView() {
    const { t } = useTranslation()
    const { patientId, threadId } = useParams<{ patientId: string, threadId?: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = React.useState<any>(null);
    const [context, setContext] = React.useState<string>("");

    React.useEffect(() => {
        if (patientId) {
            const p = getPatient(patientId);
            if (p) {
                setPatient(p);
                setContext(buildPatientContextForLLM(p));
            }
        }
    }, [patientId]);

    if (!patient) return null;

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center gap-4 p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/patient/${patientId}`)}>
                    <ArrowLeft className="size-4" />
                </Button>
                
                <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                        <AvatarImage src={patient.identity.photoUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {patient.identity.firstName[0]}{patient.identity.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xs font-bold leading-none">{getPatientFullName(patient)}</p>
                        <p className="text-[10px] text-muted-foreground">{t('patient.oncologicalConsultation')}</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <ChatInterface 
                    patientId={patientId} 
                    patientContext={context} 
                    initialThreadId={threadId}
                />
            </div>
        </div>
    );
}
