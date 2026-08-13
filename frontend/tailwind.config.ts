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
          950: '#0B1426',
          900: '#111827',
          800: '#1A2332',
          700: '#243044',
          600: '#2D3D56',
        },
        gold: {
          400: '#D4AE68',
          500: '#C9A84C',
          600: '#B8962A',
        },
        parchment: '#F5F0E8',
        muted: '#8B9BB4',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
