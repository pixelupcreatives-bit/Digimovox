import { Link } from "react-router-dom";
import {
  Inbox,
  FolderKanban,
  ScrollText,
  Receipt,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth, useDB } from "@/store/StoreProvider";
import { formatINR } from "@/lib/utils";
import {
  Card,
  CardHeader,
  StatCard,
  StatusBadge,
  EmptyState,
} from "../ui/Primitives";
import { ROLE_LABELS } from "@/store/types";

function monthLabel(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function AdminDashboard() {
  const { role, can } = useAuth();
  const db = useDB();

  const newLeads = db.leads.filter((l) => l.status === "new");
  const activeProjects = db.projects.filter(
    (p) => p.status === "in-progress" || p.status === "planning",
  );
  const outstandingInvoices = db.invoices.filter(
    (i) => i.status === "sent" || i.status === "overdue",
  );
  const pendingQuotations = db.quotations.filter((q) => q.status === "sent");

  const currentMonth = new Date().toISOString().slice(0, 7);
  const revenueThisMonth = db.revenue
    .filter((r) => r.month === currentMonth && r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);

  const stats = [
    { label: "Total leads", value: db.leads.length, hint: `${newLeads.length} new`, icon: <Inbox className="w-5 h-5" />, show: can("leads.view"), to: "/admin/leads", accent: "primary" as const },
    { label: "Active projects", value: activeProjects.length, hint: `${db.projects.length} total`, icon: <FolderKanban className="w-5 h-5" />, show: can("projects.view"), to: "/admin/projects", accent: "primary" as const },
    { label: "Signed agreements", value: db.agreements.filter((a) => a.status === "signed").length, hint: `${db.agreements.length} total`, icon: <ScrollText className="w-5 h-5" />, show: can("agreements.view"), to: "/admin/agreements", accent: "success" as const },
    { label: "Outstanding invoices", value: formatINR(outstandingInvoices.reduce((s, i) => s + i.amount, 0)), hint: `${outstandingInvoices.length} open`, icon: <Receipt className="w-5 h-5" />, show: can("invoices.view"), to: "/admin/invoices", accent: "warning" as const },
    { label: "Pending quotations", value: pendingQuotations.length, hint: "awaiting decision", icon: <AlertCircle className="w-5 h-5" />, show: can("quotations.view"), to: "/admin/quotations", accent: "warning" as const },
    { label: "Revenue this month", value: formatINR(revenueThisMonth), hint: monthLabel(currentMonth), icon: <TrendingUp className="w-5 h-5" />, show: can("revenue.view"), to: "/admin/revenue", accent: "success" as const },
  ].filter((s) => s.show);

  const recentLeads = db.leads.slice(0, 5);
  const revenueSeries = [...db.revenue]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);
  const maxRevenue = Math.max(1, ...revenueSeries.map((r) => r.amount));

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back{role ? ` — ${ROLE_LABELS[role]}` : ""}</h1>
          <p className="text-sm text-text-muted mt-1.5">
            Here's what's happening across the business. Your view is tailored to your role.
          </p>
        </div>
        {can("leads.view") && (
          <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Open Leads <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="block hover:shadow-card-hover transition-shadow rounded-card-lg">
            <StatCard
              label={s.label}
              value={s.value}
              hint={s.hint}
              icon={s.icon}
              accent={s.accent}
            />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        {can("leads.view") && (
          <Card>
            <CardHeader
              title="Recent leads"
              description="Latest enquiries from the Start a Project wizard and the contact form."
              action={
                <Link to="/admin/leads" className="text-sm font-semibold text-primary hover:underline">
                  View all
                </Link>
              }
            />
            {recentLeads.length > 0 ? (
              <ul className="space-y-3 p-4 md:p-0 md:space-y-0 md:divide-y md:divide-border-default">
                {recentLeads.map((lead) => (
                  <li
                    key={lead.id}
                    className="rounded-card-lg border border-border-default bg-white p-4 shadow-card md:rounded-none md:border-0 md:bg-transparent md:px-6 md:py-3.5 md:shadow-none"
                  >
                    <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{lead.name}</p>
                      <p className="text-xs text-text-muted truncate">{lead.company ?? lead.email}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <StatusBadge status={lead.status} label={lead.status} />
                      <p className="text-[11px] text-text-muted mt-1">
                        {lead.source === "contact" ? "Contact" : "Start a Project"}
                      </p>
                    </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No leads yet"
                description="Submissions from the website will appear here."
                icon={<Inbox className="w-6 h-6" />}
              />
            )}
          </Card>
        )}

        {/* Revenue chart */}
        {can("revenue.view") && (
          <Card>
            <CardHeader
              title="Revenue trend"
              description="Income vs forecast by month."
              action={
                <Link to="/admin/revenue" className="text-sm font-semibold text-primary hover:underline">
                  Revenue
                </Link>
              }
            />
            <div className="px-6 py-6">
              {revenueSeries.length > 0 ? (
                <div className="flex items-end gap-3 h-44">
                  {revenueSeries.map((r) => (
                    <div key={r.id} className="flex-1 flex flex-col items-center justify-end gap-2">
                      <span className="text-[11px] font-semibold text-text-secondary">
                        {formatINR(r.amount).replace("₹", "")}
                      </span>
                      <div
                        className={r.type === "income" ? "w-full rounded-t-button bg-primary" : "w-full rounded-t-button bg-warning/70"}
                        style={{ height: `${Math.max(4, (r.amount / maxRevenue) * 100)}%` }}
                        title={`${monthLabel(r.month)} · ${formatINR(r.amount)} (${r.type})`}
                      />
                      <span className="text-[11px] text-text-muted">{monthLabel(r.month)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No revenue data" icon={<TrendingUp className="w-6 h-6" />} />
              )}
              <div className="mt-4 flex items-center gap-4 text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Income</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning/70" /> Forecast</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
