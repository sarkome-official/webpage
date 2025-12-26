import * as React from "react"
import {
    Search,
    MessageSquare,
    Network,
    Brain,
    FlaskConical,
    Cpu,
    FileText,
    Gavel,
    CloudUpload,
    Code,
    Settings,
    User,
    ArrowLeft,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
    SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Intelligence",
            items: [
                {
                    title: "Query Builder",
                    url: "/platform",
                    icon: Search,
                },
                {
                    title: "Sarkome Logs",
                    url: "/logs",
                    icon: MessageSquare,
                },
                {
                    title: "Knowledge Graph",
                    url: "/knowledge-graph",
                    icon: Network,
                },
                {
                    title: "Agent Status",
                    url: "/status",
                    icon: Brain,
                },
            ],
        },
        {
            title: "Lab & Results",
            items: [
                {
                    title: "Metabolic Sim",
                    url: "/sim",
                    icon: FlaskConical,
                },
                {
                    title: "AlphaFold View",
                    url: "/alphafold",
                    icon: Cpu,
                },
            ],
        },
        {
            title: "Governance & Ops",
            items: [
                {
                    title: "Audit Report",
                    url: "/audit",
                    icon: FileText,
                },
                {
                    title: "Constitution",
                    url: "/constitution",
                    icon: Gavel,
                },
                {
                    title: "Data Ingestion",
                    url: "/ingestion",
                    icon: CloudUpload,
                },
                {
                    title: "Export & API",
                    url: "/api",
                    icon: Code,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();

    return (
        <Sidebar variant="inset" className="bg-background" {...props}>
            <SidebarHeader className="p-4 pt-6">
                <div className="flex flex-col gap-4">
                    <Link to="/platform" className="flex items-center gap-3 px-1 hover:opacity-80 transition-opacity group">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                            <img src="/logo_purple_nobackground.svg" alt="Sarkome Logo" className="size-5 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                                Sarkome OS
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-medium leading-none tracking-tighter">
                                Precision Research AI
                            </p>
                        </div>
                    </Link>

                    {/* Quick Search Placeholder */}
                    <div className="relative px-1">
                        <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                        <div className="flex h-8 w-full items-center rounded-md border border-border bg-muted/50 px-8 text-[11px] text-muted-foreground">
                            Search modules...
                            <kbd className="ml-auto pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground opacity-100">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title} className="py-2">
                        <SidebarGroupLabel className="px-3 text-muted-foreground uppercase text-[9px] font-bold tracking-widest mb-1">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                                className={`transition-all duration-200 ${isActive
                                                    ? "bg-white/5 text-foreground font-medium translate-x-1"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className={`size-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                                                    <span className="text-xs">{item.title}</span>
                                                    {isActive && (
                                                        <div className="ml-auto size-1 rounded-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarSeparator className="opacity-50" />

            <SidebarFooter className="p-4">
                <div className="flex flex-col gap-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-9">
                                <Settings className="size-4 mr-3 text-muted-foreground" />
                                <span className="text-xs">System Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <div className="flex items-center gap-3 mt-4 px-2 py-3 rounded-xl bg-muted/30 border border-border">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 p-[1px]">
                            <div className="size-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                <User className="size-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold text-foreground truncate">Nebula Researcher</span>
                            <span className="text-[10px] text-muted-foreground truncate">pro-account@sarkome.ai</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2"
                    >
                        <ArrowLeft className="size-3" />
                        Back to Site
                    </a>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
