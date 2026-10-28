import type { InsightArticle, Project } from "@/types";

/* ================================================================== */
/* Roles & permissions                                                 */
/* ================================================================== */

export type Role =
  | "admin"
  | "operations-manager"
  | "project-manager"
  | "developer"
  | "sales";

export type Permission =
  | "dashboard.view"
  | "content.blog"
  | "content.portfolio"
  | "leads.view"
  | "projects.view"
  | "agreements.view"
  | "invoices.view"
  | "quotations.view"
  | "revenue.view"
  | "files.view"
  | "users.manage";

export const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "content.blog",
  "content.portfolio",
  "leads.view",
  "projects.view",
  "agreements.view",
  "invoices.view",
  "quotations.view",
  "revenue.view",
  "files.view",
  "users.manage",
];

/**
 * Role → permission matrix.
 *
 * Admin can do everything (including managing users and delegating roles).
 * Every other role sees exactly the modules it needs, per the business rules:
 *   - Operational Manager → Projects, Agreements, Invoices, Quotations, Revenue
 *   - Project Manager     → Projects, Agreements
 *   - Developer           → Projects, File Manager
 *   - Sales Person        → Leads generation tool
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL_PERMISSIONS,
  "operations-manager": [
    "dashboard.view",
    "projects.view",
    "agreements.view",
    "invoices.view",
    "quotations.view",
    "revenue.view",
  ],
  "project-manager": ["dashboard.view", "projects.view", "agreements.view"],
  developer: ["dashboard.view", "projects.view", "files.view"],
  sales: ["dashboard.view", "leads.view"],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  "operations-manager": "Operational Manager",
  "project-manager": "Project Manager",
  developer: "Developer",
  sales: "Sales Person",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access to every module, including user and role management.",
  "operations-manager":
    "Oversees delivery and finance: projects, agreements, invoices, quotations and revenue.",
  "project-manager": "Tracks active projects and their signed agreements.",
  developer: "Works on assigned projects and the shared file manager.",
  sales: "Generates and qualifies leads from the website's enquiry and contact forms.",
};

export function rolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/* ================================================================== */
/* Users (team + clients)                                              */
/* ================================================================== */

export type UserKind = "team" | "client";

export interface AdminUser {
  id: string;
  kind: UserKind;
  name: string;
  email: string;
  /** Team members only — the role that gates which modules they can open. */
  role?: Role;
  /** Client records only — company / organisation they belong to. */
  company?: string;
  phone?: string;
  /** Client records only — internal delivery projects they are linked to. */
  linkedProjectIds?: string[];
  active: boolean;
  createdAt: string;
  /** Local demo login password (demo data only — a real backend hashes these). */
  password?: string;
  /** Marks clearly-labelled demo/sample records. */
  demo?: boolean;
}

/* ================================================================== */
/* Leads (Start a Project + Contact submissions)                       */
/* ================================================================== */

export type LeadSource = "start-a-project" | "contact";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export interface Lead {
  id: string;
  referenceId: string;
  source: LeadSource;
  status: LeadStatus;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  /** Contact form service slug or a joined list of wizard services. */
  service?: string;
  services?: string[];
  budget?: string;
  timeline?: string;
  message?: string;
  /** Full submitted payload, kept verbatim for reference. */
  raw: Record<string, unknown>;
  submittedAt: string;
  demo?: boolean;
}

/* ================================================================== */
/* Internal delivery projects                                          */
/* ================================================================== */

export type ProjectStatus =
  | "planning"
  | "in-progress"
  | "review"
  | "delivered"
  | "on-hold";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  "in-progress": "In Progress",
  review: "In Review",
  delivered: "Delivered",
  "on-hold": "On Hold",
};

export interface AdminProject {
  id: string;
  name: string;
  clientName: string;
  clientId?: string;
  status: ProjectStatus;
  /** 0–100 completion, shown on progress bars. */
  progress: number;
  managerId?: string;
  developerIds: string[];
  startDate?: string;
  deadline?: string;
  /** Contracted value in INR. */
  value: number;
  /** Human-readable project code (e.g. PRJ-9780) from the database. */
  code?: string;
  /** Client/team messages attached to the project. */
  updates?: ProjectUpdate[];
  demo?: boolean;
}

export interface ProjectUpdate {
  id: string;
  kind: string;
  body: string;
  progress?: number;
  urgency: string;
  visibility: string;
  authorName?: string;
  createdAt: string;
}

/* ================================================================== */
/* Agreements, invoices, quotations, revenue                           */
/* ================================================================== */

export type AgreementStatus = "draft" | "sent" | "signed" | "expired";

export interface Agreement {
  id: string;
  title: string;
  projectName: string;
  clientId?: string;
  /** Resolved client/company name (read-only convenience). */
  clientName?: string;
  status: AgreementStatus;
  value: number;
  createdAt: string;
  signedAt?: string;
  demo?: boolean;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

export interface Invoice {
  id: string;
  number: string;
  projectName: string;
  clientId?: string;
  /** Resolved client/company name (read-only convenience). */
  clientName?: string;
  status: InvoiceStatus;
  amount: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  demo?: boolean;
}

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export interface Quotation {
  id: string;
  number: string;
  title: string;
  clientName: string;
  status: QuotationStatus;
  amount: number;
  createdAt: string;
  validUntil?: string;
  demo?: boolean;
}

export interface RevenueEntry {
  id: string;
  /** ISO month, e.g. "2026-01". */
  month: string;
  source: string;
  amount: number;
  type: "income" | "forecast";
  demo?: boolean;
}

/* ================================================================== */
/* File manager                                                        */
/* ================================================================== */

export interface ManagedFile {
  id: string;
  name: string;
  folder: string;
  size: number;
  type: string;
  projectId?: string;
  uploadedAt: string;
  uploadedBy: string;
  /** Public R2 URL (files uploaded through the API). */
  url?: string;
  demo?: boolean;
}

export interface SettingEntry {
  key: string;
  value: unknown;
  group: string;
  label: string;
  type: string;
}

/* ================================================================== */
/* Session                                                             */
/* ================================================================== */

export interface Session {
  userId: string;
  startedAt: string;
}

/* ================================================================== */
/* The whole local database                                            */
/* ================================================================== */

export interface AdminDB {
  users: AdminUser[];
  leads: Lead[];
  blog: InsightArticle[];
  portfolio: Project[];
  projects: AdminProject[];
  agreements: Agreement[];
  invoices: Invoice[];
  quotations: Quotation[];
  revenue: RevenueEntry[];
  files: ManagedFile[];
  settings: SettingEntry[];
  session: Session | null;
}

/** Re-export content types so consumers can import from one place. */
export type { InsightArticle, Project };
