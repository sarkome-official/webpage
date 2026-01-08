import { useParams, Navigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docsConfig } from "@/lib/docs-config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mermaid } from "@/components/Mermaid";

export default function DocPage() {
  const { slug } = useParams();
  const doc = docsConfig.find((d) => d.slug === slug);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-8 lg:px-10 lg:py-12 max-w-4xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/docs/intro" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{doc.title}</span>
        </nav>

        {/* Documentation Content */}
        <article className="prose prose-slate dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-display max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return (
                  <h1
                    id={id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 pb-2 border-b"
                  >
                    {children}
                  </h1>
                );
              },
              h2: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return (
                  <h2
                    id={id}
                    className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return (
                  <h3
                    id={id}
                    className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4"
                  >
                    {children}
                  </h3>
                );
              },
              h4: ({ children }) => {
                const id = children?.toString().toLowerCase().replace(/[^\w]+/g, "-");
                return (
                  <h4
                    id={id}
                    className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3"
                  >
                    {children}
                  </h4>
                );
              },
              p: ({ children }) => (
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-7 text-muted-foreground">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-6 border-l-2 border-primary/50 pl-6 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                const language = className?.replace("language-", "");

                // Check if it's a Mermaid diagram
                if (language === "mermaid" && typeof children === "string") {
                  return <Mermaid chart={children} />;
                }

                return isInline ? (
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
                    {children}
                  </code>
                ) : (
                  <code className={cn("block", className)}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="mt-6 mb-4 overflow-x-auto rounded-lg border bg-black/5 dark:bg-white/5 p-4">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="my-8 w-full overflow-x-auto rounded-xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 shadow-sm">
                  <table className="w-full border-collapse min-w-[500px]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-border/30">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="transition-colors hover:bg-muted/30 group">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/90 uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {children}
                </td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
              hr: () => (
                <hr className="my-8 border-border" />
              )
            }}
            remarkPlugins={[remarkGfm]}
          >
            {doc.content}
          </ReactMarkdown>
        </article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t flex items-center justify-between">
          {(() => {
            const currentIndex = docsConfig.findIndex(d => d.slug === slug);
            const prevDoc = currentIndex > 0 ? docsConfig[currentIndex - 1] : null;
            const nextDoc = currentIndex < docsConfig.length - 1 ? docsConfig[currentIndex + 1] : null;

            return (
              <>
                {prevDoc && (
                  <Link
                    to={`/docs/${prevDoc.slug}`}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div>{prevDoc.title}</div>
                    </div>
                  </Link>
                )}
                <div className="flex-1" />
                {nextDoc && (
                  <Link
                    to={`/docs/${nextDoc.slug}`}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
                  >
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Next</div>
                      <div>{nextDoc.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="hidden xl:block w-64 border-l h-[calc(100vh-2rem)] sticky top-8 p-6">
        <h4 className="font-semibold text-sm mb-4 text-foreground">On this page</h4>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <ul className="space-y-2 text-sm">
            {headings.filter(h => h.level <= 3).map((heading, index) => (
              <li
                key={index}
                style={{ paddingLeft: (heading.level - 1) * 12 }}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block py-1 transition-colors border-l-2 pl-3 -ml-3",
                    activeId === heading.id
                      ? "text-primary font-medium border-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:border-muted-foreground/50"
                  )}
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
