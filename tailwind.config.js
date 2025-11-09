/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        cyan: colors.cyan,
        'genesis-bg-dark': '#0a0f18',
        'genesis-bg': '#111827',
        'genesis-surface': '#1a2233',
        'genesis-border': '#303a52',
        'genesis-text-light': '#e5e7eb',
        'genesis-text': '#9ca3af',
        'genesis-text-dim': '#6b7280',
        'genesis-cyan': '#22d3ee',
        'genesis-purple': '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
       boxShadow: {
        'cyan-500/5': '0 0 15px 5px rgba(34, 211, 238, 0.05)',
      }
    },
  },
  plugins: [],
}
