/**
 * Options, labels and defaults for the multi-step "Start a Project" wizard.
 * Kept free of UI imports so it can be reused by validation and the API layer.
 */

export interface ChoiceOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface ServiceOption {
  id: string;
  label: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  options: ServiceOption[];
}

export interface ProjectAnswers {
  goal: string;
  services: string[];
  otherRequirements: string;
  businessType: string;
  businessName: string;
  hasWebsite: string;
  websiteUrl: string;
  industry: string;
  projectDescription: string;
  mainObjective: string;
  targetAudience: string;
  referenceWebsites: string;
  additionalRequirements: string;
  briefFile: BriefFileMeta | null;
  budget: string;
  timeline: string;
  fullName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  contactMethod: string;
  privacy: boolean;
  honeypot: string;
}

export interface BriefFileMeta {
  name: string;
  size: number;
  type: string;
}

export function emptyAnswers(): ProjectAnswers {
  return {
    goal: "",
    services: [],
    otherRequirements: "",
    businessType: "",
    businessName: "",
    hasWebsite: "",
    websiteUrl: "",
    industry: "",
    projectDescription: "",
    mainObjective: "",
    targetAudience: "",
    referenceWebsites: "",
    additionalRequirements: "",
    briefFile: null,
    budget: "",
    timeline: "",
    fullName: "",
    email: "",
    phoneCountry: "in",
    phone: "",
    contactMethod: "",
    privacy: false,
    honeypot: "",
  };
}

/* ---------- Step 2: Discover the goal ---------- */

export const goalOptions: ChoiceOption[] = [
  {
    id: "launch-new",
    label: "Launch Something New",
    icon: "rocket",
    description: "Bring a new product, service, brand or website to market.",
  },
  {
    id: "build-brand",
    label: "Build My Brand",
    icon: "sparkles",
    description: "Strengthen identity, design and how your business is perceived.",
  },
  {
    id: "grow-business",
    label: "Grow My Business",
    icon: "trending-up",
    description: "Increase leads, visibility, sales and customer reach.",
  },
  {
    id: "build-products",
    label: "Build Digital Products",
    icon: "boxes",
    description: "Design and develop a website, app or custom web product.",
  },
];

/* ---------- Step 3: Services ---------- */

export const serviceCategories: ServiceCategory[] = [
  {
    id: "design-branding",
    label: "Design & Branding",
    icon: "palette",
    description: "Visual identity and creative assets.",
    options: [
      { id: "graphic-design", label: "Graphic Design" },
      { id: "logo-design", label: "Logo Design" },
      { id: "brand-identity", label: "Brand Identity & Guidelines" },
      { id: "packaging-design", label: "Packaging Design" },
      { id: "social-media-creatives", label: "Social Media Creatives" },
      { id: "marketing-collateral", label: "Marketing Collateral" },
    ],
  },
  {
    id: "website",
    label: "Website Development",
    icon: "monitor",
    description: "Fast, responsive websites built for business.",
    options: [
      { id: "business-website", label: "Business Website" },
      { id: "ecommerce-website", label: "E-commerce Website" },
      { id: "landing-page", label: "Landing Page" },
      { id: "web-application", label: "Custom Web Application" },
      { id: "website-redesign", label: "Website Redesign" },
    ],
  },
  {
    id: "app",
    label: "App Development",
    icon: "smartphone",
    description: "Mobile applications for Android and iOS.",
    options: [
      { id: "android-app", label: "Android App" },
      { id: "ios-app", label: "iOS App" },
      { id: "crossplatform-app", label: "Cross-Platform App" },
      { id: "mvp-development", label: "MVP Development" },
      { id: "app-maintenance", label: "App Maintenance" },
    ],
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    icon: "megaphone",
    description: "Reach the right audience and grow consistently.",
    options: [
      { id: "seo", label: "Search Engine Optimisation" },
      { id: "social-media-marketing", label: "Social Media Marketing" },
      { id: "paid-advertising", label: "Paid Advertising" },
      { id: "content-marketing", label: "Content Marketing" },
      { id: "analytics-reporting", label: "Analytics & Reporting" },
    ],
  },
  {
    id: "other",
    label: "Other Requirements",
    icon: "layers",
    description: "Supporting services around your core project.",
    options: [
      { id: "ui-ux-design", label: "UI/UX Design" },
      { id: "photography", label: "Photography" },
      { id: "videography", label: "Videography" },
      { id: "content-writing", label: "Content Writing" },
      { id: "strategy-consulting", label: "Strategy & Consulting" },
      { id: "something-else", label: "Something Else" },
    ],
  },
];

const allServiceOptions: ServiceOption[] = serviceCategories.flatMap(
  (c) => c.options,
);

export function serviceLabel(id: string): string {
  return allServiceOptions.find((o) => o.id === id)?.label ?? id;
}

/** Goal → suggested service ids for the "Help Me Choose" helper. */
export const recommendations: Record<string, string[]> = {
  "launch-new": ["logo-design", "business-website", "social-media-creatives"],
  "build-brand": ["brand-identity", "logo-design", "packaging-design"],
  "grow-business": ["seo", "social-media-marketing", "paid-advertising"],
  "build-products": ["ui-ux-design", "mvp-development", "crossplatform-app"],
};

/* ---------- Step 4: Business information ---------- */

export const businessTypes: ChoiceOption[] = [
  { id: "startup", label: "Startup", icon: "rocket" },
  { id: "small-business", label: "Small Business", icon: "store" },
  { id: "enterprise", label: "Enterprise", icon: "building2" },
  { id: "freelancer", label: "Freelancer / Individual", icon: "users" },
  { id: "nonprofit", label: "Non-profit", icon: "heart" },
  { id: "agency", label: "Agency / Reseller", icon: "briefcase" },
];

export const websiteStatusOptions: ChoiceOption[] = [
  { id: "live", label: "Yes, it's live", icon: "globe" },
  { id: "progress", label: "It's in progress", icon: "wrench" },
  { id: "none", label: "No, not yet", icon: "rocket" },
  { id: "unsure", label: "Not sure", icon: "help-circle" },
];

export const industries: string[] = [
  "E-commerce & Retail",
  "Food & Beverage",
  "Healthcare & Wellness",
  "Education & E-learning",
  "Real Estate",
  "Technology & SaaS",
  "Finance & Banking",
  "Travel & Hospitality",
  "Manufacturing",
  "FMCG",
  "Automotive",
  "Media & Entertainment",
  "Fashion & Beauty",
  "Non-profit",
  "Other",
];

export function businessTypeLabel(id: string): string {
  return businessTypes.find((o) => o.id === id)?.label ?? id;
}

export function websiteStatusLabel(id: string): string {
  return websiteStatusOptions.find((o) => o.id === id)?.label ?? id;
}

/* ---------- Step 5: Project requirements ---------- */

export const mainObjectives: ChoiceOption[] = [
  { id: "leads-sales", label: "Increase leads & sales", icon: "trending-up" },
  { id: "brand-awareness", label: "Build brand awareness", icon: "sparkles" },
  { id: "launch-product", label: "Launch a new product or service", icon: "rocket" },
  { id: "customer-experience", label: "Improve customer experience", icon: "heart" },
  { id: "expand-markets", label: "Expand into new markets", icon: "globe" },
  { id: "something-else", label: "Something else", icon: "layers" },
];

export function mainObjectiveLabel(id: string): string {
  return mainObjectives.find((o) => o.id === id)?.label ?? id;
}

/** Editable starter prompts to help clients describe their project. */
export const suggestionPrompts: string[] = [
  "We want to …",
  "Our customers are …",
  "The problem we're solving is …",
  "We'd like it to feel like …",
  "It should be ready by …",
  "Similar in style to …",
];

/* ---------- Step 6: Budget & timeline ---------- */

export const budgetOptions: ChoiceOption[] = [
  { id: "under-10k", label: "Under ₹10,000", icon: "indian-rupee" },
  { id: "10k-25k", label: "₹10,000–₹25,000", icon: "indian-rupee" },
  { id: "25k-50k", label: "₹25,000–₹50,000", icon: "indian-rupee" },
  { id: "50k-1l", label: "₹50,000–₹1,00,000", icon: "indian-rupee" },
  { id: "1l-3l", label: "₹1,00,000–₹3,00,000", icon: "indian-rupee" },
  { id: "3l-plus", label: "₹3,00,000+", icon: "indian-rupee" },
  { id: "not-sure", label: "Not Sure Yet", icon: "help-circle" },
];

export const timelineOptions: ChoiceOption[] = [
  { id: "asap", label: "As Soon As Possible", icon: "zap" },
  { id: "2-weeks", label: "Within 2 Weeks", icon: "clock" },
  { id: "1-month", label: "Within 1 Month", icon: "calendar" },
  { id: "2-3-months", label: "Within 2–3 Months", icon: "calendar" },
  { id: "exploring", label: "Just Exploring", icon: "compass" },
];

export function budgetLabel(id: string): string {
  return budgetOptions.find((o) => o.id === id)?.label ?? id;
}

export function timelineLabel(id: string): string {
  return timelineOptions.find((o) => o.id === id)?.label ?? id;
}

/* ---------- Step 7: Contact ---------- */

export interface CountryOption {
  id: string;
  dial: string;
  label: string;
}

export const countries: CountryOption[] = [
  { id: "in", dial: "+91", label: "India +91" },
  { id: "us", dial: "+1", label: "United States +1" },
  { id: "gb", dial: "+44", label: "United Kingdom +44" },
  { id: "ae", dial: "+971", label: "UAE +971" },
  { id: "sg", dial: "+65", label: "Singapore +65" },
  { id: "au", dial: "+61", label: "Australia +61" },
  { id: "ca", dial: "+1", label: "Canada +1" },
  { id: "de", dial: "+49", label: "Germany +49" },
];

export function countryDial(id: string): string {
  return countries.find((c) => c.id === id)?.dial ?? "+91";
}

export const contactMethodOptions: ChoiceOption[] = [
  { id: "email", label: "Email", icon: "mail", description: "We'll reply to your business email." },
  { id: "phone", label: "Phone Call", icon: "phone", description: "A quick call to discuss your project." },
  { id: "whatsapp", label: "WhatsApp", icon: "message-circle", description: "Convenient messaging on WhatsApp." },
  { id: "video", label: "Video Call", icon: "video", description: "A screen-share walkthrough meeting." },
];

export function contactMethodLabel(id: string): string {
  return contactMethodOptions.find((o) => o.id === id)?.label ?? id;
}

/* ---------- Wizard step labels ---------- */

export const stepLabels: string[] = [
  "Your Goal",
  "Services",
  "Business",
  "Requirements",
  "Budget & Timeline",
  "Contact",
  "Review",
];
