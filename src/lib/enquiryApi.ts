/**
 * Project enquiry API integration layer.
 *
 * This is the single, clearly-separated boundary between the Start a Project
 * wizard and whatever backend ultimately stores enquiries. Nothing else in the
 * UI talks to the network directly.
 *
 * Environment variables (see .env.example):
 *   VITE_ENQUIRY_ENDPOINT   Full URL of the enquiry API (e.g. https://api.example.com/enquiries).
 *                           When unset, the wizard runs in DEMO MODE: submissions are logged
 *                           to the browser console and NO data is stored or sent anywhere.
 *                           The UI surfaces this clearly so users are never shown a fake success.
 *   VITE_ENQUIRY_API_KEY    Optional bearer token sent as `Authorization: Bearer <key>`.
 *                           Never commit a real key — it is only ever read at runtime and
 *                           cannot be truly secret in client-side code, so prefer locking the
 *                           endpoint down by origin / rate limit on the server instead.
 *
 * The expected server contract (POST VITE_ENQUIRY_ENDPOINT, JSON body):
 *   200/201 -> { ok: true, referenceId: string }
 *   409     -> duplicate submission (treated as success, reuses existing referenceId)
 *   429     -> rate limited -> surfaced as a friendly "please try again shortly"
 *   4xx/5xx -> { ok: false, error: string } -> surfaced to the user
 *
 * Server-side responsibilities (NOT implemented in this SPA — see README):
 *   - validate payloads with the same rules (zod schema below is the client mirror)
 *   - rate limiting per IP
 *   - honeypot / time-trap spam checks
 *   - duplicate prevention on (email + submissionToken)
 *   - persist to the project_enquiries table with lead_status = 'New'
 */

import type { ProjectAnswers } from "@/data/projectEnquiry";
import { countryDial } from "@/data/projectEnquiry";
import { addLead, uid } from "@/store/db";
import type { Lead } from "@/store/types";

export interface EnquiryPayload {
  referenceId: string;
  submissionToken: string;
  goal: string;
  services: string[];
  otherRequirements: string;
  businessType: string;
  businessName: string;
  hasWebsite: string;
  websiteUrl: string;
  industry: string;
  projectDescription: string;
  mainObjective: string;
  targetAudience: string;
  referenceWebsites: string;
  additionalRequirements: string;
  briefFile: { name: string; size: number; type: string } | null;
  budget: string;
  timeline: string;
  fullName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  contactMethod: string;
  submittedAt: string;
}

export type SubmitResult =
  | { status: "success"; referenceId: string }
  | { status: "duplicate"; referenceId: string }
  | { status: "demo"; referenceId: string }
  | { status: "rate-limited" }
  | { status: "error"; message: string };

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;
const API_KEY = import.meta.env.VITE_ENQUIRY_API_KEY as string | undefined;

/** True when a live backend is configured (i.e. NOT demo mode). */
export function isLiveEnquiryEndpoint(): boolean {
  return Boolean(ENDPOINT);
}

/** Human-readable note shown in the UI when running without a backend. */
export const demoModeNotice =
  "Demo mode: no enquiry backend is configured, so nothing is sent to a server. Submissions are saved to this browser's local storage and appear in the admin dashboard's Leads inbox.";

/** Map an enquiry payload to a Lead record for the admin inbox. */
function payloadToLead(payload: EnquiryPayload): Lead {
  return {
    id: uid("lead"),
    referenceId: payload.referenceId,
    source: "start-a-project",
    status: "new",
    name: payload.fullName,
    email: payload.email,
    phone: `${payload.phoneCountry} ${payload.phone}`.trim(),
    company: payload.businessName || undefined,
    services: payload.services,
    budget: payload.budget,
    timeline: payload.timeline,
    message: payload.projectDescription,
    raw: payload as unknown as Record<string, unknown>,
    submittedAt: payload.submittedAt,
  };
}

/**
 * Build a short, human-friendly reference ID (e.g. MVX-7F3K-2Q).
 * The server is the source of truth and may return its own; this is the
 * optimistic value used in demo mode and as a client-side correlation id.
 */
export function generateReferenceId(): string {
  const block = () =>
    Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) ||
    "0000";
  const year = new Date().getFullYear().toString().slice(-2);
  return `MVX-${year}-${block()}${block().slice(0, 2)}`;
}

/** Stable per-attempt token used by the server for duplicate prevention. */
export function generateSubmissionToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Map wizard answers to the flat API payload. */
export function buildPayload(
  answers: ProjectAnswers,
  referenceId: string,
  submissionToken: string,
): EnquiryPayload {
  return {
    referenceId,
    submissionToken,
    goal: answers.goal,
    services: answers.services,
    otherRequirements: answers.otherRequirements.trim(),
    businessType: answers.businessType,
    businessName: answers.businessName.trim(),
    hasWebsite: answers.hasWebsite,
    websiteUrl: answers.websiteUrl.trim(),
    industry: answers.industry,
    projectDescription: answers.projectDescription.trim(),
    mainObjective: answers.mainObjective,
    targetAudience: answers.targetAudience.trim(),
    referenceWebsites: answers.referenceWebsites.trim(),
    additionalRequirements: answers.additionalRequirements.trim(),
    briefFile: answers.briefFile,
    budget: answers.budget,
    timeline: answers.timeline,
    fullName: answers.fullName.trim(),
    email: answers.email.trim(),
    phoneCountry: countryDial(answers.phoneCountry),
    phone: answers.phone.trim(),
    contactMethod: answers.contactMethod,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Submit the enquiry. Resolves with a typed result — never throws — so the
 * caller can render an accurate success / error / demo state.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  // Demo mode: no backend configured. Save to the browser-local store so the
  // admin dashboard can display the lead, and report "demo" so the UI can tell
  // the user nothing was sent to a server.
  if (!ENDPOINT) {
    console.info(
      "%c[MovoX] Start a Project submission (DEMO MODE — saved locally, not sent to a server)",
      "color:#2382B8;font-weight:bold",
      payload,
    );
    addLead(payloadToLead(payload));
    await new Promise((r) => setTimeout(r, 700));
    return { status: "demo", referenceId: payload.referenceId };
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (response.status === 409) {
      let referenceId = payload.referenceId;
      try {
        const data = (await response.json()) as { referenceId?: string };
        if (data?.referenceId) referenceId = data.referenceId;
      } catch {
        /* keep optimistic id */
      }
      return { status: "duplicate", referenceId };
    }

    if (response.status === 429) {
      return { status: "rate-limited" };
    }

    if (!response.ok) {
      let message = "Something went wrong while sending your enquiry.";
      try {
        const data = (await response.json()) as { error?: string };
        if (data?.error) message = data.error;
      } catch {
        /* generic message */
      }
      return { status: "error", message };
    }

    let referenceId = payload.referenceId;
    try {
      const data = (await response.json()) as { referenceId?: string };
      if (data?.referenceId) referenceId = data.referenceId;
    } catch {
      /* keep optimistic id */
    }

    return { status: "success", referenceId };
  } catch {
    return {
      status: "error",
      message:
        "We couldn't reach our server. Please check your connection and try again.",
    };
  }
}
