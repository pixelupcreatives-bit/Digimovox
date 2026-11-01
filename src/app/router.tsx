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
import { AnalyticsTracker } from "@/lib/analytics";

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
    &lt;div className="flex min-h-screen items-center justify-center bg-bg-soft"&gt;
      &lt;Loader2 className="w-7 h-7 animate-spin text-primary" aria-label="Loading" /&gt;
    &lt;/div&gt;
  );
}

function WithFallback({ children }: { children: ReactNode }) {
  return &lt;Suspense fallback={&lt;AdminFallback /&gt;}&gt;{children}&lt;/Suspense&gt;;
}

export function Router() {
  return (
    &lt;BrowserRouter&gt;
      &lt;AnalyticsTracker /&gt;
      &lt;Routes&gt;
        {/* Public website */}
        &lt;Route element={&lt;MainLayout /&gt;}&gt;
          &lt;Route index element={&lt;Home /&gt;} /&gt;
          &lt;Route path="about" element={&lt;About /&gt;} /&gt;
          &lt;Route path="services" element={&lt;Services /&gt;} /&gt;
          &lt;Route path="services/:slug" element={&lt;ServiceDetail /&gt;} /&gt;
          &lt;Route path="pricing" element={&lt;Pricing /&gt;} /&gt;
          &lt;Route path="contact" element={&lt;Contact /&gt;} /&gt;
          &lt;Route path="start-a-project" element={&lt;StartProject /&gt;} /&gt;
          &lt;Route path="work" element={&lt;Portfolio /&gt;} /&gt;
          &lt;Route path="work/:slug" element={&lt;PortfolioDetail /&gt;} /&gt;
          &lt;Route path="insights" element={&lt;Insights /&gt;} /&gt;
          &lt;Route path="insights/category/:slug" element={&lt;InsightCategory /&gt;} /&gt;
          &lt;Route path="insights/:slug" element={&lt;InsightDetail /&gt;} /&gt;
          &lt;Route path="thank-you" element={&lt;ThankYou /&gt;} /&gt;
          &lt;Route path="policies/privacy" element={&lt;PrivacyPolicy /&gt;} /&gt;
          &lt;Route path="policies/terms" element={&lt;TermsOfService /&gt;} /&gt;
          &lt;Route path="privacy-policy" element={&lt;Navigate to="/policies/privacy" replace /&gt;} /&gt;
          &lt;Route path="terms-and-conditions" element={&lt;Navigate to="/policies/terms" replace /&gt;} /&gt;
          &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt;
        &lt;/Route&gt;

        {/* Admin dashboard (own shell, no site header/footer) */}
        &lt;Route
          path="admin/login"
          element={
            &lt;WithFallback&gt;
              &lt;AdminLogin /&gt;
            &lt;/WithFallback&gt;
          }
        /&gt;
        &lt;Route
          path="admin"
          element={
            &lt;RequireAuth&gt;
              &lt;AdminLayout /&gt;
            &lt;/RequireAuth&gt;
          }
        &gt;
          &lt;Route index element={&lt;WithFallback&gt;&lt;AdminDashboard /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="leads" element={&lt;WithFallback&gt;&lt;LeadsPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="leads/:id" element={&lt;WithFallback&gt;&lt;LeadDetailPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="blog" element={&lt;WithFallback&gt;&lt;BlogPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="blog/new" element={&lt;WithFallback&gt;&lt;BlogEditor /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="blog/:slug" element={&lt;WithFallback&gt;&lt;BlogEditor /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="portfolio" element={&lt;WithFallback&gt;&lt;PortfolioPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="portfolio/new" element={&lt;WithFallback&gt;&lt;PortfolioEditor /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="portfolio/:slug" element={&lt;WithFallback&gt;&lt;PortfolioEditor /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="projects" element={&lt;WithFallback&gt;&lt;ProjectsPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="agreements" element={&lt;WithFallback&gt;&lt;AgreementsPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="invoices" element={&lt;WithFallback&gt;&lt;InvoicesPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="quotations" element={&lt;WithFallback&gt;&lt;QuotationsPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="revenue" element={&lt;WithFallback&gt;&lt;RevenuePage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="files" element={&lt;WithFallback&gt;&lt;FilesPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="users" element={&lt;WithFallback&gt;&lt;UsersPage /&gt;&lt;/WithFallback&gt;} /&gt;
          &lt;Route path="settings" element={&lt;WithFallback&gt;&lt;SettingsPage /&gt;&lt;/WithFallback&gt;} /&gt;
        &lt;/Route&gt;

        &lt;Route path="404" element={&lt;NotFound /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}
