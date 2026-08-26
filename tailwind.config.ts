import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
        },
        muted: "var(--muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          foreground: "var(--accent-foreground)",
        },
        brand: {
          50: "#FDFBF7",
          100: "#F9F3E8",
          200: "#F2E4CA",
          300: "#E8CE9D",
          400: "#D4AF37",
          500: "#B8860B", // Signature Polished Gold
          600: "#A27409",
          700: "#835C07",
          800: "#654605",
          900: "#473003",
        },
        gold: {
          50: "#FCFAF6",
          100: "#F7F2E7",
          200: "#EFE2C6",
          300: "#E3CEA0",
          400: "#D4B673",
          500: "#C59B3F",
          600: "#B0852E",
          700: "#8E671E",
          800: "#6B4D16",
          900: "#48330E",
        },
        champagne: {
          50: "#FAF8F5",
          100: "#F5EFEB",
          200: "#ECE2D8",
          300: "#DFD0C1",
          400: "#CDBAA8",
          500: "#B7A18E",
          600: "#9C8573",
          700: "#7E6A5A",
          800: "#5D4D41",
          900: "#3D3128",
        },
        dark: {
          50: "#FAF8F5",
          100: "#F2EBE3",
          200: "#DCD0C3",
          300: "#A89A8D",
          400: "#7A6D62",
          500: "#5A4E45",
          600: "#443931",
          700: "#332A23",
          800: "#261E18",
          900: "#1C1510",
          950: "#130E0A",
        },
        status: {
          upcoming: "var(--status-upcoming)",
          live: "var(--status-live)",
          completed: "var(--status-completed)",
          cancelled: "var(--status-cancelled)",
          postponed: "var(--status-postponed)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        accent: "0 4px 20px -2px rgba(184, 134, 11, 0.25)",
        card: "0 8px 30px rgba(184, 134, 11, 0.08)",
        gold: "0 10px 30px -5px rgba(197, 155, 63, 0.2)",
        "gold-lg": "0 20px 40px -10px rgba(197, 155, 63, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
