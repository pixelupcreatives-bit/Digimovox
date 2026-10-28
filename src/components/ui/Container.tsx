import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export function Container({ className, children, fullWidth }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        fullWidth ? "max-w-none" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
