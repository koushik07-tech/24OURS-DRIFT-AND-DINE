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
        brand: {
          black: "#0A0A0A",
          white: "#FFFFFF",
          red: "#E10600",
          redDark: "#B30500",
          redGlow: "rgba(225, 6, 0, 0.4)",
        },
        carbon: {
          950: "#060606",
          900: "#0D0D0D",
          850: "#141414",
          800: "#1A1A1A",
          700: "#262626",
          600: "#3A3A3A",
          500: "#555555",
          400: "#888888",
          300: "#B0B0B0",
          200: "#D4D4D4",
          100: "#EAEAEA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      boxShadow: {
        "glow-red": "0 0 25px rgba(225, 6, 0, 0.45)",
        "glow-red-lg": "0 0 45px rgba(225, 6, 0, 0.65)",
        "card-elevated": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "drift-float": "driftFloat 6s ease-in-out infinite",
      },
      keyframes: {
        driftFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
