import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, Plus, Pencil, Trash2, UserRound } from "lucide-react";
import { useDB, saveUser, deleteUser, uid } from "@/store/StoreProvider";
import type { AdminUser, Role, UserKind } from "@/store/types";
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
} from "@/store/types";
import { Card, Badge, Toggle, EmptyState } from "../ui/Primitives";
import { Modal, ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";
import { DEMO_PASSWORD } from "@/store/seed";

const ALL_ROLES: Role[] = [
  "admin",
  "operations-manager",
  "project-manager",
  "developer",
  "sales",
];

const schema = z
  .object({
    kind: z.enum(["team", "client"]),
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Enter a valid email."),
    password: z.string().optional(),
    role: z.enum(["admin", "operations-manager", "project-manager", "developer", "sales"]).optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    linkedProjectIds: z.array(z.string()).optional(),
    active: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.kind === "team") {
      if (!v.role) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["role"], message: "Choose a role for team members." });
      }
      if (v.password !== undefined && v.password.length > 0 && v.password.length < 4) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["password"], message: "Password must be at least 4 characters." });
      }
    }
  });

type Values = z.infer<typeof schema>;

type Filter = "all" | UserKind;

export function UsersPage() {
  const db = useDB();
  const [filter, setFilter] = useState<Filter>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);

  const rows = useMemo(() => {
    return db.users.filter((u) => filter === "all" || u.kind === filter);
  }, [db.users, filter]);

  const teamCount = db.users.filter((u) => u.kind === "team").length;
  const clientCount = db.users.filter((u) => u.kind === "client").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Manage</p>
          <h1 className="text-2xl font-bold text-text-primary">Team &amp; Clients</h1>
          <p className="text-sm text-text-muted mt-1.5">
            Create team members with a role, or client records linked to projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setEditorOpen(true); }}
          className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New user
        </button>
      </div>

      {/* Role legend */}
      <div className="mb-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {ALL_ROLES.map((r) => (
          <div key={r} className="rounded-card-lg border border-border-default bg-white p-4">
            <p className="text-sm font-semibold text-text-primary">{ROLE_LABELS[r]}</p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2 border-b border-border-default px-6 py-4">
          {(["all", "team", "client"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                "rounded-button px-4 py-2 text-sm font-semibold transition-colors " +
                (filter === f
                  ? "bg-primary text-white"
                  : "border border-border-default bg-white text-text-secondary hover:border-primary hover:text-primary")
              }
            >
              {f === "all" ? `All (${db.users.length})` : f === "team" ? `Team (${teamCount})` : `Clients (${clientCount})`}
            </button>
          ))}
        </div>

        {rows.length > 0 ? (
          <ul className="space-y-3 p-4 md:p-0 md:space-y-0 md:divide-y md:divide-border-default">
            {rows.map((u) => (
              <li
                key={u.id}
                className="rounded-card-lg border border-border-default bg-white p-4 shadow-card md:rounded-none md:border-0 md:bg-transparent md:p-6 md:shadow-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                  <p className="text-xs text-text-muted truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={u.kind === "team" ? "primary" : "navy"}>
                    {u.kind === "team" ? "Team" : "Client"}
                  </Badge>
                  {u.role ? (
                    <Badge tone="success">{ROLE_LABELS[u.role]}</Badge>
                  ) : (
                    <Badge>{u.company || "Client"}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:ml-2">
                  <button
                    type="button"
                    onClick={() => { setEditing(u); setEditorOpen(true); }}
                    aria-label={`Edit ${u.name}`}
                    className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(u)}
                    aria-label={`Delete ${u.name}`}
                    className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No users"
            description="Create a team member or client record to get started."
            icon={<Users className="w-6 h-6" />}
          />
        )}
      </Card>

      <UserEditorModal
        open={editorOpen}
        editing={editing}
        onClose={() => setEditorOpen(false)}
        onSave={(user) => {
          saveUser(user);
          setEditorOpen(false);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.kind === "team" ? "Remove team member" : "Remove client"}
        message={
          pendingDelete && (
            <>
              Remove <strong>{pendingDelete.name}</strong>? They will no longer
              appear in this list.
            </>
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteUser(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editor modal                                                        */
/* ------------------------------------------------------------------ */

function UserEditorModal({
  open,
  editing,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: AdminUser | null;
  onClose: () => void;
  onSave: (user: AdminUser) => void;
}) {
  const db = useDB();
  const isNew = !editing;

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
          kind: editing.kind,
          name: editing.name,
          email: editing.email,
          password: "",
          role: editing.role,
          company: editing.company ?? "",
          phone: editing.phone ?? "",
          linkedProjectIds: editing.linkedProjectIds ?? [],
          active: editing.active,
        }
      : {
          kind: "team",
          name: "",
          email: "",
          password: "",
          role: "sales",
          company: "",
          phone: "",
          linkedProjectIds: [],
          active: true,
        },
  });

  const kind = watch("kind");
  const selectedProjects = watch("linkedProjectIds") ?? [];

  function toggleProject(id: string) {
    const next = selectedProjects.includes(id)
      ? selectedProjects.filter((p) => p !== id)
      : [...selectedProjects, id];
    setValue("linkedProjectIds", next);
  }

  function onSubmit(values: Values) {
    if (values.kind === "team" && !values.role) return;
    const user: AdminUser = {
      id: editing?.id ?? uid("u"),
      kind: values.kind,
      name: values.name,
      email: values.email,
      active: values.active,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      demo: editing?.demo,
      ...(values.kind === "team"
        ? { role: values.role as Role, password: values.password || editing?.password || DEMO_PASSWORD }
        : { company: values.company || undefined, phone: values.phone || undefined, linkedProjectIds: values.linkedProjectIds }),
    };
    onSave(user);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? "New user" : `Edit ${editing?.name}`}
      description={isNew ? "Create a team member or a client record." : "Update this record."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        {/* Kind selector */}
        <div className="grid grid-cols-2 gap-2">
          {(["team", "client"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setValue("kind", k)}
              className={
                "rounded-card-lg border p-4 text-left transition-colors " +
                (kind === k
                  ? "border-primary bg-primary-light"
                  : "border-border-default bg-white hover:border-primary/50")
              }
            >
              <UserRound className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-semibold text-text-primary">
                {k === "team" ? "Team member" : "Client"}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {k === "team" ? "Can sign in with a role" : "CRM record linked to projects"}
              </p>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full name" id="name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" id="email" type="email" {...register("email")} error={errors.email?.message} />
        </div>

        {kind === "team" ? (
          <>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-1.5">
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="">Select a role…</option>
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              {errors.role && <p role="alert" className="mt-1.5 text-sm text-error">{errors.role.message}</p>}
              {watch("role") && (
                <p className="text-xs text-text-muted mt-1.5">{ROLE_DESCRIPTIONS[watch("role") as Role]}</p>
              )}
            </div>
            <Input
              label={isNew ? "Password" : "New password (leave blank to keep current)"}
              id="password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              helperText="Demo login password. Production would hash and verify this server-side."
            />
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Company" id="company" {...register("company")} />
              <Input label="Phone" id="phone" {...register("phone")} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Linked projects</p>
              {db.projects.length === 0 ? (
                <p className="text-xs text-text-muted">No projects to link yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {db.projects.map((p) => {
                    const on = selectedProjects.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProject(p.id)}
                        aria-pressed={on}
                        className={
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                          (on
                            ? "border-primary bg-primary text-white"
                            : "border-border-default bg-white text-text-secondary hover:border-primary/50 hover:text-primary")
                        }
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div className="pt-1">
          <Toggle label="Active account" checked={watch("active")} onChange={(v) => setValue("active", v)} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-button border border-border-default text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient px-5 py-2.5 rounded-button text-white font-semibold text-sm disabled:opacity-60"
          >
            {isNew ? "Create user" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
