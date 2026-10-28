import {
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Globe,
  Star,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

const socialLinks = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "twitter", Icon: Twitter, label: "X" },
] as const;

const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent("MovoX Digital Growth Agency")}`;

type ContactItem = {
  Icon: React.ElementType;
  label: string;
  href: string;
};

export function Topbar({ collapsed }: { collapsed?: boolean }) {
  const contactItems: ContactItem[] = [];
  if (siteConfig.email) {
    contactItems.push({
      Icon: Mail,
      label: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    });
  }
  if (siteConfig.phone) {
    contactItems.push({
      Icon: Phone,
      label: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    });
  }

  const socialItems = socialLinks.filter(
    ({ key }) =>
      Boolean(
        (siteConfig.social as Record<string, string | undefined>)[key],
      ),
  );

  return (
    <div
      className={cn(
        "bg-navy overflow-hidden transition-all duration-300 ease-in-out",
        collapsed ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 gap-3">
          {/* ===== Left side ===== */}
          <div className="flex items-center gap-4 text-xs font-medium min-w-0">
            {/* Market indicator — full on sm+, compact on mobile */}
            <div className="flex items-center gap-2 shrink-0">
              <Globe className="w-3 h-3 text-primary" />
              <span className="text-white/90">India</span>
              <span className="hidden sm:inline w-px h-2.5 bg-white/25" />
              <span className="hidden sm:inline text-white/45">
                International
              </span>
            </div>

            <span className="hidden sm:block w-px h-3 bg-white/20" />

            {/* Contact — desktop only */}
            {contactItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="hidden md:flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
              >
                <item.Icon className="w-3 h-3" />
                {item.label}
              </a>
            ))}

            {/* Mobile-only trust message */}
            <span className="md:hidden text-white/50 truncate">
              · Digital Growth Agency
            </span>
          </div>

          {/* ===== Right side ===== */}
          <div className="flex items-center gap-4 text-xs font-medium shrink-0">
            {/* Google reviews — shortened on mobile */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
            >
              <Star className="w-3 h-3 text-primary" />
              <span className="sm:hidden">Reviews</span>
              <span className="hidden sm:inline">Reviews on Google</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {socialItems.length > 0 && (
              <>
                <span className="hidden md:block w-px h-3 bg-white/20" />
                <div className="hidden md:flex items-center gap-3">
                  {socialItems.map(({ key, Icon, label }) => {
                    const url = (
                      siteConfig.social as Record<string, string | undefined>
                    )[key] as string;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label={label}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
