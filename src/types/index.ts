export type Market = "india" | "international";

export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  heroHeading: string;
  heroDescription: string;
  icon: string; // lucide icon name
  color: string;
  deliverables: string[];
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  portfolio: string[]; // project slugs
  pricing: string[]; // pricing package ids
  faqs: { question: string; answer: string }[];
  related: string[]; // service slugs
  seoTitle: string;
  seoDescription: string;
}

export interface PricingPackage {
  id: string;
  category: string;
  packageName: string;
  price: number | null; // null = on request / variable
  currency: "INR" | "USD";
  billingPeriod: "one-time" | "month";
  priceQualifier: "starting-at" | "fixed" | "on-request";
  shortDescription: string;
  features: string[];
  exclusions?: string[];
  revisionLimit?: number | string;
  highlighted?: boolean;
  ctaLabel: string;
  ctaUrl: string;
  displayOrder: number;
  enabled: boolean;
  badge?: string;
}

export interface Project {
  slug: string;
  name: string;
  client?: string;
  industry: string;
  services: string[];
  thumbnail: string;
  gallery: string[];
  overview: string;
  challenge: string;
  objectives: string[];
  strategy: string;
  execution: string;
  deliverables: string[];
  results?: string;
  related: string[];
  featured: boolean;
  demo?: boolean; // marks clearly demo/template content
}

export interface InsightArticle {
  slug: string;
  title: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  alt: string;
  content: { type: "h2" | "h3" | "p" | "list"; text: string }[];
  related: string[];
  ctaLabel: string;
  ctaUrl: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  email?: string;
  phone?: string;
  address?: string;
  social: Record<string, string>;
}
