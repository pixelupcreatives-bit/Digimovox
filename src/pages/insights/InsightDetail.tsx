import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/store/StoreProvider";

export function InsightDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getInsight } = useContent();
  const article = getInsight(slug || "");

  if (!article) {
    return (
      <>
        <SEO title="Article Not Found | MovoX" description="" path="/insights" noIndex />
        <section className="py-20 bg-bg-main">
          <Container>
            <SectionHeading heading="Article Not Found" headingTag="h1" textAlign="center" />
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/insights">Back to Insights</Link>
              </Button>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title={article.metaTitle}
        description={article.metaDescription}
        path={`/insights/${article.slug}`}
        type="article"
        image={article.image}
        publishedTime={article.publishedAt}
        authors={[article.author]}
        section={article.category}
        tags={[article.primaryKeyword, ...article.secondaryKeywords]}
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <nav className="mb-8 text-xs text-text-muted">
            <Link to="/" className="text-primary hover:underline">Home</Link>{" "}
            <span className="text-text-muted">/</span>{" "}
            <Link to="/insights" className="text-primary hover:underline">Insights</Link>{" "}
            <span className="text-text-muted">/</span>{" "}
            <span className="text-text-primary">{article.title}</span>
          </nav>

          <article className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-text-muted">{article.readTime} · {article.author}</span>
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="h-64 bg-bg-muted flex items-center justify-center text-text-muted mb-8">
              {article.alt}
            </div>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {article.excerpt}
            </p>

            <div className="prose text-text-secondary leading-relaxed space-y-6">
              {article.content.map((block, i) => {
                if (block.type === "h2") {
                  return <h2 key={i} className="text-2xl font-bold text-text-primary mb-3">{block.text}</h2>;
                }
                if (block.type === "h3") {
                  return <h3 key={i} className="text-xl font-bold text-text-primary mb-2">{block.text}</h3>;
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2 text-text-secondary">
                      {block.text.split("\n").map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border-default">
              <p className="text-sm font-semibold text-text-primary mb-3">Related articles</p>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {article.related.map((relSlug) => {
                  const rel = getInsight(relSlug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={rel.slug}
                      to={`/insights/${rel.slug}`}
                      className="flex-shrink-0 p-4 rounded-card-lg border border-border-default bg-white min-w-[240px]"
                    >
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                        {rel.category}
                      </span>
                      <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 p-8 rounded-card-lg border border-border-default bg-bg-soft text-center">
              <h3 className="text-xl font-bold text-text-primary mb-3">Ready to grow?</h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Let's discuss your project and how MovoX can help.
              </p>
              <Button asChild size="lg">
                <Link to="/start-a-project">Start Your Project</Link>
              </Button>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
