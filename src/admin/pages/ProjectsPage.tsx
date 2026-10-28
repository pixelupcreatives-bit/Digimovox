import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FolderKanban, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, saveProject, deleteProject, uid } from "@/store/StoreProvider";
import type { AdminProject, ProjectStatus } from "@/store/types";
import { PROJECT_STATUS_LABELS } from "@/store/types";
import { formatINR } from "@/lib/utils";
import {
  Card,
  StatCard,
  StatusBadge,
} from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { Modal, ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  name: z.string().min(3, "Project name is required."),
  clientName: z.string().min(2, "Client name is required."),
  clientId: z.string().optional(),
  status: z.enum(["planning", "in-progress", "review", "delivered", "on-hold"]),
  progress: z.coerce.number().min(0).max(100),
  managerId: z.string().optional(),
  developerIds: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  value: z.coerce.number().min(0),
});

type Values = z.infer<typeof schema>;

const STATUS_VALUES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

export function ProjectsPage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null);

  const active = db.projects.filter((p) => p.status === "in-progress").length;
  const delivered = db.projects.filter((p) => p.status === "delivered").length;
  const totalValue = db.projects.reduce((s, p) => s + p.value, 0);

  const columns: Column<AdminProject>[] = [
    {
      key: "name",
      header: "Project",
      render: (p) => (
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate max-w-[220px]">{p.name}</p>
          <p className="text-xs text-text-muted truncate max-w-[220px]">{p.clientName}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "progress",
      header: "Progress",
      hideOnMobile: true,
      render: (p) => (
        <div className="w-32">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>Progress</span>
            <span>{p.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-navy-light overflow-hidden">
            <div className="h-full brand-gradient" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
      hideOnMobile: true,
      align: "right",
      render: (p) => <span className="text-text-secondary">{formatINR(p.value)}</span>,
    },
    {
      key: "deadline",
      header: "Deadline",
      hideOnMobile: true,
      render: (p) => (
        <span className="text-xs text-text-muted">{p.deadline ? new Date(p.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => { setEditing(p); setEditorOpen(true); }}
            aria-label={`Edit ${p.name}`}
            className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(p)}
            aria-label={`Delete ${p.name}`}
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
          <p className="eyebrow text-primary">Operations</p>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm text-text-muted mt-1.5">Internal delivery pipeline and progress.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setEditorOpen(true); }}
          className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active projects" value={active} hint={`${db.projects.length} total`} icon={<FolderKanban className="w-5 h-5" />} accent="primary" />
        <StatCard label="Delivered" value={delivered} hint="completed to date" icon={<FolderKanban className="w-5 h-5" />} accent="success" />
        <StatCard label="Pipeline value" value={formatINR(totalValue)} hint="across all projects" icon={<FolderKanban className="w-5 h-5" />} accent="neutral" />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={db.projects}
          rowKey={(p) => p.id}
          emptyTitle="No projects"
          emptyDescription="Add an internal project to track delivery."
          emptyIcon={<FolderKanban className="w-6 h-6" />}
        />
      </Card>

      <ProjectEditorModal
        open={editorOpen}
        editing={editing}
        onClose={() => setEditorOpen(false)}
        onSave={(p) => { saveProject(p); setEditorOpen(false); }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete project"
        message={pendingDelete && <>Delete <strong>{pendingDelete.name}</strong>? This removes it from the pipeline.</>}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) deleteProject(pendingDelete.id); setPendingDelete(null); }}
      />
    </div>
  );
}

function ProjectEditorModal({
  open,
  editing,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: AdminProject | null;
  onClose: () => void;
  onSave: (p: AdminProject) => void;
}) {
  const db = useDB();
  const clients = db.users.filter((u) => u.kind === "client");
  const team = db.users.filter((u) => u.kind === "team");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? {
          name: editing.name,
          clientName: editing.clientName,
          clientId: editing.clientId ?? "",
          status: editing.status,
          progress: editing.progress,
          managerId: editing.managerId ?? "",
          developerIds: editing.developerIds,
          startDate: editing.startDate?.slice(0, 10) ?? "",
          deadline: editing.deadline?.slice(0, 10) ?? "",
          value: editing.value,
        }
      : {
          name: "",
          clientName: "",
          clientId: "",
          status: "planning",
          progress: 0,
          managerId: "",
          developerIds: [],
          startDate: "",
          deadline: "",
          value: 0,
        },
  });

  const devs = watch("developerIds") ?? [];

  function toggleDev(id: string) {
    setValue("developerIds", devs.includes(id) ? devs.filter((d) => d !== id) : [...devs, id]);
  }

  function onSubmit(v: Values) {
    onSave({
      id: editing?.id ?? uid("p"),
      name: v.name,
      clientName: v.clientName,
      clientId: v.clientId || undefined,
      status: v.status,
      progress: v.progress,
      managerId: v.managerId || undefined,
      developerIds: v.developerIds ?? [],
      startDate: v.startDate ? new Date(v.startDate).toISOString() : undefined,
      deadline: v.deadline ? new Date(v.deadline).toISOString() : undefined,
      value: v.value,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit project" : "New project"} description="Internal delivery tracking.">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Input label="Project name" id="name" {...register("name")} error={errors.name?.message} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Client name" id="clientName" {...register("clientName")} error={errors.clientName?.message} />
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-text-primary mb-1.5">Linked client record</label>
            <select id="clientId" {...register("clientId")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
              <option value="">None</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">Status</label>
            <select id="status" {...register("status")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
              {STATUS_VALUES.map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <Input label="Progress %" id="progress" type="number" {...register("progress")} error={errors.progress?.message} />
          <Input label="Value (₹)" id="value" type="number" {...register("value")} error={errors.value?.message} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="managerId" className="block text-sm font-medium text-text-primary mb-1.5">Project manager</label>
            <select id="managerId" {...register("managerId")} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
              <option value="">Unassigned</option>
              {team.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <Input label="Start date" id="startDate" type="date" {...register("startDate")} />
          <Input label="Deadline" id="deadline" type="date" {...register("deadline")} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary mb-2">Assigned developers</p>
          <div className="flex flex-wrap gap-2">
            {team.map((u) => {
              const on = devs.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleDev(u.id)}
                  aria-pressed={on}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                    (on ? "border-primary bg-primary text-white" : "border-border-default bg-white text-text-secondary hover:border-primary/50 hover:text-primary")
                  }
                >
                  {u.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-button border border-border-default text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-gradient px-5 py-2.5 rounded-button text-white font-semibold text-sm disabled:opacity-60">
            {editing ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
