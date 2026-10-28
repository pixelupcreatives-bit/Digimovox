import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-main">
      {/* Animated grid lines background */}
      <div className="hero-grid" aria-hidden="true">
        <div className="hero-grid-lines" />
        <div className="hero-grid-accent" />
      </div>

      {/* Soft colour washes above grid */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-subtle blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[100px] opacity-80" />
        {/* Bottom fade into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="eyebrow" variants={itemVariants}>
            DIGITAL GROWTH PARTNER
          </motion.p>

          <motion.h1 className="mb-6" variants={itemVariants}>
            We Design. We Build.{" "}
            <span className="brand-gradient bg-clip-text text-transparent">We Grow.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            MovoX helps businesses turn ideas into impactful digital experiences
            through creative design, modern technology and strategic digital
            marketing.
          </motion.p>

          <motion.p
            className="text-supporting text-text-muted mb-10 max-w-xl mx-auto"
            variants={itemVariants}
          >
            From building your brand identity to developing your digital
            platforms and reaching the right audience, we bring the essential
            pieces of digital growth together.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link
              to="/start-a-project"
              className="btn-gradient flex items-center justify-center gap-2 px-10 py-4 rounded-button text-white font-semibold text-lg"
            >
              Start a Project <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/work"
              className="px-10 py-4 rounded-button border border-border-default bg-white text-text-primary font-semibold text-lg hover:bg-bg-soft hover:text-primary transition-colors shadow-sm"
            >
              Explore Our Work
            </Link>
          </motion.div>

          <motion.p
            className="mt-12 text-supporting text-text-muted"
            variants={itemVariants}
          >
            Creative Thinking. Thoughtful Technology. Measurable Growth.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
