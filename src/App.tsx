import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n/useTranslation";

// Pages
import KrakenHome from "./pages/KrakenHome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CatalogPage from "./pages/CatalogPage";
import KrakenGroups from "./pages/KrakenGroups";
import CommunicationPage from "./pages/CommunicationPage";
import CooperationPage from "./pages/CooperationPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";
import GroupDetail from "./pages/GroupDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminApplications from "./pages/admin/AdminApplications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
              {/* Public pages */}
                <Route path="/" element={<KrakenHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/groups" element={<KrakenGroups />} />
                <Route path="/communication" element={<CommunicationPage />} />
                <Route path="/cooperation" element={<CooperationPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Dynamic pages */}
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                
                {/* User dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="groups" element={<AdminGroups />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="applications" element={<AdminApplications />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
