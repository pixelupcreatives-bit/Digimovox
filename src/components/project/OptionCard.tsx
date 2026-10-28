import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/enquiryIcons";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  multi?: boolean;
  onSelect: () => void;
  className?: string;
}

/**
 * Accessible selectable card used across the wizard for goals, business types,
 * budgets, timelines and contact methods. Renders as a real <button> so it is
 * keyboard-focusable and activatable with Enter/Space, and reflects state via
 * aria-pressed for screen readers.
 */
export const OptionCard = forwardRef<HTMLButtonElement, OptionCardProps>(
  ({ label, description, icon, selected, multi, onSelect, className }, ref) => {
    const Icon = icon ? getIcon(icon) : undefined;
    return (
      <button
        ref={ref}
        type="button"
        role={multi ? "checkbox" : "radio"}
        aria-checked={selected}
        aria-pressed={multi ? selected : undefined}
        onClick={onSelect}
        className={cn(
          "group relative flex w-full items-start gap-3.5 rounded-card-lg border p-4 text-left transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          selected
            ? "border-primary bg-primary-light shadow-[0_0_0_1px_rgba(35,130,184,0.5)]"
            : "border-border-default bg-white hover:border-primary/50 hover:bg-primary-subtle/60",
          className,
        )}
      >
        {Icon && (
          <span
            className={cn(
              "flex-shrink-0 w-11 h-11 rounded-button flex items-center justify-center border transition-colors duration-200",
              selected
                ? "bg-primary text-white border-primary"
                : "bg-bg-soft text-primary border-border-default group-hover:border-primary/40",
            )}
          >
            <Icon className="w-5 h-5" />
          </span>
        )}

        <span className="min-w-0 flex-1 pr-6">
          <span className="block text-sm font-semibold text-text-primary leading-snug">
            {label}
          </span>
          {description && (
            <span className="block mt-1 text-xs text-text-muted leading-relaxed">
              {description}
            </span>
          )}
        </span>

        {/* Selection indicator */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-3.5 right-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            selected
              ? "bg-primary border-primary scale-100"
              : "border-border-strong bg-white scale-90 group-hover:border-primary/50",
          )}
        >
          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
      </button>
    );
  },
);

OptionCard.displayName = "OptionCard";
