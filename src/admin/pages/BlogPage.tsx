import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, Plus, Pencil, Trash2 } from "lucide-react";
import { useDB, deletePost } from "@/store/StoreProvider";
import { Card, Badge } from "../ui/Primitives";
import { DataTable, type Column } from "../ui/Table";
import { ConfirmDialog } from "../ui/Modal";
import type { InsightArticle } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogPage() {
  const db = useDB();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<InsightArticle | null>(null);

  const posts = [...db.blog].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  const columns: Column<InsightArticle>[] = [
    {
      key: "title",
      header: "Article",
      render: (a) => (
        <div className="min-w-0">
          <p className="font-semibold text-text-primary truncate max-w-[260px]">{a.title}</p>
          <p className="text-xs text-text-muted truncate max-w-[260px]">{a.primaryKeyword}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideOnMobile: true,
      render: (a) => <Badge tone="navy">{a.category}</Badge>,
    },
    {
      key: "author",
      header: "Author",
      hideOnMobile: true,
      render: (a) => <span className="text-text-secondary">{a.author}</span>,
    },
    {
      key: "published",
      header: "Published",
      hideOnMobile: true,
      render: (a) => <span className="text-xs text-text-muted">{formatDate(a.publishedAt)}</span>,
    },
    {
      key: "readtime",
      header: "Read",
      hideOnMobile: true,
      render: (a) => <span className="text-xs text-text-muted">{a.readTime}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => navigate(`/admin/blog/${a.slug}`)}
            aria-label={`Edit ${a.title}`}
            className="rounded-button p-2 text-text-muted hover:bg-primary-light hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(a)}
            aria-label={`Delete ${a.title}`}
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
          <h1 className="text-2xl font-bold text-text-primary">Blog</h1>
          <p className="text-sm text-text-muted mt-1.5">
            Create, edit and publish articles to the public <strong>Insights</strong> section.
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New article
        </Link>
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={posts}
          rowKey={(a) => a.slug}
          emptyTitle="No articles yet"
          emptyDescription="Create your first article to populate the Insights section."
          emptyIcon={<Newspaper className="w-6 h-6" />}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete article"
        message={
          pendingDelete && (
            <>
              Delete <strong>{pendingDelete.title}</strong>? The article is
              removed from the live Insights section immediately.
            </>
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deletePost(pendingDelete.slug);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
