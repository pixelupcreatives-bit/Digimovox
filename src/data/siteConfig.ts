export const siteConfig = {
  name: "MovoX",
  tagline: "Digital Growth",
  url: "https://www.heymovox.com",
  description:
    "MovoX is a digital growth agency combining creative design, branding, website development, mobile application development and digital marketing to help businesses strengthen their digital presence across India and international markets.",
  primaryColor: "#2382B8",
  secondaryColor: "#003655",
  email: undefined,
  phone: undefined,
  address: undefined,
  social: {
    instagram: undefined,
    linkedin: undefined,
    facebook: undefined,
    twitter: undefined,
  },
} as const;

export const markets = {
  default: "india" as const,
  supported: ["india", "international"] as const,
} as const;
