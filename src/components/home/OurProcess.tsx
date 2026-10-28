import { motion } from "framer-motion";
import { Search, Compass, Palette, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discover",
    icon: Search,
    description:
      "Understand the business, audience, objectives, challenges and expectations.",
  },
  {
    step: "02",
    title: "Strategise",
    icon: Compass,
    description:
      "Define the project scope, creative direction, technical approach and delivery plan.",
  },
  {
    step: "03",
    title: "Create",
    icon: Palette,
    description:
      "Design, develop and refine the solution through structured collaboration and feedback.",
  },
  {
    step: "04",
    title: "Launch",
    icon: Rocket,
    description:
      "Prepare deliverables, test the experience and support the launch.",
  },
  {
    step: "05",
    title: "Improve",
    icon: TrendingUp,
    description:
      "Where ongoing support is agreed, use feedback and available performance data to identify opportunities for improvement.",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function OurProcess() {
  return (
    <section className="relative py-24 md:py-28 bg-bg-soft overflow-hidden">
      {/* Decorative wash */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full bg-primary-subtle blur-[140px] opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
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
                Our Process
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="mb-5 leading-tight">
              A Clear Process From{" "}
              <span className="brand-gradient bg-clip-text text-transparent">
                Idea to Execution
              </span>
              .
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-supporting text-text-muted max-w-2xl mx-auto"
            >
              A structured, transparent approach that keeps you informed at every
              stage — from the first conversation to launch and beyond.
            </motion.p>
          </motion.div>

          {/* ===== Desktop: horizontal timeline ===== */}
          <div className="hidden md:block relative">
            {/* Connector line behind nodes */}
            <motion.div
              className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/25 via-primary/50 to-primary/25 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              style={{ transformOrigin: "left" }}
              aria-hidden="true"
            />

            <motion.div
              className="grid grid-cols-5 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
              }}
            >
              {steps.map(({ step, title, icon: Icon, description }) => (
                <motion.div key={step} variants={fadeUp} className="group relative text-center">
                  {/* Node circle — sits on the line */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-primary/30 shadow-card mx-auto mb-6 flex items-center justify-center text-primary group-hover:bg-primary group-hover:border-primary group-hover:scale-110 group-hover:shadow-card-hover transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Step number pill */}
                  <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-white border border-border-default shadow-sm mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-primary">
                      STEP {step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ===== Mobile: vertical timeline ===== */}
          <div className="md:hidden relative pl-12">
            {/* Vertical connector */}
            <div
              className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-gradient-to-b from-primary/25 via-primary/40 to-primary/25 rounded-full"
              aria-hidden="true"
            />

            <motion.div
              className="space-y-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {steps.map(({ step, title, icon: Icon, description }) => (
                <motion.div key={step} variants={fadeUp} className="relative group">
                  {/* Node */}
                  <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-white border-2 border-primary/30 shadow-card flex items-center justify-center text-primary group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white border border-border-default shadow-sm mb-2">
                    <span className="text-[10px] font-bold tracking-widest text-primary">
                      STEP {step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-1.5">
                    {title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom reassurance */}
          <motion.p
            className="mt-16 text-center text-sm text-text-muted max-w-xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            You will always know what stage your project is in, what comes next
            and what we need from you.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
