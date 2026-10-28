import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  steps: string[];
  current: number;
  /** Furthest step reached — used to enable jumping back to completed steps. */
  maxReached: number;
  onJump: (index: number) => void;
}

/**
 * Dynamic progress indicator for the wizard.
 *
 * - Shows a proportional bar plus a numbered step list on desktop.
 * - Completed steps are clickable so users can revisit answers.
 * - Exposes an accessible <progress> semantics via aria attributes.
 */
export function WizardProgress({
  steps,
  current,
  maxReached,
  onJump,
}: WizardProgressProps) {
  const pct = Math.round(((current + 1) / steps.length) * 100);

  return (
    <nav aria-label="Project form progress" className="w-full">
      {/* Bar (all viewports) */}
      <div className="relative h-1.5 w-full rounded-full bg-navy-light overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 brand-gradient rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
        <span>
          Step <span className="font-semibold text-text-primary">{current + 1}</span> of{" "}
          {steps.length}
        </span>
        <span className="font-semibold text-primary">{pct}% complete</span>
      </div>

      {/* Step list (desktop) */}
      <ol className="mt-6 hidden md:flex flex-wrap gap-x-1.5 gap-y-2">
        {steps.map((label, i) => {
          const isCurrent = i === current;
          const isDone = i < current;
          const canJump = i <= maxReached && !isCurrent;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!canJump}
                onClick={() => canJump && onJump(i)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-semibold transition-all duration-200",
                  isCurrent &&
                    "border-primary bg-primary-light text-primary",
                  isDone &&
                    "border-border-default bg-white text-text-secondary hover:border-primary/50 hover:text-primary",
                  !isCurrent &&
                    !isDone &&
                    "border-border-default bg-bg-soft text-text-muted",
                  canJump && "cursor-pointer",
                  !canJump && !isCurrent && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    isCurrent && "bg-primary text-white",
                    isDone && "bg-primary/15 text-primary",
                    !isCurrent && !isDone && "bg-white text-text-muted border border-border-default",
                  )}
                >
                  {isDone ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
