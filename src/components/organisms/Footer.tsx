import { MapPin, Sun } from 'lucide-react';

export function Footer() {
    return (
        <footer className={"pt-12 pb-8 flex flex-col items-center gap-6 border-t border-border-custom mt-12 transition-all duration-500"}>
            <div className="flex flex-col items-center gap-4">
                <img alt="Sarkome Logo" className="w-16 h-16 object-contain opacity-80" src="/logo_purple_nobackground.svg" />
            </div>
            <div className={"text-[10px] text-text-muted text-center space-y-2"}>
                <p>Designed for Scientific Discovery</p>
                <p>© 2024 Sarkome Institute. All rights reserved.</p>
            </div>
            <div className={"w-full flex justify-between text-[10px] text-text-muted mt-4"}>
                <div className={"flex items-center gap-1"}>
                    <MapPin className="w-3 h-3" />
                    STGO, CL
                </div>
                <div className={"flex items-center gap-1"}>
                    <Sun className="w-3 h-3" />
                    XY°C
                </div>
            </div>
        </footer>
    );
}
