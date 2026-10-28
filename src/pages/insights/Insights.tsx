import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useContent } from "@/store/StoreProvider";

export function Insights() {
  const { insights } = useContent();
  // Derive category chips from live content so CMS-added categories appear.
  const insightCategories = Array.from(new Set(insights.map((a) => a.category)));
  return (
    <>
      <SEO
        title="Insights | MovoX Journal"
        description="Explore practical insights on design, branding, websites, applications and digital marketing from MovoX."
        path="/insights"
        image="/og-image.jpg"
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              heading="Ideas That Help Your Business Move Forward."
              description=
                "Explore practical insights on design, branding, websites, applications and digital marketing to make better decisions about your digital growth."
            />

            <div className="flex gap-2 flex-wrap mb-10">
              <Link
                to="/insights"
                className="px-5 py-2 rounded-button bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                All Articles
              </Link>
              {insightCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/insights/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-5 py-2 rounded-button border border-border-default bg-white text-text-primary font-medium hover:bg-bg-soft hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((article) => (
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
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <Link
                    to={`/insights/${article.slug}`}
                    className="block px-6 py-4 text-sm font-semibold text-primary hover:bg-bg-soft transition-colors"
                  >
                    Read article <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/insights">Explore All Insights</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
