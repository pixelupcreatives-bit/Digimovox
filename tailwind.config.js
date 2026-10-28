/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colours
        primary: {
          DEFAULT: "#2382B8",
          hover: "#1C6C99",
          active: "#17587D",
          light: "#EAF5FB",
          subtle: "#F3F9FC",
        },
        // Secondary / navy
        navy: {
          DEFAULT: "#003655",
          hover: "#002941",
          "hover-border": "#002941",
          light: "#E6EEF3",
        },
        // Backgrounds
        bg: {
          main: "#FFFFFF",
          soft: "#F7FAFC",
          muted: "#EFF4F7",
          blue: "#EAF5FB",
          dark: "#003655",
          "dark-soft": "#052F47",
        },
        // Text
        text: {
          primary: "#18313F",
          secondary: "#5D7180",
          muted: "#718391",
          inverse: "#FFFFFF",
          link: "#176B9B",
        },
        // Borders
        border: {
          DEFAULT: "#DCE5EB",
          strong: "#C4D3DD",
          focus: "#2382B8",
        },
        // Semantic
        success: "#16835B",
        "success-bg": "#E9F7F0",
        warning: "#A86408",
        "warning-bg": "#FFF5E5",
        error: "#C0392B",
        "error-bg": "#FDEDEC",
        info: "#176B9B",
        "info-bg": "#EAF5FB",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Manrope", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero-desktop": ["clamp(2.5rem, 5vw, 4.75rem)", { lineHeight: "1.05" }],
        "hero-mobile": ["clamp(1.5rem, 4vw, 2.875rem)", { lineHeight: "1.15" }],
        "section-heading-desktop": ["clamp(1.75rem, 3vw, 3rem)", { lineHeight: "1.2" }],
        "section-heading-mobile": ["clamp(1.25rem, 2.5vw, 2.25rem)", { lineHeight: "1.25" }],
        body: ["1rem", { lineHeight: "1.7" }],
        supporting: ["0.875rem", { lineHeight: "1.6" }],
      },
      spacing: {
        // 8px grid (0.5rem = 8px)
      },
      borderRadius: {
        card: "8px",
        "card-lg": "12px",
        button: "8px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
