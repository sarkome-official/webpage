import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            themeVariables: {
                primaryColor: "#8b5cf6",
                primaryTextColor: "#fff",
                primaryBorderColor: "#7c3aed",
                lineColor: "#a78bfa",
                secondaryColor: "#10b981",
                tertiaryColor: "#3b82f6",
                background: "#0a0a0a",
                mainBkg: "#1e1e1e",
                secondBkg: "#2d2d2d",
                tertiaryBkg: "#3d3d3d",
                textColor: "#e5e7eb",
                border1: "#374151",
                border2: "#4b5563",
            },
        });
    }, []);

    useEffect(() => {
        if (ref.current) {
            try {
                ref.current.innerHTML = chart;
                mermaid.contentLoaded();
            } catch (error) {
                console.error("Mermaid rendering error:", error);
                ref.current.innerHTML = `<pre class="text-red-500">Error rendering diagram</pre>`;
            }
        }
    }, [chart]);

    return (
        <div className="my-6 flex items-center justify-center overflow-x-auto">
            <div
                ref={ref}
                className="mermaid bg-black/20 dark:bg-white/5 p-6 rounded-lg border border-border"
            />
        </div>
    );
}
