import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon, Grid2x2, Sparkles } from "lucide-react";
import { useContent } from "@/store/StoreProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function FeaturedWork() {
  const { projects } = useContent();
  const featuredProjects = projects.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <section className="relative py-24 md:py-28 bg-bg-soft overflow-hidden">
      {/* Decorative washes */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-blue-50 blur-[120px] opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Selected Work
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="mb-5 leading-tight">
              Ideas Turned Into{" "}
              <span className="brand-gradient bg-clip-text text-transparent">
                Experiences
              </span>
              .
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-supporting text-text-muted max-w-2xl mx-auto"
            >
              Every project begins with a challenge. We bring creative thinking
              and technical execution together to turn those challenges into
              purposeful digital experiences.
            </motion.p>
          </motion.div>

          {/* Work grid — adaptive */}
          {displayProjects.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              }}
            >
              {displayProjects.map((project, i) => {
                /* First item spans wider on large screens for editorial rhythm */
                const spanClass =
                  displayProjects.length > 1 && i === 0
                    ? "md:col-span-2"
                    : "";

                return (
                  <motion.div
                    key={project.slug}
                    variants={fadeUp}
                    className={spanClass}
                  >
                    <Link
                      to={`/work/${project.slug}`}
                      className="group block h-full rounded-card-lg overflow-hidden border border-border-default bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image area */}
                      <div className="relative h-56 bg-gradient-to-br from-navy to-primary overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = "none";
                          }}
                        />
                        {/* Decorative grid overlay */}
                        <div
                          className="absolute inset-0 opacity-[0.08] pointer-events-none"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                          }}
                          aria-hidden="true"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-navy text-sm font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            View Case Study
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>

                        {/* Demo badge */}
                        {project.demo && (
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/95 text-warning border border-warning/30 backdrop-blur">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                            Demo template
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                        </div>

                        <p className="text-xs text-text-muted mb-4">
                          {project.industry}
                        </p>

                        {/* Service tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((s) => (
                            <span
                              key={s}
                              className="text-[11px] font-medium px-3 py-1 rounded-full bg-bg-soft text-text-secondary border border-border-default"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Honest demo notice */}
                        {project.demo && (
                          <p className="mt-4 text-[11px] text-warning font-medium bg-warning-bg rounded-button px-3 py-2">
                            Demo content — to be replaced with a real, permission-approved
                            project.
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Placeholder slots for upcoming projects */}
              {Array.from({
                length: Math.max(0, 3 - (displayProjects.length % 3 || 3)),
              }).map((_, i) => (
                <motion.div
                  key={`placeholder-${i}`}
                  variants={fadeUp}
                  className="rounded-card-lg border-2 border-dashed border-border-default bg-white/50 p-8 flex flex-col items-center justify-center text-center min-h-[280px] group hover:border-primary/40 hover:bg-white transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-button bg-bg-soft flex items-center justify-center text-text-muted mb-4 group-hover:bg-primary-light group-hover:text-primary transition-colors">
                    <Grid2x2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-text-secondary mb-1">
                    Your project could be here
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Genuine case studies coming soon.
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty state — no projects at all */
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-card-lg border-2 border-dashed border-border-default bg-white/60 py-20 text-center"
            >
              <div className="w-14 h-14 rounded-button bg-bg-soft flex items-center justify-center text-text-muted mx-auto mb-5">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-text-secondary font-semibold mb-1">
                Portfolio coming soon
              </p>
              <p className="text-sm text-text-muted">
                Add genuine project data from the{" "}
                <Link to="/admin" className="text-primary hover:underline">
                  admin dashboard
                </Link>
                .
              </p>
            </motion.div>
          )}

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
            <motion.p variants={fadeUp} className="text-sm text-text-muted mb-5">
              Real client case studies will be published here once permission is
              granted.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/work"
                className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-button text-white font-semibold text-sm"
              >
                View All Work <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
