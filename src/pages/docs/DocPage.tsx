import { useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { docsConfig } from "@/lib/docs-config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export default function DocPage() {
  const { slug } = useParams();
  const doc = docsConfig.find((d) => d.slug === slug);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  if (!doc && !slug) return <Navigate to={`/docs/${docsConfig[0].slug}`} replace />;
  if (!doc) return <div>Document not found</div>;

  // Extract headings for TOC
  useEffect(() => {
    const lines = doc.content.split("\n");
    const extracted = lines
      .filter((line) => line.startsWith("#"))
      .map((line) => {
        const level = line.match(/^#+/)?.[0].length || 0;
        const text = line.replace(/^#+\s*/, "");
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        return { id, text, level };
      });
    setHeadings(extracted);
  }, [doc]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Content */}
      <div className="flex-1 px-6 py-10 lg:px-10 max-w-4xl mx-auto w-full">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>{doc.title}</h1>
          <ReactMarkdown
            components={{
              h1: ({ children }) => {
                 const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                 return <h1 id={id} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">{children}</h1>
              },
              h2: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return <h2 id={id} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4">{children}</h2>;
              },
              h3: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return <h3 id={id} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h3>;
              },
              p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
              ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
              code: ({ children }) => <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{children}</code>,
            }}
          >
            {doc.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="hidden xl:block w-64 border-l h-[calc(100vh-2rem)] sticky top-8 p-6">
        <h4 className="font-semibold text-sm mb-4">On this page</h4>
        <ScrollArea className="h-full">
          <ul className="space-y-2 text-sm">
            {headings.map((heading, index) => (
              <li key={index} style={{ paddingLeft: (heading.level - 1) * 12 }}>
                <a
                  href={`#${heading.id}`}
                  className="text-muted-foreground hover:text-foreground transition-colors block py-1"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>
    </div>
  );
}
