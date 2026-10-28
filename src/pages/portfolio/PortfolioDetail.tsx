import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/store/StoreProvider";

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getProject } = useContent();
  const project = getProject(slug || "");

  if (!project) {
    return (
      <>
        <SEO title="Project Not Found | MovoX" description="" path="/work" noIndex />
        <section className="py-20 bg-bg-main">
          <Container>
            <SectionHeading heading="Project Not Found" headingTag="h1" textAlign="center" />
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/work">Back to Work</Link>
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
        title={`${project.name} | MovoX`}
        description={project.overview}
        path={`/work/${project.slug}`}
        image={project.thumbnail}
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <nav className="mb-8 text-xs text-text-muted">
            <Link to="/" className="text-primary hover:underline">Home</Link>{" "}
            <span className="text-text-muted">/</span>{" "}
            <Link to="/work" className="text-primary hover:underline">Work</Link>{" "}
            <span className="text-text-muted">/</span>{" "}
            <span className="text-text-primary">{project.name}</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-card-lg overflow-hidden border border-border-default mb-8">
              <div className="h-64 bg-bg-muted flex items-center justify-center text-text-muted">
                {project.demo ? "Demo template" : "Project gallery image"}
              </div>
              <div className="p-4">
                {project.demo && (
                  <p className="text-[10px] text-warning font-bold bg-warning-bg px-2 py-1 rounded inline-block mb-3 uppercase">
                    Demo content — replace with real project
                  </p>
                )}
                <h1 className="text-3xl font-bold text-text-primary mb-3">
                  {project.name}
                </h1>
                <p className="text-text-secondary">
                  {project.industry} · {project.services.join(", ")}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <SectionHeading heading="Overview" headingTag="h2" textAlign="left" />
                <p className="text-text-secondary leading-relaxed">
                  {project.overview}
                </p>

                <SectionHeading heading="Challenge" headingTag="h2" textAlign="left" />
                <p className="text-text-secondary leading-relaxed">
                  {project.challenge}
                </p>

                <SectionHeading heading="Strategy" headingTag="h2" textAlign="left" />
                <p className="text-text-secondary leading-relaxed">
                  {project.strategy}
                </p>

                <SectionHeading heading="Execution" headingTag="h2" textAlign="left" />
                <p className="text-text-secondary leading-relaxed">
                  {project.execution}
                </p>
              </div>

              <div className="space-y-8">
                <SectionHeading heading="Objectives" headingTag="h2" textAlign="left" />
                <ul className="space-y-2 text-text-secondary text-sm leading-relaxed">
                  {project.objectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                      {obj}
                    </li>
                  ))}
                </ul>

                <SectionHeading heading="Deliverables" headingTag="h2" textAlign="left" />
                <ul className="space-y-2 text-text-secondary text-sm leading-relaxed">
                  {project.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                      {d}
                    </li>
                  ))}
                </ul>

                {project.results && (
                  <>
                    <SectionHeading heading="Results" headingTag="h2" textAlign="left" />
                    <p className="text-text-secondary leading-relaxed">
                      {project.results}
                    </p>
                  </>
                )}

                <div className="pt-4">
                  <Button asChild size="lg" className="w-full">
                    <Link to="/start-a-project">
                      Start a Similar Project
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
