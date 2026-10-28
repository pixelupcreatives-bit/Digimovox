import type {
  AdminDB,
  AdminProject,
  AdminUser,
  Agreement,
  Invoice,
  Lead,
  ManagedFile,
  Quotation,
  RevenueEntry,
  SettingEntry,
} from "./types";
import { buildSeed } from "./seed";
import type { InsightArticle, Project } from "@/types";
import { api, getToken, setToken } from "@/lib/adminApi";

/**
 * Admin data store — remote-first with a local fallback.
 *
 * When the Cloudflare Worker API is reachable it is the source of truth and
 * every mutation is mirrored to Neon Postgres. When it is not (no Worker
 * running, offline, deployed without the API), the store keeps working against
 * browser localStorage, and the UI shows an "offline" badge.
 *
 * All secrets (Neon connection string, R2 keys) stay server-side in the Worker.
 */

const STORAGE_KEY = "movox:admin:v1";

/* ------------------------------------------------------------------ */
/* Persistence (local fallback cache)                                  */
/* ------------------------------------------------------------------ */

function load(): AdminDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminDB;
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.blog)) {
        return { ...buildSeed(), ...parsed };
      }
    }
  } catch {
    /* storage unavailable or corrupt — reseed below */
  }
  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

function persist(db: AdminDB): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* quota or private mode */
  }
}

/* ------------------------------------------------------------------ */
/* Observable singleton                                                */
/* ------------------------------------------------------------------ */

let db: AdminDB = load();
const listeners = new Set<() => void>();

export type ConnectionMode = "unknown" | "live" | "offline";

let mode: ConnectionMode = "unknown";

export function getDB(): AdminDB {
  return db;
}

export function getMode(): ConnectionMode {
  return mode;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(): void {
  listeners.forEach((l) => l());
}

function update(updater: (current: AdminDB) => AdminDB): void {
  db = updater(db);
  persist(db);
  emit();
}

/** Best-effort server push; a failure flips the app to offline mode. */
function push(promise: Promise<unknown>): void {
  promise.catch(() => {
    if (mode === "live") {
      mode = "offline";
      emit();
    }
  });
}

/* ------------------------------------------------------------------ */
/* Server row → client model mappers                                   */
/* ------------------------------------------------------------------ */

type Row = Record<string, any>;

function rowToUser(r: Row): AdminUser {
  return {
    id: String(r.id),
    kind: r.kind === "client" ? "client" : "team",
    name: String(r.name),
    email: String(r.email),
    role: r.role ?? undefined,
    company: r.company ?? undefined,
    phone: r.phone ?? undefined,
    linkedProjectIds: r.linkedProjectIds ?? [],
    active: r.active ?? true,
    createdAt: r.createdAt ?? new Date().toISOString(),
    password: r.password,
    demo: r.demo ?? false,
  };
}

function rowToLead(r: Row): Lead {
  return {
    id: String(r.id),
    referenceId: r.referenceId ?? "",
    source: r.source ?? "contact",
    status: r.status ?? "new",
    name: String(r.name),
    email: String(r.email),
    phone: r.phone,
    company: r.company,
    service: r.service,
    services: [],
    budget: r.budget,
    timeline: r.timeline,
    message: r.message,
    raw: (r.raw as Record<string, unknown>) ?? {},
    submittedAt: r.submittedAt ?? new Date().toISOString(),
    demo: r.demo ?? false,
  };
}

function rowToInsight(r: Row): InsightArticle {
  return {
    slug: String(r.slug),
    title: String(r.title),
    category: r.category ?? "Uncategorised",
    primaryKeyword: "",
    secondaryKeywords: [],
    metaTitle: r.title ?? String(r.title),
    metaDescription: r.excerpt ?? "",
    excerpt: r.excerpt ?? "",
    author: r.author ?? "MovoX Team",
    publishedAt: r.publishedAt ?? new Date().toISOString().slice(0, 10),
    readTime: r.readTime ?? "5 min read",
    image: r.image ?? "",
    alt: String(r.title),
    content: (r.content as InsightArticle["content"]) ?? [],
    related: r.related ?? [],
    ctaLabel: "Start Your Project",
    ctaUrl: "/start-a-project",
  };
}

function rowToWork(r: Row): Project {
  return {
    slug: String(r.slug),
    name: String(r.name),
    client: r.client,
    industry: r.industry,
    services: r.services ?? [],
    thumbnail: r.thumbnail ?? "",
    gallery: [],
    overview: r.overview ?? "",
    challenge: r.challenge ?? "",
    objectives: r.objectives ?? [],
    strategy: r.strategy ?? "",
    execution: r.execution ?? "",
    deliverables: r.deliverables ?? [],
    results: r.results,
    related: [],
    featured: r.featured ?? false,
    demo: r.demo ?? false,
  };
}

function rowToProject(r: Row): AdminProject {
  return { ...r, updates: r.updates ?? [] } as unknown as AdminProject;
}

function rowToAgreement(r: Row): Agreement {
  return r as unknown as Agreement;
}
function rowToInvoice(r: Row): Invoice {
  return r as unknown as Invoice;
}
function rowToQuotation(r: Row): Quotation {
  return r as unknown as Quotation;
}
function rowToRevenue(r: Row): RevenueEntry {
  return r as unknown as RevenueEntry;
}
function rowToFile(r: Row): ManagedFile {
  return r as unknown as ManagedFile;
}
function rowToSetting(r: Row): SettingEntry {
  return {
    key: String(r.key),
    value: r.value,
    group: r.group ?? "",
    label: r.label ?? String(r.key),
    type: r.type ?? "text",
  };
}

/* ------------------------------------------------------------------ */
/* Bootstrap from the server                                           */
/* ------------------------------------------------------------------ */

/**
 * Pull the database from Neon and make it the source of truth.
 * Falls back to the local cache (and demo seed) when the API is unavailable.
 */
export async function bootstrapFromServer(): Promise<boolean> {
  let sessionUser: AdminUser | null = null;
  if (getToken()) {
    try {
      const res = await api.me();
      sessionUser = res.user as AdminUser;
    } catch {
      setToken(null);
      db = { ...db, session: null };
      persist(db);
    }
  }

  try {
    const s = await api.loadDB();
    const next: AdminDB = {
      users: s.users.map(rowToUser),
      leads: s.leads.map(rowToLead),
      blog: s.blog.map(rowToInsight),
      portfolio: s.portfolio.map(rowToWork),
      projects: s.projects.map(rowToProject),
      agreements: s.agreements.map(rowToAgreement),
      invoices: s.invoices.map(rowToInvoice),
      quotations: s.quotations.map(rowToQuotation),
      revenue: s.revenue.map(rowToRevenue),
      files: s.files.map(rowToFile),
      settings: s.settings.map(rowToSetting),
      session: sessionUser
        ? { userId: sessionUser.id, startedAt: new Date().toISOString() }
        : null,
    };
    db = next;
    persist(db);
    mode = "live";
    emit();
    return true;
  } catch {
    mode = "offline";
    emit();
    return false;
  }
}

/** Re-fetch and replace local state. */
export async function refreshFromServer(): Promise<boolean> {
  try {
    const s = await api.loadDB();
    db = {
      ...db,
      users: s.users.map(rowToUser),
      leads: s.leads.map(rowToLead),
      blog: s.blog.map(rowToInsight),
      portfolio: s.portfolio.map(rowToWork),
      projects: s.projects.map(rowToProject),
      agreements: s.agreements.map(rowToAgreement),
      invoices: s.invoices.map(rowToInvoice),
      quotations: s.quotations.map(rowToQuotation),
      revenue: s.revenue.map(rowToRevenue),
      files: s.files.map(rowToFile),
      settings: s.settings.map(rowToSetting),
    };
    persist(db);
    mode = "live";
    emit();
    return true;
  } catch {
    mode = "offline";
    emit();
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function uid(prefix = "id"): string {
  // Several tables (enquiries, projects, admin_users, works, blogs, …) use UUID
  // primary keys, so generate a real UUID when the platform supports it.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [item, ...list];
  const next = list.slice();
  next[idx] = item;
  return next;
}

function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id);
}

function upsertBySlug<T extends { slug: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.slug === item.slug);
  if (idx === -1) return [item, ...list];
  const next = list.slice();
  next[idx] = item;
  return next;
}

function removeBySlug<T extends { slug: string }>(list: T[], slug: string): T[] {
  return list.filter((x) => x.slug !== slug);
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export interface LoginResult {
  ok: boolean;
  error?: string;
}

/** Sign in against the Worker API; persists the session token on success. */
export async function loginRemote(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const res = await api.login(email, password);
    setToken(res.token);
    update((d) => {
      // Make sure the signed-in user is present locally (bootstrap may still
      // be in flight), otherwise the session wouldn't resolve to a user.
      const known = d.users.some((u) => u.id === res.user.id);
      const users = known ? d.users : [rowToUser(res.user as Row), ...d.users];
      return {
        ...d,
        users,
        session: { userId: res.user.id, startedAt: new Date().toISOString() },
      };
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Local-only sign in (used when the API is unreachable). */
export function loginLocal(email: string, password: string): LoginResult {
  const user = db.users.find(
    (u) => u.kind === "team" && u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user) return { ok: false, error: "No team account found for that email." };
  if (user.password !== password) return { ok: false, error: "Incorrect password." };
  if (!user.active) return { ok: false, error: "This account has been deactivated." };
  update((d) => ({
    ...d,
    session: { userId: user.id, startedAt: new Date().toISOString() },
  }));
  return { ok: true };
}

export function logout(): void {
  const token = getToken();
  if (token) push(api.logout());
  setToken(null);
  update((d) => ({ ...d, session: null }));
}

export function currentUser(): AdminUser | undefined {
  if (!db.session) return undefined;
  return db.users.find((u) => u.id === db.session!.userId);
}

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export function addLead(lead: Lead): void {
  update((d) => ({ ...d, leads: [lead, ...d.leads] }));
  push(api.createLead(lead));
}

export function updateLeadStatus(id: string, status: Lead["status"]): void {
  update((d) => ({
    ...d,
    leads: d.leads.map((l) => (l.id === id ? { ...l, status } : l)),
  }));
  push(api.updateLeadStatus(id, status));
}

export function deleteLead(id: string): void {
  update((d) => ({ ...d, leads: removeById(d.leads, id) }));
  push(api.deleteLead(id));
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export function savePost(article: InsightArticle): void {
  update((d) => ({ ...d, blog: upsertBySlug(d.blog, article) }));
  push(api.savePost(article));
}

export function deletePost(slug: string): void {
  update((d) => ({ ...d, blog: removeBySlug(d.blog, slug) }));
  push(api.deletePost(slug));
}

/* ------------------------------------------------------------------ */
/* Portfolio                                                           */
/* ------------------------------------------------------------------ */

export function savePortfolioItem(item: Project): void {
  update((d) => ({ ...d, portfolio: upsertBySlug(d.portfolio, item) }));
  push(api.savePortfolioItem(item));
}

export function deletePortfolioItem(slug: string): void {
  update((d) => ({ ...d, portfolio: removeBySlug(d.portfolio, slug) }));
  push(api.deletePortfolioItem(slug));
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export function saveUser(user: AdminUser): void {
  update((d) => ({ ...d, users: upsert(d.users, user) }));
  push(api.saveUser(user));
}

export function deleteUser(id: string): void {
  update((d) => ({ ...d, users: removeById(d.users, id) }));
  push(api.deleteUser(id));
}

/* ------------------------------------------------------------------ */
/* Business collections                                                */
/* ------------------------------------------------------------------ */

export function saveProject(project: AdminProject): void {
  update((d) => ({ ...d, projects: upsert(d.projects, project) }));
  push(api.saveProject(project));
}
export function deleteProject(id: string): void {
  update((d) => ({ ...d, projects: removeById(d.projects, id) }));
  push(api.deleteProject(id));
}

export function saveAgreement(agreement: Agreement): void {
  update((d) => ({ ...d, agreements: upsert(d.agreements, agreement) }));
  push(api.saveAgreement(agreement));
}
export function deleteAgreement(id: string): void {
  update((d) => ({ ...d, agreements: removeById(d.agreements, id) }));
  push(api.deleteAgreement(id));
}

export function saveInvoice(invoice: Invoice): void {
  update((d) => ({ ...d, invoices: upsert(d.invoices, invoice) }));
  push(api.saveInvoice(invoice));
}
export function deleteInvoice(id: string): void {
  update((d) => ({ ...d, invoices: removeById(d.invoices, id) }));
  push(api.deleteInvoice(id));
}

export function saveQuotation(quotation: Quotation): void {
  update((d) => ({ ...d, quotations: upsert(d.quotations, quotation) }));
  push(api.saveQuotation(quotation));
}
export function deleteQuotation(id: string): void {
  update((d) => ({ ...d, quotations: removeById(d.quotations, id) }));
  push(api.deleteQuotation(id));
}

export function saveRevenue(entry: RevenueEntry): void {
  update((d) => ({ ...d, revenue: upsert(d.revenue, entry) }));
  push(api.saveRevenue(entry));
}
export function deleteRevenue(id: string): void {
  update((d) => ({ ...d, revenue: removeById(d.revenue, id) }));
  push(api.deleteRevenue(id));
}

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

export function saveFile(file: ManagedFile): void {
  update((d) => ({ ...d, files: upsert(d.files, file) }));
  push(api.saveFile(file));
}
export function deleteFile(id: string): void {
  update((d) => ({ ...d, files: removeById(d.files, id) }));
  push(api.deleteFile(id));
}

/** Upload the binary to R2 via the Worker, then add the record locally. */
export async function uploadFile(
  file: File,
  folder: string,
  projectId: string,
): Promise<string> {
  const { file: record } = await api.uploadFile(file, folder, projectId);
  update((d) => ({
    ...d,
    files: upsert(d.files, { ...record, folder: folder || record.folder, demo: false } as ManagedFile),
  }));
  return record.url;
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export function saveSetting(setting: SettingEntry): void {
  update((d) => {
    const settings = d.settings.slice();
    const idx = settings.findIndex((s) => s.key === setting.key);
    if (idx === -1) settings.unshift(setting);
    else settings[idx] = setting;
    return { ...d, settings };
  });
  push(api.saveSetting(setting));
}

/* ------------------------------------------------------------------ */
/* Maintenance                                                         */
/* ------------------------------------------------------------------ */

/** Re-read everything from the database. */
export async function refreshData(): Promise<void> {
  await refreshFromServer();
}

/** True when a live backend is configured and reachable. */
export function hasLiveBackend(): boolean {
  return mode === "live";
}

export { api };
