import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { serviceList } from "@/data/services";

const iconMap = {
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
} as const;

/* Asymmetric bento layout — 6-column grid on md+ */
const gridSpans: Record<string, string> = {
  "graphic-design": "md:col-span-2",
  "branding-packaging": "md:col-span-2",
  "website-development": "md:col-span-2",
  "app-development": "md:col-span-3",
  "digital-marketing": "md:col-span-3",
};

const featuredSlug = "website-development";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ServicesOverview() {
  return (
    <section className="relative py-24 md:py-28 bg-white overflow-hidden">
      {/* Decorative wash */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-primary-subtle blur-[130px] opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-soft border border-border-default shadow-sm mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Our Services
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="mb-5 leading-tight">
              Everything You Need to{" "}
              <span className="brand-gradient bg-clip-text text-transparent">
                Grow Digitally
              </span>
              .
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-supporting text-text-muted max-w-2xl mx-auto"
            >
              A connected approach to building stronger brands, better digital
              experiences and meaningful customer connections.
            </motion.p>
          </motion.div>

          {/* Bento grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-6 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
          >
            {serviceList.map((service, i) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] ?? Layers;
              const featured = service.slug === featuredSlug;

              return (
                <motion.div
                  key={service.slug}
                  variants={fadeUp}
                  className={gridSpans[service.slug] ?? "md:col-span-2"}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className={
                      featured
                        ? "group relative flex flex-col h-full p-8 rounded-card-lg bg-navy text-white overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover"
                        : "group flex flex-col h-full p-8 rounded-card-lg bg-white border border-border-default hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover"
                    }
                  >
                    {/* Featured glow */}
                    {featured && (
                      <>
                        <div
                          className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/30 blur-[70px] pointer-events-none"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 opacity-[0.06] pointer-events-none"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                          }}
                          aria-hidden="true"
                        />
                      </>
                    )}

                    {/* Top row: icon + index */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={
                          featured
                            ? "w-12 h-12 rounded-button bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy transition-colors duration-300"
                            : "w-12 h-12 rounded-button bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                        }
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={
                          featured
                            ? "text-xs font-semibold text-white/40 tracking-widest"
                            : "text-xs font-semibold text-text-muted tracking-widest"
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <h3
                      className={
                        featured
                          ? "text-xl font-bold mb-3 text-white group-hover:text-white/90 transition-colors"
                          : "text-xl font-bold mb-3 text-text-primary group-hover:text-primary transition-colors"
                      }
                    >
                      {service.name}
                    </h3>
                    <p
                      className={
                        featured
                          ? "text-sm leading-relaxed mb-6 text-white/70"
                          : "text-sm leading-relaxed mb-6 text-text-secondary"
                      }
                    >
                      {service.description}
                    </p>

                    {/* Deliverable chips */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {service.deliverables.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className={
                            featured
                              ? "text-[11px] font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10"
                              : "text-[11px] font-medium px-3 py-1 rounded-full bg-bg-soft text-text-secondary border border-border-default"
                          }
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Footer link — pushed to bottom */}
                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold">
                      <span
                        className={
                          featured
                            ? "inline-flex items-center gap-2 text-white"
                            : "inline-flex items-center gap-2 text-primary"
                        }
                      >
                        Explore {service.shortName}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-14 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
            }}
          >
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/services"
                className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-button text-white font-semibold text-sm"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-button border border-border-default bg-white text-text-primary font-semibold text-sm hover:bg-bg-soft hover:text-primary transition-colors"
              >
                See Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
