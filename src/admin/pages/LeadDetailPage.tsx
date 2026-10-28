import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Inbox } from "lucide-react";
import { useDB, deleteLead, updateLeadStatus } from "@/store/StoreProvider";
import type { LeadStatus } from "@/store/types";
import { LEAD_STATUS_LABELS } from "@/store/types";
import { serviceLabel } from "@/data/projectEnquiry";
import { Card, CardHeader, Badge, StatusBadge, EmptyState } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { formatINR } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 py-3 border-b border-border-default last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="text-sm text-text-secondary break-words">{value || "—"}</dd>
    </div>
  );
}

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const db = useDB();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(false);

  const lead = db.leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <Card>
        <EmptyState
          title="Lead not found"
          description="It may have been deleted."
          icon={<Inbox className="w-6 h-6" />}
          action={
            <Link to="/admin/leads" className="text-sm font-semibold text-primary hover:underline">
              Back to Leads
            </Link>
          }
        />
      </Card>
    );
  }

  const budgetLabel = lead.budget ? serviceBudgetLabel(lead.budget) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> All leads
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPendingDelete(true)}
            className="inline-flex items-center gap-2 rounded-button border border-error/40 text-error px-4 py-2.5 text-sm font-semibold hover:bg-error-bg"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <Card>
        <CardHeader
          title={lead.name}
          description={`${lead.referenceId} · submitted ${formatDate(lead.submittedAt)}`}
          action={
            <div className="flex items-center gap-2">
              <Badge tone={lead.source === "contact" ? "navy" : "primary"}>
                {lead.source === "contact" ? "Contact Form" : "Start a Project"}
              </Badge>
              <StatusBadge status={lead.status} />
            </div>
          }
        />

        <div className="px-6 py-6 grid lg:grid-cols-3 gap-6">
          {/* Status control */}
          <div className="rounded-card-lg border border-border-default bg-bg-soft p-5">
            <p className="text-sm font-semibold text-text-primary mb-3">Update status</p>
            <select
              value={lead.status}
              aria-label="Lead status"
              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full rounded-button border border-border-default bg-white px-3 py-2.5 text-sm text-text-primary focus:border-primary outline-none"
            >
              {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              New → Contacted → Qualified → Proposal Sent → Won / Lost.
            </p>
          </div>

          {/* Contact + details */}
          <div className="lg:col-span-2">
            <dl>
              <Row label="Full name" value={lead.name} />
              <Row label="Email" value={lead.email} />
              <Row label="Phone" value={lead.phone} />
              <Row label="Company" value={lead.company} />
              <Row
                label="Services"
                value={
                  lead.services?.length
                    ? lead.services.map(serviceLabel).join(", ")
                    : lead.service || null
                }
              />
              <Row label="Budget" value={budgetLabel} />
              <Row label="Timeline" value={lead.timeline} />
              <Row label="Message" value={lead.message} />
            </dl>
          </div>
        </div>

        {/* Raw payload — full fidelity */}
        <div className="border-t border-border-default px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
            Submitted payload
          </p>
          <pre className="rounded-button bg-navy text-blue-100 text-xs leading-relaxed p-4 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(lead.raw, null, 2)}
          </pre>
        </div>
      </Card>

      <ConfirmDialog
        open={pendingDelete}
        title="Delete lead"
        message={
          <>
            Delete the enquiry from <strong>{lead.name}</strong>? This removes it
            from the inbox permanently.
          </>
        }
        onCancel={() => setPendingDelete(false)}
        onConfirm={() => {
          deleteLead(lead.id);
          setPendingDelete(false);
          navigate("/admin/leads", { replace: true });
        }}
      />
    </div>
  );
}

/** Map wizard budget ids to their public labels. */
function serviceBudgetLabel(id: string): string | null {
  const map: Record<string, string> = {
    "under-10k": "Under ₹10,000",
    "10k-25k": "₹10,000–₹25,000",
    "25k-50k": "₹25,000–₹50,000",
    "50k-1l": "₹50,000–₹1,00,000",
    "1l-3l": "₹1,00,000–₹3,00,000",
    "3l-plus": "₹3,00,000+",
    "not-sure": "Not Sure Yet",
    "1l-plus": "₹1,00,000+",
    guidance: "Need Guidance",
  };
  if (map[id]) return map[id];
  return formatINR(Number(id)) || id;
}
