import type {
  AdminDB,
  AdminUser,
  Lead,
  AdminProject,
  Agreement,
  Invoice,
  Quotation,
  RevenueEntry,
  ManagedFile,
} from "@/store/types";
import type { InsightArticle, Project } from "@/types";

/**
 * Client for the Cloudflare Worker admin API.
 *
 * The Worker is the only place that ever sees the Neon credentials or the R2
 * bucket — the browser only talks to these HTTP endpoints.
 *
 * Base URL resolution:
 *   - VITE_API_URL set  → use it (deployed Worker URL)
 *   - otherwise         → "/api" (Vite dev proxy → wrangler dev on :8787)
 */

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "/api";

const TOKEN_KEY = "movox:admin-token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the admin API.", 0);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* keep generic message */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** The Worker returns the same shapes the React admin uses (minus session). */
export type ServerDB = Omit<AdminDB, "session">;

export const api = {
  health: () => request<{ status: string }>("GET", "/health"),

  login: (email: string, password: string) =>
    request<{ ok: boolean; token: string; user: AdminUser }>("POST", "/auth/login", { email, password }),
  logout: () => request("POST", "/auth/logout"),
  me: () => request<{ ok: boolean; user: AdminUser }>("GET", "/auth/me"),

  loadDB: () => request<ServerDB>("GET", "/db"),
  reset: () => request<ServerDB>("POST", "/reset"),

  createLead: (lead: Lead) => request("POST", "/leads", lead),
  updateLeadStatus: (id: string, status: Lead["status"]) =>
    request("PATCH", `/leads/${id}`, { status }),
  deleteLead: (id: string) => request("DELETE", `/leads/${id}`),

  savePost: (article: InsightArticle) => request("POST", "/blog", article),
  deletePost: (slug: string) => request("DELETE", `/blog/${slug}`),

  savePortfolioItem: (item: Project) => request("POST", "/portfolio", item),
  deletePortfolioItem: (slug: string) => request("DELETE", `/portfolio/${slug}`),

  saveUser: (user: AdminUser) => request("POST", "/users", user),
  deleteUser: (id: string) => request("DELETE", `/users/${id}`),

  saveProject: (p: AdminProject) => request("POST", "/projects", p),
  deleteProject: (id: string) => request("DELETE", `/projects/${id}`),
  saveAgreement: (a: Agreement) => request("POST", "/agreements", a),
  deleteAgreement: (id: string) => request("DELETE", `/agreements/${id}`),
  saveInvoice: (i: Invoice) => request("POST", "/invoices", i),
  deleteInvoice: (id: string) => request("DELETE", `/invoices/${id}`),
  saveQuotation: (q: Quotation) => request("POST", "/quotations", q),
  deleteQuotation: (id: string) => request("DELETE", `/quotations/${id}`),
  saveRevenue: (r: RevenueEntry) => request("POST", "/revenue", r),
  deleteRevenue: (id: string) => request("DELETE", `/revenue/${id}`),

  saveFile: (f: ManagedFile) => request("POST", "/files", f),
  deleteFile: (id: string) => request("DELETE", `/files/${id}`),
  saveSetting: (s: { key: string; value: unknown; group?: string; label?: string; type?: string }) =>
    request("POST", "/settings", s),

  /** Multipart upload — the Worker stores the binary in R2. */
  uploadFile: async (
    file: File,
    folder: string,
    projectId: string,
  ): Promise<{ file: ManagedFile & { url: string } }> => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    form.append("project_id", projectId);

    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${BASE}/files/upload`, { method: "POST", headers, body: form });
    } catch {
      throw new ApiError("Cannot reach the admin API.", 0);
    }
    if (!res.ok) {
      let message = `Upload failed (${res.status})`;
      try {
        const data = (await res.json()) as { error?: string };
        if (data?.error) message = data.error;
      } catch {
        /* generic */
      }
      throw new ApiError(message, res.status);
    }
    const data = (await res.json()) as { ok: boolean; file: ManagedFile & { url: string } };
    return { file: data.file };
  },
};

export const API_BASE = BASE;
