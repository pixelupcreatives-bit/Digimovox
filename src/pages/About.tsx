import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Palette,
  Code2,
  Megaphone,
  Target,
  Eye,
  Compass,
  Sparkles,
  Cpu,
  TrendingUp,
  Layers,
  Search,
  Map,
  PenTool,
  Rocket,
  Quote,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const whatWeDo = [
  {
    Icon: Palette,
    title: "Creative Design",
    description:
      "We create compelling visual identities and communication designs that help brands stand out, connect with their audiences, and communicate their value effectively.",
    href: "/services/graphic-design",
  },
  {
    Icon: Code2,
    title: "Web & App Development",
    description:
      "We design and develop modern, responsive websites and mobile applications that deliver seamless user experiences and support business objectives.",
    href: "/services/website-development",
  },
  {
    Icon: Megaphone,
    title: "Digital Marketing & Growth",
    description:
      "We help businesses increase their online visibility, reach the right audience, generate qualified leads, and build sustainable digital growth through strategic marketing.",
    href: "/services/digital-marketing",
  },
] as const;

const whyPoints = [
  {
    Icon: Compass,
    title: "Strategy Before Execution",
    description:
      "Every solution starts with understanding your business, audience, and objectives.",
  },
  {
    Icon: Sparkles,
    title: "Creativity With Purpose",
    description:
      "We combine compelling design with clear communication and business goals.",
  },
  {
    Icon: Cpu,
    title: "Technology That Works",
    description:
      "We build practical, scalable digital experiences designed around user needs.",
  },
  {
    Icon: TrendingUp,
    title: "Growth-Focused Marketing",
    description:
      "We focus on strategies that improve visibility, engagement, and lead generation.",
  },
  {
    Icon: Layers,
    title: "One Integrated Partner",
    description:
      "Design, development, and marketing work together under one strategic direction.",
  },
] as const;

const approachSteps = [
  {
    step: "01",
    title: "Discover",
    icon: Search,
    description:
      "Understand your business, challenges, audience, and goals.",
  },
  {
    step: "02",
    title: "Strategize",
    icon: Map,
    description:
      "Develop a clear roadmap aligned with your business objectives.",
  },
  {
    step: "03",
    title: "Create",
    icon: PenTool,
    description:
      "Transform ideas into compelling designs and functional digital experiences.",
  },
  {
    step: "04",
    title: "Launch",
    icon: Rocket,
    description:
      "Deliver solutions with a focus on quality, usability, and performance.",
  },
  {
    step: "05",
    title: "Grow",
    icon: TrendingUp,
    description:
      "Continuously identify opportunities to improve visibility, engagement, and business results.",
  },
] as const;

export function About() {
  return (
    <>
      <SEO
        title="About MovoX | Design, Development & Digital Marketing"
        description="MovoX is a digital growth company focused on helping businesses build stronger brands and more effective digital experiences. Learn about our mission, vision and values."
        path="/about"
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
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[90%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                ]}
              />
            </div>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                About MovoX
              </span>
            </motion.div>

            <motion.h1
              className="text-white mb-6 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              We Design. We Develop.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                We Drive Growth
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-blue-100/80 text-lg max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              MovoX is a digital growth company that helps businesses build a
              powerful brand presence, create meaningful digital experiences,
              and accelerate business growth through creative design, modern
              technology, and strategic digital marketing.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== Intro ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto space-y-6 text-lg text-text-secondary leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.p variants={fadeUp}>
              We bring together creativity, technology, and marketing to help
              businesses transform their ideas into impactful digital solutions.
              From building a distinctive brand identity to developing
              high-performing websites and executing result-driven marketing
              campaigns, we help businesses establish their presence and grow in
              an increasingly digital world.
            </motion.p>
            <motion.p variants={fadeUp}>
              At MovoX, we believe that{" "}
              <strong className="text-text-primary font-semibold">
                great design attracts attention
              </strong>
              ,{" "}
              <strong className="text-text-primary font-semibold">
                smart technology creates opportunities
              </strong>
              , and{" "}
              <strong className="text-text-primary font-semibold">
                strategic marketing turns those opportunities into growth
              </strong>
              .
            </motion.p>
            <motion.p variants={fadeUp}>
              We work with startups, small businesses, growing brands, and
              established companies to deliver digital solutions tailored to
              their goals, audiences, and ambitions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== What We Do ===== */}
      <section className="py-20 md:py-24 bg-bg-soft relative overflow-hidden">
        <div
          className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary-subtle blur-[130px] opacity-50 pointer-events-none"
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  What We Do
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="leading-tight">
                Three disciplines,{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  one direction
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
              {whatWeDo.map(({ Icon, title, description, href }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Link
                    to={href}
                    className="group block h-full p-8 rounded-card-lg bg-white border border-border-default hover:border-primary/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-button bg-primary-light text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-6">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore service
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Mission & Vision ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {/* Mission */}
              <motion.div
                variants={fadeUp}
                className="relative p-9 rounded-card-lg bg-navy text-white overflow-hidden"
              >
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/30 blur-[70px] pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-button bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white mb-6">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
                    Our Mission
                  </p>
                  <p className="text-lg leading-relaxed text-white/85">
                    To empower businesses with creative, technology-driven, and
                    marketing-focused digital solutions that simplify
                    challenges, unlock opportunities, and accelerate growth.
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                variants={fadeUp}
                className="relative p-9 rounded-card-lg bg-bg-soft border border-border-default overflow-hidden"
              >
                <div
                  className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-primary-subtle blur-[70px] pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm mb-6">
                    <Eye className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
                    Our Vision
                  </p>
                  <p className="text-lg leading-relaxed text-text-secondary">
                    To become a trusted digital growth partner for businesses
                    worldwide by combining creative excellence, technological
                    innovation, and measurable marketing strategies.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Why MovoX ===== */}
      <section className="py-20 md:py-24 bg-bg-soft relative overflow-hidden">
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-primary-subtle blur-[140px] opacity-40 pointer-events-none"
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-default shadow-sm mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Why MovoX
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="leading-tight">
                Built on{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  five principles
                </span>
                .
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              }}
            >
              {whyPoints.map(({ Icon, title, description }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group p-7 rounded-card-lg bg-white border border-border-default hover:border-primary/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-button bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
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

      {/* ===== Our Approach ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-soft border border-border-default shadow-sm mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Our Approach
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="leading-tight">
                From idea to{" "}
                <span className="brand-gradient bg-clip-text text-transparent">
                  growth
                </span>
                .
              </motion.h2>
            </motion.div>

            {/* Desktop horizontal timeline */}
            <div className="hidden md:block relative mb-4">
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
                {approachSteps.map(({ step, title, icon: Icon, description }) => (
                  <motion.div
                    key={step}
                    variants={fadeUp}
                    className="group text-center"
                  >
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-primary/30 shadow-card mx-auto mb-5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-bg-soft border border-border-default mb-3">
                      <span className="text-[10px] font-bold tracking-widest text-primary">
                        {step}
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

            {/* Mobile vertical timeline */}
            <div className="md:hidden relative pl-12">
              <div
                className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-gradient-to-b from-primary/25 via-primary/40 to-primary/25 rounded-full"
                aria-hidden="true"
              />
              <motion.div
                className="space-y-9"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {approachSteps.map(({ step, title, icon: Icon, description }) => (
                  <motion.div key={step} variants={fadeUp} className="relative group">
                    <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-white border-2 border-primary/30 shadow-card flex items-center justify-center text-primary group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-bg-soft border border-border-default mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-primary">
                        {step}
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
          </div>
        </div>
      </section>

      {/* ===== Philosophy ===== */}
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
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8">
              <Quote className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Our Philosophy
              </span>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6"
            >
              We don't believe digital growth comes from isolated efforts. It
              happens when{" "}
              <span
                className="bg-clip-text text-transparent font-semibold"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                design, technology, and marketing work together
              </span>
              .
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-blue-100/80 leading-relaxed mb-10"
            >
              That's why MovoX brings these disciplines into one integrated
              approach, helping businesses move from ideas to execution and from
              execution to growth.
            </motion.p>

            <motion.div variants={fadeUp}>
              <p className="text-lg font-heading font-bold text-white mb-8">
                MovoX —{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                  }}
                >
                  Digital Growth. Built Around Your Business.
                </span>
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/start-a-project"
                className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-button bg-white text-navy font-semibold hover:bg-blue-50 transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-button border border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
