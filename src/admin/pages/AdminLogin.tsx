import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  ShieldCheck,
  LayoutDashboard,
  Newspaper,
  Inbox,
  FolderKanban,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/store/StoreProvider";
import { ROLE_LABELS, type Role } from "@/store/types";

/** Real admin account in the Neon database (password reset via db:adopt). */
const ADMIN_PASSWORD = "MovoX@2026";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type Values = z.infer<typeof schema>;

/** Admin account surfaced on the login screen. */
const demoAccounts: { email: string; role: Role; name: string }[] = [
  { email: "admin@heymovox.com", role: "admin", name: "Admin User" },
];

/** What the dashboard unlocks — shown on the brand panel. */
const features = [
  { icon: LayoutDashboard, title: "One workspace", text: "Every module your team needs, in one place." },
  { icon: Inbox, title: "Leads inbox", text: "Enquiries from the Start a Project wizard and contact form." },
  { icon: Newspaper, title: "Live content CMS", text: "Edit the Blog and Portfolio — changes publish instantly." },
  { icon: FolderKanban, title: "Delivery pipeline", text: "Projects, agreements, invoices and quotations." },
  { icon: TrendingUp, title: "Revenue & files", text: "Track income and keep project assets organised." },
];

export function AdminLogin() {
  const { user, loginRemote, loginLocal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/admin";

  // Already signed in — go straight to the dashboard.
  if (user) {
    return <Navigate to={from} replace />;
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    // Try the real API first, then fall back to local demo auth when offline.
    const remote = await loginRemote(values.email, values.password).catch(() => ({
      ok: false,
      error: "offline",
    }));
    if (remote.ok) {
      navigate(from, { replace: true });
      return;
    }
    const local = loginLocal(values.email, values.password);
    if (local.ok) {
      navigate(from, { replace: true });
      return;
    }
    setServerError(local.error ?? remote.error ?? "Sign in failed. Please try again.");
  }

  function useDemo(email: string) {
    setValue("email", email);
    setValue("password", ADMIN_PASSWORD);
    // Mirror into the uncontrolled inputs so the fields visibly populate.
    setField("email", email);
    setField("password", ADMIN_PASSWORD);
    setServerError(null);
  }

  function setField(id: string, value: string) {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) el.value = value;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy"
      style={{ backgroundImage: "linear-gradient(135deg, #2382B8 0%, #003655 60%, #002941 100%)" }}
    >
      {/* Animated grid + glows */}
      <div className="hero-grid" aria-hidden="true">
        <div className="hero-grid-lines" />
        <div className="hero-grid-accent" />
      </div>
      <div
        className="absolute -top-40 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/30 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-24 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-[150px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* ===== Brand panel ===== */}
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 py-16">
          <div className="max-w-lg animate-fade-in" style={{ animationDelay: "0.05s" }}>
            {/* White logo variant for the dark panel */}
            <img src="/logo-white.png" alt="MovoX" className="h-11 w-auto mb-10 drop-shadow-sm" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light/80 mb-4">
              MovoX Admin
            </p>
            <h1 className="text-white text-4xl xl:text-5xl font-heading font-bold leading-[1.12] tracking-tight mb-5">
              Run your entire business from{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #9fd8f0 60%, #4fb0dd 100%)" }}>
                one dashboard.
              </span>
            </h1>
            <p className="text-blue-100/80 text-base leading-relaxed max-w-md mb-10">
              Manage content, review every enquiry, and give each team member
              exactly the access their role needs.
            </p>

            <ul className="space-y-5 mb-10">
              {features.map((f, i) => (
                <li
                  key={f.title}
                  className="flex items-start gap-3.5 animate-slide-up"
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-button bg-white/10 border border-white/15 flex items-center justify-center text-white/90">
                    <f.icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{f.title}</span>
                    <span className="block text-sm text-blue-100/70 leading-snug">{f.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Role chips */}
            <div className="animate-slide-up" style={{ animationDelay: "0.55s" }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">
                Five role-based views
              </p>
              <div className="flex flex-wrap gap-2">
                {(["admin", "operations-manager", "project-manager", "developer", "sales"] as Role[]).map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/12 px-3.5 py-1.5 text-xs font-medium text-white/80"
                  >
                    <Users className="w-3 h-3 text-primary-light/70" />
                    {ROLE_LABELS[r]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Sign-in panel ===== */}
        <div className="flex items-center justify-center px-5 sm:px-10 py-12 lg:py-16">
          <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {/* ===== Requested: the light logo ===== */}
            <div className="rounded-card-lg bg-white p-8 sm:p-9 shadow-card-hover">
              <div className="flex flex-col items-center text-center mb-7">
                <img src="/logo.png" alt="MovoX" className="h-12 w-auto mb-5" />
                <h2 className="text-2xl font-heading font-bold text-text-primary">
                  Sign in to your workspace
                </h2>
                <p className="text-sm text-text-muted mt-1.5">
                  Use a team account to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      {...register("email")}
                      className="w-full rounded-button border border-border-default bg-white pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="you@movox.com"
                    />
                  </div>
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-sm text-error">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      {...register("password")}
                      className="w-full rounded-button border border-border-default bg-white pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p role="alert" className="mt-1.5 text-sm text-error">{errors.password.message}</p>
                  )}
                </div>

                {serverError && (
                  <div role="alert" className="rounded-button border border-error bg-error-bg px-4 py-3 text-sm text-error">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gradient inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-button text-white font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign in
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Demo mode — local authentication only
                </p>
              </form>

              {/* Demo accounts */}
              <div className="mt-7 rounded-button border border-border-default bg-bg-soft p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Admin account · password{" "}
                  <code className="px-1 rounded bg-white border border-border-default">{ADMIN_PASSWORD}</code>
                </p>
                <div className="grid gap-1.5">
                  {demoAccounts.map((a) => (
                    <button
                      key={a.email}
                      type="button"
                      onClick={() => useDemo(a.email)}
                      className="flex items-center justify-between gap-3 rounded-button border border-border-default bg-white px-3 py-2 text-left hover:border-primary hover:bg-primary-subtle transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-text-primary truncate">{a.name}</span>
                        <span className="block text-xs text-text-muted truncate">{a.email}</span>
                      </span>
                      <span className="flex-shrink-0 text-[11px] font-semibold text-primary uppercase tracking-wide">
                        {ROLE_LABELS[a.role]}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-[11px] text-text-muted leading-relaxed">
                  Authentication is local demo only. A production build would verify
                  credentials and sessions on a server.
                </p>
              </div>
            </div>

            {/* Card footer links */}
            <div className="mt-5 flex items-center justify-between gap-4 text-xs">
              <Link to="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Back to website
              </Link>
              <Link to="/policies/privacy" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
