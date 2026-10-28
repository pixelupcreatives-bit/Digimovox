import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function ThankYou() {
  return (
    <>
      <SEO
        title="Thank You | MovoX"
        description="Thank you for reaching out to MovoX."
        path="/thank-you"
        noIndex
      />
      <section className="py-20 bg-bg-main">
        <Container>
          <SectionHeading
            heading="Thank You"
            description=
              "Your message has been received. Our team will get in touch shortly."
            headingTag="h1"
            textAlign="center"
          />
          <div className="max-w-lg mx-auto text-center mt-10">
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
