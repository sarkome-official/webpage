import * as React from "react"
import {
    Search,
    MessageSquare,
    Network,
    LayoutGrid,
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
    Database,
    LogOut,
    ChevronUp,
    Palette,
    LifeBuoy,
    ChevronRight,
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
    useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { createThreadId, listThreads, setActiveThreadId, type StoredThread } from "@/lib/local-threads"
import { listPatients, getPatientFullName, type PatientRecord } from "@/lib/patient-record"
import { UserPlus, Users } from "lucide-react"

const data = {
    navMain: [
        {
            title: "Intelligence",
            items: [
                {
                    title: "New Chat",
                    url: "/platform",
                    icon: Search,
                },
                {
                    title: "Knowledge Graph",
                    url: "/knowledge-graph",
                    icon: Network,
                },


            ],
        },
        {
            title: "Lab & Results",
            items: [
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
                    title: "API",
                    url: "/api",
                    icon: Code,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();
    const { isMobile, setOpenMobile } = useSidebar();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recentThreads, setRecentThreads] = React.useState<StoredThread[]>(() => listThreads().slice(0, 8));
    const [patients, setPatients] = React.useState<PatientRecord[]>(() => listPatients());

    React.useEffect(() => {
        const refreshThreads = () => setRecentThreads(listThreads().slice(0, 8));
        const refreshPatients = () => setPatients(listPatients());
        
        refreshThreads();
        refreshPatients();

        const onStorage = (e: StorageEvent) => {
            if (!e.key) return;
            if (e.key.includes("sarkome.threads")) refreshThreads();
            if (e.key.includes("sarkome.patients")) refreshPatients();
        };

        window.addEventListener("storage", onStorage);
        window.addEventListener("sarkome:threads", refreshThreads as EventListener);
        window.addEventListener("sarkome:patients", refreshPatients as EventListener);
        
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("sarkome:threads", refreshThreads as EventListener);
            window.removeEventListener("sarkome:patients", refreshPatients as EventListener);
        };
    }, []);

    const filteredNavMain = React.useMemo(() => {
        if (!searchQuery) return data.navMain;

        return data.navMain.map(group => ({
            ...group,
            items: group.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(group => group.items.length > 0);
    }, [searchQuery]);

    return (
        <Sidebar variant="inset" className="bg-background" {...props}>
            <SidebarHeader className="p-4 pt-6">
                <div className="flex flex-col gap-4">
                    <Link to="/platform" className="flex items-center gap-3 px-1 hover:opacity-80 transition-opacity group" aria-label="Sarkome Home">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                            <img src="/logo_purple_nobackground.svg" alt="Sarkome Logo" className="size-5 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                                Sarkome
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-medium leading-none tracking-tighter">
                                Precision Research AI
                            </p>
                        </div>
                    </Link>

                    {/* Quick Search */}
                    <div className="relative px-1">
                        <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground z-10" />
                        <input
                            type="text"
                            placeholder="Search modules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex h-8 w-full items-center rounded-md border border-border bg-muted/50 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary/50 transition-all shadow-xs"
                            aria-label="Search modules"
                        />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup className="py-2">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNavMain.flatMap((group) => group.items).map((item) => {
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
                                            <Link
                                                to={item.url}
                                                className="flex items-center gap-3"
                                                onClick={(e) => {
                                                    if (item.url === "/platform" && item.title === "Nuevo chat") {
                                                        e.preventDefault();
                                                        const newId = createThreadId();
                                                        setActiveThreadId(newId);
                                                        if (isMobile) setOpenMobile(false);
                                                        window.location.href = "/platform";
                                                        return;
                                                    }
                                                    if (isMobile) setOpenMobile(false);
                                                }}
                                            >
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

                {/* Patients Section */}
                <SidebarGroup className="py-2 mt-2 group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1 flex items-center justify-between">
                        <span>My Patients</span>
                        <Users className="size-3 opacity-50" />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {patients.length === 0 ? (
                                <SidebarMenuItem>
                                    <div className="px-2 py-2 text-[11px] text-muted-foreground italic">No patients registered.</div>
                                </SidebarMenuItem>
                            ) : (
                                patients.map((p) => (
                                    <SidebarMenuItem key={p.id}>
                                        <SidebarMenuButton
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-10 transition-colors"
                                            onClick={() => {
                                                if (isMobile) setOpenMobile(false);
                                                window.location.href = `/patient/${p.id}`;
                                            }}
                                        >
                                            <div className="flex flex-col items-start overflow-hidden">
                                                <span className="text-xs font-medium truncate w-full">{getPatientFullName(p)}</span>
                                                <span className="text-[10px] text-muted-foreground/60 truncate w-full">{p.diagnosis.cancerType}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="text-primary hover:text-primary/80 hover:bg-primary/5 h-8 transition-colors mt-1"
                                    onClick={() => {
                                        if (isMobile) setOpenMobile(false);
                                        window.location.href = "/patient/new";
                                    }}
                                >
                                    <UserPlus className="size-3.5 mr-2" />
                                    <span className="text-xs font-semibold">New Patient</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Recent Chats Section */}
                <SidebarGroup className="py-2 mt-2 group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
                        Chats without patient
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {recentThreads.filter(t => !t.patientId).length === 0 ? (
                                <SidebarMenuItem>
                                    <div className="px-2 py-2 text-[11px] text-muted-foreground italic">No recent chats.</div>
                                </SidebarMenuItem>
                            ) : (
                                recentThreads.filter(t => !t.patientId).map((t) => (
                                    <SidebarMenuItem key={t.id}>
                                        <SidebarMenuButton
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 transition-colors"
                                            onClick={() => {
                                                setActiveThreadId(t.id);
                                                if (isMobile) setOpenMobile(false);
                                                window.location.href = "/platform";
                                            }}
                                        >
                                            <span className="text-xs truncate">{(t.title && t.title.trim().length > 0) ? t.title : t.id}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className="opacity-50" />

            <SidebarFooter className="p-4">
                <div className="flex flex-col gap-2">


                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-3 mt-4 px-2 py-3 rounded-xl bg-muted/30 border border-border w-full hover:bg-muted/50 transition-colors cursor-pointer text-left">
                                <div className="size-8 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 p-[1px]">
                                    <div className="size-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                        {user?.picture ? (
                                            <img src={user.picture} alt={user.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <User className="size-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col overflow-hidden flex-1">
                                    <span className="text-xs font-semibold text-foreground truncate">{user?.name || "Sarkome User"}</span>
                                    <span className="text-[10px] text-muted-foreground truncate">{user?.email || "guest@sarkome.ai"}</span>
                                </div>
                                <ChevronUp className="size-4 text-muted-foreground" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 mb-2" align="start" side="top">
                            <div className="p-3 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 p-[1px]">
                                        <div className="size-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                            {user?.picture ? (
                                                <img src={user.picture} alt={user.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                <User className="size-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-semibold text-foreground truncate">{user?.name || "Sarkome User"}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user?.email || "guest@sarkome.ai"}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-1.5 flex flex-col gap-0.5">
                                <button className="flex items-center gap-3 w-full px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left">
                                    <Palette className="size-4 text-muted-foreground" />
                                    <span>Personalization</span>
                                </button>
                                <button className="flex items-center gap-3 w-full px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left">
                                    <Settings className="size-4 text-muted-foreground" />
                                    <span>Settings</span>
                                </button>
                            </div>

                            <div className="h-px bg-border mx-2 my-1" />

                            <div className="p-1.5 flex flex-col gap-0.5">
                                <button className="flex items-center justify-between w-full px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                        <LifeBuoy className="size-4 text-muted-foreground" />
                                        <span>Help</span>
                                    </div>
                                    <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground" />
                                </button>
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center gap-3 w-full px-2.5 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-left group"
                                >
                                    <LogOut className="size-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                                    <span>Sign out</span>
                                </button>

                                <div className="h-px bg-border mx-2 my-1" />

                                <a
                                    href="/"
                                    className="flex items-center gap-3 w-full px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left"
                                >
                                    <ArrowLeft className="size-4 text-muted-foreground" />
                                    <span>Back to Site</span>
                                </a>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
