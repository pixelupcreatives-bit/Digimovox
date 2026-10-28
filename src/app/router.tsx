import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/services/ServiceDetail";
import { Pricing } from "@/pages/Pricing";
import { Contact } from "@/pages/Contact";
import { StartProject } from "@/pages/StartProject";
import { Portfolio } from "@/pages/portfolio/Portfolio";
import { PortfolioDetail } from "@/pages/portfolio/PortfolioDetail";
import { Insights } from "@/pages/insights/Insights";
import { InsightCategory } from "@/pages/insights/InsightCategory";
import { InsightDetail } from "@/pages/insights/InsightDetail";
import { NotFound } from "@/pages/NotFound";
import { ThankYou } from "@/pages/system/ThankYou";
import { PrivacyPolicy } from "@/pages/legal/PrivacyPolicy";
import { TermsOfService } from "@/pages/legal/TermsOfService";
import { AdminLayout } from "@/admin/AdminLayout";
import { RequireAuth } from "@/admin/guards";

// Admin pages are code-split so the public site bundle stays lean.
const AdminLogin = lazy(() => import("@/admin/pages/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("@/admin/pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const LeadsPage = lazy(() => import("@/admin/pages/LeadsPage").then((m) => ({ default: m.LeadsPage })));
const LeadDetailPage = lazy(() => import("@/admin/pages/LeadDetailPage").then((m) => ({ default: m.LeadDetailPage })));
const BlogPage = lazy(() => import("@/admin/pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const BlogEditor = lazy(() => import("@/admin/pages/BlogEditor").then((m) => ({ default: m.BlogEditor })));
const PortfolioPage = lazy(() => import("@/admin/pages/PortfolioPage").then((m) => ({ default: m.PortfolioPage })));
const PortfolioEditor = lazy(() => import("@/admin/pages/PortfolioEditor").then((m) => ({ default: m.PortfolioEditor })));
const ProjectsPage = lazy(() => import("@/admin/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const AgreementsPage = lazy(() => import("@/admin/pages/AgreementsPage").then((m) => ({ default: m.AgreementsPage })));
const InvoicesPage = lazy(() => import("@/admin/pages/InvoicesPage").then((m) => ({ default: m.InvoicesPage })));
const QuotationsPage = lazy(() => import("@/admin/pages/QuotationsPage").then((m) => ({ default: m.QuotationsPage })));
const RevenuePage = lazy(() => import("@/admin/pages/RevenuePage").then((m) => ({ default: m.RevenuePage })));
const FilesPage = lazy(() => import("@/admin/pages/FilesPage").then((m) => ({ default: m.FilesPage })));
const UsersPage = lazy(() => import("@/admin/pages/UsersPage").then((m) => ({ default: m.UsersPage })));
const SettingsPage = lazy(() => import("@/admin/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-soft">
      <Loader2 className="w-7 h-7 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}

function WithFallback({ children }: { children: ReactNode }) {
  return <Suspense fallback={<AdminFallback />}>{children}</Suspense>;
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="start-a-project" element={<StartProject />} />
          <Route path="work" element={<Portfolio />} />
          <Route path="work/:slug" element={<PortfolioDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/category/:slug" element={<InsightCategory />} />
          <Route path="insights/:slug" element={<InsightDetail />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="policies/privacy" element={<PrivacyPolicy />} />
          <Route path="policies/terms" element={<TermsOfService />} />
          <Route path="privacy-policy" element={<Navigate to="/policies/privacy" replace />} />
          <Route path="terms-and-conditions" element={<Navigate to="/policies/terms" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin dashboard (own shell, no site header/footer) */}
        <Route
          path="admin/login"
          element={
            <WithFallback>
              <AdminLogin />
            </WithFallback>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<WithFallback><AdminDashboard /></WithFallback>} />
          <Route path="leads" element={<WithFallback><LeadsPage /></WithFallback>} />
          <Route path="leads/:id" element={<WithFallback><LeadDetailPage /></WithFallback>} />
          <Route path="blog" element={<WithFallback><BlogPage /></WithFallback>} />
          <Route path="blog/new" element={<WithFallback><BlogEditor /></WithFallback>} />
          <Route path="blog/:slug" element={<WithFallback><BlogEditor /></WithFallback>} />
          <Route path="portfolio" element={<WithFallback><PortfolioPage /></WithFallback>} />
          <Route path="portfolio/new" element={<WithFallback><PortfolioEditor /></WithFallback>} />
          <Route path="portfolio/:slug" element={<WithFallback><PortfolioEditor /></WithFallback>} />
          <Route path="projects" element={<WithFallback><ProjectsPage /></WithFallback>} />
          <Route path="agreements" element={<WithFallback><AgreementsPage /></WithFallback>} />
          <Route path="invoices" element={<WithFallback><InvoicesPage /></WithFallback>} />
          <Route path="quotations" element={<WithFallback><QuotationsPage /></WithFallback>} />
          <Route path="revenue" element={<WithFallback><RevenuePage /></WithFallback>} />
          <Route path="files" element={<WithFallback><FilesPage /></WithFallback>} />
          <Route path="users" element={<WithFallback><UsersPage /></WithFallback>} />
          <Route path="settings" element={<WithFallback><SettingsPage /></WithFallback>} />
        </Route>

        <Route path="404" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
