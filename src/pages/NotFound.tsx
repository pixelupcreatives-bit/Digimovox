import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | MovoX"
        description="The page you're looking for doesn't exist."
        path="/404"
        noIndex
      />
      <section className="py-24 bg-bg-main">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeading
              heading="404"
              headingTag="h1"
              textAlign="center"
            />
            <p className="text-lg text-text-secondary mb-10">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-auto">
                <Link to="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-auto">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
