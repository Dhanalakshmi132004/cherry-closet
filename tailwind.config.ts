import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          cream: '#FAF6F1',
          charcoal: '#2B2622',
          terracotta: '#C1592F',
          terracottaHover: '#A64A26',
          sand: '#E8E1D8',
          muted: '#7A7168',
          success: '#4A7C59',
          error: '#B3402D',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        pill: '999px',
      }
    },
  },
  plugins: [],
};
export default config;
