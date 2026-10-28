import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Coffee,
  GraduationCap,
  Stethoscope,
  Building2,
  Briefcase,
  Factory,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.ElementType> = {
  "Retail & E-commerce": ShoppingBag,
  "Food & Grocery": Coffee,
  Education: GraduationCap,
  Healthcare: Stethoscope,
  "Real Estate": Building2,
  "Professional Services": Briefcase,
  Manufacturing: Factory,
  "Startups & Emerging Businesses": Rocket,
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Industries() {
  return (
    <section className="relative py-24 md:py-28 bg-white overflow-hidden">
      {/* Decorative wash */}
      <div
        className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            {/* Left column — heading */}
            <motion.div
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
                  Industries We Serve
                </span>
              </motion.div>

              <motion.h2 variants={fadeUp} className="mb-5 leading-tight">
                Digital Solutions for{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  Different Business Needs
                </span>
                .
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-lg text-text-secondary leading-relaxed mb-8"
              >
                Every industry has different customers, challenges and growth
                opportunities. We tailor our creative, technical and marketing
                approach to each project's requirements.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-xs text-text-muted leading-relaxed mb-8 max-w-md"
              >
                Project examples are shown only where we have genuine, approved
                work to share.
              </motion.p>

              <motion.div variants={fadeUp}>
                <Link
                  to="/start-a-project"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                >
                  Discuss your industry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column — industry tiles */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
              }}
            >
              {industries.map((industry) => {
                const Icon = iconMap[industry] ?? Building2;

                return (
                  <motion.div key={industry} variants={fadeUp}>
                    <div className="group h-full flex flex-col items-center justify-center text-center p-5 rounded-card-lg border border-border-default bg-white hover:border-primary/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                      <div className="w-12 h-12 rounded-button bg-primary-light text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-text-secondary leading-snug group-hover:text-primary transition-colors">
                        {industry}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
