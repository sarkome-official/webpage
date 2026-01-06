import { useEffect, lazy, Suspense } from "react";
import { ThemeToggle } from "@/components/molecules";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AgentProvider } from "@/contexts/AgentContext";
import { docsConfig } from "@/lib/docs-config";

// Lazy loaded components
const KnowledgeGraph = lazy(() => import("@/pages/platform/KnowledgeGraphView").then(m => ({ default: m.KnowledgeGraphView })));
const KnowledgeGraphNodes = lazy(() => import("@/pages/platform/KnowledgeGraphNodes").then(m => ({ default: m.KnowledgeGraphNodes })));
const AlphaFoldView = lazy(() => import("@/pages/platform/AlphaFoldView").then(m => ({ default: m.AlphaFoldView })));
const ApiView = lazy(() => import("@/pages/platform/ApiView").then(m => ({ default: m.ApiView })));
const HistoryView = lazy(() => import("@/pages/platform/HistoryView").then(m => ({ default: m.HistoryView })));
const SimulationView = lazy(() => import("@/pages/platform/SimulationView").then(m => ({ default: m.SimulationView })));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const ProgramDetail = lazy(() => import("@/pages/programs/ProgramDetail"));
const DocsLayout = lazy(() => import("@/pages/docs/DocsLayout").then(m => ({ default: m.DocsLayout })));
const DocPage = lazy(() => import("@/pages/docs/DocPage"));
const NewPatientForm = lazy(() => import("@/components/NewPatientForm"));
const PatientRecordView = lazy(() => import("@/pages/platform/PatientRecordView"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const ChatInterface = lazy(() => import("@/components/ChatInterface"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isPlatformRoute = location.pathname.startsWith("/platform") ||
    location.pathname.startsWith("/patient") ||
    location.pathname === "/knowledge-graph" ||
    location.pathname === "/alphafold" ||
    location.pathname === "/knowledge-graph-nodes" ||
    location.pathname === "/api" ||
    location.pathname === "/sim" ||
    location.pathname === "/history";

  // Public routes (no auth required)
  if (!isPlatformRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<Navigate to={`/docs/${docsConfig[0].slug}`} replace />} />
            <Route path=":slug" element={<DocPage />} />
          </Route>
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    );
  }

  // Protected platform routes - wrapped with AgentProvider to persist chat state
  return (
    <ProtectedRoute>
      <AgentProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex h-screen bg-background text-foreground font-sans antialiased w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
              <header className="flex h-14 items-center gap-3 border-b border-border bg-background/50 px-4 sm:px-6 backdrop-blur-xl sticky top-0 z-10">
                <SidebarTrigger className="text-[#7E22CE] hover:text-[#7E22CE] transition-colors" />

                {/* App branding - visible on mobile */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm tracking-tight text-foreground">Sarkome</span>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <ThemeToggle />
                </div>
              </header>
              <main className="h-full w-full mx-auto overflow-y-auto no-scrollbar">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
                    <Route path="/knowledge-graph-nodes" element={<KnowledgeGraphNodes />} />
                    <Route path="/alphafold" element={<AlphaFoldView />} />
                    <Route path="/api" element={<ApiView />} />
                    <Route path="/sim" element={<SimulationView />} />
                    <Route path="/history" element={<HistoryView />} />
                    <Route path="/patient/new" element={<NewPatientForm />} />
                    <Route path="/patient/:patientId" element={<PatientRecordView />} />
                    <Route path="/platform" element={<ChatInterface />} />
                  </Routes>
                </Suspense>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AgentProvider>
    </ProtectedRoute>
  );
}
