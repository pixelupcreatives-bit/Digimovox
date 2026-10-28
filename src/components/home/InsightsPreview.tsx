import { Link } from "react-router-dom";
import { useContent } from "@/store/StoreProvider";

export function InsightsPreview() {
  const { insights } = useContent();
  const featured = insights.slice(0, 3);

  return (
    <section className="py-20 bg-bg-soft">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="mb-4">Ideas That Help Your Business Move Forward.</h2>
          <p className="text-supporting text-text-muted max-w-2xl mx-auto">
            Explore practical insights on design, branding, websites,
            applications and digital marketing to make better decisions about
            your digital growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featured.map((article) => (
            <article key={article.slug} className="bg-white rounded-card-lg border border-border-default p-6 hover:shadow-card-hover transition-all">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                {article.category}
              </span>
              <h3 className="text-lg font-bold text-text-primary mb-3">{article.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <Link
                to={`/insights/${article.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Read article <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/insights" className="text-sm font-semibold text-primary hover:underline">
            Explore Insights <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
