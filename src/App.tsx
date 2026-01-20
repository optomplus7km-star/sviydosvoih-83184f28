import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Catalog from "./pages/Catalog";
import Communication from "./pages/Communication";
import Cooperation from "./pages/Cooperation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminApplications from "./pages/admin/AdminApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/cooperation" element={<Cooperation />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                {/* Legacy routes redirect */}
                <Route path="/groups" element={<Catalog />} />
                <Route path="/projects" element={<Cooperation />} />
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="groups" element={<AdminGroups />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="applications" element={<AdminApplications />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
