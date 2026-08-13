import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B13',
          900: '#0E131F',
          800: '#141A29',
          700: '#1F273A',
          600: '#2A344D',
        },
        gold: {
          400: '#DFBA6B',
          500: '#C9A84C',
          600: '#A38435',
        },
        parchment: '#F9F8F6',
        muted: '#7E8F9F',
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
