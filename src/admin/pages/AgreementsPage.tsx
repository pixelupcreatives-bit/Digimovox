import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollText, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, saveAgreement, deleteAgreement, uid } from "@/store/StoreProvider";
import type { Agreement, AgreementStatus } from "@/store/types";
import { formatINR } from "@/lib/utils";
import { Card, StatCard, StatusBadge } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { FormModal } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  title: z.string().min(3, "Title is required."),
  projectName: z.string().min(2, "Project name is required."),
  clientId: z.string().optional(),
  status: z.enum(["draft", "sent", "signed", "expired"]),
  value: z.coerce.number().min(0),
  signedAt: z.string().optional(),
});
type Values = z.infer<typeof schema>;

const STATUS: AgreementStatus[] = ["draft", "sent", "signed", "expired"];

export function AgreementsPage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Agreement | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Agreement | null>(null);

  const signed = db.agreements.filter((a) => a.status === "signed").length;
  const sent = db.agreements.filter((a) => a.status === "sent").length;
  const totalValue = db.agreements.reduce((s, a) => s + a.value, 0);

  const columns: Column<Agreement>[] = [
    {
      key: "title",
      header: "Agreement",
      render: (a) => (
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate max-w-[220px]">{a.title}</p>
          <p className="text-xs text-text-muted truncate max-w-[220px]">{a.projectName}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "value",
      header: "Value",
      hideOnMobile: true,
      align: "right",
      render: (a) => <span className="text-text-secondary">{formatINR(a.value)}</span>,
    },
    {
      key: "signed",
      header: "Signed",
      hideOnMobile: true,
      render: (a) => (
        <span className="text-xs text-text-muted">
          {a.signedAt ? new Date(a.signedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => { setEditing(a); setEditorOpen(true); }} aria-label={`Edit ${a.title}`} className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"><Pencil className="w-4 h-4" /></button>
          <button type="button" onClick={() => setPendingDelete(a)} aria-label={`Delete ${a.title}`} className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Operations</p>
          <h1 className="text-2xl font-bold text-text-primary">Agreements</h1>
          <p className="text-sm text-text-muted mt-1.5">Client contracts and their signing status.</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setEditorOpen(true); }} className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> New agreement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total agreements" value={db.agreements.length} hint={formatINR(totalValue) + " value"} icon={<ScrollText className="w-5 h-5" />} accent="primary" />
        <StatCard label="Signed" value={signed} hint="executed" icon={<ScrollText className="w-5 h-5" />} accent="success" />
        <StatCard label="Awaiting signature" value={sent} hint="sent to clients" icon={<ScrollText className="w-5 h-5" />} accent="warning" />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={db.agreements}
          rowKey={(a) => a.id}
          emptyTitle="No agreements"
          emptyDescription="Add a client agreement to track it here."
          emptyIcon={<ScrollText className="w-6 h-6" />}
        />
      </Card>

      <AgreementEditorModal
        open={editorOpen}
        editing={editing}
        onClose={() => setEditorOpen(false)}
        onSave={(a) => { saveAgreement(a); setEditorOpen(false); }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete agreement"
        message={pendingDelete && <>Delete <strong>{pendingDelete.title}</strong>? This removes it permanently.</>}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) deleteAgreement(pendingDelete.id); setPendingDelete(null); }}
      />
    </div>
  );
}

function AgreementEditorModal({ open, editing, onClose, onSave }: {
  open: boolean;
  editing: Agreement | null;
  onClose: () => void;
  onSave: (a: Agreement) => void;
}) {
  const db = useDB();
  const clients = db.users.filter((u) => u.kind === "client");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? { title: editing.title, projectName: editing.projectName, clientId: editing.clientId ?? "", status: editing.status, value: editing.value, signedAt: editing.signedAt?.slice(0, 10) ?? "" }
      : { title: "", projectName: "", clientId: "", status: "draft", value: 0, signedAt: "" },
  });

  function onSubmit(v: Values) {
    onSave({
      id: editing?.id ?? uid("a"),
      title: v.title,
      projectName: v.projectName,
      clientId: v.clientId || undefined,
      status: v.status,
      value: v.value,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      signedAt: v.signedAt ? new Date(v.signedAt).toISOString() : undefined,
    });
  }

  return (
    <FormModal open={open} onClose={onClose} title={editing ? "Edit agreement" : "New agreement"} submitLabel={editing ? "Save changes" : "Create agreement"} isSubmitting={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <Input label="Title" id="title" {...register("title")} error={errors.title?.message} />
      <Input label="Project name" id="projectName" {...register("projectName")} error={errors.projectName?.message} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
          <select id="status" {...register("status")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            {STATUS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <Input label="Value (₹)" id="value" type="number" {...register("value")} error={errors.value?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-text-primary mb-1.5">Linked client</label>
          <select id="clientId" {...register("clientId")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            <option value="">None</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>
        </div>
        <Input label="Signed date" id="signedAt" type="date" {...register("signedAt")} />
      </div>
    </FormModal>
  );
}
