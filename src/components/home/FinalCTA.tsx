import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
      {/* Animated grid background */}
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
              "linear-gradient(to right, rgba(35,130,184,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,130,184,0.18) 1px, transparent 1px)",
          }}
        />
      </div>

      {/* Glow orbs */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[70%] rounded-full bg-primary/30 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary/20 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {/* Eyebrow pill */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8"
          >
            <MessageSquare className="w-3.5 h-3.5 text-white/80" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
              Start a Conversation
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="text-white font-heading font-bold mb-6 leading-[1.15] tracking-tight"
          >
            Let's Build Something That{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
              }}
            >
              Moves Your Business Forward
            </span>
            .
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-blue-100/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Have a project in mind, a business challenge to solve or an idea
            ready to take shape? Let's discuss what you want to achieve and
            how MovoX can help.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/start-a-project"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-button border border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Our Team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Reassurance line */}
          <motion.p
            variants={fadeUp}
            className="mt-10 text-sm text-white/50"
          >
            No pressure. A straightforward conversation about your goals.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
