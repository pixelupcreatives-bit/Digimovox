import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  Image,
  Layers,
  Code2,
  Smartphone,
  Megaphone,
} as const;

const megaContent: Record<
  string,
  { icon: keyof typeof iconMap; description: string }
> = {
  "Graphic Design": {
    icon: "Image",
    description: "Visual design that makes your brand memorable",
  },
  "Branding & Packaging": {
    icon: "Layers",
    description: "Identity systems and packaging that stand out",
  },
  "Website Development": {
    icon: "Code2",
    description: "Fast, responsive websites built for business",
  },
  "App Development": {
    icon: "Smartphone",
    description: "Mobile apps designed around your users",
  },
  "Digital Marketing": {
    icon: "Megaphone",
    description: "Strategic marketing that drives real growth",
  },
};

interface NavDropdownProps {
  item: NavItem;
  active?: boolean;
}

export function NavDropdown({ item, active }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <Link
        to={item.href}
        className={cn(
          "relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
          active ? "text-primary" : "text-text-secondary hover:text-primary",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />

        {/* Animated underline */}
        <span
          className={cn(
            "absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </Link>

      {isOpen && item.items && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50">
          <div className="w-[520px] bg-white border border-border-default rounded-card-lg shadow-card-hover overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header strip */}
            <div className="px-6 pt-5 pb-4 border-b border-border-default bg-bg-soft/50">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1">
                Our Services
              </p>
              <p className="text-xs text-text-muted">
                Design, development and marketing under one roof.
              </p>
            </div>

            {/* Service items */}
            <div className="p-3">
              {item.items.map((sub) => {
                const meta = megaContent[sub.label];
                const Icon = meta ? iconMap[meta.icon] : Layers;

                return (
                  <Link
                    key={sub.label}
                    to={sub.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 px-4 py-3 rounded-button hover:bg-bg-soft transition-colors"
                  >
                    <span className="flex-shrink-0 w-11 h-11 rounded-button bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {sub.label}
                      </span>
                      {meta && (
                        <span className="block text-xs text-text-muted mt-0.5 truncate">
                          {meta.description}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-border-default bg-bg-soft/50 flex items-center justify-between">
              <Link
                to="/services"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all services
              </Link>
              <Link
                to="/start-a-project"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
              >
                Get a custom quote
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
