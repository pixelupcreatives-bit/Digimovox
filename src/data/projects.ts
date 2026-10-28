import type { Project } from "@/types";

// NOTE: This is a reusable portfolio template. No real client projects have been
// added yet. Demo entries are clearly marked so they are never presented as
// actual client work. Replace with genuine, permission-approved projects.
export const projects: Project[] = [
  {
    slug: "demo-template-project",
    name: "Template Project (Demo)",
    client: undefined,
    industry: "Professional Services",
    services: ["Branding", "Website Development"],
    thumbnail: "/images/portfolio/demo-placeholder.svg",
    gallery: [],
    overview:
      "This is a reusable portfolio template. Replace with a genuine project once client permission is obtained.",
    challenge: "Placeholder challenge description.",
    objectives: ["Placeholder objective 1", "Placeholder objective 2"],
    strategy: "Placeholder strategy description.",
    execution: "Placeholder execution description.",
    deliverables: ["Placeholder deliverable 1", "Placeholder deliverable 2"],
    related: [],
    featured: false,
    demo: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
