import { motion } from "framer-motion";
import { Palette, Code2, Megaphone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const capabilities = [
  {
    Icon: Palette,
    title: "Creative Design & Identity",
    description:
      "Visual identity, graphic design and packaging that make your brand memorable.",
    href: "/services/graphic-design",
  },
  {
    Icon: Code2,
    title: "Websites & Applications",
    description:
      "Responsive websites and mobile apps engineered for performance and scale.",
    href: "/services/website-development",
  },
  {
    Icon: Megaphone,
    title: "Strategic Digital Marketing",
    description:
      "Campaigns that reach the right audience and turn attention into growth.",
    href: "/services/digital-marketing",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Introduction() {
  return (
    <section className="relative py-24 md:py-28 bg-bg-soft overflow-hidden">
      {/* Soft decorative wash */}
      <div className="absolute top-0 right-0 w-[35%] h-[60%] rounded-full bg-primary-subtle blur-[120px] opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            {/* Left column — story */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Why MovoX
                </span>
              </motion.div>

              <motion.h2 variants={fadeUp} className="mb-6 leading-tight">
                Your Business Deserves{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  More Than
                </span>{" "}
                Just a Digital Presence.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-lg text-text-secondary leading-relaxed mb-5"
              >
                In a competitive digital landscape, simply being online isn't
                enough. Your brand needs to stand out, your digital platforms
                need to perform, and your marketing needs to connect with the
                right people.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-lg text-text-secondary leading-relaxed mb-8"
              >
                MovoX brings design, development and marketing together to
                create digital experiences that support your business goals —
                whether you're launching a new venture or strengthening an
                established business.
              </motion.p>

              <motion.div variants={fadeUp}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                >
                  Learn more about us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column — capability cards */}
            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
              }}
            >
              {capabilities.map(({ Icon, title, description, href }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Link
                    to={href}
                    className="group flex items-start gap-5 p-6 bg-white rounded-card-lg border border-border-default shadow-card hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-button bg-primary-light group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto mt-1 flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
