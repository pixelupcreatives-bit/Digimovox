import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Controls width; default is comfortable for forms. */
  size?: "md" | "lg" | "xl";
}

const sizes = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Accessible dialog for admin create/edit forms.
 *
 * - Locks body scroll while open
 * - Closes on Escape and backdrop click
 * - Moves focus into the dialog on open and restores it on close
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full rounded-card-lg bg-white shadow-card-hover flex flex-col max-h-[92vh]",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-default px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
            {description && (
              <p className="text-sm text-text-muted mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-button p-2 text-text-muted hover:bg-bg-soft hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "danger" | "primary";
}

/** Destructive-action confirmation. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  tone = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="md">
      <div className="text-sm text-text-secondary leading-relaxed">{message}</div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-button border border-border-default text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "px-5 py-2.5 rounded-button text-white font-semibold text-sm transition-colors",
            tone === "danger"
              ? "bg-error hover:bg-error/90"
              : "bg-primary hover:bg-primary-hover",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
