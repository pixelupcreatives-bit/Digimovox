import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { useContent } from "@/store/StoreProvider";

export function InsightCategory() {
  const { slug } = useParams<{ slug: string }>();
  const { insightsByCategory } = useContent();
  const categoryArticles = insightsByCategory(slug || "");
  const categoryName = (slug || "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <>
      <SEO
        title={`${categoryName} Insights | MovoX`}
        description={`Explore ${categoryName} insights from MovoX.`}
        path={`/insights/category/${slug}`}
        image="/og-image.jpg"
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <div className="max-w-5xl mx-auto">
            <nav className="mb-6 text-xs text-text-muted">
              <Link to="/" className="text-primary hover:underline">Home</Link>{" "}
              <span className="text-text-muted">/</span>{" "}
              <Link to="/insights" className="text-primary hover:underline">Insights</Link>{" "}
              <span className="text-text-muted">/</span>{" "}
              <span className="text-text-primary">{categoryName}</span>
            </nav>

            <SectionHeading
              heading={`${categoryName} Insights`}
              headingTag="h1"
              textAlign="left"
            />

            <div className="grid md:grid-cols-3 gap-6">
              {categoryArticles.length > 0 ? (
                categoryArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="rounded-card-lg border border-border-default bg-white overflow-hidden hover:shadow-card-hover transition-all"
                  >
                    <div className="h-48 bg-bg-muted flex items-center justify-center text-text-muted">
                      {article.title.slice(0, 20)}...
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-bold text-text-primary mb-3">
                        {article.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/insights/${article.slug}`}
                      className="block px-6 py-4 text-sm font-semibold text-primary hover:bg-bg-soft transition-colors"
                    >
                      Read article <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-text-muted">No articles in this category yet.</p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
