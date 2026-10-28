import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Star,
  ExternalLink,
  Send,
  CheckCircle2,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { siteConfig } from "@/data/siteConfig";
import { addLead, uid } from "@/store/db";
import { generateReferenceId } from "@/lib/enquiryApi";

const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid business email."),
  phone: z.string().min(5, "Please enter a valid phone number."),
  company: z.string().min(1, "Please enter your company or brand name."),
  service: z.string().min(1, "Please select a service."),
  package: z.string().optional(),
  budget: z.string().min(1, "Please select a budget range."),
  timeline: z.string().min(1, "Please select a timeline."),
  details: z.string().min(10, "Please provide more details about your project."),
  privacy: z.boolean().refine((val) => val === true, {
    message: "You must consent to our privacy policy.",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const serviceOptions = [
  { value: "graphic-design", label: "Graphic Design" },
  { value: "branding-packaging", label: "Branding & Packaging" },
  { value: "website-development", label: "Website Development" },
  { value: "app-development", label: "App Development" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "multiple", label: "Multiple Services" },
  { value: "other", label: "Other" },
];

const budgetOptions = [
  { value: "under-10k", label: "Under ₹10,000" },
  { value: "10k-25k", label: "₹10,000–₹25,000" },
  { value: "25k-50k", label: "₹25,000–₹50,000" },
  { value: "50k-1l", label: "₹50,000–₹1,00,000" },
  { value: "1l-plus", label: "₹1,00,000+" },
  { value: "guidance", label: "Need Guidance" },
];

const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within 1 month" },
  { value: "2-3-months", label: "2–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "flexible", label: "Flexible / Not sure" },
];

const nextSteps = [
  {
    step: "01",
    title: "We review your enquiry",
    description:
      "Our team reviews your requirements, goals and timeline carefully.",
  },
  {
    step: "02",
    title: "We get in touch",
    description:
      "We contact you to discuss your project and answer any questions.",
  },
  {
    step: "03",
    title: "You receive a clear proposal",
    description:
      "We prepare a transparent scope, deliverables and quote for approval.",
  },
] as const;

/* Google Maps — search embed shows the real business listing, ratings and reviews */
const mapsSearchQuery = "MovoX Digital Growth Agency";
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsSearchQuery)}&output=embed`;
const mapsLinkUrl = `https://www.google.com/maps/search/${encodeURIComponent(mapsSearchQuery)}`;

export function Contact() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: ContactFormValues = {
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: searchParams.get("service") || "",
    package: searchParams.get("package") || "",
    budget: "",
    timeline: "",
    details: "",
    privacy: false,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
      if (!endpoint) {
        // Demo mode: no backend. Save to the browser-local store so the admin
        // dashboard's Leads inbox can display it, and log for transparency.
        console.log("Contact form submission (demo mode — saved locally):", data);
        addLead({
          id: uid("lead"),
          referenceId: generateReferenceId(),
          source: "contact",
          status: "new",
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          message: data.details,
          raw: data as unknown as Record<string, unknown>,
          submittedAt: new Date().toISOString(),
        });
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitted(true);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Submission failed.");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Thank You | MovoX"
          description="Thank you for reaching out to MovoX."
          path="/contact"
        />
        <section className="relative overflow-hidden bg-navy pt-10 pb-24 md:pb-32">
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

          <div className="px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              className="max-w-xl mx-auto text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-7">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white mb-4">Thank You</h1>
              <p className="text-blue-100/80 text-lg leading-relaxed mb-9">
                Your enquiry has been received, and our team will review your
                requirements and get in touch.
              </p>
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Back to Home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Contact MovoX | Start a Project Enquiry"
        description="Share your project requirements with MovoX. We offer graphic design, branding, website development, app development and digital marketing services across India."
        path="/contact"
        image="/og-image.jpg"
      />

      {/* ===== Dark hero ===== */}
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
                  { label: "Contact", href: "/contact" },
                ]}
              />
            </div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Contact Us
              </span>
            </motion.div>

            <motion.h1
              className="text-white mb-6 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Tell Us What You're Planning.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Let's Make It Happen
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              Share a little about your business, your project and what you'd
              like to achieve. Our team can review your requirements and
              discuss the next steps.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== Form + sidebar ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
            {/* Form */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-7 md:p-9 rounded-card-lg border border-border-default bg-white shadow-card"
              >
                <div className="flex items-center gap-3 mb-7">
                  <span className="w-10 h-10 rounded-button bg-primary-light text-primary flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      Project Enquiry
                    </h2>
                    <p className="text-xs text-text-muted">
                      All fields marked are required unless optional.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label="Full name"
                      id="fullName"
                      placeholder="e.g. Ravi Sharma"
                      {...register("fullName")}
                      error={errors.fullName?.message}
                    />
                    <Input
                      label="Business email"
                      id="email"
                      type="email"
                      placeholder="e.g. ravi@company.com"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label="Phone number"
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                    <Input
                      label="Company or brand"
                      id="company"
                      placeholder="e.g. Acme Retail"
                      {...register("company")}
                      error={errors.company?.message}
                    />
                  </div>
                  <Select
                    label="Required service"
                    id="service"
                    options={serviceOptions}
                    placeholder="Select a service"
                    {...register("service")}
                    error={errors.service?.message}
                  />
                  <Input
                    label="Selected package (optional)"
                    id="package"
                    placeholder="e.g. Business Website"
                    {...register("package")}
                    helperText="Optional — leave blank if you need guidance."
                  />
                  <div className="grid md:grid-cols-2 gap-5">
                    <Select
                      label="Estimated budget"
                      id="budget"
                      options={budgetOptions}
                      placeholder="Select a budget range"
                      {...register("budget")}
                      error={errors.budget?.message}
                    />
                    <Select
                      label="Project timeline"
                      id="timeline"
                      options={timelineOptions}
                      placeholder="Select a timeline"
                      {...register("timeline")}
                      error={errors.timeline?.message}
                    />
                  </div>
                  <Textarea
                    label="Project details"
                    id="details"
                    placeholder="Tell us about your business, goals and what you need."
                    {...register("details")}
                    error={errors.details?.message}
                  />

                  <div className="flex items-start">
                    <input
                      id="privacy"
                      type="checkbox"
                      className="mt-1 rounded border-border-default text-primary focus:ring-primary"
                      {...register("privacy")}
                    />
                    <label
                      htmlFor="privacy"
                      className="ml-3 text-sm text-text-secondary leading-relaxed"
                    >
                      I consent to MovoX storing my enquiry details to respond
                      to my request.{" "}
                      <Link
                        to="/policies/privacy"
                        className="text-primary hover:underline"
                      >
                        Read our Privacy Policy
                      </Link>
                      .
                    </label>
                    {errors.privacy && (
                      <p className="ml-3 mt-1 text-sm text-error">
                        {errors.privacy.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div className="rounded-button border border-error bg-error-bg p-4 text-error text-sm">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formIsSubmitting || isSubmitting}
                    className="btn-gradient w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-button text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formIsSubmitting || isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Project Enquiry
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-2 text-xs text-text-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Your details are used only to respond to your enquiry.
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-5 space-y-5"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Contact details */}
              <div className="p-7 rounded-card-lg bg-bg-soft border border-border-default">
                <h3 className="text-base font-bold text-text-primary mb-5">
                  Reach us directly
                </h3>

                <ul className="space-y-4">
                  {siteConfig.email && (
                    <li className="flex items-center gap-4">
                      <span className="w-11 h-11 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-text-muted">Email</p>
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="text-sm font-semibold text-text-primary hover:text-primary transition-colors break-all"
                        >
                          {siteConfig.email}
                        </a>
                      </div>
                    </li>
                  )}
                  {siteConfig.phone && (
                    <li className="flex items-center gap-4">
                      <span className="w-11 h-11 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs text-text-muted">Phone</p>
                        <a
                          href={`tel:${siteConfig.phone}`}
                          className="text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                        >
                          {siteConfig.phone}
                        </a>
                      </div>
                    </li>
                  )}
                  <li className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs text-text-muted">Response time</p>
                      <p className="text-sm font-semibold text-text-primary">
                        Within 1 business day
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs text-text-muted">Service area</p>
                      <p className="text-sm font-semibold text-text-primary">
                        India &amp; international markets
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What happens next */}
              <div className="p-7 rounded-card-lg border border-border-default bg-white shadow-card">
                <h3 className="text-base font-bold text-text-primary mb-5">
                  What happens next
                </h3>
                <ol className="space-y-4">
                  {nextSteps.map(({ step, title, description }) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light text-primary text-xs font-bold flex items-center justify-center">
                        {step}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {title}
                        </p>
                        <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                          {description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Google rating card */}
              <a
                href={mapsLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-card-lg bg-navy text-white overflow-hidden relative"
              >
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/30 blur-[60px] pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                      Find us on Google
                    </p>
                    <p className="text-base font-bold group-hover:text-white/90 transition-colors">
                      MovoX — Digital Growth Agency
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-white/70">
                      <Star className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        Read real reviews on Google Maps
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </div>
              </a>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ===== Google Maps ===== */}
      <section className="py-16 md:py-20 bg-bg-soft relative overflow-hidden">
        <div
          className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Find Us
                </span>
              </div>
              <h2 className="leading-tight">
                MovoX on{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  Google Maps
                </span>
                .
              </h2>
              <p className="text-supporting text-text-muted max-w-2xl mx-auto mt-4">
                Find our business listing, check directions and read real
                customer reviews on Google Maps.
              </p>
            </div>

            <motion.div
              className="rounded-card-lg overflow-hidden border border-border-default bg-white shadow-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Map header strip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-border-default bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-button bg-primary-light text-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      MovoX — Digital Growth Agency
                    </p>
                    <p className="text-xs text-text-muted">
                      Design · Development · Digital Marketing
                    </p>
                  </div>
                </div>

                <a
                  href={mapsLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-button border border-border-default bg-white text-sm font-semibold text-text-primary hover:bg-bg-soft hover:text-primary transition-colors"
                >
                  <Star className="w-4 h-4 text-primary" />
                  Read Reviews
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map embed */}
              <div className="relative w-full h-[420px] md:h-[480px] bg-bg-soft">
                <iframe
                  src={mapsEmbedUrl}
                  title="MovoX — Digital Growth Agency on Google Maps"
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            <p className="mt-6 text-center text-xs text-text-muted">
              Map and reviews are provided by Google Maps. Ratings and reviews
              shown are from real Google users.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
