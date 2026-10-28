import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  Globe,
  X,
} from "lucide-react";
import { NAV_ITEMS } from "./nav";
import { useAuth, useMode } from "@/store/StoreProvider";
import { ROLE_LABELS } from "@/store/types";
import { cn } from "@/lib/utils";

function titleFor(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  const match = NAV_ITEMS.find(
    (i) => pathname.startsWith(i.to) && i.to !== "/admin",
  );
  if (match) return match.label;
  const tail = pathname.split("/").pop() ?? "";
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

/** Section group shown as an eyebrow above the page title on mobile. */
function sectionFor(pathname: string): string {
  const match = NAV_ITEMS.find(
    (i) => pathname.startsWith(i.to) && i.to !== "/admin",
  );
  return match?.group ?? "Overview";
}

/** Animated three-line hamburger, matching the public site's header. */
function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open navigation menu"
      aria-haspopup="dialog"
      className="group relative w-11 h-11 -ml-1 rounded-button flex items-center justify-center text-text-primary hover:bg-bg-soft active:scale-95 transition-all duration-200"
    >
      <span className="relative flex flex-col items-end gap-[5px]">
        <span className="w-6 h-[2px] bg-text-primary rounded-full group-hover:w-4 transition-all duration-300" />
        <span className="w-4 h-[2px] bg-primary rounded-full group-hover:w-6 transition-all duration-300" />
        <span className="w-6 h-[2px] bg-text-primary rounded-full group-hover:w-4 transition-all duration-300" />
      </span>
    </button>
  );
}

export function AdminLayout() {
  const { user, role, can, logout } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((i) =>
    i.permission === "admin" ? role === "admin" : can(i.permission),
  );

  // Group items by their `group` while preserving order.
  const groups: { name: string; items: typeof visibleItems }[] = [];
  visibleItems.forEach((item) => {
    const name = item.group ?? "Other";
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.items.push(item);
    else groups.push({ name, items: [item] });
  });

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        {/* Light logo on a white tile so it stays crisp on the dark panel */}
        <div className="flex-shrink-0 w-11 h-11 rounded-button bg-white flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          <img src="/logo.png" alt="MovoX" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight truncate">MovoX Admin</p>
          <p className="text-[11px] text-blue-200/70 leading-tight">Digital Growth</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        {groups.map((g) => (
          <div key={g.name} className="mb-5">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-200/50">
              {g.name}
            </p>
            <ul className="space-y-1">
              {g.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/admin"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-blue-100/80 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white/12 border border-white/15 flex items-center justify-center text-white text-xs font-bold">
              {initials(user.name)}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-white truncate">{user.name}</span>
              <span className="block text-[11px] text-blue-200/70 truncate">
                {role ? ROLE_LABELS[role] : user.email}
              </span>
            </span>
          </div>
        )}
        <p className="text-[11px] text-blue-200/70 leading-relaxed">
          Local demo data. Connect a backend for production.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-soft">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <div className="h-full bg-navy" style={{ backgroundImage: "linear-gradient(160deg, #003655 0%, #002941 100%)" }}>
          {sidebar}
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy shadow-card-hover">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 rounded-button p-1.5 text-blue-100/80 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-full" style={{ backgroundImage: "linear-gradient(160deg, #003655 0%, #002941 100%)" }}>
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white border-b border-border-default">
          {/* Brand accent line */}
          <div className="h-1 w-full brand-gradient" aria-hidden="true" />

          {/* ===== Mobile / tablet header ===== */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 pt-3">
              <div className="flex items-center gap-1 min-w-0">
                <img src="/logo.png" alt="MovoX" className="h-8 w-auto flex-shrink-0" />
                <HamburgerButton onClick={() => setMobileOpen(true)} />
              </div>
              <AccountMenu
                user={user}
                role={role}
                can={can}
                onLogout={handleLogout}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
              />
            </div>

            {/* Page context row — gives the title room on small screens */}
            <div className="px-4 pt-3 pb-3">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow text-primary">{sectionFor(location.pathname)}</p>
                  <h1 className="text-xl font-bold text-text-primary leading-tight truncate">
                    {titleFor(location.pathname)}
                  </h1>
                </div>
                <ModeBadge mode={mode} compact />
              </div>
            </div>
          </div>

          {/* ===== Desktop header ===== */}
          <div className="hidden lg:flex items-center gap-3 px-8 py-3.5">
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-text-primary truncate">
                {titleFor(location.pathname)}
              </h1>
            </div>
            <ModeBadge mode={mode} />
            <AccountMenu
              user={user}
              role={role}
              can={can}
              onLogout={handleLogout}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

/** Connection indicator: live (Neon), offline (local fallback), or connecting. */
function ModeBadge({
  mode,
  compact = false,
}: {
  mode: ReturnType<typeof useMode>;
  compact?: boolean;
}) {
  const config = {
    live: { label: compact ? "Live" : "Live · Neon", cls: "bg-success-bg text-success", dot: "bg-success" },
    offline: { label: compact ? "Offline" : "Offline · local", cls: "bg-warning-bg text-warning", dot: "bg-warning" },
    unknown: { label: compact ? "…" : "Connecting…", cls: "bg-bg-soft text-text-muted", dot: "bg-text-muted" },
  }[mode];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        config.cls,
      )}
      title={
        mode === "live"
          ? "Connected to Neon Postgres"
          : mode === "offline"
            ? "API unreachable — using this browser's local data"
            : "Checking the API…"
      }
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

interface AccountMenuProps {
  user: ReturnType<typeof useAuth>["user"];
  role: ReturnType<typeof useAuth>["role"];
  can: ReturnType<typeof useAuth>["can"];
  onLogout: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

/** Avatar + dropdown, used in both the mobile and desktop headers. */
function AccountMenu({
  user,
  role,
  can,
  onLogout,
  menuOpen,
  setMenuOpen,
}: AccountMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="group flex items-center gap-2 rounded-full pl-1 pr-1.5 py-1 hover:bg-bg-soft transition-colors"
      >
        <span className="relative flex-shrink-0">
          <span className="w-9 h-9 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-[0_2px_6px_rgba(0,54,85,0.25)]">
            {initials(user?.name ?? "?")}
          </span>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-white"
            aria-hidden="true"
          />
        </span>
        <span className="hidden sm:block text-left">
          <span className="block text-sm font-semibold text-text-primary leading-tight">
            {user?.name ?? "Unknown"}
          </span>
          <span className="block text-[11px] text-text-muted leading-tight">
            {role ? ROLE_LABELS[role] : "—"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200",
            menuOpen && "rotate-180",
          )}
        />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 z-40 mt-2 w-60 rounded-card-lg border border-border-default bg-white shadow-card-hover overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-default bg-bg-soft/60">
              <span className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {initials(user?.name ?? "?")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
                {role && (
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-primary-light text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {ROLE_LABELS[role]}
                  </span>
                )}
              </div>
            </div>
            <div className="py-1.5">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-soft hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                View website
              </Link>
              {can("users.manage") && (
                <Link
                  to="/admin/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-soft hover:text-primary transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error-bg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Re-export for consumers that want to wrap content in the admin shell. */
export function AdminPage({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
