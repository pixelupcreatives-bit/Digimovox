import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Receipt, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, saveInvoice, deleteInvoice, uid } from "@/store/StoreProvider";
import type { Invoice, InvoiceStatus } from "@/store/types";
import { formatINR } from "@/lib/utils";
import { Card, StatCard, StatusBadge } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { FormModal } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  number: z.string().min(1, "Invoice number is required."),
  projectName: z.string().min(2, "Project name is required."),
  clientId: z.string().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "void"]),
  amount: z.coerce.number().min(0),
  issuedAt: z.string().optional(),
  dueAt: z.string().optional(),
  paidAt: z.string().optional(),
});
type Values = z.infer<typeof schema>;
const STATUS: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "void"];

export function InvoicesPage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);

  const outstanding = db.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const outstandingValue = outstanding.reduce((s, i) => s + i.amount, 0);
  const paid = db.invoices.filter((i) => i.status === "paid").length;
  const overdue = db.invoices.filter((i) => i.status === "overdue").length;

  const columns: Column<Invoice>[] = [
    { key: "number", header: "Invoice", render: (i) => <span className="font-semibold text-text-primary">{i.number}</span> },
    { key: "project", header: "Project", hideOnMobile: true, render: (i) => <span className="text-text-secondary truncate max-w-[180px] block">{i.projectName}</span> },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
    { key: "amount", header: "Amount", hideOnMobile: true, align: "right", render: (i) => <span className="text-text-secondary">{formatINR(i.amount)}</span> },
    { key: "due", header: "Due", hideOnMobile: true, render: (i) => <span className="text-xs text-text-muted">{i.dueAt ? new Date(i.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (i) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => { setEditing(i); setEditorOpen(true); }} aria-label={`Edit ${i.number}`} className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"><Pencil className="w-4 h-4" /></button>
          <button type="button" onClick={() => setPendingDelete(i)} aria-label={`Delete ${i.number}`} className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Operations</p>
          <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
          <p className="text-sm text-text-muted mt-1.5">Billing issued to clients.</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setEditorOpen(true); }} className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> New invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Outstanding" value={formatINR(outstandingValue)} hint={`${outstanding.length} open invoices`} icon={<Receipt className="w-5 h-5" />} accent="warning" />
        <StatCard label="Paid" value={paid} hint="invoices settled" icon={<Receipt className="w-5 h-5" />} accent="success" />
        <StatCard label="Overdue" value={overdue} hint="need chasing" icon={<Receipt className="w-5 h-5" />} accent="danger" />
      </div>

      <Card>
        <DataTable columns={columns} rows={db.invoices} rowKey={(i) => i.id} emptyTitle="No invoices" emptyDescription="Create an invoice to start tracking billing." emptyIcon={<Receipt className="w-6 h-6" />} />
      </Card>

      <InvoiceEditorModal open={editorOpen} editing={editing} onClose={() => setEditorOpen(false)} onSave={(inv) => { saveInvoice(inv); setEditorOpen(false); }} />

      <ConfirmDialog open={Boolean(pendingDelete)} title="Delete invoice" message={pendingDelete && <>Delete <strong>{pendingDelete.number}</strong>? This removes it permanently.</>} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) deleteInvoice(pendingDelete.id); setPendingDelete(null); }} />
    </div>
  );
}

function InvoiceEditorModal({ open, editing, onClose, onSave }: { open: boolean; editing: Invoice | null; onClose: () => void; onSave: (i: Invoice) => void }) {
  const db = useDB();
  const clients = db.users.filter((u) => u.kind === "client");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? { number: editing.number, projectName: editing.projectName, clientId: editing.clientId ?? "", status: editing.status, amount: editing.amount, issuedAt: editing.issuedAt?.slice(0, 10) ?? "", dueAt: editing.dueAt?.slice(0, 10) ?? "", paidAt: editing.paidAt?.slice(0, 10) ?? "" }
      : { number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(3, "0")}`, projectName: "", clientId: "", status: "draft", amount: 0, issuedAt: new Date().toISOString().slice(0, 10), dueAt: "", paidAt: "" },
  });

  function onSubmit(v: Values) {
    onSave({
      id: editing?.id ?? uid("i"),
      number: v.number,
      projectName: v.projectName,
      clientId: v.clientId || undefined,
      status: v.status,
      amount: v.amount,
      issuedAt: v.issuedAt ? new Date(v.issuedAt).toISOString() : new Date().toISOString(),
      dueAt: v.dueAt ? new Date(v.dueAt).toISOString() : new Date().toISOString(),
      paidAt: v.paidAt ? new Date(v.paidAt).toISOString() : undefined,
    });
  }

  return (
    <FormModal open={open} onClose={onClose} title={editing ? "Edit invoice" : "New invoice"} submitLabel={editing ? "Save changes" : "Create invoice"} isSubmitting={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Invoice number" id="number" {...register("number")} error={errors.number?.message} />
        <Input label="Amount (₹)" id="amount" type="number" {...register("amount")} error={errors.amount?.message} />
      </div>
      <Input label="Project name" id="projectName" {...register("projectName")} error={errors.projectName?.message} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
          <select id="status" {...register("status")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            {STATUS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-text-primary mb-1.5">Linked client</label>
          <select id="clientId" {...register("clientId")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            <option value="">None</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Input label="Issued" id="issuedAt" type="date" {...register("issuedAt")} />
        <Input label="Due" id="dueAt" type="date" {...register("dueAt")} />
        <Input label="Paid" id="paidAt" type="date" {...register("paidAt")} />
      </div>
    </FormModal>
  );
}
