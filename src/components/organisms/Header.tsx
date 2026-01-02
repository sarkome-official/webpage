import { ThemeToggle } from "../molecules/ThemeToggle";

export function Header() {
    return (
        <header className={"flex justify-between items-center text-xs font-medium tracking-widest text-text-muted uppercase opacity-80 transition-colors duration-500 px-4 sm:px-0 w-full"}>
            <div className="hidden sm:block">3DUCATION & T3CHNOLOGY</div>
            <div className={"flex items-center gap-4 ml-auto sm:ml-0"}>
                <div className={"flex items-center gap-2"}>
                    <span className={"relative flex h-2 w-2"}>
                        <span className={"animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"}></span>
                        <span className={"relative inline-flex rounded-full h-2 w-2 bg-primary"}></span>
                    </span>
                    <span className="hidden min-[380px]:inline">System: Online</span>
                    <span className="min-[380px]:hidden inline">Online</span>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
