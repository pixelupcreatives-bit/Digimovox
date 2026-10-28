import { Link } from "react-router-dom";
import {
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Globe,
  ChevronUp,
} from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { footerNavigation } from "@/data/navigation";

const socialLinks = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "twitter", Icon: Twitter, label: "X (Twitter)" },
] as const;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
        {children}
      </h3>
      <div className="mt-2.5 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  type ContactLink = {
    Icon: React.ElementType;
    label: string;
    href: string | undefined;
  };

  const contactLinks: ContactLink[] = [
    siteConfig.email && {
      Icon: Mail,
      label: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    siteConfig.phone && {
      Icon: Phone,
      label: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    },
    siteConfig.address && {
      Icon: MapPin,
      label: siteConfig.address,
      href: undefined,
    },
  ].filter(Boolean) as unknown as ContactLink[];

  const hasContact = contactLinks.length > 0;

  return (
    <footer className="relative bg-navy text-white overflow-hidden">
      {/* Decorative glow + grid */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70%] h-[60%] rounded-full bg-primary/20 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ===== Top CTA strip ===== */}
      <div className="relative border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
                Ready when you are
              </p>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                Let's discuss what you want to achieve.
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/start-a-project"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-button bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-all duration-300 shadow-[0_6px_20px_rgba(35,130,184,0.35)] hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-button border border-white/25 bg-white/5 text-white font-semibold text-sm backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main footer ===== */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
            {/* Brand column */}
            <div className="lg:col-span-5">
              <img
                src="/logo-white.png"
                alt="MovoX"
                className="h-10 w-auto mb-5 block"
              />
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-7">
                {siteConfig.tagline}. A digital growth agency combining creative
                design, branding, website development, app development and
                digital marketing to help businesses strengthen their digital
                presence.
              </p>

              {/* Markets note */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-7">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-white/70">
                  Serving India &amp; international markets
                </span>
              </div>

              {/* Socials */}
              <div className="flex gap-3">
                {socialLinks.map(({ key, Icon, label }) => {
                  const url = siteConfig.social[key];
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-button border border-white/15 bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Services column */}
            <div className="lg:col-span-3">
              <ColumnHeading>Services</ColumnHeading>
              <ul className="space-y-3.5">
                {footerNavigation.services.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div className="lg:col-span-2">
              <ColumnHeading>Company</ColumnHeading>
              <ul className="space-y-3.5">
                {footerNavigation.company.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div className="lg:col-span-2">
              <ColumnHeading>Contact</ColumnHeading>

              {hasContact ? (
                <ul className="space-y-3.5 mb-6">
                  {contactLinks.map(({ Icon, label, href }, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {href ? (
                        <a
                          href={href}
                          className="text-white/60 text-sm hover:text-white transition-colors leading-snug"
                        >
                          {label}
                        </a>
                      ) : (
                        <span className="text-white/60 text-sm leading-snug">
                          {label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Have a question or a project in mind? We'd love to hear from
                  you.
                </p>
              )}

              <Link
                to="/start-a-project"
                className="group inline-flex items-center gap-2 text-primary text-sm font-semibold hover:text-white transition-colors"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ===== Bottom bar ===== */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-xs text-white/45">
              <p>
                © {currentYear} {siteConfig.name}. All rights reserved.
              </p>
              <span className="hidden sm:inline w-px h-3 bg-white/20" />
              <p className="text-white/35">
                Genuine client work is published only with permission.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <Link
                to="/policies/privacy"
                className="text-white/55 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="w-px h-3 bg-white/20" />
              <Link
                to="/policies/terms"
                className="text-white/55 hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </Link>
              <span className="hidden sm:inline w-px h-3 bg-white/20" />
              <Link
                to="/admin"
                className="text-white/55 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <span className="hidden sm:inline w-px h-3 bg-white/20" />
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="w-8 h-8 rounded-button border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-white transition-all"
                aria-label="Back to top"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
