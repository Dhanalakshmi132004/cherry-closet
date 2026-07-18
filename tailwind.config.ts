import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
          blue: {
            50: 'rgb(var(--brand-blue-50) / <alpha-value>)',
            100: 'rgb(var(--brand-blue-100) / <alpha-value>)',
            200: 'rgb(var(--brand-blue-200) / <alpha-value>)',
            300: 'rgb(var(--brand-blue-300) / <alpha-value>)',
            400: 'rgb(var(--brand-blue-400) / <alpha-value>)',
            500: 'rgb(var(--brand-blue-500) / <alpha-value>)',
            600: 'rgb(var(--brand-blue-600) / <alpha-value>)',
            700: 'rgb(var(--brand-blue-700) / <alpha-value>)',
            800: 'rgb(var(--brand-blue-800) / <alpha-value>)',
            900: 'rgb(var(--brand-blue-900) / <alpha-value>)',
            950: 'rgb(var(--brand-blue-950) / <alpha-value>)',
          },
          white: 'rgb(var(--brand-white) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
          error: 'rgb(var(--brand-error) / <alpha-value>)',
          success: 'rgb(var(--brand-success) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.06)',
        premium: '0 20px 40px -15px rgba(29, 78, 216, 0.15)',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        pill: '999px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
