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
          cream: '#FFFFFF',
          charcoal: '#0F172A',
          terracotta: '#2563EB',
          terracottaHover: '#1D4ED8',
          sand: '#E2E8F0',
          muted: '#64748B',
          success: '#3B82F6',
          error: '#1E3A8A',
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
