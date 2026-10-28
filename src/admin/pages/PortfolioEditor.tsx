import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useDB, savePortfolioItem } from "@/store/StoreProvider";
import { slugify } from "@/lib/utils";
import { Card, CardHeader, Toggle } from "../ui/Primitives";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";

const schema = z.object({
  name: z.string().min(3, "Give the project a name."),
  slug: z
    .string()
    .min(2, "A URL slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  client: z.string().optional(),
  industry: z.string().min(1, "Industry is required."),
  services: z.string().min(1, "List at least one service."),
  thumbnail: z.string().optional(),
  gallery: z.string().optional(),
  overview: z.string().min(10, "Write a short overview."),
  challenge: z.string().min(10, "Describe the challenge."),
  objectives: z.string().min(10, "List the objectives (one per line)."),
  strategy: z.string().min(10, "Describe the strategy."),
  execution: z.string().min(10, "Describe the execution."),
  deliverables: z.string().min(10, "List the deliverables (one per line)."),
  results: z.string().optional(),
  related: z.string().optional(),
  featured: z.boolean(),
  demo: z.boolean(),
});

type Values = z.infer<typeof schema>;

function lines(value?: string): string[] {
  return (value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function commaList(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PortfolioEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const db = useDB();
  const existing = slug ? db.portfolio.find((p) => p.slug === slug) : undefined;
  const isNew = !existing;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
          name: existing.name,
          slug: existing.slug,
          client: existing.client ?? "",
          industry: existing.industry,
          services: existing.services.join(", "),
          thumbnail: existing.thumbnail,
          gallery: existing.gallery.join(", "),
          overview: existing.overview,
          challenge: existing.challenge,
          objectives: existing.objectives.join("\n"),
          strategy: existing.strategy,
          execution: existing.execution,
          deliverables: existing.deliverables.join("\n"),
          results: existing.results ?? "",
          related: existing.related.join(", "),
          featured: existing.featured,
          demo: Boolean(existing.demo),
        }
      : {
          name: "",
          slug: "",
          client: "",
          industry: "",
          services: "",
          thumbnail: "",
          gallery: "",
          overview: "",
          challenge: "",
          objectives: "",
          strategy: "",
          execution: "",
          deliverables: "",
          results: "",
          related: "",
          featured: false,
          demo: true,
        },
  });

  const name = watch("name");
  const slugValue = watch("slug");

  useEffect(() => {
    if (isNew && !slugValue && name) setValue("slug", slugify(name));
  }, [name, slugValue, isNew, setValue]);

  function onSubmit(values: Values) {
    const clash = db.portfolio.find(
      (p) => p.slug === values.slug && p.slug !== existing?.slug,
    );
    if (clash) {
      setError("slug", { message: "That slug is already used by another project." });
      return;
    }

    const item: Project = {
      slug: values.slug,
      name: values.name,
      client: values.client || undefined,
      industry: values.industry,
      services: commaList(values.services),
      thumbnail: values.thumbnail || "/images/portfolio/demo-placeholder.svg",
      gallery: commaList(values.gallery),
      overview: values.overview,
      challenge: values.challenge,
      objectives: lines(values.objectives),
      strategy: values.strategy,
      execution: values.execution,
      deliverables: lines(values.deliverables),
      results: values.results || undefined,
      related: commaList(values.related),
      featured: values.featured,
      demo: values.demo,
    };
    savePortfolioItem(item);
    navigate("/admin/portfolio", { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link to="/admin/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> All projects
        </Link>
        <span className="text-sm text-text-muted">
          {isNew ? "New project" : `Editing · ${slugValue}`}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6">
          <Card>
            <CardHeader title="Project" description="Shown on the public Work pages and case-study detail." />
            <div className="px-6 py-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Name" id="name" {...register("name")} error={errors.name?.message} placeholder="Acme — E-commerce Website" />
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-text-primary mb-1.5">URL slug</label>
                  <input
                    id="slug"
                    {...register("slug")}
                    className="w-full rounded-button border border-border-default bg-white px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="acme-ecommerce-website"
                  />
                  {errors.slug && <p role="alert" className="mt-1.5 text-sm text-error">{errors.slug.message}</p>}
                  <p className="text-xs text-text-muted mt-1.5">Lives at <code>/work/{slugValue || "…"}</code></p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Client" id="client" {...register("client")} placeholder="Client name (optional)" />
                <Input label="Industry" id="industry" {...register("industry")} error={errors.industry?.message} placeholder="e.g. E-commerce & Retail" />
              </div>
              <Input
                label="Services"
                id="services"
                {...register("services")}
                error={errors.services?.message}
                helperText="Comma-separated, e.g. Branding, Website Development"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Thumbnail path" id="thumbnail" {...register("thumbnail")} placeholder="/images/portfolio/x.svg" />
                <Input label="Gallery paths" id="gallery" {...register("gallery")} helperText="Comma-separated" />
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <Toggle label="Featured on home page" checked={watch("featured")} onChange={(v) => setValue("featured", v)} />
                <Toggle label="Mark as demo template" checked={watch("demo")} onChange={(v) => setValue("demo", v)} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Case study" description="The narrative shown on the detail page." />
            <div className="px-6 py-6 grid gap-4">
              <Textarea label="Overview" id="overview" rows={3} {...register("overview")} error={errors.overview?.message} />
              <Textarea label="Challenge" id="challenge" rows={3} {...register("challenge")} error={errors.challenge?.message} />
              <Textarea
                label="Objectives"
                id="objectives"
                rows={4}
                {...register("objectives")}
                error={errors.objectives?.message}
                helperText="One per line"
              />
              <Textarea label="Strategy" id="strategy" rows={3} {...register("strategy")} error={errors.strategy?.message} />
              <Textarea label="Execution" id="execution" rows={3} {...register("execution")} error={errors.execution?.message} />
              <Textarea
                label="Deliverables"
                id="deliverables"
                rows={4}
                {...register("deliverables")}
                error={errors.deliverables?.message}
                helperText="One per line"
              />
              <Textarea label="Results" id="results" rows={3} {...register("results")} helperText="Optional" />
              <Input label="Related project slugs" id="related" {...register("related")} helperText="Comma-separated" />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link to="/admin/portfolio">Cancel</Link>
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-button text-white text-sm font-semibold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isNew ? "Add project" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
