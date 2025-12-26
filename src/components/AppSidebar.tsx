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
        <Sidebar variant="inset" className="border-r border-neutral-800/50" {...props}>
            <SidebarHeader className="p-4 pt-6">
                <div className="flex flex-col gap-4">
                    <Link to="/platform" className="flex items-center gap-3 px-1 hover:opacity-80 transition-opacity group">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/10 border border-white/10 group-hover:scale-105 transition-transform">
                            <img src="/logo_purple_nobackground.svg" alt="Sarkome Logo" className="size-5 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold tracking-tight text-neutral-100 uppercase">
                                Sarkome OS
                            </h2>
                            <p className="text-[10px] text-neutral-500 font-medium leading-none tracking-tighter">
                                Precision Research AI
                            </p>
                        </div>
                    </Link>

                    {/* Quick Search Placeholder */}
                    <div className="relative px-1">
                        <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-neutral-500" />
                        <div className="flex h-8 w-full items-center rounded-md border border-neutral-800 bg-neutral-900/50 px-8 text-[11px] text-neutral-500">
                            Search modules...
                            <kbd className="ml-auto pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[8px] font-medium text-neutral-400 opacity-100">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title} className="py-2">
                        <SidebarGroupLabel className="px-3 text-neutral-500 uppercase text-[9px] font-bold tracking-widest mb-1">
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
                                                    ? "bg-blue-500/10 text-blue-400 font-medium translate-x-1"
                                                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                                                    }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className={`size-4 shrink-0 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />
                                                    <span className="text-xs">{item.title}</span>
                                                    {isActive && (
                                                        <div className="ml-auto size-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
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
                            <SidebarMenuButton className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 h-9">
                                <Settings className="size-4 mr-3 text-neutral-500" />
                                <span className="text-xs">System Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <div className="flex items-center gap-3 mt-4 px-2 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px]">
                            <div className="size-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                                <User className="size-4 text-neutral-400" />
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold text-neutral-200 truncate">Nebula Researcher</span>
                            <span className="text-[10px] text-neutral-500 truncate">pro-account@sarkome.ai</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors px-2"
                    >
                        <ArrowLeft className="size-3" />
                        Back to Site
                    </a>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
