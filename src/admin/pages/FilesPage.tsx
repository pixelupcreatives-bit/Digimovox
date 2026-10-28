import { useMemo, useState } from "react";
import { FolderOpen, Plus, Trash2, Search, FileText, ImageIcon } from "lucide-react";
import { useDB, deleteFile, uploadFile } from "@/store/StoreProvider";
import type { ManagedFile } from "@/store/types";
import { Card, Badge } from "../ui/Primitives";
import { FormModal } from "../ui/Primitives";
import { ConfirmDialog } from "../ui/Modal";
import { Input } from "@/components/ui/Input";

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function FilesPage() {
  const db = useDB();
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ManagedFile | null>(null);
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const folders = useMemo(
    () => Array.from(new Set(db.files.map((f) => f.folder))),
    [db.files],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.files.filter((f) => {
      if (folderFilter !== "all" && f.folder !== folderFilter) return false;
      if (!q) return true;
      return f.name.toLowerCase().includes(q) || f.folder.toLowerCase().includes(q);
    });
  }, [db.files, folderFilter, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow text-primary">Delivery</p>
          <h1 className="text-2xl font-bold text-text-primary">File Manager</h1>
          <p className="text-sm text-text-muted mt-1.5">Shared project assets and deliverables.</p>
        </div>
        <button type="button" onClick={() => setEditorOpen(true)} className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Upload file
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-border-default">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files and folders…"
              className="w-full rounded-button border border-border-default bg-white pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary outline-none"
            />
          </div>
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            aria-label="Filter by folder"
            className="rounded-button border border-border-default bg-white px-3 py-2.5 text-sm text-text-primary focus:border-primary outline-none"
          >
            <option value="all">All folders</option>
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {rows.length > 0 ? (
          <ul className="space-y-3 p-4 md:p-0 md:space-y-0 md:divide-y md:divide-border-default">
            {rows.map((f) => (
              <li
                key={f.id}
                className="rounded-card-lg border border-border-default bg-white p-4 shadow-card md:rounded-none md:border-0 md:bg-transparent md:p-6 md:shadow-none"
              >
                <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-button bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                  {f.type.startsWith("image/") ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{f.name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {f.folder} · {formatSize(f.size)} · {f.type || "unknown"}
                  </p>
                </div>
                {f.projectId && (
                  <Badge tone="navy" className="hidden sm:inline-flex">
                    {db.projects.find((p) => p.id === f.projectId)?.name ?? "Project"}
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(f)}
                  aria-label={`Delete ${f.name}`}
                  className="rounded-button p-2 text-text-muted hover:bg-error-bg hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-button bg-bg-soft flex items-center justify-center text-text-muted mb-4">
              <FolderOpen className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-text-primary">No files found</p>
            <p className="text-sm text-text-muted mt-1.5">Add a file record or adjust the filters.</p>
          </div>
        )}
      </Card>

      <FileEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
      />

      <ConfirmDialog open={Boolean(pendingDelete)} title="Delete file record" message={pendingDelete && <>Remove <strong>{pendingDelete.name}</strong> from the file manager?</>} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) deleteFile(pendingDelete.id); setPendingDelete(null); }} />
    </div>
  );
}

function FileEditorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const db = useDB();
  const [folder, setFolder] = useState("/project-files");
  const [projectId, setProjectId] = useState("");
  const [picked, setPicked] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // project_files.project_id is NOT NULL, so a project is required.
  const effectiveProject = projectId || db.projects[0]?.id || "";

  async function handleUpload() {
    if (!picked) {
      setError("Choose a file first.");
      return;
    }
    if (!effectiveProject) {
      setError("Create a project first — every file must be linked to one.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Uploads the binary to R2 via the Worker, then records metadata in Neon.
      await uploadFile(picked, folder || "/project-files", effectiveProject);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Upload file"
      description="The file is stored in Cloudflare R2 and its metadata in Neon."
      submitLabel={busy ? "Uploading…" : "Upload file"}
      isSubmitting={busy}
      onSubmit={handleUpload}
    >
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Choose file</label>
        <label className="flex items-center gap-3 rounded-button border border-dashed border-border-strong px-4 py-4 cursor-pointer hover:border-primary hover:bg-primary-subtle transition-colors">
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm text-text-secondary">
            {picked ? <span className="font-semibold text-text-primary">{picked.name}</span> : "Select a file to upload"}
          </span>
          <input
            type="file"
            className="sr-only"
            onChange={(e) => setPicked(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Folder" id="folder" value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="/project-name" />
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-text-primary mb-1.5">Linked project</label>
          <select id="projectId" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary focus:border-primary outline-none">
            <option value="">None</option>
            {db.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      {error && (
        <p role="alert" className="rounded-button border border-error bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}
    </FormModal>
  );
}
