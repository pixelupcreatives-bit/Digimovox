import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileUp,
  HelpCircle,
  Lightbulb,
  Send,
  Sparkles,
  AlertTriangle,
  X,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { OptionCard } from "@/components/project/OptionCard";
import { WizardProgress } from "@/components/project/WizardProgress";
import { cn } from "@/lib/utils";
import {
  businessTypes,
  websiteStatusOptions,
  industries,
  budgetOptions,
  timelineOptions,
  contactMethodOptions,
  countries,
  goalOptions,
  mainObjectives,
  serviceCategories,
  recommendations,
  suggestionPrompts,
  stepLabels,
  emptyAnswers,
  serviceLabel,
  budgetLabel,
  timelineLabel,
  businessTypeLabel,
  websiteStatusLabel,
  mainObjectiveLabel,
  contactMethodLabel,
  countryDial,
  type ProjectAnswers,
} from "@/data/projectEnquiry";
import {
  buildPayload,
  generateReferenceId,
  generateSubmissionToken,
  submitEnquiry,
} from "@/lib/enquiryApi";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "movox:start-a-project:v1";
const ALL_SERVICE_IDS = serviceCategories.flatMap((c) => c.options.map((o) => o.id));
const MIN_SUBMIT_MS = 2500; // soft time-trap: real humans cannot finish 7 steps this fast

/** Map `?service=` slugs from other pages onto wizard service ids. */
const SERVICE_SLUG_MAP: Record<string, string[]> = {
  "graphic-design": ["graphic-design"],
  "branding-packaging": ["brand-identity", "logo-design"],
  "website-development": ["business-website"],
  "app-development": ["crossplatform-app"],
  "digital-marketing": ["seo", "social-media-marketing"],
  multiple: ["business-website", "seo"],
  other: ["something-else"],
};

const MAX_BRIEF_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_BRIEF_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
  "image/png",
  "image/jpeg",
];

type Errors = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns errors for a single step. Empty object = valid. */
function validateStep(index: number, a: ProjectAnswers): Errors {
  const e: Errors = {};

  switch (index) {
    case 0: // Goal
      if (!a.goal) e.goal = "Please choose what you'd like to achieve.";
      break;

    case 1: // Services
      if (a.services.length === 0)
        e.services = "Please select at least one service.";
      if (a.services.includes("something-else") && a.otherRequirements.trim().length < 3)
        e.otherRequirements = "Please tell us briefly what you need.";
      break;

    case 2: // Business
      if (!a.businessType) e.businessType = "Please select your business type.";
      if (a.businessName.trim().length < 2)
        e.businessName = "Please enter your business or brand name.";
      if (!a.hasWebsite) e.hasWebsite = "Please tell us about your website.";
      if (
        (a.hasWebsite === "live" || a.hasWebsite === "progress") &&
        a.websiteUrl.trim().length < 4
      )
        e.websiteUrl = "Please enter your website URL.";
      if (!a.industry) e.industry = "Please select your industry.";
      break;

    case 3: // Requirements
      if (a.projectDescription.trim().length < 20)
        e.projectDescription =
          "Please describe your project in at least a couple of sentences.";
      if (!a.mainObjective) e.mainObjective = "Please choose your main objective.";
      if (targetAudienceRelevant(a) && a.targetAudience.trim().length < 3)
        e.targetAudience = "Please describe your target audience.";
      break;

    case 4: // Budget & timeline
      if (!a.budget) e.budget = "Please select an indicative budget range.";
      if (!a.timeline) e.timeline = "Please select a timeline.";
      break;

    case 5: // Contact
      if (a.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
      if (!EMAIL_RE.test(a.email.trim()))
        e.email = "Please enter a valid business email.";
      if (a.phone.replace(/\D/g, "").length < 6)
        e.phone = "Please enter a valid phone number.";
      if (!a.contactMethod)
        e.contactMethod = "Please choose how you'd like us to contact you.";
      break;

    case 6: // Review
      if (!a.privacy) e.privacy = "Please consent so we can respond to your enquiry.";
      break;
  }

  return e;
}

/** Target audience is only asked when it is genuinely relevant. */
function targetAudienceRelevant(a: ProjectAnswers): boolean {
  if (a.goal === "grow-business" || a.goal === "build-products") return true;
  return a.services.some((s) =>
    ["seo", "social-media-marketing", "paid-advertising", "content-marketing", "business-website", "ecommerce-website"].includes(s),
  );
}

/** First step with outstanding validation — used when restoring progress. */
function firstIncompleteStep(a: ProjectAnswers): number {
  for (let i = 0; i < 6; i++) {
    if (Object.keys(validateStep(i, a)).length > 0) return i;
  }
  return 6;
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

const NON_PERSISTED: (keyof ProjectAnswers)[] = [
  "fullName",
  "email",
  "phone",
  "honeypot",
  "privacy",
  "briefFile",
];

function loadStoredAnswers(): ProjectAnswers | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProjectAnswers>;
    const base = emptyAnswers();
    const merged: ProjectAnswers = { ...base };

    (Object.keys(base) as (keyof ProjectAnswers)[]).forEach((key) => {
      if (NON_PERSISTED.includes(key)) return;
      const value = parsed[key];
      if (key === "services" && Array.isArray(value)) {
        merged.services = value.filter((s): s is string => typeof s === "string");
      } else if (typeof value === "string" && value !== "") {
        (merged[key] as string) = value;
      }
    });

    const hasProgress =
      merged.goal ||
      merged.services.length > 0 ||
      merged.businessName ||
      merged.projectDescription ||
      merged.budget;
    return hasProgress ? merged : null;
  } catch {
    return null;
  }
}

function persistAnswers(a: ProjectAnswers) {
  try {
    const slim = { ...a } as Partial<ProjectAnswers>;
    NON_PERSISTED.forEach((k) => delete slim[k]);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    /* storage may be unavailable — progress simply won't persist */
  }
}

function clearStoredAnswers() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Stage = "intro" | "form" | "result";
type Outcome = "success" | "unconfigured";

export function StartProject() {
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();

  const mountedAt = useRef<number>(Date.now());
  const submittingRef = useRef(false);

  const [answers, setAnswers] = useState<ProjectAnswers>(() => {
    const stored = loadStoredAnswers();
    const fresh = stored ?? emptyAnswers();

    // URL prefill (?service= & ?package=)
    const service = searchParams.get("service");
    if (service && !stored) {
      const mapped = SERVICE_SLUG_MAP[service] ?? [];
      const exact = ALL_SERVICE_IDS.includes(service) ? [service] : [];
      const ids = [...new Set([...mapped, ...exact])];
      if (ids.length > 0) fresh.services = ids;
    }
    const pkg = searchParams.get("package");
    if (pkg && !stored) {
      fresh.additionalRequirements = `Interested in package: ${pkg}`;
    }
    return fresh;
  });

  const restored = useRef(loadStoredAnswers() !== null).current;

  const [stage, setStage] = useState<Stage>(() =>
    restored ? "form" : "intro",
  );
  const [step, setStep] = useState<number>(() => {
    const stored = loadStoredAnswers();
    return stored ? firstIncompleteStep(stored) : 0;
  });
  const [maxReached, setMaxReached] = useState<number>(() => {
    const stored = loadStoredAnswers();
    return stored ? firstIncompleteStep(stored) : 0;
  });

  const [errors, setErrors] = useState<Errors>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [referenceId, setReferenceId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [helpOpen, setHelpOpen] = useState(false);

  /* Persist non-sensitive progress across refreshes. */
  useEffect(() => {
    if (stage === "form") persistAnswers(answers);
  }, [answers, stage]);

  /* Focus the step heading when it changes (accessibility). */
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (stage === "form") headingRef.current?.focus();
  }, [step, stage]);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  /* -------------------- derived -------------------- */

  const showTargetAudience = useMemo(
    () => targetAudienceRelevant(answers),
    [answers],
  );
  const showWebsiteUrl =
    answers.hasWebsite === "live" || answers.hasWebsite === "progress";
  const showOtherRequirements = answers.services.includes("something-else");
  const suggestions = answers.goal ? recommendations[answers.goal] ?? [] : [];

  /* -------------------- actions -------------------- */

  function setAnswer<K extends keyof ProjectAnswers>(key: K, value: ProjectAnswers[K]) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function toggleService(id: string) {
    setAnswers((prev) => {
      const has = prev.services.includes(id);
      const services = has
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id];
      return { ...prev, services };
    });
    setErrors((prev) => {
      if (!prev.services) return prev;
      const next = { ...prev };
      delete next.services;
      return next;
    });
  }

  function applySuggestion() {
    if (suggestions.length === 0) return;
    setAnswers((prev) => {
      const merged = [...new Set([...prev.services, ...suggestions])];
      return { ...prev, services: merged };
    });
    setHelpOpen(false);
  }

  function goTo(target: number) {
    const clamped = Math.max(0, Math.min(target, stepLabels.length - 1));
    setDirection(clamped > step ? 1 : -1);
    setErrors({});
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
  }

  function handleNext() {
    const found = validateStep(step, answersRef.current);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    setDirection(1);
    const next = step + 1;
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleBack() {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function startWizard() {
    setStage("form");
    setStep(0);
    setMaxReached(0);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      setAnswer("briefFile", null);
      return;
    }
    if (file.size > MAX_BRIEF_BYTES) {
      setErrors((p) => ({
        ...p,
        briefFile: "File is too large. Maximum size is 10 MB.",
      }));
      return;
    }
    const typeOk =
      ALLOWED_BRIEF_TYPES.includes(file.type) ||
      /\.(pdf|docx?|txt|zip|png|jpe?g)$/i.test(file.name);
    if (!typeOk) {
      setErrors((p) => ({
        ...p,
        briefFile: "Unsupported file type. Use PDF, DOC/DOCX, TXT, ZIP, PNG or JPG.",
      }));
      return;
    }
    const cleanErrors = { ...errors };
    delete cleanErrors.briefFile;
    setErrors(cleanErrors);
    setAnswer("briefFile", { name: file.name, size: file.size, type: file.type });
  }

  async function handleSubmit() {
    const found = validateStep(6, answersRef.current);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if (submittingRef.current) return; // prevent duplicate submissions

    const current = answersRef.current;

    // Honeypot — a real user never sees this field.
    if (current.honeypot) {
      setSubmitError("Your submission couldn't be processed. Please try again.");
      return;
    }
    // Soft time-trap against instant bot submissions.
    if (Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      setSubmitError("Please take a moment to review your answers, then submit again.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    setOutcome(null);

    try {
      const ref = generateReferenceId();
      const payload = buildPayload(current, ref, generateSubmissionToken());
      const res = await submitEnquiry(payload);

      if (res.status === "success" || res.status === "duplicate") {
        setReferenceId(res.referenceId);
        setOutcome("success");
        clearStoredAnswers();
        setStage("result");
      } else if (res.status === "demo") {
        setOutcome("unconfigured");
        setStage("result");
      } else if (res.status === "rate-limited") {
        setSubmitError(
          "You've submitted very recently. Please wait a moment and try again.",
        );
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function goToStepFromReview(index: number) {
    setOutcome(null);
    setSubmitError(null);
    setStage("form");
    goTo(index);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* -------------------- result -------------------- */

  if (stage === "result" && outcome) {
    return (
      <>
        <SEO
          title={outcome === "success" ? "Thank You | MovoX" : "Start a Project | MovoX"}
          description="Your project enquiry for MovoX."
          path="/start-a-project"
        />
        <ResultScreen
          outcome={outcome}
          referenceId={referenceId}
          onRetry={() => {
            setOutcome(null);
            setSubmitError(null);
            setStage("form");
            setStep(6);
          }}
        />
      </>
    );
  }

  /* -------------------- main -------------------- */

  return (
    <>
      <SEO
        title="Start a Project | MovoX"
        description="Tell MovoX about your next project. Select your goal, services, budget and timeline in a guided 2–3 minute onboarding experience."
        path="/start-a-project"
        image="/og-image.jpg"
      />

      {/* ================= Dark hero ================= */}
      <section className="relative overflow-hidden bg-navy pt-10 pb-16 md:pb-20">
        <div className="hero-grid" aria-hidden="true">
          <div
            className="hero-grid-lines"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            }}
          />
          <div
            className="hero-grid-accent"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(35,130,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,130,184,0.2) 1px, transparent 1px)",
            }}
          />
        </div>
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Start a Project", href: "/start-a-project" },
                ]}
              />
            </div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Start a Project
              </span>
            </motion.div>

            <motion.h1
              className="text-white mb-6 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Your Next Big Idea{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Starts Here.
              </span>
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              Every great project starts with an idea. Tell us yours, and we'll
              help you turn it into something extraordinary.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ================= Content ================= */}
      <section className="py-14 md:py-16 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* ---------- Intro ---------- */}
            {stage === "intro" && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-semibold mb-6">
                  <Clock className="w-4 h-4" />
                  Takes about 2–3 minutes
                </div>

                <p className="text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
                  A short, guided conversation — one question at a time. You'll
                  share your goal, services, budget and timeline, then review
                  everything before it reaches our team.
                </p>

                <button
                  type="button"
                  onClick={startWizard}
                  className="btn-gradient inline-flex items-center gap-2.5 px-10 py-4 rounded-button text-white font-semibold text-base"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </button>

                <ul className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
                  {[
                    "One question per screen",
                    "Review before you send",
                    "Your progress is saved",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 p-4 rounded-card-lg bg-bg-soft border border-border-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{t}</span>
                    </li>
                  ))}
                </ul>

                {restored && (
                  <p className="mt-6 text-sm text-text-muted">
                    We found your saved progress and picked up where you left off.
                  </p>
                )}
              </motion.div>
            )}

            {/* ---------- Form ---------- */}
            {stage === "form" && (
              <div>
                <WizardProgress
                  steps={stepLabels}
                  current={step}
                  maxReached={maxReached}
                  onJump={goTo}
                />

                <div className="mt-8 rounded-card-lg border border-border-default bg-white shadow-card p-6 md:p-8">
                  {/* Keyed remount + CSS animation. Content is visible immediately
                      even if the animation never runs (unlike an exit-gated
                      AnimatePresence, which can deadlock on throttled tabs). */}
                  <div
                    key={step}
                    className={reduceMotion ? undefined : direction === 1 ? "step-enter" : "step-enter-back"}
                  >
                      <StepContent
                        step={step}
                        answers={answers}
                        errors={errors}
                        showTargetAudience={showTargetAudience}
                        showWebsiteUrl={showWebsiteUrl}
                        showOtherRequirements={showOtherRequirements}
                        headingRef={headingRef}
                        setAnswer={setAnswer}
                        toggleService={toggleService}
                        helpOpen={helpOpen}
                        setHelpOpen={setHelpOpen}
                        suggestions={suggestions}
                        applySuggestion={applySuggestion}
                        handleFileChange={handleFileChange}
                        submitError={submitError}
                        isSubmitting={isSubmitting}
                        onBack={handleBack}
                        onNext={handleNext}
                        onSubmit={handleSubmit}
                        goToStepFromReview={goToStepFromReview}
                        setErrors={setErrors}
                      />
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-text-muted">
                  Prefer to talk first?{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Contact us
                  </Link>{" "}
                  instead — or read our{" "}
                  <Link to="/policies/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Step content                                                        */
/* ------------------------------------------------------------------ */

interface StepProps {
  step: number;
  answers: ProjectAnswers;
  errors: Errors;
  showTargetAudience: boolean;
  showWebsiteUrl: boolean;
  showOtherRequirements: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  setAnswer: <K extends keyof ProjectAnswers>(
    key: K,
    value: ProjectAnswers[K],
  ) => void;
  toggleService: (id: string) => void;
  helpOpen: boolean;
  setHelpOpen: (v: boolean) => void;
  suggestions: string[];
  applySuggestion: () => void;
  handleFileChange: (file: File | null) => void;
  submitError: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  goToStepFromReview: (index: number) => void;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

function StepContent(p: StepProps) {
  const a = p.answers;

  const titles: string[] = [
    "What would you like to achieve?",
    "Which services do you need?",
    "Tell us about your business",
    "Describe your project",
    "Budget and timeline",
    "How can we reach you?",
    "Review your project",
  ];

  const subtitles: string[] = [
    "Pick the option that best matches your goal — you can choose services next.",
    "Select everything that applies. Pick as many as you like.",
    "A little context helps us route your enquiry to the right team.",
    "Share as much detail as you're comfortable with. You can use the prompts as a starting point.",
    "These are indicative ranges only — not a fixed quotation.",
    "We'll only use these details to respond to your enquiry.",
    "Check everything below. You can edit any answer without losing the rest.",
  ];

  return (
    <div>
      {/* Heading */}
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-2">
          Step {p.step + 1} of {stepLabels.length}
        </p>
        <h2
          ref={p.headingRef}
          tabIndex={-1}
          className="text-2xl md:text-3xl font-bold text-text-primary leading-snug outline-none"
        >
          {titles[p.step]}
        </h2>
        <p className="text-sm text-text-muted mt-2">{subtitles[p.step]}</p>
      </div>

      {/* Error summary (role=alert for screen readers) */}
      {Object.keys(p.errors).length > 0 && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-button border border-error bg-error-bg px-4 py-3 text-sm text-error"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Please review the highlighted {Object.keys(p.errors).length === 1 ? "field" : "fields"} to continue.
          </span>
        </div>
      )}

      {/* ---------------- Step 1: Goal ---------------- */}
      {p.step === 0 && (
        <div role="radiogroup" aria-label="Project goal" className="grid sm:grid-cols-2 gap-4">
          {goalOptions.map((o) => (
            <OptionCard
              key={o.id}
              label={o.label}
              description={o.description}
              icon={o.icon}
              selected={a.goal === o.id}
              onSelect={() => p.setAnswer("goal", o.id)}
            />
          ))}
        </div>
      )}

      {/* ---------------- Step 2: Services ---------------- */}
      {p.step === 1 && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <p className="text-sm font-semibold text-text-primary">
              {a.services.length > 0 ? (
                <>
                  {a.services.length} service
                  {a.services.length > 1 ? "s" : ""} selected
                </>
              ) : (
                "No services selected yet"
              )}
            </p>
            <button
              type="button"
              onClick={() => p.setHelpOpen(!p.helpOpen)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <HelpCircle className="w-4 h-4" />
              Help Me Choose
            </button>
          </div>

          <AnimatePresence initial={false}>
            {p.helpOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-6 rounded-card-lg border border-primary/30 bg-primary-light p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary mb-1">
                        Not sure what to pick?
                      </p>
                      {a.goal ? (
                        <>
                          <p className="text-sm text-text-secondary mb-3">
                            Based on your goal of{" "}
                            <span className="font-semibold text-text-primary">
                              {goalOptions.find((g) => g.id === a.goal)?.label}
                            </span>
                            , these services are a common fit:
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {p.suggestions.map((id) => (
                              <span
                                key={id}
                                className="px-2.5 py-1 rounded-full bg-white border border-primary/30 text-xs font-medium text-text-primary"
                              >
                                {serviceLabel(id)}
                              </span>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={p.applySuggestion}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            Add these to my selection
                          </button>
                        </>
                      ) : (
                        <p className="text-sm text-text-secondary">
                          Choose your goal on the first step and we'll suggest a
                          starting set — or simply pick anything that applies.
                          You can select multiple services.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            {serviceCategories.map((cat) => (
              <fieldset key={cat.id}>
                <legend className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-button bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                    {serviceCategories.indexOf(cat) + 1}
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {cat.label}
                  </span>
                  <span className="text-xs text-text-muted hidden sm:inline">
                    {cat.description}
                  </span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {cat.options.map((o) => {
                    const active = a.services.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role="checkbox"
                        aria-checked={active}
                        onClick={() => p.toggleService(o.id)}
                        className={cn(
                          "px-3.5 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-border-default bg-white text-text-secondary hover:border-primary/50 hover:text-primary",
                        )}
                      >
                        {active && (
                          <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                        )}
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

          {p.showOtherRequirements && (
            <div className="mt-6">
              <Textarea
                label="Other requirements"
                id="otherRequirements"
                placeholder="Tell us briefly what else you need…"
                rows={3}
                value={a.otherRequirements}
                onChange={(e) => p.setAnswer("otherRequirements", e.target.value)}
                error={p.errors.otherRequirements}
                helperText="Required because you selected “Something Else”."
              />
            </div>
          )}
        </div>
      )}

      {/* ---------------- Step 3: Business ---------------- */}
      {p.step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="block text-sm font-medium text-text-primary mb-3">
              Business type <span className="text-error">*</span>
            </p>
            <div role="radiogroup" aria-label="Business type" className="grid sm:grid-cols-3 gap-3">
              {businessTypes.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  icon={o.icon}
                  selected={a.businessType === o.id}
                  onSelect={() => p.setAnswer("businessType", o.id)}
                />
              ))}
            </div>
            {p.errors.businessType && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.businessType}
              </p>
            )}
          </div>

          <Input
            label="Business or brand name"
            id="businessName"
            placeholder="e.g. Acme Retail"
            required
            value={a.businessName}
            onChange={(e) => p.setAnswer("businessName", e.target.value)}
            error={p.errors.businessName}
          />

          <div>
            <p className="block text-sm font-medium text-text-primary mb-3">
              Do you have a website? <span className="text-error">*</span>
            </p>
            <div role="radiogroup" aria-label="Existing website status" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {websiteStatusOptions.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  icon={o.icon}
                  selected={a.hasWebsite === o.id}
                  onSelect={() => p.setAnswer("hasWebsite", o.id)}
                />
              ))}
            </div>
            {p.errors.hasWebsite && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.hasWebsite}
              </p>
            )}
          </div>

          {p.showWebsiteUrl && (
            <Input
              label="Website URL"
              id="websiteUrl"
              type="url"
              placeholder="https://example.com"
              value={a.websiteUrl}
              onChange={(e) => p.setAnswer("websiteUrl", e.target.value)}
              error={p.errors.websiteUrl}
              helperText="So we can look at what you already have."
            />
          )}

          <Select
            label="Industry"
            id="industry"
            options={industries.map((i) => ({ value: i, label: i }))}
            placeholder="Select your industry"
            required
            value={a.industry}
            onChange={(e) => p.setAnswer("industry", e.target.value)}
            error={p.errors.industry}
          />
        </div>
      )}

      {/* ---------------- Step 4: Requirements ---------------- */}
      {p.step === 3 && (
        <div className="space-y-6">
          <div>
            <Textarea
              label="Project description"
              id="projectDescription"
              placeholder="What are you looking to build or achieve? What does success look like?"
              rows={6}
              value={a.projectDescription}
              onChange={(e) => p.setAnswer("projectDescription", e.target.value)}
              error={p.errors.projectDescription}
              helperText="A few sentences is plenty to get started."
            />

            <div className="mt-3">
              <p className="text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-primary" />
                Tap a prompt to add it — then edit it in your own words
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      p.setAnswer(
                        "projectDescription",
                        a.projectDescription
                          ? `${a.projectDescription.trimEnd()}\n${s} `
                          : `${s} `,
                      )
                    }
                    className="px-3 py-1.5 rounded-full border border-dashed border-border-strong text-xs text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-subtle transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-text-primary mb-3">
              Main objective <span className="text-error">*</span>
            </p>
            <div role="radiogroup" aria-label="Main objective" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mainObjectives.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  icon={o.icon}
                  selected={a.mainObjective === o.id}
                  onSelect={() => p.setAnswer("mainObjective", o.id)}
                />
              ))}
            </div>
            {p.errors.mainObjective && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.mainObjective}
              </p>
            )}
          </div>

          {p.showTargetAudience && (
            <Textarea
              label="Target audience"
              id="targetAudience"
              placeholder="Who are you trying to reach? (age, location, role, interests…)"
              rows={3}
              value={a.targetAudience}
              onChange={(e) => p.setAnswer("targetAudience", e.target.value)}
              error={p.errors.targetAudience}
              helperText="Relevant to the services and goal you selected."
            />
          )}

          <Input
            label="Reference websites (optional)"
            id="referenceWebsites"
            placeholder="https://example.com, https://another.com"
            value={a.referenceWebsites}
            onChange={(e) => p.setAnswer("referenceWebsites", e.target.value)}
            helperText="Sites whose style or approach you like."
          />

          <Textarea
            label="Additional requirements (optional)"
            id="additionalRequirements"
            placeholder="Anything else — integrations, compliance, deadlines, must-haves…"
            rows={3}
            value={a.additionalRequirements}
            onChange={(e) => p.setAnswer("additionalRequirements", e.target.value)}
          />

          {/* Brief upload */}
          <div>
            <p className="block text-sm font-medium text-text-primary mb-1.5">
              Project brief (optional)
            </p>
            <label
              htmlFor="briefFile"
              className={cn(
                "flex items-center gap-3 rounded-button border border-dashed px-4 py-4 cursor-pointer transition-colors",
                p.errors.briefFile
                  ? "border-error bg-error-bg"
                  : "border-border-strong hover:border-primary hover:bg-primary-subtle",
              )}
            >
              <FileUp className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="min-w-0">
                {a.briefFile ? (
                  <span className="flex items-center gap-2 text-sm text-text-primary">
                    <span className="truncate">{a.briefFile.name}</span>
                    <span className="text-xs text-text-muted">
                      ({(a.briefFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      aria-label="Remove file"
                      onClick={(e) => {
                        e.preventDefault();
                        p.handleFileChange(null);
                      }}
                      className="text-text-muted hover:text-error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ) : (
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{" "}
                    a PDF, DOC/DOCX, TXT, ZIP, PNG or JPG (max 10 MB)
                  </span>
                )}
              </span>
              <input
                id="briefFile"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                onChange={(e) => p.handleFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
            {p.errors.briefFile && (
              <p role="alert" className="mt-1.5 text-sm text-error">
                {p.errors.briefFile}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Step 5: Budget & timeline ---------------- */}
      {p.step === 4 && (
        <div className="space-y-7">
          <div>
            <p className="block text-sm font-medium text-text-primary mb-1">
              Budget range <span className="text-error">*</span>
            </p>
            <p className="text-xs text-text-muted mb-3 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
              These are indicative lead-qualification ranges to help us understand
              scope — they are not fixed quotations.
            </p>
            <div role="radiogroup" aria-label="Budget range" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {budgetOptions.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  icon={o.icon}
                  selected={a.budget === o.id}
                  onSelect={() => p.setAnswer("budget", o.id)}
                />
              ))}
            </div>
            {p.errors.budget && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.budget}
              </p>
            )}
          </div>

          <div>
            <p className="block text-sm font-medium text-text-primary mb-3">
              Timeline <span className="text-error">*</span>
            </p>
            <div role="radiogroup" aria-label="Timeline" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {timelineOptions.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  icon={o.icon}
                  selected={a.timeline === o.id}
                  onSelect={() => p.setAnswer("timeline", o.id)}
                />
              ))}
            </div>
            {p.errors.timeline && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.timeline}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Step 6: Contact ---------------- */}
      {p.step === 5 && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Full name"
              id="fullName"
              placeholder="e.g. Ravi Sharma"
              autoComplete="name"
              required
              value={a.fullName}
              onChange={(e) => p.setAnswer("fullName", e.target.value)}
              error={p.errors.fullName}
            />
            <Input
              label="Business email"
              id="email"
              type="email"
              placeholder="e.g. ravi@company.com"
              autoComplete="email"
              required
              value={a.email}
              onChange={(e) => p.setAnswer("email", e.target.value)}
              error={p.errors.email}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Phone number <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              <Select
                id="phoneCountry"
                aria-label="Country code"
                className="w-40 flex-shrink-0"
                options={countries.map((c) => ({ value: c.id, label: c.label }))}
                value={a.phoneCountry}
                onChange={(e) => p.setAnswer("phoneCountry", e.target.value)}
              />
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                className="flex-1"
                value={a.phone}
                onChange={(e) => p.setAnswer("phone", e.target.value)}
                error={p.errors.phone}
                aria-describedby={p.errors.phone ? "phone-error" : undefined}
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-text-primary mb-3">
              Preferred contact method <span className="text-error">*</span>
            </p>
            <div role="radiogroup" aria-label="Preferred contact method" className="grid sm:grid-cols-2 gap-3">
              {contactMethodOptions.map((o) => (
                <OptionCard
                  key={o.id}
                  label={o.label}
                  description={o.description}
                  icon={o.icon}
                  selected={a.contactMethod === o.id}
                  onSelect={() => p.setAnswer("contactMethod", o.id)}
                />
              ))}
            </div>
            {p.errors.contactMethod && (
              <p role="alert" className="mt-2 text-sm text-error">
                {p.errors.contactMethod}
              </p>
            )}
          </div>

          {/* Honeypot — hidden from real users, tempting for bots */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={a.honeypot}
              onChange={(e) => p.setAnswer("honeypot", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ---------------- Step 7: Review ---------------- */}
      {p.step === 6 && (
        <ReviewStep
          answers={a}
          errors={p.errors}
          onEdit={p.goToStepFromReview}
          onConsentChange={(checked) => p.setAnswer("privacy", checked)}
        />
      )}

      {/* ---------------- Nav ---------------- */}
      <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={p.step === 0 ? undefined : p.onBack}
          disabled={p.step === 0}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-button text-sm font-semibold border transition-colors",
            p.step === 0
              ? "border-border-default text-text-muted opacity-40 cursor-not-allowed"
              : "border-border-default text-text-secondary hover:border-primary hover:text-primary",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {p.step < stepLabels.length - 1 ? (
          <button
            type="button"
            onClick={p.onNext}
            className="btn-gradient inline-flex items-center gap-2 px-7 py-3 rounded-button text-sm font-semibold text-white"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={p.onSubmit}
            disabled={p.isSubmitting}
            className="btn-gradient inline-flex items-center gap-2 px-7 py-3 rounded-button text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {p.isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Submit Project Enquiry
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {p.step === stepLabels.length - 1 && p.submitError && (
        <div
          role="alert"
          className="mt-4 rounded-button border border-error bg-error-bg px-4 py-3 text-sm text-error"
        >
          {p.submitError}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Review                                                              */
/* ------------------------------------------------------------------ */

function ReviewStep({
  answers,
  errors,
  onEdit,
  onConsentChange,
}: {
  answers: ProjectAnswers;
  errors: Errors;
  onEdit: (step: number) => void;
  onConsentChange: (checked: boolean) => void;
}) {
  const groups: { step: number; title: string; rows: { label: string; value: string }[] }[] = [
    {
      step: 0,
      title: "Goal",
      rows: [
        {
          label: "Objective",
          value: goalOptions.find((g) => g.id === answers.goal)?.label ?? "—",
        },
      ],
    },
    {
      step: 1,
      title: "Services",
      rows: [
        {
          label: "Selected",
          value: answers.services.length
            ? answers.services.map(serviceLabel).join(", ")
            : "—",
        },
        ...(answers.otherRequirements.trim()
          ? [{ label: "Other requirements", value: answers.otherRequirements.trim() }]
          : []),
      ],
    },
    {
      step: 2,
      title: "Business",
      rows: [
        { label: "Type", value: businessTypeLabel(answers.businessType) },
        { label: "Name", value: answers.businessName || "—" },
        { label: "Website", value: websiteStatusLabel(answers.hasWebsite) },
        ...(answers.websiteUrl.trim()
          ? [{ label: "URL", value: answers.websiteUrl.trim() }]
          : []),
        { label: "Industry", value: answers.industry || "—" },
      ],
    },
    {
      step: 3,
      title: "Requirements",
      rows: [
        { label: "Description", value: answers.projectDescription || "—" },
        { label: "Main objective", value: mainObjectiveLabel(answers.mainObjective) },
        ...(answers.targetAudience.trim()
          ? [{ label: "Target audience", value: answers.targetAudience.trim() }]
          : []),
        ...(answers.referenceWebsites.trim()
          ? [{ label: "References", value: answers.referenceWebsites.trim() }]
          : []),
        ...(answers.additionalRequirements.trim()
          ? [{ label: "Additional", value: answers.additionalRequirements.trim() }]
          : []),
        ...(answers.briefFile
          ? [{ label: "Brief file", value: `${answers.briefFile.name} (${(answers.briefFile.size / 1024 / 1024).toFixed(2)} MB)` }]
          : []),
      ],
    },
    {
      step: 4,
      title: "Budget & Timeline",
      rows: [
        { label: "Budget (indicative)", value: budgetLabel(answers.budget) },
        { label: "Timeline", value: timelineLabel(answers.timeline) },
      ],
    },
    {
      step: 5,
      title: "Contact",
      rows: [
        { label: "Name", value: answers.fullName || "—" },
        { label: "Email", value: answers.email || "—" },
        {
          label: "Phone",
          value: answers.phone
            ? `${countryDial(answers.phoneCountry)} ${answers.phone}`
            : "—",
        },
        { label: "Preferred contact", value: contactMethodLabel(answers.contactMethod) },
      ],
    },
  ];

  return (
    <div>
      <div className="space-y-5">
        {groups.map((g) => (
          <div
            key={g.title}
            className="rounded-card-lg border border-border-default bg-bg-soft p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-primary">{g.title}</h3>
              <button
                type="button"
                onClick={() => onEdit(g.step)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <dl className="space-y-2.5">
              {g.rows.map((r) => (
                <div
                  key={r.label}
                  className="grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-3"
                >
                  <dt className="text-xs font-medium text-text-muted">{r.label}</dt>
                  <dd className="text-sm text-text-secondary break-words whitespace-pre-line">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Consent */}
      <div className="mt-6 rounded-card-lg border border-border-default bg-white p-5">
        <div className="flex items-start gap-3">
          <input
            id="privacy"
            type="checkbox"
            checked={answers.privacy}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-border-default text-primary focus:ring-primary"
          />
          <label htmlFor="privacy" className="text-sm text-text-secondary leading-relaxed">
            I consent to MovoX storing my enquiry details in order to respond to
            my request, as described in the{" "}
            <Link to="/policies/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.privacy && (
          <p role="alert" className="mt-2 ml-7 text-sm text-error">
            {errors.privacy}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-text-muted leading-relaxed">
        Submitting sends your answers to the MovoX team for review. Nothing is
        shared with third parties beyond what's needed to respond to you.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result                                                              */
/* ------------------------------------------------------------------ */

function ResultScreen({
  outcome,
  referenceId,
  onRetry,
}: {
  outcome: Outcome;
  referenceId: string;
  onRetry: () => void;
}) {
  const success = outcome === "success";

  return (
    <section className="relative overflow-hidden bg-navy pt-16 pb-24 md:pb-32 min-h-[60vh] flex items-center">
      <div className="hero-grid" aria-hidden="true">
        <div
          className="hero-grid-lines"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          }}
        />
      </div>
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative w-full">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-7",
              success
                ? "bg-primary/20 border-primary/30"
                : "bg-warning-bg border-warning/30",
            )}
          >
            {success ? (
              <CheckCircle2 className="w-8 h-8 text-white" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-warning" />
            )}
          </div>

          {success ? (
            <>
              <h1 className="text-white mb-4 leading-tight">
                Your Next Big Idea Starts Here.
              </h1>
              <p className="text-blue-100/80 text-lg leading-relaxed mb-7">
                Thank you — your project enquiry has reached the MovoX team. We'll
                review the requirements you submitted and get in touch using your
                preferred contact method.
              </p>

              <div className="mb-8 inline-flex flex-col items-center gap-1.5 px-6 py-4 rounded-card-lg bg-white/10 border border-white/15 backdrop-blur-sm">
                <span className="text-xs uppercase tracking-widest text-white/60">
                  Enquiry Reference
                </span>
                <span className="text-lg font-bold text-white tracking-wide select-all">
                  {referenceId}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Back to Main Website
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-button border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-white mb-4 leading-tight">
                Your enquiry has been saved locally.
              </h1>
              <p className="text-blue-100/80 text-lg leading-relaxed mb-5">
                This site isn't connected to a live enquiry backend, so nothing
                was sent to a server. Your enquiry was saved in this browser and
                will appear in the MovoX admin dashboard's Leads inbox.
              </p>
              <p className="text-sm text-white/60 mb-7 leading-relaxed">
                To send enquiries to a real server, set{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                  VITE_ENQUIRY_ENDPOINT
                </code>{" "}
                in the environment — see the project README for setup steps.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-button btn-gradient text-white font-semibold"
                >
                  Back to Review
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-button border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Back to Main Website
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
