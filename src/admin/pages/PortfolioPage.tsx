import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, deletePortfolioItem } from "@/store/StoreProvider";
import { Card, Badge, Toggle } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { ConfirmDialog } from "../ui/Modal";
import { savePortfolioItem } from "@/store/StoreProvider";
import type { Project } from "@/types";

export function PortfolioPage() {
  const db = useDB();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const columns: Column<Project>[] = [
    {
      key: "name",
      header: "Project",
      render: (p) => (
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate max-w-[240px]">{p.name}</p>
          <p className="text-xs text-text-muted truncate max-w-[240px]">{p.industry}</p>
        </div>
      ),
    },
    {
      key: "services",
      header: "Services",
      hideOnMobile: true,
      render: (p) => (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {p.services.slice(0, 2).map((s) => (
            <Badge key={s} tone="navy">{s}</Badge>
          ))}
          {p.services.length > 2 && <Badge>{`+${p.services.length - 2}`}</Badge>}
        </div>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      hideOnMobile: true,
      render: (p) => (
        <Toggle
          checked={p.featured}
          onChange={(v) => savePortfolioItem({ ...p, featured: v })}
          label={p.featured ? "Yes" : "No"}
        />
      ),
    },
    {
      key: "demo",
      header: "Content",
      hideOnMobile: true,
      render: (p) => (
        <Badge tone={p.demo ? "warning" : "success"}>{p.demo ? "Demo template" : "Live"}</Badge>
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
            onClick={() => navigate(`/admin/portfolio/${p.slug}`)}
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
          <p className="eyebrow text-primary">Content</p>
          <h1 className="text-2xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-sm text-text-muted mt-1.5">
            Manage the case studies shown on the public <strong>Work</strong> pages.
          </p>
        </div>
        <Link
          to="/admin/portfolio/new"
          className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New project
        </Link>
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={db.portfolio}
          rowKey={(p) => p.slug}
          emptyTitle="No portfolio items"
          emptyDescription="Add a genuine, permission-approved project to showcase."
          emptyIcon={<Briefcase className="w-6 h-6" />}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete portfolio item"
        message={
          pendingDelete && (
            <>
              Delete <strong>{pendingDelete.name}</strong>? It's removed from the
              live Work pages immediately.
            </>
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deletePortfolioItem(pendingDelete.slug);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
