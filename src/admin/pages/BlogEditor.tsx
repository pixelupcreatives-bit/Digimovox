import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Wand2 } from "lucide-react";
import { useDB, savePost } from "@/store/StoreProvider";
import { parseContent, serializeContent } from "../lib/content";
import { slugify } from "@/lib/utils";
import { Card, CardHeader } from "../ui/Primitives";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { InsightArticle } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Give the article a title."),
  slug: z
    .string()
    .min(2, "A URL slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  category: z.string().min(1, "Choose a category."),
  excerpt: z.string().min(10, "Write a short excerpt (at least 10 characters)."),
  author: z.string().min(2, "Author is required."),
  publishedAt: z.string().min(1, "Pick a publish date."),
  readTime: z.string().min(1, "Read time is required."),
  primaryKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
  content: z.string().min(10, "Add some article content."),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  related: z.string().optional(),
});

type Values = z.infer<typeof schema>;

function splitList(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function BlogEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const db = useDB();
  const existing = slug ? db.blog.find((a) => a.slug === slug) : undefined;
  const isNew = !existing;

  const categories = useMemo(
    () => Array.from(new Set(db.blog.map((a) => a.category))),
    [db.blog],
  );

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
          title: existing.title,
          slug: existing.slug,
          category: existing.category,
          excerpt: existing.excerpt,
          author: existing.author,
          publishedAt: existing.publishedAt,
          readTime: existing.readTime,
          primaryKeyword: existing.primaryKeyword,
          secondaryKeywords: existing.secondaryKeywords.join(", "),
          metaTitle: existing.metaTitle,
          metaDescription: existing.metaDescription,
          image: existing.image,
          alt: existing.alt,
          content: serializeContent(existing.content),
          ctaLabel: existing.ctaLabel,
          ctaUrl: existing.ctaUrl,
          related: existing.related.join(", "),
        }
      : {
          title: "",
          slug: "",
          category: "",
          excerpt: "",
          author: "MovoX Team",
          publishedAt: new Date().toISOString().slice(0, 10),
          readTime: "5 min read",
          primaryKeyword: "",
          secondaryKeywords: "",
          metaTitle: "",
          metaDescription: "",
          image: "",
          alt: "",
          content: "",
          ctaLabel: "",
          ctaUrl: "",
          related: "",
        },
  });

  const title = watch("title");
  const slugValue = watch("slug");

  // Auto-fill the slug from the title on a new article until the user sets one.
  useEffect(() => {
    if (isNew && !slugValue && title) {
      setValue("slug", slugify(title));
    }
  }, [title, slugValue, isNew, setValue]);

  function onSubmit(values: Values) {
    const clash = db.blog.find(
      (a) => a.slug === values.slug && a.slug !== existing?.slug,
    );
    if (clash) {
      setError("slug", { message: "That slug is already used by another article." });
      return;
    }

    const article: InsightArticle = {
      slug: values.slug,
      title: values.title,
      category: values.category,
      primaryKeyword: values.primaryKeyword ?? "",
      secondaryKeywords: splitList(values.secondaryKeywords),
      metaTitle: values.metaTitle ?? values.title,
      metaDescription: values.metaDescription ?? values.excerpt,
      excerpt: values.excerpt,
      author: values.author,
      publishedAt: values.publishedAt,
      readTime: values.readTime,
      image: values.image ?? "",
      alt: values.alt ?? values.title,
      content: parseContent(values.content),
      related: splitList(values.related),
      ctaLabel: values.ctaLabel || "Start Your Project",
      ctaUrl: values.ctaUrl || "/start-a-project",
    };
    savePost(article);
    navigate("/admin/blog", { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>
        <span className="text-sm text-text-muted">
          {isNew ? "New article" : `Editing · ${slugValue}`}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6">
          {/* Core */}
          <Card>
            <CardHeader title="Article" description="The content visitors read on the Insights pages." />
            <div className="px-6 py-6 grid gap-4">
              <Input
                label="Title"
                id="title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="How to Choose the Right Design Style"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-text-primary mb-1.5">
                    URL slug
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="slug"
                      {...register("slug")}
                      className="flex-1 rounded-button border border-border-default bg-white px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="how-to-choose-design-style"
                    />
                    <button
                      type="button"
                      onClick={() => setValue("slug", slugify(title))}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-button border border-border-default bg-white px-3 text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary"
                    >
                      <Wand2 className="w-4 h-4" /> Generate
                    </button>
                  </div>
                  {errors.slug && <p role="alert" className="mt-1.5 text-sm text-error">{errors.slug.message}</p>}
                  <p className="text-xs text-text-muted mt-1.5">
                    Lives at <code>/insights/{slugValue || "…"}</code>
                  </p>
                </div>
                <Input
                  label="Category"
                  id="category"
                  {...register("category")}
                  error={errors.category?.message}
                  placeholder="e.g. Branding"
                  list="blog-categories"
                />
                <datalist id="blog-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <Textarea
                label="Excerpt"
                id="excerpt"
                rows={2}
                {...register("excerpt")}
                error={errors.excerpt?.message}
                placeholder="A one or two sentence summary shown on listing pages."
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="Author" id="author" {...register("author")} error={errors.author?.message} />
                <Input
                  label="Publish date"
                  id="publishedAt"
                  type="date"
                  {...register("publishedAt")}
                  error={errors.publishedAt?.message}
                />
                <Input label="Read time" id="readTime" {...register("readTime")} error={errors.readTime?.message} />
              </div>
              <Textarea
                label="Content"
                id="content"
                rows={12}
                {...register("content")}
                error={errors.content?.message}
                helperText="Use '## ' for headings, '### ' for subheadings and '- ' for list items."
                placeholder={"## Why it matters\n\nWrite a paragraph…\n\n- Point one\n- Point two"}
              />
            </div>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader title="SEO" description="Optional metadata used on search and social previews." />
            <div className="px-6 py-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Primary keyword" id="primaryKeyword" {...register("primaryKeyword")} />
                <Input
                  label="Secondary keywords"
                  id="secondaryKeywords"
                  {...register("secondaryKeywords")}
                  helperText="Comma-separated"
                />
              </div>
              <Input
                label="Meta title"
                id="metaTitle"
                {...register("metaTitle")}
                helperText="Leave blank to reuse the article title"
              />
              <Textarea label="Meta description" id="metaDescription" rows={2} {...register("metaDescription")} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Image path" id="image" {...register("image")} placeholder="/images/blog/my-article.svg" />
                <Input label="Image alt text" id="alt" {...register("alt")} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="CTA label" id="ctaLabel" {...register("ctaLabel")} />
                <Input label="CTA URL" id="ctaUrl" {...register("ctaUrl")} />
              </div>
              <Input
                label="Related article slugs"
                id="related"
                {...register("related")}
                helperText="Comma-separated slugs"
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link to="/admin/blog">Cancel</Link>
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-button text-white text-sm font-semibold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isNew ? "Publish article" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
