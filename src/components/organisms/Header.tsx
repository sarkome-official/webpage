import { ThemeToggle } from "../ui/ThemeToggle";

export function Header() {
    return (
        <header className={"flex justify-between items-center text-xs font-medium tracking-widest text-text-muted-light dark:text-text-muted-dark uppercase opacity-80"}>
            <div>EST. 2025</div>
            <div className={"flex items-center gap-4"}>
                <div className={"flex items-center gap-2"}>
                    <span className={"relative flex h-2 w-2"}>
                        <span className={"animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"}></span>
                        <span className={"relative inline-flex rounded-full h-2 w-2 bg-primary"}></span>
                    </span>
                    System: Online
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
