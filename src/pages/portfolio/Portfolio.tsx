import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { useContent } from "@/store/StoreProvider";

export function Portfolio() {
  const { projects } = useContent();
  return (
    <>
      <SEO
        title="Our Work | MovoX Portfolio"
        description="Explore selected MovoX projects across creative design, branding, website development, application development and digital marketing."
        path="/work"
        image="/og-image.jpg"
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              heading="Work That Brings Ideas to Life."
              description=
                "Explore selected projects across creative design, branding, website development, application development and digital marketing."
            />

            <div className="flex gap-2 flex-wrap mb-10">
              <Link
                to="/work"
                className="px-5 py-2 rounded-button bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                All Projects
              </Link>
              {[
                "Graphic Design",
                "Branding",
                "Website Development",
                "App Development",
                "Digital Marketing",
              ].map((cat) => (
                <Link
                  key={cat}
                  to="/work"
                  className="px-5 py-2 rounded-button border border-border-default bg-white text-text-primary font-medium hover:bg-bg-soft hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link
                    key={project.slug}
                    to={`/work/${project.slug}`}
                    className="block rounded-card-lg overflow-hidden border border-border-default bg-white hover:shadow-card-hover transition-all"
                  >
                    <div className="h-48 bg-bg-muted flex items-center justify-center text-text-muted">
                      {project.demo ? "Demo template" : "Project thumbnail"}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {project.services[0] || "Project"}
                        </span>
                        {project.demo && (
                          <span className="text-[10px] text-warning font-bold bg-warning-bg px-1.5 py-0.5 rounded uppercase">
                            Demo
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-text-muted">{project.industry}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 bg-white rounded-card-lg border border-border-default">
                  <p className="text-text-muted">No projects to display yet.</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
