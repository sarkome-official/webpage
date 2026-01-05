import { NavLink, Outlet, Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { docsConfig } from "@/lib/docs-config";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function DocsLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col min-h-full py-6">
      {/* Header */}
      <div className="px-6 mb-6">
        <Link to="/" className="flex items-center gap-2 mb-2">
          <img src="/logo_purple_nobackground.svg" alt="Sarkome" className="w-8 h-8" />
          <span className="font-bold text-lg">Sarkome</span>
        </Link>
        <p className="text-sm text-muted-foreground">Technical Documentation</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3">
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Getting Started
            </h4>
          </div>
          {docsConfig.slice(0, 1).map((doc) => (
            <NavLink
              key={doc.slug}
              to={`/docs/${doc.slug}`}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )
              }
            >
              {doc.title}
            </NavLink>
          ))}

          <div className="px-3 mb-2 mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Core Concepts
            </h4>
          </div>
          {docsConfig.slice(1, -2).map((doc) => (
            <NavLink
              key={doc.slug}
              to={`/docs/${doc.slug}`}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )
              }
            >
              {doc.title}
            </NavLink>
          ))}

          <div className="px-3 mb-2 mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Advanced
            </h4>
          </div>
          {docsConfig.slice(-2).map((doc) => (
            <NavLink
              key={doc.slug}
              to={`/docs/${doc.slug}`}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 text-sm font-medium rounded-md transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )
              }
            >
              {doc.title}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-3 pt-6 border-t">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Link
          to="/faq"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted mt-1"
        >
          <BookOpen className="size-4" />
          FAQ
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <img src="/logo_purple_nobackground.svg" alt="Sarkome" className="w-6 h-6" />
          <span className="font-semibold">Documentation</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r h-screen sticky top-0 overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarContent />
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
