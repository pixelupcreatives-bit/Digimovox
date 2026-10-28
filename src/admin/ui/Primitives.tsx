import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card-lg border border-border-default bg-white shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border-default px-6 py-5">
      <div>
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "danger" | "neutral";
}) {
  const accents = {
    primary: "bg-primary-light text-primary",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger: "bg-error-bg text-error",
    neutral: "bg-bg-soft text-text-secondary",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl font-bold text-text-primary mt-1.5">{value}</p>
          {hint && <p className="text-xs text-text-muted mt-1.5">{hint}</p>}
        </div>
        {icon && (
          <span
            className={cn(
              "flex-shrink-0 w-11 h-11 rounded-button flex items-center justify-center",
              accents[accent],
            )}
          >
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export type BadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "navy";

const badgeTones: Record<BadgeTone, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-error-bg text-error",
  neutral: "bg-bg-soft text-text-secondary",
  navy: "bg-navy-light text-navy",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTones: Record<string, BadgeTone> = {
  // lead status
  new: "primary",
  contacted: "navy",
  qualified: "success",
  proposal: "warning",
  won: "success",
  lost: "danger",
  // project status
  planning: "neutral",
  "in-progress": "primary",
  review: "warning",
  delivered: "success",
  "on-hold": "neutral",
  // agreement
  draft: "neutral",
  sent: "primary",
  signed: "success",
  expired: "danger",
  // invoice
  paid: "success",
  overdue: "danger",
  void: "neutral",
  // quotation
  accepted: "success",
  rejected: "danger",
  // generic
  active: "success",
  inactive: "neutral",
  income: "success",
  forecast: "warning",
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const tone = statusTones[status] ?? "neutral";
  const text = label ?? status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return <Badge tone={tone}>{text}</Badge>;
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-button bg-bg-soft flex items-center justify-center text-text-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form modal (create / edit scaffolding)                              */
/* ------------------------------------------------------------------ */

export function FormModal({
  open,
  onClose,
  title,
  description,
  submitLabel = "Save",
  isSubmitting,
  onSubmit,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {children}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-button border border-border-default text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "btn-gradient px-5 py-2.5 rounded-button text-white font-semibold text-sm disabled:opacity-60",
            )}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Toggle                                                              */
/* ------------------------------------------------------------------ */

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2.5",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
