import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  createSql,
  loadAll,
  getUsers,
  upsertUser,
  deleteUser,
  insertLead,
  updateLeadStatus,
  deleteLead,
  upsertInsight,
  deleteInsight,
  upsertWork,
  deleteWork,
  upsertProject,
  deleteProject,
  upsertAgreement,
  deleteAgreement,
  upsertInvoice,
  deleteInvoice,
  upsertQuotation,
  deleteQuotation,
  upsertRevenue,
  deleteRevenue,
  upsertFile,
  deleteFile,
  upsertSetting,
  createSession,
  getSessionUser,
  deleteSession,
  verifyPassword,
  type Sql,
  type Env,
} from "./repo";
import { buildKey, putObject, publicUrl } from "./r2";

type Variables = { sql: Sql; user: Record<string, unknown> };

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const ok = (c: any, data: unknown = { ok: true }, status = 200) => c.json(data as object, status as 200);
const fail = (c: any, error: string, status = 400) => c.json({ ok: false, error }, status);

app.use("/api/*", async (c, next) => {
  const origin = c.env.ALLOWED_ORIGIN || "http://localhost:5174";
  return cors({ origin, credentials: true })(c, next);
});

app.use("/api/*", async (c, next) => {
  c.set("sql", createSql(c.env));
  await next();
});

const requireAuth = async (c: any, next: any) => {
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return fail(c, "Missing auth token", 401);
  const rows = await getSessionUser(c.get("sql"), token);
  if (!rows[0]) return fail(c, "Invalid or expired session", 401);
  c.set("user", rows[0]);
  await next();
};

const requireAdmin = async (c: any, next: any) => {
  const user = c.get("user");
  if (user?.role !== "admin") return fail(c, "Admin access required.", 403);
  await next();
};

/* ------------------------------------------------------------------ */
/* Health                                                              */
/* ------------------------------------------------------------------ */

app.get("/api/health", async (c) => {
  try {
    await c.get("sql")`SELECT 1`;
    return ok(c, { ok: true, status: "live", time: new Date().toISOString() });
  } catch (e) {
    return fail(c, `Database unreachable: ${(e as Error).message}`, 503);
  }
});

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json<{ email?: string; password?: string }>();
  if (!email || !password) return fail(c, "Email and password are required.");

  const rows = await c.get("sql")`SELECT * FROM admin_users WHERE email = ${email.toLowerCase()}`;
  const user = rows[0];
  if (!user || user.is_active !== true) return fail(c, "No active account found for that email.", 401);
  if (user.role === "client") return fail(c, "This is a client account. Use the client portal.", 403);
  if (!(await verifyPassword(password, String(user.password_hash ?? "")))) {
    return fail(c, "Incorrect password.", 401);
  }

  const token = crypto.randomUUID();
  await createSession(c.get("sql"), token, user.id, new Date().toISOString());
  return ok(c, { ok: true, token, user });
});

app.post("/api/auth/logout", requireAuth, async (c) => {
  const token = (c.req.header("Authorization") ?? "").slice(7).trim();
  await deleteSession(c.get("sql"), token);
  return ok(c);
});

app.get("/api/auth/me", requireAuth, (c) => ok(c, { ok: true, user: c.get("user") }));

/* ------------------------------------------------------------------ */
/* Bootstrap                                                           */
/* ------------------------------------------------------------------ */

app.get("/api/db", requireAuth, async (c) => {
  const data = await loadAll(c.get("sql"));
  return ok(c, { ok: true, ...data });
});

/* ------------------------------------------------------------------ */
/* Leads (enquiries)                                                   */
/* ------------------------------------------------------------------ */

app.post("/api/leads", async (c) => {
  const body = await c.req.json();
  if (!body?.name || !body?.email) return fail(c, "Name and email are required.");
  await insertLead(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.patch("/api/leads/:id", requireAuth, async (c) => {
  const { status } = await c.req.json<{ status?: string }>();
  if (!status) return fail(c, "status is required.");
  await updateLeadStatus(c.get("sql"), c.req.param("id"), status);
  return ok(c);
});

app.delete("/api/leads/:id", requireAuth, async (c) => {
  await deleteLead(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

app.post("/api/blog", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.slug) return fail(c, "slug is required.");
  await upsertInsight(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/blog/:slug", requireAuth, async (c) => {
  await deleteInsight(c.get("sql"), c.req.param("slug"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Portfolio (works)                                                   */
/* ------------------------------------------------------------------ */

app.post("/api/portfolio", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.slug) return fail(c, "slug is required.");
  await upsertWork(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/portfolio/:slug", requireAuth, async (c) => {
  await deleteWork(c.get("sql"), c.req.param("slug"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Users (admin only)                                                  */
/* ------------------------------------------------------------------ */

app.post("/api/users", requireAuth, requireAdmin, async (c) => {
  const body = await c.req.json();
  if (!body?.id || !body?.email) return fail(c, "id and email are required.");
  await upsertUser(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/users/:id", requireAuth, requireAdmin, async (c) => {
  await deleteUser(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

app.post("/api/projects", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id) return fail(c, "id is required.");
  await upsertProject(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/projects/:id", requireAuth, async (c) => {
  await deleteProject(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Agreements                                                          */
/* ------------------------------------------------------------------ */

app.post("/api/agreements", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id) return fail(c, "id is required.");
  await upsertAgreement(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/agreements/:id", requireAuth, async (c) => {
  await deleteAgreement(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

app.post("/api/invoices", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id) return fail(c, "id is required.");
  await upsertInvoice(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/invoices/:id", requireAuth, async (c) => {
  await deleteInvoice(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Quotations / Revenue (additive tables)                              */
/* ------------------------------------------------------------------ */

app.post("/api/quotations", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id) return fail(c, "id is required.");
  await upsertQuotation(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});
app.delete("/api/quotations/:id", requireAuth, async (c) => {
  await deleteQuotation(c.get("sql"), c.req.param("id"));
  return ok(c);
});

app.post("/api/revenue", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id) return fail(c, "id is required.");
  await upsertRevenue(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});
app.delete("/api/revenue/:id", requireAuth, async (c) => {
  await deleteRevenue(c.get("sql"), c.req.param("id"));
  return ok(c);
});

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

app.post("/api/settings", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.key) return fail(c, "key is required.");
  await upsertSetting(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

/* ------------------------------------------------------------------ */
/* Files (project_files + R2)                                          */
/* ------------------------------------------------------------------ */

app.post("/api/files", requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body?.id || !body?.name) return fail(c, "id and name are required.");
  await upsertFile(c.get("sql"), body);
  return ok(c, { ok: true }, 201);
});

app.delete("/api/files/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const rows = await c.get("sql")`SELECT storage_key FROM project_files WHERE id = ${id}`;
  const key = rows[0]?.storage_key as string | undefined;
  if (key) await c.env.BUCKET.delete(key).catch(() => undefined);
  await deleteFile(c.get("sql"), id);
  return ok(c);
});

app.post("/api/files/upload", requireAuth, async (c) => {
  const form = await c.req.formData();
  const rawFile = form.get("file") as
    | { name: string; size: number; type: string; arrayBuffer(): Promise<ArrayBuffer> }
    | string
    | null;
  const folder = String(form.get("folder") ?? "/uploads");
  if (!rawFile || typeof rawFile === "string") return fail(c, "No file provided.");
  const projectId = form.get("project_id") ? String(form.get("project_id")) : "";
  if (!projectId) return fail(c, "project_id is required.");

  const id = crypto.randomUUID();
  const key = buildKey(folder, rawFile.name);
  const buffer = await rawFile.arrayBuffer();
  await putObject(c.env.BUCKET, key, buffer, rawFile.type || undefined);
  const uploadedAt = new Date().toISOString();

  const record = {
    id,
    name: rawFile.name,
    folder,
    size: rawFile.size,
    type: rawFile.type || "application/octet-stream",
    projectId,
    uploadedAt,
    uploadedBy: c.get("user")?.id ?? "unknown",
    r2Key: key,
    url: publicUrl(key),
  };
  await upsertFile(c.get("sql"), record);
  return ok(c, { ok: true, file: { ...record, url: publicUrl(key) } }, 201);
});

app.get("/api/files/:id/url", requireAuth, async (c) => {
  const rows = await c.get("sql")`SELECT public_url, storage_key FROM project_files WHERE id = ${c.req.param("id")}`;
  const row = rows[0];
  if (!row) return fail(c, "File not found", 404);
  const url = (row.public_url as string) || (row.storage_key ? publicUrl(String(row.storage_key)) : null);
  if (!url) return fail(c, "No URL for this file", 404);
  return ok(c, { ok: true, url });
});

/* ------------------------------------------------------------------ */
/* Fallback                                                            */
/* ------------------------------------------------------------------ */

app.notFound((c) => fail(c, "Not found", 404));
app.onError((err, c) => {
  console.error(err);
  return fail(c, "Internal server error", 500);
});

export default app;
