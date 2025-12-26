import { NavLink, Outlet, Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { docsConfig } from "@/lib/docs-config";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function DocsLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col min-h-full py-4">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Documentation</h2>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {docsConfig.map((doc) => (
          <NavLink
            key={doc.slug}
            to={`/docs/${doc.slug}`}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {doc.title}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto px-2 pt-4 border-t">
        <Link
          to="/"
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
        >
          <ArrowLeft className="size-3" />
          Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="ml-4 font-semibold">Docs</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r h-screen sticky top-0 overflow-hidden">
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
