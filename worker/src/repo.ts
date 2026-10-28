import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export interface Env {
  DATABASE_URL: string;
  SESSION_SECRET: string;
  ALLOWED_ORIGIN?: string;
  BUCKET: R2Bucket;
}

export type Sql = NeonQueryFunction<false, false>;

export function createSql(env: Env): Sql {
  return neon(env.DATABASE_URL);
}

/**
 * The Worker speaks the same shapes the React admin uses, so the frontend needs
 * no mapping layer — it just casts the response.
 */
export interface ClientDB {
  users: ClientUser[];
  leads: ClientLead[];
  blog: ClientInsight[];
  portfolio: ClientWork[];
  projects: ClientProject[];
  agreements: ClientAgreement[];
  invoices: ClientInvoice[];
  quotations: ClientQuotation[];
  revenue: ClientRevenue[];
  files: ClientFile[];
  settings: ClientSetting[];
}

export interface ClientUser {
  id: string;
  kind: "team" | "client";
  name: string;
  email: string;
  role?: string;
  company?: string;
  phone?: string;
  linkedProjectIds: string[];
  active: boolean;
  createdAt: string;
  demo: boolean;
}

export interface ClientLead {
  id: string;
  referenceId: string;
  source: string;
  status: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  raw: Record<string, unknown>;
  submittedAt: string;
  demo: boolean;
}

export interface ClientInsight {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  image: string;
  author: string;
  content: { type: string; text: string }[];
  related: string[];
}

export interface ClientWork {
  slug: string;
  name: string;
  client?: string;
  industry?: string;
  services: string[];
  thumbnail: string;
  overview: string;
  challenge: string;
  objectives: string[];
  strategy: string;
  execution: string;
  deliverables: string[];
  results?: string;
  featured: boolean;
  demo: boolean;
}

export interface ClientProjectUpdate {
  id: string;
  kind: string;
  body: string;
  progress?: number;
  urgency: string;
  visibility: string;
  authorName?: string;
  createdAt: string;
}

export interface ClientProject {
  id: string;
  name: string;
  clientName: string;
  clientId?: string;
  status: string;
  progress: number;
  managerId?: string;
  developerIds: string[];
  startDate?: string;
  deadline?: string;
  value: number;
  code?: string;
  updates: ClientProjectUpdate[];
  demo: boolean;
}

export interface ClientAgreement {
  id: string;
  title: string;
  projectName: string;
  clientName: string;
  status: string;
  value: number;
  createdAt: string;
  signedAt?: string;
  demo: boolean;
}

export interface ClientInvoice {
  id: string;
  number: string;
  projectName: string;
  clientName: string;
  status: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  demo: boolean;
}

export interface ClientQuotation {
  id: string;
  number: string;
  title: string;
  clientName: string;
  status: string;
  amount: number;
  createdAt: string;
  validUntil?: string;
  demo: boolean;
}

export interface ClientRevenue {
  id: string;
  month: string;
  source: string;
  amount: number;
  type: string;
  demo: boolean;
}

export interface ClientFile {
  id: string;
  name: string;
  folder: string;
  size: number;
  type: string;
  projectId?: string;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
  demo: boolean;
}

export interface ClientSetting {
  key: string;
  value: unknown;
  group: string;
  label: string;
  type: string;
}

/* ------------------------------------------------------------------ */
/* Additive column the admin needs (safe, idempotent)                  */
/* ------------------------------------------------------------------ */

export async function ensureSchema(sql: Sql): Promise<void> {
  await sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'`;
}

/* ------------------------------------------------------------------ */
/* Row mappers                                                         */
/* ------------------------------------------------------------------ */

const TEAM_ROLES = new Set(["admin", "operations-manager", "project-manager", "developer", "sales"]);

/** Serialize a JS array as a Postgres array literal for text[] columns. */
function pgArray(items: unknown): string {
  const arr = Array.isArray(items) ? items : [];
  if (arr.length === 0) return "{}";
  return "{" + arr.map((v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",") + "}";
}

function toUser(r: Record<string, unknown>, linkedProjectIds: string[] = []): ClientUser {
  const role = String(r.role ?? "");
  const isClient = role === "client";
  return {
    id: String(r.id),
    kind: isClient ? "client" : "team",
    name: String(r.name),
    email: String(r.email),
    role: isClient ? undefined : TEAM_ROLES.has(role) ? role : undefined,
    company: (r.company as string) || undefined,
    phone: (r.phone as string) || undefined,
    linkedProjectIds,
    active: Boolean(r.is_active),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    demo: false,
  };
}

function toLead(r: Record<string, unknown>): ClientLead {
  const source = String(r.source ?? "enquiry");
  return {
    id: String(r.id),
    referenceId: `ENQ-${String(r.id).slice(0, 8).toUpperCase()}`,
    source: source === "start-a-project" ? "start-a-project" : "contact",
    status: String(r.status ?? "new"),
    name: String(r.name),
    email: String(r.email),
    phone: (r.phone as string) || undefined,
    company: (r.business as string) || undefined,
    service: (r.service as string) || undefined,
    budget: (r.budget as string) || undefined,
    timeline: (r.timeline as string) || undefined,
    message: (r.brief as string) || undefined,
    raw: r as Record<string, unknown>,
    submittedAt: String(r.received_at ?? r.created_at ?? new Date().toISOString()),
    demo: false,
  };
}

function toInsight(r: Record<string, unknown>): ClientInsight {
  const body = Array.isArray(r.body) ? r.body : [];
  return {
    slug: String(r.slug),
    title: String(r.title),
    category: String(r.category ?? "Uncategorised"),
    excerpt: String(r.excerpt ?? ""),
    publishedAt: String(r.published_on ?? new Date().toISOString().slice(0, 10)),
    readTime: `${r.reading_minutes ?? 5} min read`,
    image: String(r.image ?? ""),
    author: String(r.author ?? "MovoX Team"),
    content: body as { type: string; text: string }[],
    related: (r.related_services as string[]) ?? [],
  };
}

function toWork(r: Record<string, unknown>): ClientWork {
  const results = Array.isArray(r.results) ? r.results : [];
  return {
    slug: String(r.slug),
    name: String(r.title),
    client: (r.client as string) || undefined,
    industry: (r.category as string) || undefined,
    services: (r.services as string[]) ?? [],
    thumbnail: String(r.image ?? "/images/portfolio/demo-placeholder.svg"),
    overview: String(r.summary ?? ""),
    challenge: String(r.challenge ?? ""),
    objectives: (r.objectives as string[]) ?? [],
    strategy: ((r.approach as string[]) ?? []).join("\n"),
    execution: "",
    deliverables: (r.deliverables as string[]) ?? [],
    results: results.map((x) => `${x.label}: ${x.value}`).join("\n") || undefined,
    featured: Boolean(r.published && !r.is_sample),
    demo: Boolean(r.is_sample),
  };
}

function toProject(
  r: Record<string, unknown>,
  members: string[],
  updates: ClientProjectUpdate[],
  usersById: Map<string, ClientUser>,
): ClientProject {
  const clientId = (r.client_id as string) ?? undefined;
  const client = clientId ? usersById.get(clientId) : undefined;
  return {
    id: String(r.id),
    name: String(r.name),
    clientName: client?.name ?? "",
    clientId,
    status: String(r.status ?? "planning"),
    progress: Number(r.progress ?? 0),
    managerId: (r.created_by as string) ?? undefined,
    developerIds: members,
    startDate: (r.start_date as string) ?? undefined,
    deadline: (r.end_date as string) ?? undefined,
    value: Number(r.budget ?? 0),
    code: (r.code as string) ?? undefined,
    updates,
    demo: false,
  };
}

function toAgreement(r: Record<string, unknown>): ClientAgreement {
  return {
    id: String(r.id),
    title: String(r.title),
    projectName: String(r.project_name ?? ""),
    clientName: String(r.client_company ?? r.client_name ?? ""),
    status: String(r.status ?? "draft"),
    value: 0,
    createdAt: String(r.created_at ?? new Date().toISOString()),
    signedAt: (r.signed_at as string) ?? (r.client_signed_at as string) ?? undefined,
    demo: false,
  };
}

function toInvoice(r: Record<string, unknown>): ClientInvoice {
  return {
    id: String(r.id),
    number: String(r.invoice_number),
    projectName: String(r.client_company ?? ""),
    clientName: String(r.client_name ?? ""),
    status: String(r.status ?? "draft"),
    amount: Number(r.total ?? 0),
    issuedAt: String(r.issue_date ?? new Date().toISOString()),
    dueAt: String(r.due_date ?? r.issue_date ?? new Date().toISOString()),
    paidAt: (r.paid_at as string) ?? undefined,
    demo: false,
  };
}

function toQuotation(r: Record<string, unknown>): ClientQuotation {
  return {
    id: String(r.id),
    number: String(r.number),
    title: String(r.title ?? ""),
    clientName: String(r.client_name ?? ""),
    status: String(r.status ?? "draft"),
    amount: Number(r.amount ?? 0),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    validUntil: (r.valid_until as string) ?? undefined,
    demo: Boolean(r.demo),
  };
}

function toRevenue(r: Record<string, unknown>): ClientRevenue {
  return {
    id: String(r.id),
    month: String(r.month),
    source: String(r.source ?? ""),
    amount: Number(r.amount ?? 0),
    type: String(r.type ?? "income"),
    demo: Boolean(r.demo),
  };
}

function toFile(r: Record<string, unknown>): ClientFile {
  return {
    id: String(r.id),
    name: String(r.filename),
    folder: "",
    size: Number(r.size_bytes ?? 0),
    type: String(r.content_type ?? ""),
    projectId: (r.project_id as string) ?? undefined,
    uploadedAt: String(r.created_at ?? new Date().toISOString()),
    uploadedBy: String(r.uploaded_by ?? ""),
    url: (r.public_url as string) ?? undefined,
    demo: false,
  };
}

/* ------------------------------------------------------------------ */
/* Load everything                                                     */
/* ------------------------------------------------------------------ */

export async function loadAll(sql: Sql): Promise<ClientDB> {
  await ensureSchema(sql);

  const [users, projects, members, updates, enquiries, works, blogs, agreements, invoices, quotations, revenue, files, settings] =
    await Promise.all([
      sql`SELECT * FROM admin_users ORDER BY created_at`,
      sql`SELECT * FROM projects ORDER BY created_at`,
      sql`SELECT * FROM project_members`,
      sql`SELECT * FROM project_updates ORDER BY created_at`,
      sql`SELECT * FROM enquiries ORDER BY received_at DESC`,
      sql`SELECT * FROM works ORDER BY sort_order`,
      sql`SELECT * FROM blogs ORDER BY published_on DESC`,
      sql`SELECT * FROM agreements ORDER BY created_at`,
      sql`SELECT * FROM invoices ORDER BY created_at`,
      sql`SELECT * FROM quotations`,
      sql`SELECT * FROM revenue ORDER BY month`,
      sql`SELECT * FROM project_files ORDER BY created_at`,
      sql`SELECT * FROM settings ORDER BY key`,
    ]);

  const usersById = new Map<string, ClientUser>();
  const clientUsers: ClientUser[] = users.map((u) => {
    const cu = toUser(u);
    usersById.set(cu.id, cu);
    return cu;
  });

  // Which projects each client is linked to.
  const linkedByUser = new Map<string, string[]>();
  for (const p of projects) {
    const cid = p.client_id as string | null;
    if (!cid) continue;
    const list = linkedByUser.get(cid) ?? [];
    list.push(String(p.id));
    linkedByUser.set(cid, list);
  }
  const allUsers = clientUsers.map((u) => ({
    ...u,
    linkedProjectIds: linkedByUser.get(u.id) ?? [],
  }));
  const usersById2 = new Map(allUsers.map((u) => [u.id, u]));

  const membersByProject = new Map<string, string[]>();
  for (const m of members) {
    const pid = String(m.project_id);
    const list = membersByProject.get(pid) ?? [];
    list.push(String(m.user_id));
    membersByProject.set(pid, list);
  }

  const updatesByProject = new Map<string, ClientProjectUpdate[]>();
  for (const u of updates) {
    const pid = String(u.project_id);
    const list = updatesByProject.get(pid) ?? [];
    const author = u.author_id ? usersById2.get(String(u.author_id)) : undefined;
    list.push({
      id: String(u.id),
      kind: String(u.kind ?? "message"),
      body: String(u.body ?? ""),
      progress: u.progress != null ? Number(u.progress) : undefined,
      urgency: String(u.urgency ?? "normal"),
      visibility: String(u.visibility ?? "shared"),
      authorName: author?.name,
      createdAt: String(u.created_at ?? new Date().toISOString()),
    });
    updatesByProject.set(pid, list);
  }

  return {
    users: allUsers,
    leads: enquiries.map(toLead),
    blog: blogs.map(toInsight),
    portfolio: works.map(toWork),
    projects: projects.map((p) =>
      toProject(p, membersByProject.get(String(p.id)) ?? [], updatesByProject.get(String(p.id)) ?? [], usersById2),
    ),
    agreements: agreements.map(toAgreement),
    invoices: invoices.map(toInvoice),
    quotations: quotations.map(toQuotation),
    revenue: revenue.map(toRevenue),
    files: files.map(toFile),
    settings: settings.map((s) => ({
      key: String(s.key),
      value: s.value as unknown,
      group: String(s.group_name ?? ""),
      label: String(s.label ?? String(s.key)),
      type: String(s.type ?? "text"),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export const getUsers = (sql: Sql) => sql`SELECT * FROM admin_users ORDER BY created_at`;

export async function upsertUser(sql: Sql, u: Record<string, unknown>): Promise<void> {
  const isClient = u.kind === "client";
  const role = isClient ? "client" : String(u.role ?? "sales");
  const linked = Array.isArray(u.linked_project_ids) ? (u.linked_project_ids as string[]) : [];
  const now = new Date().toISOString();
  await sql`
    INSERT INTO admin_users (id, email, password_hash, name, role, created_at, phone, avatar, is_active, notes, company, client_of, personal_email)
    VALUES (${String(u.id)}, ${String(u.email)}, ${String(u.password ?? "")}, ${String(u.name)}, ${role},
            ${now}, ${String(u.phone ?? "")}, ${""}, ${Boolean(u.active ?? true)},
            ${JSON.stringify({ linkedProjectIds: linked })}, ${String(u.company ?? "")}, ${""}, ${String(u.personal_email ?? "")})
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email, name = EXCLUDED.name, role = EXCLUDED.role,
      phone = EXCLUDED.phone, is_active = EXCLUDED.is_active, company = EXCLUDED.company
  `;
}

export const deleteUser = (sql: Sql, id: string) => sql`DELETE FROM admin_users WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Enquiries → Leads                                                   */
/* ------------------------------------------------------------------ */

export async function insertLead(sql: Sql, l: Record<string, unknown>): Promise<void> {
  const now = new Date().toISOString();
  await sql`
    INSERT INTO enquiries (id, name, business, email, phone, service, budget, timeline, brief,
                           consent, source, received_at, status, created_at)
    VALUES (${String(l.id)}, ${String(l.name)}, ${String(l.company ?? "")}, ${String(l.email)},
            ${String(l.phone ?? "")}, ${String(l.service ?? (Array.isArray(l.services) ? l.services[0] : "") ?? "")},
            ${String(l.budget ?? "")}, ${String(l.timeline ?? "")}, ${String(l.message ?? "")},
            TRUE, ${String(l.source ?? "enquiry")}, ${now}, ${String(l.status ?? "new")}, ${now})
  `;
}

export const updateLeadStatus = (sql: Sql, id: string, status: string) =>
  sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;

export const deleteLead = (sql: Sql, id: string) => sql`DELETE FROM enquiries WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export async function upsertInsight(sql: Sql, a: Record<string, unknown>): Promise<void> {
  const minutes = Number(String(a.readTime ?? "5").replace(/\D/g, "")) || 5;
  const now = new Date().toISOString();
  await sql`
    INSERT INTO blogs (id, slug, title, excerpt, category, published_on, reading_minutes, image,
                       author, author_role, body, related_services, published, created_at, updated_at)
    VALUES (${crypto.randomUUID()}, ${String(a.slug)}, ${String(a.title)}, ${String(a.excerpt ?? "")}, ${String(a.category ?? "Uncategorised")},
            ${String(a.publishedAt ?? new Date().toISOString().slice(0, 10))}, ${minutes},
            ${String(a.image ?? "")}, ${String(a.author ?? "MovoX Team")}, ${"MovoX Team"},
            ${JSON.stringify(a.content ?? [])}::jsonb, ${pgArray(a.related ?? [])}::text[], TRUE, ${now}, ${now})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, category = EXCLUDED.category,
      published_on = EXCLUDED.published_on, reading_minutes = EXCLUDED.reading_minutes,
      image = EXCLUDED.image, author = EXCLUDED.author, body = EXCLUDED.body,
      related_services = EXCLUDED.related_services, published = EXCLUDED.published
  `;
}

export const deleteInsight = (sql: Sql, slug: string) => sql`DELETE FROM blogs WHERE slug = ${slug}`;

/* ------------------------------------------------------------------ */
/* Works (portfolio)                                                   */
/* ------------------------------------------------------------------ */

export async function upsertWork(sql: Sql, w: Record<string, unknown>): Promise<void> {
  const now = new Date().toISOString();
  await sql`
    INSERT INTO works (id, slug, title, client, client_descriptor, category, services, year, summary,
                       image, challenge, objectives, approach, deliverables, results, is_sample,
                       published, sort_order, created_at, updated_at)
    VALUES (${crypto.randomUUID()}, ${String(w.slug)}, ${String(w.name)}, ${String(w.client ?? "")}, ${String(w.industry ?? "")},
            ${String(w.industry ?? "")}, ${pgArray(w.services ?? [])}::text[], ${String(new Date().getFullYear())},
            ${String(w.overview ?? "")}, ${String(w.thumbnail ?? "")}, ${String(w.challenge ?? "")},
            ${pgArray(w.objectives ?? [])}::text[], ${pgArray(String(w.strategy ?? "").split("\n").filter(Boolean))}::text[],
            ${pgArray(w.deliverables ?? [])}::text[],
            ${JSON.stringify(parseResults(w.results))}::jsonb,
            ${Boolean(w.demo ?? false)}, ${Boolean(w.featured ?? true)},
            ${Number(w.sortOrder ?? 0)}, ${now}, ${now})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, client = EXCLUDED.client, category = EXCLUDED.category,
      services = EXCLUDED.services, summary = EXCLUDED.summary, image = EXCLUDED.image,
      challenge = EXCLUDED.challenge, objectives = EXCLUDED.objectives, approach = EXCLUDED.approach,
      deliverables = EXCLUDED.deliverables, results = EXCLUDED.results, is_sample = EXCLUDED.is_sample,
      published = EXCLUDED.published
  `;
}

function parseResults(results: unknown): { note: string; label: string; value: string }[] {
  if (!results) return [];
  if (Array.isArray(results)) return results as { note: string; label: string; value: string }[];
  if (typeof results === "string") {
    return results
      .split("\n")
      .filter(Boolean)
      .map((line, i) => ({ note: line, label: `Result ${i + 1}`, value: line }));
  }
  return [];
}

export const deleteWork = (sql: Sql, slug: string) => sql`DELETE FROM works WHERE slug = ${slug}`;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export async function upsertProject(sql: Sql, p: Record<string, unknown>): Promise<void> {
  const startDate = p.startDate ? String(p.startDate).slice(0, 10) : null;
  const endDate = p.deadline ? String(p.deadline).slice(0, 10) : null;
  await sql`
    INSERT INTO projects (id, code, name, description, client_id, status, priority, start_date, end_date, budget, progress, created_by)
    VALUES (${String(p.id)}, ${String(p.code ?? `PRJ-${String(p.id).slice(0, 4).toUpperCase()}`)},
            ${String(p.name)}, ${String(p.description ?? "")}, ${p.clientId ? String(p.clientId) : null},
            ${String(p.status ?? "planning")}, ${"normal"},
            ${startDate}, ${endDate},
            ${Number(p.value ?? 0)}, ${Number(p.progress ?? 0)}, ${p.managerId ? String(p.managerId) : null})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, status = EXCLUDED.status, start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date, budget = EXCLUDED.budget, progress = EXCLUDED.progress,
      client_id = EXCLUDED.client_id, created_by = EXCLUDED.created_by
  `;
  const devs = Array.isArray(p.developerIds) ? (p.developerIds as string[]) : [];
  if (devs.length) {
    await sql`DELETE FROM project_members WHERE project_id = ${String(p.id)}`;
    for (const uid of devs) {
      await sql`INSERT INTO project_members (id, project_id, user_id, assigned_at) VALUES (${crypto.randomUUID()}, ${String(p.id)}, ${uid}, ${new Date().toISOString()})`;
    }
  }
}

export const deleteProject = (sql: Sql, id: string) =>
  sql`DELETE FROM projects WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Agreements                                                          */
/* ------------------------------------------------------------------ */

export async function upsertAgreement(sql: Sql, a: Record<string, unknown>): Promise<void> {
  await sql`
    INSERT INTO agreements (id, title, project_name, status, signature_name, document_url,
                            client_name, client_company, effective_date)
    VALUES (${String(a.id)}, ${String(a.title)}, ${String(a.projectName ?? "")}, ${String(a.status ?? "draft")},
            ${String(a.clientName ?? "")}, ${""}, ${String(a.clientName ?? "")},
            ${String(a.projectName ?? "")}, ${null})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title, project_name = EXCLUDED.project_name, status = EXCLUDED.status,
      client_name = EXCLUDED.client_name, client_company = EXCLUDED.client_company,
      signed_at = ${a.signedAt ? String(a.signedAt) : null}
  `;
}

export const deleteAgreement = (sql: Sql, id: string) => sql`DELETE FROM agreements WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

export async function upsertInvoice(sql: Sql, i: Record<string, unknown>): Promise<void> {
  const issue = String(i.issuedAt ?? new Date().toISOString()).slice(0, 10);
  const due = String(i.dueAt ?? i.issuedAt ?? new Date().toISOString()).slice(0, 10);
  await sql`
    INSERT INTO invoices (id, invoice_number, client_name, client_company, status, subtotal, tax_rate,
                          tax_amount, total, currency, issue_date, due_date, paid_at, terms)
    VALUES (${String(i.id)}, ${String(i.number)}, ${String(i.clientName ?? "")}, ${String(i.projectName ?? "")},
            ${String(i.status ?? "draft")}, ${Number(i.amount ?? 0)}, ${0}, ${0}, ${Number(i.amount ?? 0)},
            ${"INR"}, ${issue}, ${due},
            ${i.paidAt ? String(i.paidAt) : null}, ${"Payment due within 14 days of invoice date."})
    ON CONFLICT (id) DO UPDATE SET
      invoice_number = EXCLUDED.invoice_number, client_name = EXCLUDED.client_name,
      client_company = EXCLUDED.client_company, status = EXCLUDED.status, total = EXCLUDED.total,
      due_date = EXCLUDED.due_date, paid_at = EXCLUDED.paid_at
  `;
}

export const deleteInvoice = (sql: Sql, id: string) => sql`DELETE FROM invoices WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Quotations / Revenue (additive tables)                              */
/* ------------------------------------------------------------------ */

export async function upsertQuotation(sql: Sql, q: Record<string, unknown>): Promise<void> {
  await sql`
    INSERT INTO quotations (id, number, title, client_name, status, amount, created_at, valid_until, demo)
    VALUES (${String(q.id)}, ${String(q.number)}, ${String(q.title ?? "")}, ${String(q.clientName ?? "")},
            ${String(q.status ?? "draft")}, ${Number(q.amount ?? 0)}, ${String(q.createdAt ?? new Date().toISOString())},
            ${q.validUntil ? String(q.validUntil) : null}, ${Boolean(q.demo ?? false)})
    ON CONFLICT (id) DO UPDATE SET
      number = EXCLUDED.number, title = EXCLUDED.title, client_name = EXCLUDED.client_name,
      status = EXCLUDED.status, amount = EXCLUDED.amount, valid_until = EXCLUDED.valid_until
  `;
}
export const deleteQuotation = (sql: Sql, id: string) => sql`DELETE FROM quotations WHERE id = ${id}`;

export async function upsertRevenue(sql: Sql, r: Record<string, unknown>): Promise<void> {
  await sql`
    INSERT INTO revenue (id, month, source, amount, type, demo)
    VALUES (${String(r.id)}, ${String(r.month)}, ${String(r.source ?? "")}, ${Number(r.amount ?? 0)},
            ${String(r.type ?? "income")}, ${Boolean(r.demo ?? false)})
    ON CONFLICT (id) DO UPDATE SET month = EXCLUDED.month, source = EXCLUDED.source,
      amount = EXCLUDED.amount, type = EXCLUDED.type
  `;
}
export const deleteRevenue = (sql: Sql, id: string) => sql`DELETE FROM revenue WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Files (project_files + R2)                                          */
/* ------------------------------------------------------------------ */

export async function upsertFile(sql: Sql, f: Record<string, unknown>): Promise<void> {
  await sql`
    INSERT INTO project_files (id, project_id, uploaded_by, filename, storage_key, public_url,
                               content_type, size_bytes, client_finalized)
    VALUES (${String(f.id)}, ${f.projectId ? String(f.projectId) : null}, ${f.uploadedBy ? String(f.uploadedBy) : null},
            ${String(f.name)}, ${String(f.r2Key ?? "")}, ${String(f.url ?? "")}, ${String(f.type ?? "")},
            ${Number(f.size ?? 0)}, FALSE)
    ON CONFLICT (id) DO UPDATE SET
      filename = EXCLUDED.filename, public_url = EXCLUDED.public_url, storage_key = EXCLUDED.storage_key,
      content_type = EXCLUDED.content_type, size_bytes = EXCLUDED.size_bytes
  `;
}

export const deleteFile = (sql: Sql, id: string) => sql`DELETE FROM project_files WHERE id = ${id}`;

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export async function upsertSetting(sql: Sql, s: Record<string, unknown>): Promise<void> {
  await sql`
    INSERT INTO settings (id, key, value, group_name, label, type)
    VALUES (${crypto.randomUUID()}, ${String(s.key)}, ${JSON.stringify(s.value)}, ${String(s.group ?? "General")},
            ${String(s.label ?? String(s.key))}, ${String(s.type ?? "text")})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, label = EXCLUDED.label, type = EXCLUDED.type
  `;
}

/* ------------------------------------------------------------------ */
/* Sessions                                                            */
/* ------------------------------------------------------------------ */

export function createSession(sql: Sql, token: string, userId: string, startedAt: string) {
  return sql`INSERT INTO sessions (token, user_id, started_at) VALUES (${token}, ${userId}, ${startedAt})`;
}

export function getSessionUser(sql: Sql, token: string) {
  return sql`
    SELECT u.* FROM sessions s JOIN admin_users u ON u.id = s.user_id::uuid WHERE s.token = ${token}
  `;
}

export function deleteSession(sql: Sql, token: string) {
  return sql`DELETE FROM sessions WHERE token = ${token}`;
}

/* ------------------------------------------------------------------ */
/* Password verification (PBKDF2-SHA256, Web Crypto)                   */
/* ------------------------------------------------------------------ */

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [scheme, iterationsStr, salt, expected] = encoded.split("$");
  if (scheme !== "pbkdf2" || !iterationsStr || !salt || !expected) return false;
  const iterations = Number(iterationsStr);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(salt), iterations },
    key,
    256,
  );
  return bufToHex(bits) === expected;
}
