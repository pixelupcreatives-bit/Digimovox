import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  headingTag?: "h1" | "h2" | "h3";
  className?: string;
  textAlign?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  headingTag = "h2",
  className,
  textAlign = "center",
}: SectionHeadingProps) {
  const Tag = headingTag;
  const align = textAlign === "center" ? "text-center" : "text-left";
  const mb = description ? "mb-8" : "mb-6";

  return (
    <div className={cn("max-w-3xl mx-auto", mb, align, className)}>
      {eyebrow && (
        <p className="eyebrow text-primary">{eyebrow}</p>
      )}
      <Tag className={cn(textAlign === "center" ? "mx-auto" : "")}>
        {heading}
      </Tag>
      {description && (
        <p className="text-supporting text-text-muted mt-4 max-w-xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
