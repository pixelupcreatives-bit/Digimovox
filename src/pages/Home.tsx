import { SEO } from "@/components/seo/SEO";
import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WhyMovoX } from "@/components/home/WhyMovoX";
import { OurProcess } from "@/components/home/OurProcess";
import { Industries } from "@/components/home/Industries";
import { InsightsPreview } from "@/components/home/InsightsPreview";
import { FinalCTA } from "@/components/home/FinalCTA";

export function Home() {
  return (
    <>
      <SEO
        title="MovoX | Digital Growth Agency"
        description=
          "MovoX is a digital growth agency combining creative design, branding, website development, mobile application development and digital marketing to help businesses strengthen their digital presence across India and internationally."
        path="/"
        image="/og-image.jpg"
      />
      <Hero />
      <Introduction />
      <ServicesOverview />
      <FeaturedWork />
      <WhyMovoX />
      <OurProcess />
      <Industries />
      <InsightsPreview />
      <FinalCTA />
    </>
  );
}
