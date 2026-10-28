import type { Service } from "@/types";

export const services: Record<string, Service> = {
  "graphic-design": {
    id: "graphic-design",
    slug: "graphic-design",
    name: "Graphic Design",
    shortName: "Graphic Design",
    description:
      "Visual communication that makes your brand recognisable, consistent and memorable.",
    heroHeading: "Design That Makes Your Brand Stand Out.",
    heroDescription:
      "We create purposeful visual communication that helps businesses express their identity, communicate their message and connect with their audience across digital and print channels.",
    icon: "Image",
    color: "#2382B8",
    deliverables: [
      "Social media creatives",
      "Marketing campaign creatives",
      "Advertising creatives",
      "Digital and print design",
      "Presentation design",
    ],
    benefits: [
      "Consistent visual identity across all channels",
      "Professional creatives that attract attention",
      "Print-ready and web-optimised deliverables",
      "Clear messaging aligned with your brand",
    ],
    process: [
      { step: 1, title: "Brief", description: "Understand your brand, audience and design objectives." },
      { step: 2, title: "Concept", description: "Develop creative directions and initial concepts." },
      { step: 3, title: "Design", description: "Refine the selected concept through structured feedback." },
      { step: 4, title: "Deliver", description: "Prepare final files in the required formats and resolutions." },
    ],
    portfolio: [],
    pricing: ["graphic-starter", "graphic-business", "graphic-premium"],
    faqs: [
      {
        question: "What file formats will I receive?",
        answer: "Final designs are delivered in web-optimised and print-ready formats, including PNG, JPG and PDF. Source files can be discussed based on the package.",
      },
      {
        question: "How many revision rounds are included?",
        answer: "Revision rounds vary by package: Starter includes 1, Business includes 2 and Premium includes 3 revision rounds.",
      },
    ],
    related: ["branding-packaging", "digital-marketing"],
    seoTitle: "Graphic Design Services for Businesses | MovoX",
    seoDescription:
      "Build a consistent and recognisable brand with professional graphic design services for social media, advertising, marketing campaigns and business communications.",
  },
  "branding-packaging": {
    id: "branding-packaging",
    slug: "branding-packaging",
    name: "Branding & Packaging",
    shortName: "Branding",
    description:
      "Build a distinctive brand identity that communicates your values and creates a consistent impression.",
    heroHeading: "Build a Brand People Recognise and Remember.",
    heroDescription:
      "We help businesses define their visual identity and create consistent brand experiences across digital platforms, marketing materials and product packaging.",
    icon: "Layers",
    color: "#2382B8",
    deliverables: [
      "Brand strategy and positioning",
      "Logo design",
      "Visual identity systems",
      "Brand guidelines",
      "Packaging design",
    ],
    benefits: [
      "A distinctive, memorable brand identity",
      "Consistency across all customer touchpoints",
      "Clear brand guidelines for internal and external use",
      "Packaging that stands out on the shelf",
    ],
    process: [
      { step: 1, title: "Discovery", description: "Research your market, audience and brand positioning." },
      { step: 2, title: "Strategy", description: "Define brand values, voice and visual direction." },
      { step: 3, title: "Identity", description: "Design logo, colour palette, typography and brand elements." },
      { step: 4, title: "Guidelines", description: "Document usage in a brand guidelines book." },
    ],
    portfolio: [],
    pricing: ["brand-starter", "brand-identity", "brand-signature"],
    faqs: [
      {
        question: "What is included in a brand guidelines document?",
        answer: "Brand guidelines document usage of the logo, colour palette, typography, imagery and tone of voice across applications. The depth varies by package.",
      },
      {
        question: "Are printing costs included in packaging design?",
        answer: "No. Packaging design covers the dieline, artwork and mockups. Printing, materials and production are additional unless specified.",
      },
    ],
    related: ["graphic-design", "website-development"],
    seoTitle: "Branding & Packaging Design Services | MovoX",
    seoDescription:
      "Develop a distinctive brand identity with logo design, visual identity systems, brand guidelines and packaging design from MovoX.",
  },
  "website-development": {
    id: "website-development",
    slug: "website-development",
    name: "Website Development",
    shortName: "Websites",
    description:
      "Create fast, responsive websites designed around your customers, business goals and online visibility.",
    heroHeading: "Websites Built for Business. Designed for People.",
    heroDescription:
      "We design and develop modern websites that combine thoughtful user experiences, responsive layouts, technical performance and clear conversion paths.",
    icon: "Code2",
    color: "#2382B8",
    deliverables: [
      "Corporate websites",
      "Business websites",
      "E-commerce websites",
      "Landing pages",
      "Custom web applications",
    ],
    benefits: [
      "Responsive design on all devices",
      "Fast-loading, performance-focused websites",
      "Clear conversion paths and contact points",
      "Basic on-page SEO included",
    ],
    process: [
      { step: 1, title: "Plan", description: "Define sitemap, features and technical approach." },
      { step: 2, title: "Design", description: "Create wireframes and visual designs for approval." },
      { step: 3, title: "Develop", description: "Build the responsive website and integrate functionality." },
      { step: 4, title: "Launch", description: "Test, optimise and support the launch." },
    ],
    portfolio: [],
    pricing: ["web-starter", "web-business", "web-premium"],
    faqs: [
      {
        question: "Is hosting included in website packages?",
        answer: "No. Hosting, domain renewals and paid subscriptions are additional unless explicitly included in your proposal.",
      },
      {
        question: "Will the website be mobile-friendly?",
        answer: "Yes. All websites we build are responsive and tested across desktop, tablet and mobile devices.",
      },
    ],
    related: ["app-development", "digital-marketing"],
    seoTitle: "Website Development Company for Businesses | MovoX",
    seoDescription:
      "Get a responsive, performance-focused website built around your business goals with MovoX website design and development services.",
  },
  "app-development": {
    id: "app-development",
    slug: "app-development",
    name: "App Development",
    shortName: "Apps",
    description:
      "Turn business ideas into useful mobile experiences with thoughtful interfaces and reliable functionality.",
    heroHeading: "Turn Your App Idea Into a Real Product.",
    heroDescription:
      "We help businesses transform application ideas into practical digital experiences through product planning, interface design, development and testing.",
    icon: "Smartphone",
    color: "#2382B8",
    deliverables: [
      "Android applications",
      "iOS applications",
      "Cross-platform applications",
      "MVP development",
      "Application maintenance",
    ],
    benefits: [
      "User-focused interface design",
      "Defined backend scope and API integrations",
      "Functional testing before deployment",
      "Deployment support for agreed platforms",
    ],
    process: [
      { step: 1, title: "Plan", description: "Define scope, core screens and backend requirements." },
      { step: 2, title: "Design", description: "Create UI/UX designs and clickable prototypes." },
      { step: 3, title: "Develop", description: "Build the application with agreed authentication and integrations." },
      { step: 4, title: "Launch", description: "Test and support deployment to the agreed platform." },
    ],
    portfolio: [],
    pricing: ["app-mvp", "app-business", "app-advanced"],
    faqs: [
      {
        question: "Are app store fees included?",
        answer: "No. Cloud infrastructure, app-store fees, paid APIs and third-party services are additional unless agreed otherwise.",
      },
      {
        question: "Which platforms do you support?",
        answer: "We build Android, iOS and cross-platform applications based on your requirements and target audience.",
      },
    ],
    related: ["website-development", "digital-marketing"],
    seoTitle: "Mobile App Development Services | MovoX",
    seoDescription:
      "Build user-focused mobile applications with MovoX, from MVP planning and UI/UX design to development, testing and launch.",
  },
  "digital-marketing": {
    id: "digital-marketing",
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Marketing",
    description:
      "Connect your business with the right audience through strategic, consistent and data-informed marketing.",
    heroHeading: "Reach the Right Audience. Build Meaningful Growth.",
    heroDescription:
      "We help businesses strengthen their digital presence through strategic marketing, relevant content, search visibility and performance-focused campaigns.",
    icon: "Megaphone",
    color: "#2382B8",
    deliverables: [
      "Search engine optimisation",
      "Social media marketing",
      "Paid advertising",
      "Content marketing",
      "Analytics and reporting",
    ],
    benefits: [
      "Improved search visibility",
      "Consistent social media presence",
      "Data-informed campaign decisions",
      "Transparent monthly reporting",
    ],
    process: [
      { step: 1, title: "Audit", description: "Review current presence, audience and competitors." },
      { step: 2, title: "Strategy", description: "Define channels, messaging and campaign goals." },
      { step: 3, title: "Execute", description: "Publish content, run campaigns and optimise performance." },
      { step: 4, title: "Report", description: "Measure results and recommend improvements." },
    ],
    portfolio: [],
    pricing: ["social-starter", "social-growth", "social-premium", "seo-local", "seo-business", "seo-growth", "ads-starter", "ads-growth", "ads-performance", "content-starter", "content-business", "content-growth"],
    faqs: [
      {
        question: "Is advertising spend included?",
        answer: "No. Advertising expenditure is separate and paid by the client, in addition to the management fee.",
      },
      {
        question: "Do you guarantee search rankings?",
        answer: "No. We do not guarantee search rankings, traffic volumes or sales. We focus on best-practice optimisation and transparent reporting.",
      },
    ],
    related: ["website-development", "graphic-design"],
    seoTitle: "Digital Marketing Services for Businesses | MovoX",
    seoDescription:
      "Strengthen your online presence with digital marketing services covering SEO, social media, paid advertising and content marketing.",
  },
};

export const serviceList = Object.values(services);
