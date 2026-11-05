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
        mosam: {
          dark: "#080c16",
          darker: "#04060b",
          card: "#0f172a",
          cardBorder: "#1e293b",
          light: "#f8fafc",
          lightCard: "#ffffff",
          lightBorder: "#e2e8f0",
          sky: "#0284c7",
          sun: "#f59e0b",
          rain: "#38bdf8",
          leaf: "#10b981",
          storm: "#6366f1",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "float": "float 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
