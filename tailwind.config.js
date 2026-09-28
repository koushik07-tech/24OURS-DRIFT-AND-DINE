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
        'brand-black': '#060608',
        'brand-obsidian': '#060608',
        'brand-white': '#FFFFFF',
        'brand-red': {
          DEFAULT: '#E10600',
          crimson: '#FF2E00',
          hover: '#FF1F1A',
          dark: '#B30500',
          glow: 'rgba(255, 46, 0, 0.45)',
        },
        carbon: {
          950: '#060608',
          900: '#0b0b0f',
          850: '#111117',
          800: '#181822',
          700: '#242430',
          600: '#363644',
          500: '#555566',
          400: '#858599',
          300: '#b5b5c7',
          200: '#dcdce8',
          100: '#f0f0f7',
        },
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'var(--font-syne)', 'sans-serif'],
        heading: ['var(--font-orbitron)', 'var(--font-syne)', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(255, 46, 0, 0.55)',
        'glow-red-lg': '0 0 60px -10px rgba(255, 46, 0, 0.7)',
        'glow-red-ambient': '0 0 80px -10px rgba(255, 46, 0, 0.35)',
        'red-border': 'inset 0 0 0 1px rgba(255, 46, 0, 0.4)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'card-glow': '0 0 0 1px rgba(255, 46, 0, 0.3), 0 20px 40px -15px rgba(255, 46, 0, 0.2)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(255, 46, 0, 0.18) 0%, rgba(6, 6, 8, 0) 70%)',
        'speed-lines': 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)',
        'track-dark': 'radial-gradient(ellipse at center, rgba(255, 46, 0, 0.1) 0%, rgba(6, 6, 8, 1) 75%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift-float': 'driftFloat 7s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        driftFloat: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '100%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
