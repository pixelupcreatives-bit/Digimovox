import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

const buttonVariants = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary",
  secondary:
    "bg-white text-navy hover:bg-primary hover:text-white border border-border-default focus-visible:ring-primary",
  dark: "bg-navy text-white hover:bg-navy-hover focus-visible:ring-primary",
  outline:
    "bg-transparent text-text-primary border border-border-default hover:bg-primary hover:text-white focus-visible:ring-primary",
  ghost: "text-text-secondary hover:text-primary hover:bg-primary-subtle",
};

const buttonSizes = {
  sm: "px-6 py-2 text-sm",
  md: "px-8 py-3.5 text-base",
  lg: "px-10 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, disabled, asChild, ...props },
    ref,
  ) => {
    const Comp = asChild ? ({ children: innerChildren }: { children: React.ReactNode }) => (
      <span className="inline-flex items-center justify-center">{innerChildren}</span>
    ) : "button";

    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          "inline-flex items-center justify-center rounded-button font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
