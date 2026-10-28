import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  RefreshCcw,
  ShieldCheck,
  Check,
  X,
  Globe,
  Building2,
  Receipt,
  SlidersHorizontal,
} from "lucide-react";
import { useDB, useMode, saveSetting, refreshData } from "@/store/StoreProvider";
import { Card, CardHeader } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { ALL_PERMISSIONS, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERMISSIONS, type Role } from "@/store/types";
import type { SettingEntry } from "@/store/types";

const ROLE_ORDER: Role[] = ["admin", "operations-manager", "project-manager", "developer", "sales"];

const permissionLabels: Record<string, string> = {
  "dashboard.view": "Dashboard",
  "content.blog": "Blog",
  "content.portfolio": "Portfolio",
  "leads.view": "Leads",
  "projects.view": "Projects",
  "agreements.view": "Agreements",
  "invoices.view": "Invoices",
  "quotations.view": "Quotations",
  "revenue.view": "Revenue",
  "files.view": "File Manager",
  "users.manage": "Users & Roles",
};

const groupIcons: Record<string, typeof Building2> = {
  Company: Building2,
  Enquiries: Globe,
  Invoicing: Receipt,
  Social: Globe,
  Site: SlidersHorizontal,
  General: SlidersHorizontal,
};

export function SettingsPage() {
  const db = useDB();
  const mode = useMode();
  const [confirmRefresh, setConfirmRefresh] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const live = mode === "live";

  const groups = Array.from(new Set(db.settings.map((s) => s.group || "General")));

  function updateSetting(entry: SettingEntry, value: unknown) {
    const next = { ...entry, value };
    saveSetting(next);
    setSavedKey(entry.key);
    setTimeout(() => setSavedKey((k) => (k === entry.key ? null : k)), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-primary">Workspace</p>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1.5">
          Workspace configuration, stored in Neon Postgres.
        </p>
      </div>

      {/* Backend status */}
      <Card>
        <CardHeader title="Backend connection" description="Where the admin data is stored and read from." />
        <div className="px-6 py-6 grid gap-4">
          <div className="flex items-start gap-3 rounded-card-lg border border-border-default bg-bg-soft p-4">
            <Database className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {live ? "Connected to Neon Postgres" : "Local fallback (API unreachable)"}
              </p>
              <p className="text-sm text-text-secondary mt-0.5">
                {live
                  ? "Changes are written to the database immediately and shared across devices."
                  : "The admin is running from this browser's local storage. Start the Worker to go live."}
              </p>
            </div>
          </div>
          <div className="rounded-button border border-border-default bg-white p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-text-muted">Records</span>
              <span className="text-text-secondary">
                {db.leads.length} leads · {db.projects.length} projects · {db.invoices.length} invoices ·{" "}
                {db.quotations.length} quotations
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Database settings */}
      {db.settings.length > 0 && (
        <Card>
          <CardHeader
            title="Site settings"
            description="Key/value settings read from the database (company details, invoicing, social links)."
          />
          <div className="px-6 py-6 space-y-6">
            {groups.map((group) => {
              const Icon = groupIcons[group] ?? SlidersHorizontal;
              const entries = db.settings.filter((s) => (s.group || "General") === group);
              return (
                <div key={group}>
                  <p className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    {group}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {entries.map((entry) => (
                      <label key={entry.key} className="block rounded-button border border-border-default bg-bg-soft/60 px-4 py-3">
                        <span className="flex items-center justify-between gap-2 text-xs font-medium text-text-muted">
                          {entry.label}
                          {savedKey === entry.key && (
                            <span className="inline-flex items-center gap-1 text-success text-[11px] font-semibold">
                              <Check className="w-3 h-3" /> Saved
                            </span>
                          )}
                        </span>
                        {entry.type === "boolean" ? (
                          <span className="mt-2 inline-flex">
                            <input
                              type="checkbox"
                              checked={Boolean(entry.value)}
                              onChange={(e) => updateSetting(entry, e.target.checked)}
                              className="h-4 w-4 rounded border-border-default text-primary focus:ring-primary"
                            />
                          </span>
                        ) : (
                          <input
                            type={entry.type === "number" ? "number" : "text"}
                            value={String(entry.value ?? "")}
                            onChange={(e) =>
                              updateSetting(entry, entry.type === "number" ? Number(e.target.value) : e.target.value)
                            }
                            className="mt-2 w-full rounded-button border border-border-default bg-white px-3 py-2 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Role matrix */}
      <Card>
        <CardHeader title="Role permissions" description="What each role can access across the dashboard." />
        <div className="hidden md:block overflow-x-auto px-6 py-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left text-xs font-bold uppercase tracking-wider text-text-muted py-2 pr-4">Module</th>
                {ROLE_ORDER.map((r) => (
                  <th key={r} className="text-center text-xs font-bold uppercase tracking-wider text-text-muted py-2 px-2">
                    {ROLE_LABELS[r]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map((perm) => (
                <tr key={perm} className="border-b border-border-default last:border-0">
                  <td className="py-2.5 pr-4 text-text-secondary">{permissionLabels[perm] ?? perm}</td>
                  {ROLE_ORDER.map((r) => (
                    <td key={r} className="text-center py-2.5 px-2">
                      {ROLE_PERMISSIONS[r].includes(perm) ? (
                        <Check className="w-4 h-4 text-success mx-auto" aria-label="Allowed" />
                      ) : (
                        <X className="w-4 h-4 text-text-muted/40 mx-auto" aria-label="Not allowed" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3 p-4">
          {ROLE_ORDER.map((r) => (
            <div key={r} className="rounded-card-lg border border-border-default bg-white p-4 shadow-card">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-button bg-primary-light text-primary flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary">{ROLE_LABELS[r]}</p>
                  <p className="text-xs text-text-muted leading-snug mt-0.5">{ROLE_DESCRIPTIONS[r]}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const allowed = ROLE_PERMISSIONS[r].includes(perm);
                  return (
                    <li key={perm} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-text-secondary">{permissionLabels[perm] ?? perm}</span>
                      {allowed ? (
                        <span className="inline-flex items-center gap-1 text-success text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" /> Access
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-text-muted/60 text-xs font-semibold">
                          <X className="w-3.5 h-3.5" /> —
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Data controls */}
      <Card>
        <CardHeader title="Data controls" description="Re-read the latest data from the database." />
        <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Refresh from database</p>
              <p className="text-sm text-text-muted mt-0.5">
                Discards any unsaved local edits and reloads everything from Neon.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmRefresh(true)}
            className="inline-flex items-center gap-2 rounded-button border border-border-default bg-white px-5 py-2.5 text-sm font-semibold text-text-primary hover:border-primary hover:text-primary flex-shrink-0"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh data
          </button>
        </div>
      </Card>

      <p className="text-center text-xs text-text-muted">
        <Link to="/" className="text-primary hover:underline">← Back to website</Link>
      </p>

      <ConfirmDialog
        open={confirmRefresh}
        title="Refresh from database"
        message={<>This reloads every record from Neon Postgres and discards unsaved local edits.</>}
        confirmLabel="Refresh"
        tone="primary"
        onCancel={() => setConfirmRefresh(false)}
        onConfirm={() => {
          void refreshData();
          setConfirmRefresh(false);
        }}
      />
    </div>
  );
}
