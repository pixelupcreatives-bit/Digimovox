import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
  ArrowRight,
  Check,
  Compass,
  Gauge,
  Handshake,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { serviceList } from "@/data/services";
import { servicesFAQs } from "@/data/faqs";

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

const differentiators = [
  {
    Icon: Compass,
    title: "One connected strategy",
    description:
      "Design, development and marketing planned together — not as disconnected tasks.",
  },
  {
    Icon: Handshake,
    title: "Transparent process",
    description:
      "Clear scope, agreed deliverables and honest pricing before work begins.",
  },
  {
    Icon: Gauge,
    title: "Built for performance",
    description:
      "Fast, responsive and accessible digital products focused on real business outcomes.",
  },
] as const;

export function Services() {
  return (
    <>
      <SEO
        title="Our Services | Digital Growth Agency MovoX"
        description="Explore MovoX services: graphic design, branding & packaging, website development, app development and digital marketing."
        path="/services"
        image="/og-image.jpg"
      />

      {/* ===== Page hero ===== */}
      <section className="relative overflow-hidden bg-navy pt-10 pb-20 md:pt-12 md:pb-24">
        {/* Animated grid */}
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
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[80%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]}
              />
            </div>

            <motion.h1
              className="text-white mb-6 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Digital Services Built Around{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Your Business Goals
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              A connected approach to building stronger brands, better digital
              experiences and meaningful customer connections.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== Services grid ===== */}
      <section className="py-24 md:py-28 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {serviceList.map((service, i) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Layers;
                const reversed = i % 2 === 1;

                return (
                  <motion.article
                    key={service.slug}
                    variants={fadeUp}
                    className="group rounded-card-lg border border-border-default bg-white overflow-hidden hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
                  >
                    <div
                      className={`grid md:grid-cols-2 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}
                    >
                      {/* Left: content */}
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-14 h-14 rounded-button bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold tracking-[0.2em] text-text-muted">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                          {service.name}
                        </h2>
                        <p className="text-text-secondary leading-relaxed mb-6">
                          {service.description}
                        </p>

                        {/* Benefits */}
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-7">
                          {service.benefits.slice(0, 4).map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2.5 text-sm text-text-secondary"
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center mt-0.5">
                                <Check className="w-3 h-3" />
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap items-center gap-4">
                          <Link
                            to={`/services/${service.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-button bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                          >
                            Explore {service.shortName}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                          <Link
                            to="/pricing"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                          >
                            See pricing
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: deliverables panel */}
                      <div className="relative bg-bg-soft border-t md:border-t-0 md:border-l border-border-default p-8 md:p-10">
                        <div
                          className="absolute inset-0 opacity-[0.035] pointer-events-none"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #003655 1px, transparent 1px), linear-gradient(to bottom, #003655 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                          }}
                          aria-hidden="true"
                        />
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-5">
                          What you get
                        </p>
                        <ul className="space-y-3 relative">
                          {service.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-center gap-3 text-sm text-text-secondary bg-white rounded-button px-4 py-3 border border-border-default shadow-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Differentiators ===== */}
      <section className="py-24 md:py-28 bg-bg-soft relative overflow-hidden">
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Why MovoX
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="leading-tight">
                Built differently, on{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  purpose
                </span>
                .
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
              }}
            >
              {differentiators.map(({ Icon, title, description }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group p-8 rounded-card-lg bg-white border border-border-default hover:border-primary/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-button bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 md:py-28 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-soft border border-border-default shadow-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Common Questions
                </span>
              </div>
              <h2 className="leading-tight">
                Questions before you{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  get started
                </span>
                .
              </h2>
            </div>

            <Accordion items={servicesFAQs} />

            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
              >
                Still have a question? Ask our team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 md:py-24 bg-navy overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-5 leading-tight">
              Not sure which service you need?
            </h2>
            <p className="text-blue-100/80 mb-9 max-w-xl mx-auto leading-relaxed">
              Tell us about your business and goals — we'll recommend the right
              mix of services and a clear next step.
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
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
