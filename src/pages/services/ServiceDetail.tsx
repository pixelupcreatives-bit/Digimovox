import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { services } from "@/data/services";
import { getPricingById } from "@/data/pricing";
import { formatINR } from "@/lib/utils";

const iconMap = {
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-soft border border-border-default shadow-sm mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
        {children}
      </span>
    </div>
  );
}

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = services[slug || ""];

  if (!service) {
    return (
      <>
        <SEO
          title="Service Not Found | MovoX"
          description=""
          path="/services"
          noIndex
        />
        <section className="py-24 bg-bg-main">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-14 h-14 rounded-button bg-primary-light text-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="mb-4">Service Not Found</h1>
              <p className="text-text-muted mb-8">
                The service you're looking for doesn't exist or may have been
                moved.
              </p>
              <Link
                to="/services"
                className="btn-gradient inline-flex items-center gap-2 px-7 py-3.5 rounded-button text-white font-semibold text-sm"
              >
                Back to Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Layers;
  const servicePricing = service.pricing
    .map((id) => getPricingById(id))
    .filter(Boolean);

  return (
    <>
      <SEO
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.slug}`}
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
          className="absolute -top-32 right-0 w-[45%] h-[100%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-7 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.name, href: `/services/${service.slug}` },
                ]}
              />
            </div>

            <motion.div
              className="flex items-center gap-5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-button bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white">
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                {service.name}
              </span>
            </motion.div>

            <motion.h1
              className="text-white mb-6 leading-[1.15] max-w-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {service.heroHeading}
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-2xl leading-relaxed mb-9"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {service.heroDescription}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/start-a-project"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#deliverables"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-button border border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
              >
                What you get
                <ChevronRight className="w-4 h-4 rotate-90" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Main content + sticky sidebar ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
            {/* ---- Main column ---- */}
            <div className="lg:col-span-8 space-y-16">
              {/* Overview */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel>Overview</SectionLabel>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {service.heroDescription}
                  </p>
                </motion.div>
              </motion.div>

              {/* Deliverables */}
              <div id="deliverables" className="scroll-mt-28">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } },
                  }}
                >
                  <motion.div variants={fadeUp}>
                    <SectionLabel>Deliverables</SectionLabel>
                    <h2 className="mb-8 leading-tight">
                      What we{" "}
                      <span className="brand-gradient bg-clip-text text-transparent">
                        deliver
                      </span>
                      .
                    </h2>
                  </motion.div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.deliverables.map((d) => (
                      <motion.div
                        key={d}
                        variants={fadeUp}
                        className="group flex items-center gap-4 p-5 rounded-card-lg border border-border-default bg-white hover:border-primary/30 hover:shadow-card transition-all duration-300"
                      >
                        <span className="flex-shrink-0 w-10 h-10 rounded-button bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <Check className="w-5 h-5" />
                        </span>
                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                          {d}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Benefits */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel>Benefits</SectionLabel>
                  <h2 className="mb-8 leading-tight">
                    Why it{" "}
                    <span className="brand-gradient bg-clip-text text-transparent">
                      matters
                    </span>
                    .
                  </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {service.benefits.map((b) => (
                    <motion.div
                      key={b}
                      variants={fadeUp}
                      className="p-6 rounded-card-lg bg-bg-soft border border-border-default"
                    >
                      <span className="w-8 h-8 rounded-button bg-white border border-border-default text-primary flex items-center justify-center mb-4 shadow-sm">
                        <Check className="w-4 h-4" />
                      </span>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {b}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Process timeline */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel>Our Process</SectionLabel>
                  <h2 className="mb-10 leading-tight">
                    From brief to{" "}
                    <span className="brand-gradient bg-clip-text text-transparent">
                      delivery
                    </span>
                    .
                  </h2>
                </motion.div>

                <div className="relative pl-12">
                  {/* Vertical connector */}
                  <div
                    className="absolute top-3 bottom-3 left-[19px] w-0.5 bg-gradient-to-b from-primary/40 via-primary/25 to-transparent rounded-full"
                    aria-hidden="true"
                  />

                  <div className="space-y-9">
                    {service.process.map((step) => (
                      <motion.div
                        key={step.step}
                        variants={fadeUp}
                        className="relative group"
                      >
                        <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-white border-2 border-primary/30 shadow-card flex items-center justify-center text-primary text-sm font-bold group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors duration-300">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                          {step.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* FAQ */}
              <div>
                <SectionLabel>FAQs</SectionLabel>
                <h2 className="mb-8 leading-tight">
                  Frequently{" "}
                  <span className="brand-gradient bg-clip-text text-transparent">
                    asked
                  </span>
                  .
                </h2>
                <Accordion items={service.faqs} />
              </div>

              {/* Related services */}
              <div>
                <SectionLabel>Related Services</SectionLabel>
                <h2 className="mb-8 leading-tight">
                  Explore{" "}
                  <span className="brand-gradient bg-clip-text text-transparent">
                    more
                  </span>
                  .
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.related.map((relSlug) => {
                    const rel = services[relSlug];
                    if (!rel) return null;
                    const RelIcon =
                      iconMap[rel.icon as keyof typeof iconMap] ?? Layers;
                    return (
                      <Link
                        key={rel.slug}
                        to={`/services/${rel.slug}`}
                        className="group flex items-center gap-4 p-6 rounded-card-lg border border-border-default bg-white hover:border-primary/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                      >
                        <span className="flex-shrink-0 w-12 h-12 rounded-button bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <RelIcon className="w-5 h-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-bold text-text-primary group-hover:text-primary transition-colors">
                            {rel.name}
                          </span>
                          <span className="block text-xs text-text-muted mt-0.5 line-clamp-1">
                            {rel.shortName}
                          </span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ---- Sticky sidebar ---- */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-5">
                {/* Quick summary card */}
                <div className="rounded-card-lg border border-border-default bg-bg-soft p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold text-text-primary">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <Link
                    to="/start-a-project"
                    className="btn-gradient flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-button text-white font-semibold text-sm"
                  >
                    Start a Project <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-button border border-border-default bg-white text-text-primary font-semibold text-sm hover:bg-bg-soft hover:text-primary transition-colors"
                  >
                    Talk to Our Team
                  </Link>
                </div>

                {/* Pricing table */}
                {servicePricing.length > 0 && (
                  <div className="rounded-card-lg border border-border-default bg-white p-6 shadow-card">
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-base font-bold text-text-primary">
                        Indicative Pricing
                      </h4>
                      <Link
                        to="/pricing"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all
                      </Link>
                    </div>

                    <ul className="space-y-4">
                      {servicePricing.map((p) => (
                        <li
                          key={p!.id}
                          className="pb-4 border-b border-border-default last:border-0 last:pb-0"
                        >
                          <div className="flex items-baseline justify-between gap-3 mb-1">
                            <span className="text-sm font-semibold text-text-primary">
                              {p!.packageName}
                            </span>
                            <span className="text-sm font-bold text-primary whitespace-nowrap">
                              {p!.price !== null
                                ? `${p!.priceQualifier === "starting-at" ? "from " : ""}${formatINR(p!.price)}`
                                : "On request"}
                              {p!.billingPeriod === "month" && (
                                <span className="text-text-muted font-normal">
                                  /mo
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">
                            {p!.shortDescription}
                          </p>
                          {p!.badge && (
                            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-light text-primary">
                              {p!.badge}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>

                    <p className="text-[11px] text-text-muted mt-4 leading-relaxed">
                      Prices exclude GST. Final pricing depends on project scope
                      and requirements.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== Bottom CTA ===== */}
      <section className="relative py-20 md:py-24 bg-navy overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="hero-grid" aria-hidden="true">
          <div
            className="hero-grid-lines"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            }}
          />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-5 leading-tight">
              Ready to start your {service.name.toLowerCase()} project?
            </h2>
            <p className="text-blue-100/80 mb-9 max-w-xl mx-auto leading-relaxed">
              Discuss your requirements with our team and get a clear,
              transparent proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/start-a-project"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-button border border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
              >
                View All Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
