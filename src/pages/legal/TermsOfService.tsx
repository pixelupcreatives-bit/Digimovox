import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Scale, Calendar, FileText, Anchor } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "definitions", label: "2. Definitions" },
  { id: "use-of-site", label: "3. Use of the Site" },
  { id: "services", label: "4. Services" },
  { id: "proposals", label: "5. Proposals & Scope" },
  { id: "pricing", label: "6. Pricing & Payment" },
  { id: "ip", label: "7. Intellectual Property" },
  { id: "client-materials", label: "8. Client Materials" },
  { id: "confidentiality", label: "9. Confidentiality" },
  { id: "third-parties", label: "10. Third-Party Services" },
  { id: "no-guarantees", label: "11. No Guarantees" },
  { id: "liability", label: "12. Limitation of Liability" },
  { id: "indemnity", label: "13. Indemnity" },
  { id: "termination", label: "14. Termination" },
  { id: "governing-law", label: "15. Governing Law" },
  { id: "changes", label: "16. Changes" },
  { id: "contact", label: "17. Contact" },
  { id: "annexure-a", label: "Annexure A — Service Scope" },
  { id: "annexure-b", label: "Annexure B — Payment Terms" },
  { id: "annexure-c", label: "Annexure C — IP Ownership" },
  { id: "annexure-d", label: "Annexure D — Acceptable Use" },
];

function Clause({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 pt-10 first:pt-0">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-9 h-9 rounded-button bg-primary-light text-primary text-sm font-bold flex items-center justify-center">
          {n}
        </span>
        <h2 className="text-xl font-bold text-text-primary leading-snug pt-1">
          {title}
        </h2>
      </div>
      <div className="pl-0 sm:pl-13 space-y-3.5 text-sm text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Annexure({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 mt-14 p-7 md:p-9 rounded-card-lg bg-bg-soft border border-border-default"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-button bg-white border border-border-default text-primary flex items-center justify-center shadow-sm">
          <Anchor className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {label}
          </p>
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-5">
        {intro}
      </p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service | MovoX"
        description="MovoX Terms of Service — the terms governing your use of our website and services, with detailed annexure policies."
        path="/policies/terms"
        noIndex
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pt-10 pb-14 md:pb-16">
        <div className="hero-grid" aria-hidden="true">
          <div
            className="hero-grid-lines"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            }}
          />
        </div>
        <div
          className="absolute -top-32 right-0 w-[45%] h-[100%] rounded-full bg-primary/25 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Policies", href: "/policies/terms" },
                  { label: "Terms of Service", href: "/policies/terms" },
                ]}
              />
            </div>

            <motion.div
              className="flex items-center gap-4 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-button bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Legal
                </p>
                <span className="text-sm font-semibold text-white">
                  Terms of Service
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-white mb-5 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Terms of{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Service
              </span>
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Effective: 25 October 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Version 2.7.50
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 md:py-16 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
            {/* TOC sidebar */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-secondary mb-4">
                  On this page
                </p>
                <nav className="space-y-1 border-l border-border-default">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block pl-4 -ml-px border-l-2 border-transparent text-xs text-text-muted hover:text-primary hover:border-primary/40 transition-colors py-1.5"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-9 max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
              >
                <Clause id="introduction" n="1" title="Introduction">
                  <p>
                    Welcome to MovoX. These Terms of Service ("Terms") govern
                    your use of our website https://www.heymovox.com ("the
                    Site") and the services we provide ("Services"). By using
                    the Site or engaging our Services, you agree to be bound by
                    these Terms.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you must
                    not use the Site or engage our Services.
                  </p>
                </Clause>

                <Clause id="definitions" n="2" title="Definitions">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">"MovoX", "we", "us", "our"</strong>{" "}
                      — the digital growth agency operating the Site.
                    </li>
                    <li>
                      <strong className="text-text-primary">"Client", "you", "your"</strong>{" "}
                      — the individual or entity engaging our Services or using
                      the Site.
                    </li>
                    <li>
                      <strong className="text-text-primary">"Services"</strong> —
                      graphic design, branding &amp; packaging, website
                      development, app development, digital marketing and
                      related services described on the Site.
                    </li>
                    <li>
                      <strong className="text-text-primary">"Proposal"</strong> — the
                      written scope, deliverables, timeline and pricing agreed
                      for a specific engagement.
                    </li>
                    <li>
                      <strong className="text-text-primary">"Deliverables"</strong> —
                      the outputs specified in a Proposal.
                    </li>
                  </ul>
                </Clause>

                <Clause id="use-of-site" n="3" title="Use of the Site">
                  <p>
                    You may use the Site for lawful purposes only. You agree not
                    to:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Use the Site in any way that violates applicable law.</li>
                    <li>
                      Attempt to interfere with, disrupt or compromise the
                      Site's operation or security.
                    </li>
                    <li>
                      Attempt to gain unauthorised access to any part of the
                      Site or its systems.
                    </li>
                    <li>
                      Scrape, harvest or collect content or data from the Site
                      without written permission.
                    </li>
                    <li>
                      Reproduce, duplicate or resell any Site content for
                      commercial purposes without permission.
                    </li>
                  </ul>
                  <p>
                    See <a href="#annexure-d" className="text-primary hover:underline">Annexure D</a> for
                    the full Acceptable Use Policy.
                  </p>
                </Clause>

                <Clause id="services" n="4" title="Services">
                  <p>
                    MovoX provides graphic design, branding &amp; packaging,
                    website development, app development and digital marketing
                    services as described on the Site and in individual
                    Proposals.
                  </p>
                  <p>
                    The descriptions, packages and pricing on the Site are
                    indicative. The specific scope, deliverables, timeline and
                    pricing for your engagement are set out in a written
                    Proposal agreed between you and MovoX.
                  </p>
                  <p>
                    See <a href="#annexure-a" className="text-primary hover:underline">Annexure A</a> for
                    the service scope schedule.
                  </p>
                </Clause>

                <Clause id="proposals" n="5" title="Proposals & Scope">
                  <p>
                    Before work begins, we prepare a Proposal setting out the
                    agreed scope, Deliverables, timeline, pricing and any
                    assumptions. A Proposal becomes binding when you approve it
                    in writing (including email) and any required advance
                    payment is received.
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Changes to an agreed scope may require a revised Proposal
                      and additional fees.
                    </li>
                    <li>
                      Any estimates outside the agreed scope are indicative
                      only.
                    </li>
                    <li>
                      Delays caused by late feedback, missing materials or
                      changed requirements may extend the timeline.
                    </li>
                  </ul>
                </Clause>

                <Clause id="pricing" n="6" title="Pricing & Payment">
                  <p>
                    Prices displayed on the Site are indicative starting prices
                    and exclude GST and any applicable taxes. Final pricing
                    depends on project scope and is confirmed in a Proposal.
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Payment terms are as set out in your Proposal or, where
                      none is stated, as set out in{" "}
                      <a href="#annexure-b" className="text-primary hover:underline">Annexure B</a>.
                    </li>
                    <li>
                      Third-party costs (hosting, domains, paid tools,
                      advertising spend, app-store fees) are additional unless
                      explicitly included in your Proposal.
                    </li>
                    <li>
                      Late payments may accrue interest and pause work until
                      payment is received.
                    </li>
                  </ul>
                </Clause>

                <Clause id="ip" n="7" title="Intellectual Property">
                  <p>
                    Unless otherwise agreed in writing:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Upon full payment, you receive the rights to the final
                      Deliverables as set out in your Proposal.
                    </li>
                    <li>
                      MovoX retains ownership of pre-existing materials,
                      frameworks, tools, methods and working files.
                    </li>
                    <li>
                      MovoX may display non-confidential Deliverables in its
                      portfolio and marketing, unless you have requested
                      otherwise in writing.
                    </li>
                    <li>
                      Source files, editable files and underlying code are
                      transferred only where explicitly included in your
                      Proposal.
                    </li>
                  </ul>
                  <p>
                    See <a href="#annexure-c" className="text-primary hover:underline">Annexure C</a> for
                    the full IP ownership schedule.
                  </p>
                </Clause>

                <Clause id="client-materials" n="8" title="Client Materials">
                  <p>
                    You are responsible for ensuring that all materials you
                    provide (text, images, brand assets, data, logins) are
                    accurate and that you have the necessary rights and
                    permissions for us to use them.
                  </p>
                  <p>
                    You agree to indemnify MovoX against claims arising from
                    materials you provide that infringe third-party rights.
                  </p>
                </Clause>

                <Clause id="confidentiality" n="9" title="Confidentiality">
                  <p>
                    Each party agrees to keep confidential any proprietary or
                    confidential information disclosed by the other party in
                    connection with an engagement, and to use it only for the
                    purposes of the engagement. This obligation does not apply
                    to information that is publicly available or independently
                    developed.
                  </p>
                </Clause>

                <Clause id="third-parties" n="10" title="Third-Party Services">
                  <p>
                    Deliverables may rely on third-party platforms, plugins,
                    APIs, hosting or tools. We are not responsible for the
                    availability, pricing, policy changes or behaviour of
                    third-party services, unless explicitly agreed otherwise in
                    your Proposal.
                  </p>
                </Clause>

                <Clause id="no-guarantees" n="11" title="No Guarantees">
                  <p>
                    MovoX does not guarantee search rankings, traffic volumes,
                    lead volumes, sales, revenue or any specific business
                    outcome. We provide professional services with reasonable
                    care and skill, following industry best practices.
                  </p>
                  <p>
                    Digital platforms and algorithms change frequently; results
                    depend on many factors outside our control.
                  </p>
                </Clause>

                <Clause id="liability" n="12" title="Limitation of Liability">
                  <p>
                    To the maximum extent permitted by law:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      MovoX's total liability arising from any engagement shall
                      not exceed the total fees paid by you for that engagement.
                    </li>
                    <li>
                      MovoX shall not be liable for indirect, incidental,
                      special, consequential or punitive damages, or for loss of
                      profits, revenue, data or business opportunity.
                    </li>
                    <li>
                      Nothing in these Terms excludes liability that cannot be
                      excluded under applicable law.
                    </li>
                  </ul>
                </Clause>

                <Clause id="indemnity" n="13" title="Indemnity">
                  <p>
                    You agree to indemnify and hold harmless MovoX against any
                    claims, damages, losses or expenses arising from: (a)
                    materials you provide; (b) your use of the Deliverables
                    beyond the agreed scope; (c) your breach of these Terms; or
                    (d) your violation of any applicable law or third-party
                    rights.
                  </p>
                </Clause>

                <Clause id="termination" n="14" title="Termination">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Either party may terminate an engagement with written
                      notice as set out in the Proposal, or where none is
                      stated, with 15 days' written notice.
                    </li>
                    <li>
                      MovoX may suspend or terminate work immediately if you
                      breach these Terms or fail to make agreed payments.
                    </li>
                    <li>
                      Upon termination, you shall pay for all work completed
                      and costs incurred up to the termination date.
                    </li>
                    <li>
                      Provisions concerning intellectual property,
                      confidentiality, indemnity and limitation of liability
                      survive termination.
                    </li>
                  </ul>
                </Clause>

                <Clause id="governing-law" n="15" title="Governing Law">
                  <p>
                    These Terms are governed by the laws of India. Any disputes
                    shall be subject to the exclusive jurisdiction of the
                    courts of India.
                  </p>
                </Clause>

                <Clause id="changes" n="16" title="Changes to These Terms">
                  <p>
                    We may update these Terms from time to time. The
                    "Effective" date at the top reflects the latest revision.
                    Material changes will be highlighted on this page. Continued
                    use of the Site or Services after changes constitutes
                    acceptance of the updated Terms.
                  </p>
                </Clause>

                <Clause id="contact" n="17" title="Contact Us">
                  <p>
                    For questions about these Terms, contact us through the
                    details on our{" "}
                    <Link to="/contact" className="text-primary hover:underline">
                      contact page
                    </Link>
                    .
                  </p>
                </Clause>

                {/* ============ ANNEXURES ============ */}

                <Annexure
                  id="annexure-a"
                  label="Annexure A"
                  title="Service Scope Schedule"
                  intro="This annexure summarises the typical scope of each service category. The specific scope for your engagement is set out in your Proposal."
                >
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full text-xs border border-border-default rounded-button overflow-hidden">
                      <thead className="bg-bg-soft">
                        <tr>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Service</th>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Typical Deliverables</th>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Typical Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-default bg-white">
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Graphic Design</td>
                          <td className="px-4 py-3 text-text-secondary">Social creatives, campaign assets, print design</td>
                          <td className="px-4 py-3 text-text-secondary">3–10 days</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Branding &amp; Packaging</td>
                          <td className="px-4 py-3 text-text-secondary">Logo, identity system, guidelines, packaging</td>
                          <td className="px-4 py-3 text-text-secondary">2–6 weeks</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Website Development</td>
                          <td className="px-4 py-3 text-text-secondary">Design, build, content integration, launch</td>
                          <td className="px-4 py-3 text-text-secondary">3–10 weeks</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">App Development</td>
                          <td className="px-4 py-3 text-text-secondary">Planning, UI/UX, development, testing, launch</td>
                          <td className="px-4 py-3 text-text-secondary">6–20 weeks</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Digital Marketing</td>
                          <td className="px-4 py-3 text-text-secondary">SEO, social, ads, content, reporting</td>
                          <td className="px-4 py-3 text-text-secondary">Monthly retainer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-text-muted">
                    Timelines are indicative and depend on scope, feedback
                    turnaround and third-party dependencies.
                  </p>
                </Annexure>

                <Annexure
                  id="annexure-b"
                  label="Annexure B"
                  title="Payment Terms Schedule"
                  intro="This annexure sets out the default payment terms that apply where your Proposal does not specify otherwise."
                >
                  <div className="space-y-3">
                    {[
                      { scope: "Small design projects", terms: "100% upfront" },
                      { scope: "Branding projects", terms: "50% advance, 50% before final delivery" },
                      { scope: "Websites", terms: "50% advance, 30% at an agreed milestone, 20% before launch" },
                      { scope: "Applications", terms: "Milestone-based payments" },
                      { scope: "Marketing retainers", terms: "Monthly advance payment" },
                    ].map((t) => (
                      <div
                        key={t.scope}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4 rounded-button bg-white border border-border-default"
                      >
                        <span className="text-sm font-medium text-text-primary">
                          {t.scope}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {t.terms}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-text-muted pt-2">
                      Invoices are payable within the period stated on the
                      invoice. Prices exclude GST and applicable taxes.
                    </p>
                  </div>
                </Annexure>

                <Annexure
                  id="annexure-c"
                  label="Annexure C"
                  title="Intellectual Property Ownership"
                  intro="This annexure details how intellectual property rights are allocated for different types of materials."
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Final Deliverables
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Upon full payment, you receive the rights to final
                        Deliverables as specified in your Proposal (usage,
                        reproduction and modification rights).
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Pre-Existing Materials
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        MovoX retains ownership of all pre-existing materials,
                        frameworks, code libraries, templates, methods and
                        tools.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Working Files
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Source and working files remain MovoX property unless
                        explicitly included in your Proposal and paid for.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Portfolio Use
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        MovoX may showcase non-confidential Deliverables in its
                        portfolio and marketing, unless you request otherwise in
                        writing before the engagement begins.
                      </p>
                    </div>
                  </div>
                </Annexure>

                <Annexure
                  id="annexure-d"
                  label="Annexure D"
                  title="Acceptable Use Policy"
                  intro="This annexure lists prohibited activities when using the MovoX website and services."
                >
                  <div className="space-y-3">
                    {[
                      "Violating any applicable law, regulation or third-party right.",
                      "Attempting to breach or circumvent Site security or access controls.",
                      "Interfering with the Site's operation, servers or networks.",
                      "Uploading malicious code, viruses or harmful content.",
                      "Impersonating any person or entity, or misrepresenting your affiliation.",
                      "Using the Site to send unsolicited communications or spam.",
                      "Scraping, harvesting or collecting data from the Site without permission.",
                      "Reproducing or commercially exploiting Site content without written permission.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-4 p-4 rounded-button bg-white border border-border-default"
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </Annexure>
              </motion.div>

              {/* Footer nav */}
              <div className="mt-14 pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-text-muted">
                  Last updated: 25 October 2026 · Version 2.7.50
                </p>
                <Link
                  to="/policies/privacy"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
                >
                  Read our Privacy Policy
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
