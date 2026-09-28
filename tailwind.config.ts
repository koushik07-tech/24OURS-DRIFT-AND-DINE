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
          black: "#060608",
          obsidian: "#060608",
          white: "#FFFFFF",
          red: "#E10600",
          crimson: "#FF2E00",
          redDark: "#B30500",
          redGlow: "rgba(255, 46, 0, 0.45)",
        },
        carbon: {
          950: "#060608",
          900: "#0b0b0f",
          850: "#111117",
          800: "#181822",
          700: "#242430",
          600: "#363644",
          500: "#555566",
          400: "#858599",
          300: "#b5b5c7",
          200: "#dcdce8",
          100: "#f0f0f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-orbitron)", "var(--font-syne)", "sans-serif"],
        display: ["var(--font-orbitron)", "var(--font-syne)", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      boxShadow: {
        "glow-red": "0 0 25px rgba(255, 46, 0, 0.45)",
        "glow-red-lg": "0 0 45px rgba(255, 46, 0, 0.65)",
        "glow-red-ambient": "0 0 80px -10px rgba(255, 46, 0, 0.35)",
        "card-elevated": "0 20px 40px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "card-glow": "0 0 0 1px rgba(255, 46, 0, 0.3), 0 20px 40px -15px rgba(255, 46, 0, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "drift-float": "driftFloat 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        driftFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
