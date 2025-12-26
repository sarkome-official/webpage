import { MapPin, Sun } from 'lucide-react';

export function Footer() {
    return (
        <footer className={"pt-12 pb-8 flex flex-col items-center gap-6 border-t border-border-light dark:border-border-dark mt-12 transition-all duration-500"}>
            <img alt="Sarkome Logo" className="h-20 w-auto opacity-80" loading="lazy" src="/logo_purple_nobackground.svg" />
            <div className={"text-[10px] text-text-muted-light dark:text-text-muted-dark text-center space-y-2"}>
                <p>Designed for Scientific Discovery</p>
                <p>© 2025 Sarkome Institute. All rights reserved.</p>
            </div>
            <div className={"w-full flex justify-between text-[10px] text-text-muted-light dark:text-text-muted-dark mt-4"}>
                <div className={"flex items-center gap-1"}>
                    <MapPin className="w-3 h-3" />
                    Chile, Santiago
                </div>
                <div className={"flex items-center gap-1"}>
                    <Sun className="w-3 h-3" />
                    24°C
                </div>
            </div>
        </footer>
    );
}
