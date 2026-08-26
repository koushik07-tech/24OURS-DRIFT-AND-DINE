/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-black': '#0A0A0A',
        'brand-white': '#FFFFFF',
        'brand-red': {
          DEFAULT: '#E10600',
          hover: '#FF1F1A',
          dark: '#B30500',
          glow: 'rgba(225, 6, 0, 0.4)',
        },
        carbon: {
          950: '#0A0A0A',
          900: '#121212',
          850: '#181818',
          800: '#222222',
          700: '#333333',
          600: '#4D4D4D',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F9FAFB',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(225, 6, 0, 0.5)',
        'glow-red-lg': '0 0 60px -10px rgba(225, 6, 0, 0.6)',
        'red-border': 'inset 0 0 0 1px rgba(225, 6, 0, 0.35)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(225, 6, 0, 0.15) 0%, rgba(10, 10, 10, 0) 70%)',
        'speed-lines': 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)',
        'track-dark': 'radial-gradient(ellipse at center, rgba(225, 6, 0, 0.08) 0%, rgba(10, 10, 10, 1) 75%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift-float': 'driftFloat 7s ease-in-out infinite alternate',
      },
      keyframes: {
        driftFloat: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '100%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
      },
    },
  },
  plugins: [],
};
