import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Inbox, Eye, Trash2, Search, Plus } from "lucide-react";
import { useDB, deleteLead, updateLeadStatus } from "@/store/StoreProvider";
import type { Lead, LeadSource, LeadStatus } from "@/store/types";
import { LEAD_STATUS_LABELS } from "@/store/types";
import { serviceLabel } from "@/data/projectEnquiry";
import {
  Card,
  Badge,
  StatusBadge,
} from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { ConfirmDialog } from "../ui/Modal";

const sourceLabels: Record<LeadSource, string> = {
  "start-a-project": "Start a Project",
  contact: "Contact Form",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LeadsPage() {
  const db = useDB();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      if (!q) return true;
      return [lead.name, lead.email, lead.company ?? "", lead.referenceId]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [db.leads, query, statusFilter, sourceFilter]);

  const columns: Column<Lead>[] = [
    {
      key: "lead",
      header: "Lead",
      render: (l) => (
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate max-w-[180px]">{l.name}</p>
          <p className="text-xs text-text-muted truncate max-w-[180px]">{l.email}</p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      hideOnMobile: true,
      render: (l) => <span className="text-text-secondary">{l.company || "—"}</span>,
    },
    {
      key: "source",
      header: "Source",
      hideOnMobile: true,
      render: (l) => <Badge tone={l.source === "contact" ? "navy" : "primary"}>{sourceLabels[l.source]}</Badge>,
    },
    {
      key: "services",
      header: "Services / budget",
      hideOnMobile: true,
      render: (l) => (
        <div className="text-xs text-text-secondary">
          {l.services?.length
            ? l.services.map(serviceLabel).join(", ")
            : l.service || "—"}
          {l.budget && <div className="text-text-muted mt-0.5">{l.budget}</div>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (l) => (
        <select
          value={l.status}
          aria-label={`Status for ${l.name}`}
          onChange={(e) => updateLeadStatus(l.id, e.target.value as LeadStatus)}
          className="rounded-button border border-border-default bg-white px-2.5 py-1.5 text-xs font-medium text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      hideOnMobile: true,
      render: (l) => <span className="text-xs text-text-muted">{formatDate(l.submittedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (l) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => navigate(`/admin/leads/${l.id}`)}
            aria-label={`View ${l.name}`}
            className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(l)}
            aria-label={`Delete ${l.name}`}
            className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Sales</p>
          <h1 className="text-2xl font-bold text-text-primary">Leads</h1>
          <p className="text-sm text-text-muted mt-1.5">
            Every enquiry from the Start a Project wizard and the contact form.
          </p>
        </div>
        <Link
          to="/start-a-project"
          className="inline-flex items-center gap-2 rounded-button border border-border-default bg-white px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4" /> New enquiry
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-border-default">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, company or reference…"
              className="w-full rounded-button border border-border-default bg-white pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | LeadStatus)}
              aria-label="Filter by status"
              className="rounded-button border border-border-default bg-white px-3 py-2.5 text-sm text-text-primary focus:border-primary outline-none"
            >
              <option value="all">All statuses</option>
              {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as "all" | LeadSource)}
              aria-label="Filter by source"
              className="rounded-button border border-border-default bg-white px-3 py-2.5 text-sm text-text-primary focus:border-primary outline-none"
            >
              <option value="all">All sources</option>
              <option value="start-a-project">Start a Project</option>
              <option value="contact">Contact Form</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(l) => l.id}
          emptyTitle="No leads found"
          emptyDescription="Try clearing the filters, or wait for new website enquiries."
          emptyIcon={<Inbox className="w-6 h-6" />}
        />

        <div className="flex items-center justify-between gap-3 border-t border-border-default px-6 py-4">
          <p className="text-xs text-text-muted">
            {filtered.length} of {db.leads.length} leads
          </p>
          <StatusBadge status="new" label={`${db.leads.filter((l) => l.status === "new").length} new`} />
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lead"
        message={
          pendingDelete && (
            <>
              Delete the enquiry from <strong>{pendingDelete.name}</strong>? This
              removes it from the inbox permanently.
            </>
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteLead(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
