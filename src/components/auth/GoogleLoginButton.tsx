import { useAuth } from './AuthProvider';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoogleLoginButton({ className }: { className?: string }) {
    const { login, user, isLoading } = useAuth();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // If loading, do nothing
        if (isLoading) {
            e.preventDefault();
            return;
        }

        // If user is NOT logged in, prevent navigation to /platform and trigger login
        if (!user) {
            e.preventDefault();
            login();
        }
        // If user IS logged in, let the anchor tag default behavior happen (navigate to /platform)
    };

    return (
        <a
            className={cn(
                "inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary transition-all group cursor-pointer",
                isLoading && "opacity-70 cursor-not-allowed",
                className
            )}
            aria-label="Enter Sarkome platform"
            href="/platform"
            data-discover="true"
            onClick={handleClick}
        >
            <span className="mono-text">
                {isLoading ? "LOADING..." : "[ ENTER PLATFORM ]"}
            </span>
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            )}
        </a>
    );
}
