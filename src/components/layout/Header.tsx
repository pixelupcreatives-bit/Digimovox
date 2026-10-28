import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { mainNavigation, ctaLink } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Topbar } from "@/components/layout/Topbar";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,54,85,0.08)]"
            : "bg-white/80 backdrop-blur-md",
        )}
      >
        {/* Topbar — collapses on scroll */}
        <Topbar collapsed={isScrolled} />

        {/* Main nav bar */}
        <div
          className={cn(
            "border-b border-border-default transition-all duration-300",
            isScrolled && "border-transparent",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
              isScrolled ? "h-16" : "h-[72px]",
            )}
          >
            {/* Logo */}
            <div className="flex items-center gap-5">
              <button
                onClick={handleLogoClick}
                className="flex items-center shrink-0"
                aria-label="MovoX home"
              >
                <img src="/logo.png" alt="MovoX" className="h-9 w-auto" />
              </button>

              <span className="hidden lg:block w-px h-8 bg-border-default" />

              <span className="hidden lg:flex flex-col leading-none">
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-semibold">
                  Digital Growth
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">
                  Agency
                </span>
              </span>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
              {mainNavigation.map((item) => {
                if (item.items) {
                  return (
                    <NavDropdown
                      key={item.label}
                      item={item}
                      active={location.pathname.startsWith(item.href)}
                    />
                  );
                }

                const active =
                  location.pathname === item.href ||
                  (item.href !== "/" &&
                    location.pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "relative px-3 py-2 transition-colors",
                      active
                        ? "text-primary"
                        : "text-text-secondary hover:text-primary",
                    )}
                  >
                    {item.label}

                    {/* Animated underline */}
                    <span
                      className={cn(
                        "absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Phone CTA */}
              {siteConfig.phone && (
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-semibold text-text-secondary hover:text-primary hover:bg-bg-soft transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call us
                </a>
              )}

              {/* Primary CTA */}
              <Link
                to={ctaLink.href}
                className="btn-gradient group inline-flex items-center gap-2 px-7 py-3 rounded-button text-white font-semibold text-sm"
              >
                {ctaLink.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile hamburger — animated */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden relative w-11 h-11 -mr-2 rounded-button flex items-center justify-center group hover:bg-bg-soft transition-colors"
              aria-label="Open menu"
            >
              <span className="relative flex flex-col items-end gap-[5px]">
                <span className="w-6 h-[2px] bg-text-primary rounded-full group-hover:w-5 transition-all duration-300" />
                <span className="w-4 h-[2px] bg-primary rounded-full group-hover:w-6 transition-all duration-300" />
                <span className="w-6 h-[2px] bg-text-primary rounded-full group-hover:w-5 transition-all duration-300" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
