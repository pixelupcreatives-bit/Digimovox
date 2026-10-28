import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Mail,
  Phone,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
  Home,
  Briefcase,
  Newspaper,
  Tag,
  Users,
  MessageSquare,
} from "lucide-react";
import { mainNavigation, ctaLink } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/* Map nav labels to icons */
const navIcons: Record<string, React.ElementType> = {
  Home,
  Services: Layers,
  Work: Briefcase,
  Insights: Newspaper,
  Pricing: Tag,
  About: Users,
  Contact: MessageSquare,
};

const serviceIcons: Record<string, React.ElementType> = {
  "Graphic Design": Image,
  "Branding & Packaging": Layers,
  "Website Development": Code2,
  "App Development": Smartphone,
  "Digital Marketing": Megaphone,
};

const socialLinks = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "twitter", Icon: Twitter, label: "X" },
] as const;

export function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(isOpen);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(isOpen);
    if (isOpen) {
      setServicesOpen(location.pathname.startsWith("/services"));
    }
  }, [isOpen, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!menuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[380px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-border-default bg-white shrink-0">
          <img src="/logo.png" alt="MovoX" className="h-8 w-auto" />
          <button
            onClick={onClose}
            className="relative w-10 h-10 rounded-button bg-bg-soft text-text-secondary hover:bg-primary hover:text-white transition-colors flex items-center justify-center group"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <nav className="space-y-1">
            {mainNavigation.map((item, idx) => {
              const Icon = navIcons[item.label] ?? Sparkles;
              const active =
                location.pathname === item.href ||
                (item.href !== "/" &&
                  location.pathname.startsWith(item.href + "/"));

              /* Services — accordion */
              if (item.items) {
                return (
                  <div key={item.label} className="mb-1">
                    <div
                      className={cn(
                        "flex items-center rounded-button transition-colors",
                        active
                          ? "bg-primary-light"
                          : "hover:bg-bg-soft",
                      )}
                    >
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex-1 flex items-center gap-3.5 px-4 py-3.5"
                      >
                        <span
                          className={cn(
                            "w-9 h-9 rounded-button flex items-center justify-center flex-shrink-0 transition-colors",
                            active
                              ? "bg-primary text-white"
                              : "bg-bg-soft text-primary",
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span
                          className={cn(
                            "text-base font-medium",
                            active ? "text-primary" : "text-text-primary",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                      <button
                        onClick={() => setServicesOpen((v) => !v)}
                        className="p-3.5 text-text-muted hover:text-primary transition-colors"
                        aria-label="Toggle services submenu"
                        aria-expanded={servicesOpen}
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            servicesOpen && "rotate-180 text-primary",
                          )}
                        />
                      </button>
                    </div>

                    {/* Submenu with grid animation */}
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        servicesOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-6 mt-1 mb-2 pl-4 border-l-2 border-primary/30 space-y-0.5">
                          {item.items.map((sub) => {
                            const SubIcon =
                              serviceIcons[sub.label] ?? Layers;
                            const subActive = location.pathname === sub.href;
                            return (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2.5 text-sm rounded-button transition-colors",
                                  subActive
                                    ? "bg-primary-light text-primary font-semibold"
                                    : "text-text-secondary hover:text-primary hover:bg-bg-soft",
                                )}
                              >
                                <SubIcon className="w-4 h-4 flex-shrink-0" />
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* Regular links with staggered fade-in */
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-button text-base font-medium transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300",
                    active
                      ? "bg-primary-light text-primary"
                      : "text-text-primary hover:bg-bg-soft hover:text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "w-9 h-9 rounded-button flex items-center justify-center flex-shrink-0 transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "bg-bg-soft text-primary",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 h-px bg-border-default" />

          {/* Contact info */}
          <div className="space-y-3.5 px-2">
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3.5 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <span className="w-9 h-9 rounded-button bg-bg-soft text-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                {siteConfig.email}
              </a>
            )}
            {siteConfig.phone && (
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3.5 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <span className="w-9 h-9 rounded-button bg-bg-soft text-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                {siteConfig.phone}
              </a>
            )}

            <div className="flex items-center gap-3.5 text-sm text-text-muted pt-1">
              <span className="w-9 h-9 rounded-button bg-bg-soft text-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              India &amp; international markets
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-6 px-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
              Follow Us
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ key, Icon, label }) => {
                const url = (
                  siteConfig.social as Record<string, string | undefined>
                )[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-button bg-bg-soft text-text-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-5 border-t border-border-default bg-white shrink-0">
          <Link
            to={ctaLink.href}
            onClick={onClose}
            className="btn-gradient flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-button text-white font-semibold text-sm"
          >
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
