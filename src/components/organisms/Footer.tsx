export function Footer() {
    return (
        <footer className={"pt-12 pb-8 flex flex-col items-center gap-6 border-t border-border-light dark:border-border-dark mt-12"}>
            <img
                src="/logo_purple_nobackground.svg"
                alt="Sarkome Logo"
                className="h-20 w-auto opacity-80"
            />
            <div className={"text-[10px] text-text-muted-light dark:text-text-muted-dark text-center space-y-2"}>
                <p>Designed for Scientific Discovery</p>
                <p>© 2025 Sarkome Institute. All rights reserved.</p>
            </div>
            <div className={"w-full flex justify-between text-[10px] text-text-muted-light dark:text-text-muted-dark mt-4"}>
                <div className={"flex items-center gap-1"}>
                    <span className={"material-symbols-outlined text-[12px]"}>location_on</span>
                    Chile, Santiago
                </div>
                <div className={"flex items-center gap-1"}>
                    <span className={"material-symbols-outlined text-[12px]"}>wb_sunny</span>
                    24°C
                </div>
            </div>
        </footer>
    );
}
