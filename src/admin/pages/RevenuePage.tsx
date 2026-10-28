import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TrendingUp, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, saveRevenue, deleteRevenue, uid } from "@/store/StoreProvider";
import type { RevenueEntry } from "@/store/types";
import { formatINR } from "@/lib/utils";
import { Card, StatCard, StatusBadge } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { FormModal } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  month: z.string().min(1, "Month is required."),
  source: z.string().min(2, "Source is required."),
  amount: z.coerce.number().min(0),
  type: z.enum(["income", "forecast"]),
});
type Values = z.infer<typeof schema>;

function monthLabel(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function RevenuePage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<RevenueEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RevenueEntry | null>(null);

  const rows = useMemo(
    () => [...db.revenue].sort((a, b) => b.month.localeCompare(a.month)),
    [db.revenue],
  );

  const totalIncome = db.revenue.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const totalForecast = db.revenue.filter((r) => r.type === "forecast").reduce((s, r) => s + r.amount, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonth = db.revenue.filter((r) => r.month === currentMonth).reduce((s, r) => s + r.amount, 0);

  const columns: Column<RevenueEntry>[] = [
    { key: "month", header: "Month", render: (r) => <span className="font-semibold text-text-primary">{monthLabel(r.month)}</span> },
    { key: "source", header: "Source", hideOnMobile: true, render: (r) => <span className="text-text-secondary">{r.source}</span> },
    { key: "type", header: "Type", render: (r) => <StatusBadge status={r.type} /> },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="text-text-secondary">{formatINR(r.amount)}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => { setEditing(r); setEditorOpen(true); }} aria-label="Edit entry" className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"><Pencil className="w-4 h-4" /></button>
          <button type="button" onClick={() => setPendingDelete(r)} aria-label="Delete entry" className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Operations</p>
          <h1 className="text-2xl font-bold text-text-primary">Revenue</h1>
          <p className="text-sm text-text-muted mt-1.5">Income recorded and forecast by month.</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setEditorOpen(true); }} className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="This month" value={formatINR(thisMonth)} hint={monthLabel(currentMonth)} icon={<TrendingUp className="w-5 h-5" />} accent="primary" />
        <StatCard label="Total income" value={formatINR(totalIncome)} hint="all recorded" icon={<TrendingUp className="w-5 h-5" />} accent="success" />
        <StatCard label="Forecast" value={formatINR(totalForecast)} hint="projected" icon={<TrendingUp className="w-5 h-5" />} accent="warning" />
      </div>

      <Card>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} emptyTitle="No revenue data" emptyDescription="Add income or forecast entries to track revenue." emptyIcon={<TrendingUp className="w-6 h-6" />} />
      </Card>

      <RevenueEditorModal open={editorOpen} editing={editing} onClose={() => setEditorOpen(false)} onSave={(r) => { saveRevenue(r); setEditorOpen(false); }} />

      <ConfirmDialog open={Boolean(pendingDelete)} title="Delete revenue entry" message={pendingDelete && <>Delete the {formatINR(pendingDelete.amount)} entry for {monthLabel(pendingDelete.month)}?</>} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) deleteRevenue(pendingDelete.id); setPendingDelete(null); }} />
    </div>
  );
}

function RevenueEditorModal({ open, editing, onClose, onSave }: { open: boolean; editing: RevenueEntry | null; onClose: () => void; onSave: (r: RevenueEntry) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? { month: editing.month, source: editing.source, amount: editing.amount, type: editing.type }
      : { month: new Date().toISOString().slice(0, 7), source: "", amount: 0, type: "income" },
  });

  function onSubmit(v: Values) {
    onSave({ id: editing?.id ?? uid("r"), month: v.month, source: v.source, amount: v.amount, type: v.type });
  }

  return (
    <FormModal open={open} onClose={onClose} title={editing ? "Edit entry" : "Add revenue entry"} submitLabel={editing ? "Save changes" : "Add entry"} isSubmitting={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-text-primary mb-1.5">Month</label>
          <input id="month" type="month" {...register("month")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none" />
          {errors.month && <p role="alert" className="mt-1.5 text-sm text-error">{errors.month.message}</p>}
        </div>
        <Input label="Amount (₹)" id="amount" type="number" {...register("amount")} error={errors.amount?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Source" id="source" {...register("source")} error={errors.source?.message} placeholder="e.g. Projects, Retainers" />
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-1.5">Type</label>
          <select id="type" {...register("type")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            <option value="income">Income</option>
            <option value="forecast">Forecast</option>
          </select>
        </div>
      </div>
    </FormModal>
  );
}
