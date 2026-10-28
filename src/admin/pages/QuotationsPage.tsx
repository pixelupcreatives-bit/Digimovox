import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileSpreadsheet, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, saveQuotation, deleteQuotation, uid } from "@/store/StoreProvider";
import type { Quotation, QuotationStatus } from "@/store/types";
import { formatINR } from "@/lib/utils";
import { Card, StatCard, StatusBadge } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { FormModal } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  number: z.string().min(1, "Quotation number is required."),
  title: z.string().min(3, "Title is required."),
  clientName: z.string().min(2, "Client name is required."),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
  amount: z.coerce.number().min(0),
  validUntil: z.string().optional(),
});
type Values = z.infer<typeof schema>;
const STATUS: QuotationStatus[] = ["draft", "sent", "accepted", "rejected", "expired"];

export function QuotationsPage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Quotation | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Quotation | null>(null);

  const sent = db.quotations.filter((q) => q.status === "sent").length;
  const accepted = db.quotations.filter((q) => q.status === "accepted").length;
  const totalValue = db.quotations.reduce((s, q) => s + q.amount, 0);

  const columns: Column<Quotation>[] = [
    { key: "number", header: "Quotation", render: (q) => <span className="font-semibold text-text-primary">{q.number}</span> },
    { key: "title", header: "Title", hideOnMobile: true, render: (q) => <span className="text-text-secondary truncate max-w-[180px] block">{q.title}</span> },
    { key: "client", header: "Client", hideOnMobile: true, render: (q) => <span className="text-text-secondary">{q.clientName}</span> },
    { key: "status", header: "Status", render: (q) => <StatusBadge status={q.status} /> },
    { key: "amount", header: "Amount", hideOnMobile: true, align: "right", render: (q) => <span className="text-text-secondary">{formatINR(q.amount)}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (q) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => { setEditing(q); setEditorOpen(true); }} aria-label={`Edit ${q.number}`} className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"><Pencil className="w-4 h-4" /></button>
          <button type="button" onClick={() => setPendingDelete(q)} aria-label={`Delete ${q.number}`} className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Operations</p>
          <h1 className="text-2xl font-bold text-text-primary">Quotations</h1>
          <p className="text-sm text-text-muted mt-1.5">Price proposals sent to prospective clients.</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setEditorOpen(true); }} className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> New quotation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total quotations" value={db.quotations.length} hint={formatINR(totalValue) + " value"} icon={<FileSpreadsheet className="w-5 h-5" />} accent="primary" />
        <StatCard label="Awaiting decision" value={sent} hint="sent to clients" icon={<FileSpreadsheet className="w-5 h-5" />} accent="warning" />
        <StatCard label="Accepted" value={accepted} hint="converted to work" icon={<FileSpreadsheet className="w-5 h-5" />} accent="success" />
      </div>

      <Card>
        <DataTable columns={columns} rows={db.quotations} rowKey={(q) => q.id} emptyTitle="No quotations" emptyDescription="Create a quotation to send to a prospect." emptyIcon={<FileSpreadsheet className="w-6 h-6" />} />
      </Card>

      <QuotationEditorModal open={editorOpen} editing={editing} onClose={() => setEditorOpen(false)} onSave={(q) => { saveQuotation(q); setEditorOpen(false); }} />

      <ConfirmDialog open={Boolean(pendingDelete)} title="Delete quotation" message={pendingDelete && <>Delete <strong>{pendingDelete.number}</strong>? This removes it permanently.</>} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) deleteQuotation(pendingDelete.id); setPendingDelete(null); }} />
    </div>
  );
}

function QuotationEditorModal({ open, editing, onClose, onSave }: { open: boolean; editing: Quotation | null; onClose: () => void; onSave: (q: Quotation) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? { number: editing.number, title: editing.title, clientName: editing.clientName, status: editing.status, amount: editing.amount, validUntil: editing.validUntil?.slice(0, 10) ?? "" }
      : { number: `QUO-${new Date().getFullYear()}-${String(1).padStart(3, "0")}`, title: "", clientName: "", status: "draft", amount: 0, validUntil: "" },
  });

  function onSubmit(v: Values) {
    onSave({
      id: editing?.id ?? uid("q"),
      number: v.number,
      title: v.title,
      clientName: v.clientName,
      status: v.status,
      amount: v.amount,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      validUntil: v.validUntil ? new Date(v.validUntil).toISOString() : undefined,
    });
  }

  return (
    <FormModal open={open} onClose={onClose} title={editing ? "Edit quotation" : "New quotation"} submitLabel={editing ? "Save changes" : "Create quotation"} isSubmitting={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Quotation number" id="number" {...register("number")} error={errors.number?.message} />
        <Input label="Amount (₹)" id="amount" type="number" {...register("amount")} error={errors.amount?.message} />
      </div>
      <Input label="Title" id="title" {...register("title")} error={errors.title?.message} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Client name" id="clientName" {...register("clientName")} error={errors.clientName?.message} />
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
          <select id="status" {...register("status")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            {STATUS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <Input label="Valid until" id="validUntil" type="date" {...register("validUntil")} />
    </FormModal>
  );
}
