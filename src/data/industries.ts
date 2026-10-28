export const industries = [
  "Retail & E-commerce",
  "Food & Grocery",
  "Education",
  "Healthcare",
  "Real Estate",
  "Professional Services",
  "Manufacturing",
  "Startups & Emerging Businesses",
] as const;

export const industryList = industries.map((i) => ({ label: i, value: i }));
