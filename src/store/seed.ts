import { insights } from "@/data/insights";
import { projects } from "@/data/projects";
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
} from "./types";

/** Password shared by every seeded demo login (shown on the login screen). */
export const DEMO_PASSWORD = "demo1234";

const iso = (d: string) => new Date(d).toISOString();

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

const users: AdminUser[] = [
  {
    id: "u-admin",
    kind: "team",
    name: "Aarav Mehta",
    email: "admin@movox.demo",
    role: "admin",
    active: true,
    createdAt: iso("2026-01-05"),
    password: DEMO_PASSWORD,
    demo: true,
  },
  {
    id: "u-ops",
    kind: "team",
    name: "Priya Nair",
    email: "ops@movox.demo",
    role: "operations-manager",
    active: true,
    createdAt: iso("2026-01-08"),
    password: DEMO_PASSWORD,
    demo: true,
  },
  {
    id: "u-pm",
    kind: "team",
    name: "Rahul Verma",
    email: "pm@movox.demo",
    role: "project-manager",
    active: true,
    createdAt: iso("2026-01-10"),
    password: DEMO_PASSWORD,
    demo: true,
  },
  {
    id: "u-dev",
    kind: "team",
    name: "Sneha Iyer",
    email: "dev@movox.demo",
    role: "developer",
    active: true,
    createdAt: iso("2026-01-12"),
    password: DEMO_PASSWORD,
    demo: true,
  },
  {
    id: "u-sales",
    kind: "team",
    name: "Karan Shah",
    email: "sales@movox.demo",
    role: "sales",
    active: true,
    createdAt: iso("2026-01-15"),
    password: DEMO_PASSWORD,
    demo: true,
  },
  {
    id: "u-client-1",
    kind: "client",
    name: "Meera Reddy",
    email: "meera@sampleclient.demo",
    company: "Sample Retail Co.",
    phone: "+91 90000 00001",
    linkedProjectIds: ["p-1"],
    active: true,
    createdAt: iso("2026-02-01"),
    demo: true,
  },
];

/* ------------------------------------------------------------------ */
/* Internal projects                                                   */
/* ------------------------------------------------------------------ */

const projectsSeed: AdminProject[] = [
  {
    id: "p-1",
    name: "Sample Retail — Website Redesign",
    clientName: "Sample Retail Co.",
    clientId: "u-client-1",
    status: "in-progress",
    progress: 60,
    managerId: "u-pm",
    developerIds: ["u-dev"],
    startDate: iso("2026-03-02"),
    deadline: iso("2026-05-15"),
    value: 145000,
    demo: true,
  },
  {
    id: "p-2",
    name: "Sample Foods — Brand Identity",
    clientName: "Sample Foods LLP",
    status: "review",
    progress: 85,
    managerId: "u-pm",
    developerIds: [],
    startDate: iso("2026-02-10"),
    deadline: iso("2026-04-10"),
    value: 65000,
    demo: true,
  },
  {
    id: "p-3",
    name: "Sample Apps — MVP Build",
    clientName: "Sample Tech",
    status: "planning",
    progress: 15,
    managerId: "u-ops",
    developerIds: ["u-dev"],
    startDate: iso("2026-04-01"),
    deadline: iso("2026-08-01"),
    value: 320000,
    demo: true,
  },
];

/* ------------------------------------------------------------------ */
/* Agreements, invoices, quotations, revenue                           */
/* ------------------------------------------------------------------ */

const agreements: Agreement[] = [
  {
    id: "a-1",
    title: "Website Redesign Agreement",
    projectName: "Sample Retail — Website Redesign",
    clientId: "u-client-1",
    status: "signed",
    value: 145000,
    createdAt: iso("2026-02-25"),
    signedAt: iso("2026-03-01"),
    demo: true,
  },
  {
    id: "a-2",
    title: "Brand Identity Agreement",
    projectName: "Sample Foods — Brand Identity",
    status: "signed",
    value: 65000,
    createdAt: iso("2026-02-05"),
    signedAt: iso("2026-02-09"),
    demo: true,
  },
  {
    id: "a-3",
    title: "MVP Development Agreement",
    projectName: "Sample Apps — MVP Build",
    status: "sent",
    value: 320000,
    createdAt: iso("2026-03-20"),
    demo: true,
  },
];

const invoices: Invoice[] = [
  {
    id: "i-1",
    number: "INV-2026-001",
    projectName: "Sample Retail — Website Redesign",
    clientId: "u-client-1",
    status: "paid",
    amount: 72500,
    issuedAt: iso("2026-03-05"),
    dueAt: iso("2026-03-20"),
    paidAt: iso("2026-03-18"),
    demo: true,
  },
  {
    id: "i-2",
    number: "INV-2026-002",
    projectName: "Sample Foods — Brand Identity",
    status: "sent",
    amount: 32500,
    issuedAt: iso("2026-03-12"),
    dueAt: iso("2026-04-12"),
    demo: true,
  },
  {
    id: "i-3",
    number: "INV-2026-003",
    projectName: "Sample Retail — Website Redesign",
    clientId: "u-client-1",
    status: "overdue",
    amount: 72500,
    issuedAt: iso("2026-03-25"),
    dueAt: iso("2026-04-08"),
    demo: true,
  },
];

const quotations: Quotation[] = [
  {
    id: "q-1",
    number: "QUO-2026-001",
    title: "MVP Build Quotation",
    clientName: "Sample Tech",
    status: "sent",
    amount: 320000,
    createdAt: iso("2026-03-18"),
    validUntil: iso("2026-04-18"),
    demo: true,
  },
  {
    id: "q-2",
    number: "QUO-2026-002",
    title: "Social Media Retainer",
    clientName: "Sample Retail Co.",
    status: "accepted",
    amount: 25000,
    createdAt: iso("2026-02-20"),
    validUntil: iso("2026-03-20"),
    demo: true,
  },
];

const revenue: RevenueEntry[] = [
  { id: "r-1", month: "2026-01", source: "Retainers", amount: 40000, type: "income", demo: true },
  { id: "r-2", month: "2026-02", source: "Projects", amount: 97500, type: "income", demo: true },
  { id: "r-3", month: "2026-03", source: "Projects", amount: 105000, type: "income", demo: true },
  { id: "r-4", month: "2026-03", source: "Retainers", amount: 25000, type: "income", demo: true },
  { id: "r-5", month: "2026-04", source: "Projects", amount: 150000, type: "forecast", demo: true },
  { id: "r-6", month: "2026-05", source: "Projects", amount: 175000, type: "forecast", demo: true },
];

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

const files: ManagedFile[] = [
  {
    id: "f-1",
    name: "brand-guidelines-v1.pdf",
    folder: "/sample-retail",
    size: 2_400_000,
    type: "application/pdf",
    projectId: "p-1",
    uploadedAt: iso("2026-03-06"),
    uploadedBy: "u-design",
    demo: true,
  },
  {
    id: "f-2",
    name: "homepage-mockup.png",
    folder: "/sample-retail/design",
    size: 850_000,
    type: "image/png",
    projectId: "p-1",
    uploadedAt: iso("2026-03-14"),
    uploadedBy: "u-dev",
    demo: true,
  },
  {
    id: "f-3",
    name: "mvp-scope.docx",
    folder: "/sample-apps",
    size: 120_000,
    type: "application/msword",
    projectId: "p-3",
    uploadedAt: iso("2026-03-22"),
    uploadedBy: "u-pm",
    demo: true,
  },
];

/* ------------------------------------------------------------------ */
/* Demo leads                                                          */
/* ------------------------------------------------------------------ */

const leads: Lead[] = [
  {
    id: "l-demo-1",
    referenceId: "MVX-26-DEMO1",
    source: "start-a-project",
    status: "qualified",
    name: "Sample Prospect",
    email: "prospect@sampleco.demo",
    phone: "+91 90000 00002",
    company: "Sample Co.",
    services: ["business-website", "seo"],
    budget: "25k-50k",
    timeline: "1-month",
    message: "We need a new business website with SEO setup.",
    raw: { demo: true },
    submittedAt: iso("2026-03-19"),
    demo: true,
  },
  {
    id: "l-demo-2",
    referenceId: "MVX-26-DEMO2",
    source: "contact",
    status: "new",
    name: "Another Prospect",
    email: "hello@another.demo",
    company: "Another Biz",
    service: "branding-packaging",
    budget: "10k-25k",
    timeline: "flexible",
    message: "Looking for a logo and packaging design refresh.",
    raw: { demo: true },
    submittedAt: iso("2026-03-21"),
    demo: true,
  },
];

/* ------------------------------------------------------------------ */
/* Assemble                                                            */
/* ------------------------------------------------------------------ */

export function buildSeed(): AdminDB {
  return {
    users,
    leads,
    // Blog + portfolio start from the site's existing content so the CMS
    // edits the same entries visitors already see.
    blog: insights,
    portfolio: projects,
    projects: projectsSeed,
    agreements,
    invoices,
    quotations,
    revenue,
    files,
    settings: [],
    session: null,
  };
}
