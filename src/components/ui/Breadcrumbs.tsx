import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const location = useLocation();

  const crumbs = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const active = !isLast && location.pathname === item.href;
    return (
      <li key={item.label} className="flex items-center">
        {!isLast && <ChevronRight className="w-3 h-3 mx-2 text-text-muted" />}
        <a
          href={item.href}
          className={cn(
            "text-sm text-text-secondary transition-colors",
            isLast ? "text-text-primary font-medium" : active ? "text-primary" : "",
          )}
        >
          {item.label}
        </a>
      </li>
    );
  });

  return (
    <nav
      className="flex flex-wrap items-center gap-1 text-xs text-text-muted"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-1">{crumbs}</ol>
    </nav>
  );
}
