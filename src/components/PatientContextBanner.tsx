import React from "react";
import { X, User } from "lucide-react";
import { getPatientFullName, type PatientRecord } from "@/lib/patient-record";

interface PatientContextBannerProps {
    patient: PatientRecord;
    onRemove?: () => void;
    compact?: boolean;
    className?: string;
}

/**
 * Reusable banner component showing the active patient context.
 * Used in InputForm and anywhere patient context needs to be displayed.
 */
export function PatientContextBanner({
    patient,
    onRemove,
    compact = false,
    className = "",
}: PatientContextBannerProps) {
    const fullName = getPatientFullName(patient);

    // Generate initials from patient name
    const getInitials = (name: string) => {
        const parts = name.split(" ").filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (compact) {
        return (
            <div
                className={`flex items-center gap-2 p-2 rounded-lg border border-primary/20 bg-primary/5 ${className}`}
            >
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-6">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                        {getInitials(fullName)}
                    </span>
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold leading-tight truncate">
                        {fullName}
                    </p>
                </div>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-0.5 hover:bg-destructive/10 rounded transition-colors"
                        aria-label="Remove patient context"
                    >
                        <X className="size-3 text-muted-foreground hover:text-destructive" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <header
            className={`flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-md ${className}`}
        >
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground size-9"
                    aria-label="Remove patient context"
                >
                    <X className="size-4" />
                </button>
            )}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-8">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                        {getInitials(fullName)}
                    </span>
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-none truncate">{fullName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {patient.diagnosis.cancerType}
                    </p>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                <User className="size-3" />
                Context Active
            </div>
        </header>
    );
}
