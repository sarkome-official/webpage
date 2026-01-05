import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { upsertPatient, createPatientId, type PatientRecord } from "@/lib/patient-record"
import { ArrowLeft, UserPlus } from "lucide-react"

export default function NewPatientForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        sex: "Other" as "M" | "F" | "Other",
        cancerType: "",
        primarySite: "",
        stage: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPatient: PatientRecord = {
            id: createPatientId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            identity: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                sex: formData.sex,
            },
            diagnosis: {
                cancerType: formData.cancerType,
                primarySite: formData.primarySite,
                stage: formData.stage,
                dateOfDiagnosis: new Date().toISOString().split('T')[0],
            },
            documents: [],
            labResults: [],
            genomicProfiles: [],
            treatments: [],
            comorbidities: [],
            chronicMedications: [],
            hypotheses: [],
            threadIds: [],
        };

        upsertPatient(newPatient);
        navigate(`/patient/${newPatient.id}`);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl">
                <Button 
                    variant="ghost" 
                    className="mb-6 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                </Button>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <UserPlus className="size-5" />
                            </div>
                            <CardTitle className="text-2xl">New Patient</CardTitle>
                        </div>
                        <CardDescription>
                            Create a new digital record to start precision oncology analysis.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                        id="firstName" 
                                        placeholder="e.g., John" 
                                        required 
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                        id="lastName" 
                                        placeholder="e.g., Smith" 
                                        required 
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input 
                                        id="dob" 
                                        type="date" 
                                        required 
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sex">Sex</Label>
                                    <Select 
                                        value={formData.sex} 
                                        onValueChange={(val: any) => setFormData({...formData, sex: val})}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Male</SelectItem>
                                            <SelectItem value="F">Female</SelectItem>
                                            <SelectItem value="Other">Other / Not specified</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Diagnostic Information</h3>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="cancerType">Cancer Type</Label>
                                    <Input 
                                        id="cancerType" 
                                        placeholder="e.g., Uterine leiomyosarcoma" 
                                        required 
                                        value={formData.cancerType}
                                        onChange={(e) => setFormData({...formData, cancerType: e.target.value})}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="primarySite">Primary Site</Label>
                                        <Input 
                                            id="primarySite" 
                                            placeholder="e.g., Uterus" 
                                            required 
                                            value={formData.primarySite}
                                            onChange={(e) => setFormData({...formData, primarySite: e.target.value})}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stage">Stage (optional)</Label>
                                        <Input 
                                            id="stage" 
                                            placeholder="e.g., IIIA" 
                                            value={formData.stage}
                                            onChange={(e) => setFormData({...formData, stage: e.target.value})}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-white/10">
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Create Record
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
