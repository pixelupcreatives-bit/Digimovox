import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PenTool, Code2, Megaphone, ArrowRight, ArrowUpRight } from "lucide-react";

const capabilities = [
  {
    number: "01",
    title: "Design",
    icon: PenTool,
    description:
      "We create meaningful visual identities and digital experiences that communicate clearly and help brands stand apart.",
    href: "/services/graphic-design",
    tags: ["Branding", "Graphic Design", "Packaging"],
  },
  {
    number: "02",
    title: "Development",
    icon: Code2,
    description:
      "We build responsive websites and applications around usability, performance and business requirements.",
    href: "/services/website-development",
    tags: ["Websites", "E-commerce", "Mobile Apps"],
  },
  {
    number: "03",
    title: "Marketing",
    icon: Megaphone,
    description:
      "We help businesses improve their visibility, connect with relevant audiences and make informed marketing decisions.",
    href: "/services/digital-marketing",
    tags: ["SEO", "Social Media", "Paid Ads"],
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function WhyMovoX() {
  return (
    <section className="relative py-24 md:py-28 bg-white overflow-hidden">
      {/* Subtle top divider gradient */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent"
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
                How We Work
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="mb-5 leading-tight">
              One Connected Partner.{" "}
              <span className="brand-gradient bg-clip-text text-transparent">
                Three Powerful Capabilities
              </span>
              .
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-supporting text-text-muted max-w-2xl mx-auto"
            >
              Instead of treating design, technology and marketing as separate
              activities, we bring them together around your business objectives.
            </motion.p>
          </motion.div>

          {/* Capability cards with connecting line */}
          <div className="relative">
            {/* Desktop connecting line */}
            <div
              className="hidden md:block absolute top-[92px] left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
              aria-hidden="true"
            />

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
              }}
            >
              {capabilities.map(({ number, title, icon: Icon, description, href, tags }) => (
                <motion.div key={title} variants={fadeUp} className="relative">
                  <Link
                    to={href}
                    className="group relative block h-full p-8 rounded-card-lg bg-white border border-border-default hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover"
                  >
                    {/* Number + icon row */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold tracking-widest text-text-muted">
                        {number}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-transparent group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    {/* Icon disc — sits over the connecting line */}
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-border-default shadow-card flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-3 text-center group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed text-center mb-6">
                      {description}
                    </p>

                    {/* Service tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-3 py-1 rounded-full bg-bg-soft text-text-secondary border border-border-default group-hover:border-primary/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer link */}
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                      Explore {title.toLowerCase()}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom note */}
          <motion.p
            className="mt-14 text-center text-sm text-text-muted"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            One team. One process. No handoffs between disconnected vendors.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
