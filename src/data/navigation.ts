import type { LinkItem } from "@/types";

export interface NavItem extends LinkItem {
  items?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    items: [
      { label: "Graphic Design", href: "/services/graphic-design" },
      { label: "Branding & Packaging", href: "/services/branding-packaging" },
      { label: "Website Development", href: "/services/website-development" },
      { label: "App Development", href: "/services/app-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
    ],
  },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  services: [
    { label: "Graphic Design", href: "/services/graphic-design" },
    { label: "Branding & Packaging", href: "/services/branding-packaging" },
    { label: "Website Development", href: "/services/website-development" },
    { label: "App Development", href: "/services/app-development" },
    { label: "Digital Marketing", href: "/services/digital-marketing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Work", href: "/work" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
    { label: "Start a Project", href: "/start-a-project" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Terms & Conditions", href: "/policies/terms" },
  ],
} as const;

export const ctaLink: LinkItem = {
  label: "Start a Project",
  href: "/start-a-project",
};
