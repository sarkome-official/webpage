import { ThemeToggle } from "../molecules/ThemeToggle";

export function Header() {
    return (
        <header className="flex justify-between items-center text-[10px] sm:text-xs font-medium tracking-wider sm:tracking-widest text-text-muted uppercase opacity-80 transition-colors duration-500 px-0 w-full">
            <div>AI × 0NC0LOGY</div>
            <div className="flex items-center gap-3 sm:gap-4">
                <ThemeToggle />
            </div>
        </header>
    );
}
