import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Calendar, FileText, Anchor } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "definitions", label: "2. Definitions" },
  { id: "data-we-collect", label: "3. Personal Data We Collect" },
  { id: "how-collected", label: "4. How We Collect Data" },
  { id: "purpose", label: "5. Purpose of Processing" },
  { id: "legal-basis", label: "6. Legal Basis" },
  { id: "sharing", label: "7. Data Sharing" },
  { id: "retention", label: "8. Data Retention" },
  { id: "security", label: "9. Data Security" },
  { id: "rights", label: "10. Your Rights" },
  { id: "cookies", label: "11. Cookies" },
  { id: "children", label: "12. Children's Privacy" },
  { id: "transfers", label: "13. International Transfers" },
  { id: "changes", label: "14. Changes" },
  { id: "contact", label: "15. Contact" },
  { id: "annexure-a", label: "Annexure A — Data Categories" },
  { id: "annexure-b", label: "Annexure B — Cookies" },
  { id: "annexure-c", label: "Annexure C — Processors" },
  { id: "annexure-d", label: "Annexure D — Rights Matrix" },
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

export function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | MovoX"
        description="MovoX Privacy Policy — how we collect, use, store and protect your personal data, your rights, and detailed annexure policies."
        path="/policies/privacy"
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
                  { label: "Policies", href: "/policies/privacy" },
                  { label: "Privacy Policy", href: "/policies/privacy" },
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
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Legal
                </p>
                <span className="text-sm font-semibold text-white">
                  Privacy Policy
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-white mb-5 leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Privacy{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #2382B8 100%)",
                }}
              >
                Policy
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
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                <Clause id="introduction" n="1" title="Introduction">
                  <p>
                    MovoX ("we", "us", "our") is committed to protecting your
                    privacy. This Privacy Policy explains how we collect, use,
                    disclose and safeguard your information when you visit our
                    website https://www.heymovox.com ("the Site") or engage our
                    services.
                  </p>
                  <p>
                    By using the Site or submitting your information through
                    our forms, you agree to the practices described in this
                    Policy and its Annexures.
                  </p>
                </Clause>

                <Clause id="definitions" n="2" title="Definitions">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">Personal Data</strong>{" "}
                      — any information that identifies a living individual,
                      such as your name, email address or phone number.
                    </li>
                    <li>
                      <strong className="text-text-primary">Processing</strong> —
                      any operation performed on Personal Data, including
                      collection, storage, use and deletion.
                    </li>
                    <li>
                      <strong className="text-text-primary">Data Subject</strong>{" "}
                      — the individual to whom the Personal Data relates.
                    </li>
                    <li>
                      <strong className="text-text-primary">Processor</strong> —
                      a third party that processes Personal Data on our behalf.
                    </li>
                  </ul>
                </Clause>

                <Clause id="data-we-collect" n="3" title="Personal Data We Collect">
                  <p>We may collect the following categories of Personal Data:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">Identity data</strong>{" "}
                      — full name.
                    </li>
                    <li>
                      <strong className="text-text-primary">Contact data</strong>{" "}
                      — email address, phone number.
                    </li>
                    <li>
                      <strong className="text-text-primary">Business data</strong>{" "}
                      — company or brand name, role, industry.
                    </li>
                    <li>
                      <strong className="text-text-primary">Project data</strong>{" "}
                      — budget range, timeline, service interests and project
                      details you voluntarily provide.
                    </li>
                    <li>
                      <strong className="text-text-primary">Technical data</strong>{" "}
                      — IP address, browser type, device information and pages
                      visited, collected automatically through analytics tools.
                    </li>
                  </ul>
                  <p>
                    See <a href="#annexure-a" className="text-primary hover:underline">Annexure A</a> for
                    the full data category matrix.
                  </p>
                </Clause>

                <Clause id="how-collected" n="4" title="How We Collect Data">
                  <p>We collect Personal Data through:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Contact, enquiry and project forms submitted on the Site.</li>
                    <li>Direct communications such as email and phone calls.</li>
                    <li>
                      Automatic technical collection via cookies and analytics
                      tools (see <a href="#annexure-b" className="text-primary hover:underline">Annexure B</a>).
                    </li>
                    <li>
                      Third-party sources such as business directories, only
                      where you have consented or it is otherwise lawful.
                    </li>
                  </ul>
                </Clause>

                <Clause id="purpose" n="5" title="Purpose of Processing">
                  <p>We process Personal Data for the following purposes:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>To respond to your enquiries and provide requested information.</li>
                    <li>To prepare proposals, scope projects and deliver agreed services.</li>
                    <li>To communicate with you about active projects and support.</li>
                    <li>To improve the Site, its content and user experience.</li>
                    <li>To maintain business records and comply with legal obligations.</li>
                    <li>
                      To send occasional service-related or marketing
                      communications, where you have consented. You may opt out
                      at any time.
                    </li>
                  </ul>
                </Clause>

                <Clause id="legal-basis" n="6" title="Legal Basis for Processing">
                  <p>
                    Where applicable data protection law requires a legal basis,
                    we rely on one or more of the following:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">Consent</strong> — where
                      you have given clear consent for a specific purpose.
                    </li>
                    <li>
                      <strong className="text-text-primary">Contract</strong> — where
                      processing is necessary to perform a contract with you or
                      to take pre-contractual steps.
                    </li>
                    <li>
                      <strong className="text-text-primary">Legitimate interests</strong>{" "}
                      — where processing is necessary for our legitimate
                      business interests, balanced against your rights.
                    </li>
                    <li>
                      <strong className="text-text-primary">Legal obligation</strong>{" "}
                      — where we must comply with applicable law.
                    </li>
                  </ul>
                </Clause>

                <Clause id="sharing" n="7" title="Data Sharing">
                  <p>
                    We do not sell, rent or trade your Personal Data. We may
                    share your data with:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">Service providers</strong>{" "}
                      — hosting, analytics, email and communication tools that
                      process data on our behalf under confidentiality
                      obligations.
                    </li>
                    <li>
                      <strong className="text-text-primary">Professional advisers</strong>{" "}
                      — legal, accounting or auditing professionals where
                      necessary.
                    </li>
                    <li>
                      <strong className="text-text-primary">Authorities</strong> — where
                      required by law, regulation or court order.
                    </li>
                  </ul>
                  <p>
                    See <a href="#annexure-c" className="text-primary hover:underline">Annexure C</a> for
                    our current processor categories.
                  </p>
                </Clause>

                <Clause id="retention" n="8" title="Data Retention">
                  <p>
                    We retain Personal Data only for as long as necessary for
                    the purposes described in this Policy, including to satisfy
                    legal, accounting or reporting requirements.
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-text-primary">Enquiry data</strong> —
                      retained for up to 24 months from last contact.
                    </li>
                    <li>
                      <strong className="text-text-primary">Project data</strong> —
                      retained for the duration of the engagement and up to 7
                      years thereafter for legal and accounting purposes.
                    </li>
                    <li>
                      <strong className="text-text-primary">Marketing consent</strong> —
                      retained until you withdraw consent.
                    </li>
                    <li>
                      <strong className="text-text-primary">Analytics data</strong> —
                      retained per the tool's configured retention period.
                    </li>
                  </ul>
                </Clause>

                <Clause id="security" n="9" title="Data Security">
                  <p>
                    We implement appropriate technical and organisational
                    measures to protect Personal Data against unauthorised
                    access, alteration, disclosure or destruction. These
                    measures include access controls, encrypted transport (HTTPS),
                    reputable hosting providers and staff confidentiality
                    obligations.
                  </p>
                  <p>
                    No method of transmission over the Internet is completely
                    secure. While we strive to protect your data, we cannot
                    guarantee absolute security.
                  </p>
                </Clause>

                <Clause id="rights" n="10" title="Your Rights">
                  <p>
                    Subject to applicable law, you may have the right to:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Access the Personal Data we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your data, subject to legal retention requirements.</li>
                    <li>Object to or restrict certain processing.</li>
                    <li>Withdraw consent at any time, without affecting prior lawful processing.</li>
                    <li>Lodge a complaint with a supervisory authority.</li>
                  </ul>
                  <p>
                    See <a href="#annexure-d" className="text-primary hover:underline">Annexure D</a> for
                    the full rights matrix.
                  </p>
                </Clause>

                <Clause id="cookies" n="11" title="Cookies">
                  <p>
                    The Site may use cookies and similar technologies to
                    remember preferences, analyse traffic and improve
                    functionality. You can control cookies through your browser
                    settings. Disabling certain cookies may affect Site
                    functionality.
                  </p>
                  <p>
                    For the full cookie schedule, see{" "}
                    <a href="#annexure-b" className="text-primary hover:underline">Annexure B</a>.
                  </p>
                </Clause>

                <Clause id="children" n="12" title="Children's Privacy">
                  <p>
                    The Site and our services are directed at businesses and
                    professionals. We do not knowingly collect Personal Data
                    from children under 18. If you believe a child has provided
                    us with data, contact us and we will delete it.
                  </p>
                </Clause>

                <Clause id="transfers" n="13" title="International Transfers">
                  <p>
                    We may process data in countries other than your own,
                    including through cloud hosting and analytics providers.
                    Where such transfers occur, we take reasonable steps to
                    ensure an adequate level of protection consistent with this
                    Policy.
                  </p>
                </Clause>

                <Clause id="changes" n="14" title="Changes to This Policy">
                  <p>
                    We may update this Privacy Policy from time to time. The
                    "Effective" date at the top of this page reflects the latest
                    revision. Material changes will be highlighted on this page.
                    Continued use of the Site after changes constitutes
                    acceptance of the updated Policy.
                  </p>
                </Clause>

                <Clause id="contact" n="15" title="Contact Us">
                  <p>
                    For questions, requests or complaints regarding this Privacy
                    Policy or your Personal Data, contact us through the details
                    on our{" "}
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
                  title="Data Category Matrix"
                  intro="This annexure details each category of Personal Data we process, its source, purpose and retention period."
                >
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full text-xs border border-border-default rounded-button overflow-hidden">
                      <thead className="bg-bg-soft">
                        <tr>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Category</th>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Examples</th>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Source</th>
                          <th className="text-left font-bold text-text-primary px-4 py-3">Retention</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-default bg-white">
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Identity</td>
                          <td className="px-4 py-3 text-text-secondary">Full name</td>
                          <td className="px-4 py-3 text-text-secondary">You</td>
                          <td className="px-4 py-3 text-text-secondary">24 months</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Contact</td>
                          <td className="px-4 py-3 text-text-secondary">Email, phone</td>
                          <td className="px-4 py-3 text-text-secondary">You</td>
                          <td className="px-4 py-3 text-text-secondary">24 months</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Business</td>
                          <td className="px-4 py-3 text-text-secondary">Company, industry</td>
                          <td className="px-4 py-3 text-text-secondary">You</td>
                          <td className="px-4 py-3 text-text-secondary">Project + 7 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Project</td>
                          <td className="px-4 py-3 text-text-secondary">Budget, timeline, details</td>
                          <td className="px-4 py-3 text-text-secondary">You</td>
                          <td className="px-4 py-3 text-text-secondary">Project + 7 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-text-primary">Technical</td>
                          <td className="px-4 py-3 text-text-secondary">IP, browser, pages</td>
                          <td className="px-4 py-3 text-text-secondary">Automatic</td>
                          <td className="px-4 py-3 text-text-secondary">Per tool config</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Annexure>

                <Annexure
                  id="annexure-b"
                  label="Annexure B"
                  title="Cookie Schedule"
                  intro="This annexure lists the categories of cookies and similar technologies used on the Site."
                >
                  <div className="space-y-4">
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Strictly Necessary Cookies
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Required for core Site functionality such as security,
                        network management and accessibility. These cannot be
                        switched off.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Analytics Cookies
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Help us understand how visitors interact with the Site
                        by collecting anonymous information such as pages
                        visited and time spent. Data is aggregated and cannot be
                        used to identify you.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-2">
                        Preference Cookies
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Remember choices such as language or region to provide
                        a more personalised experience.
                      </p>
                    </div>
                    <p className="text-xs text-text-muted">
                      You can manage or disable cookies through your browser
                      settings. Disabling cookies may affect Site
                      functionality.
                    </p>
                  </div>
                </Annexure>

                <Annexure
                  id="annexure-c"
                  label="Annexure C"
                  title="Processor Categories"
                  intro="This annexure lists the categories of third-party processors that may handle Personal Data on our behalf. Each is bound by confidentiality and data protection obligations."
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-1">
                        Website Hosting
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Cloud hosting providers storing Site data securely.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-1">
                        Analytics
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Web analytics tools processing anonymous usage data.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-1">
                        Email &amp; Communication
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Email delivery and communication platforms.
                      </p>
                    </div>
                    <div className="p-5 rounded-button bg-white border border-border-default">
                      <h4 className="text-sm font-bold text-text-primary mb-1">
                        Business Tools
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Project management, accounting and collaboration tools.
                      </p>
                    </div>
                  </div>
                </Annexure>

                <Annexure
                  id="annexure-d"
                  label="Annexure D"
                  title="Data Subject Rights Matrix"
                  intro="This annexure explains each of your rights, what it means in practice, and how to exercise it."
                >
                  <div className="space-y-3">
                    {[
                      {
                        right: "Right of Access",
                        detail:
                          "Request a copy of the Personal Data we hold about you and information about how it is processed.",
                      },
                      {
                        right: "Right to Rectification",
                        detail:
                          "Request correction of inaccurate or incomplete Personal Data.",
                      },
                      {
                        right: "Right to Erasure",
                        detail:
                          "Request deletion of your Personal Data, subject to legal retention requirements.",
                      },
                      {
                        right: "Right to Restriction",
                        detail:
                          "Request that we limit how we use your Personal Data in certain circumstances.",
                      },
                      {
                        right: "Right to Object",
                        detail:
                          "Object to processing based on legitimate interests or for direct marketing purposes.",
                      },
                      {
                        right: "Right to Withdraw Consent",
                        detail:
                          "Withdraw consent at any time where processing is based on consent, without affecting prior lawful processing.",
                      },
                      {
                        right: "Right to Lodge a Complaint",
                        detail:
                          "Complain to the relevant supervisory authority if you believe your data protection rights have been infringed.",
                      },
                    ].map((r) => (
                      <div
                        key={r.right}
                        className="flex gap-4 p-4 rounded-button bg-white border border-border-default"
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="text-sm font-bold text-text-primary mb-1">
                            {r.right}
                          </p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {r.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-text-muted pt-2">
                      To exercise any of these rights, contact us via the{" "}
                      <Link to="/contact" className="text-primary hover:underline">
                        contact page
                      </Link>
                      .
                    </p>
                  </div>
                </Annexure>
              </motion.div>

              {/* Footer nav */}
              <div className="mt-14 pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-text-muted">
                  Last updated: 25 October 2026 · Version 2.7.50
                </p>
                <Link
                  to="/policies/terms"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
                >
                  Read our Terms of Service
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
