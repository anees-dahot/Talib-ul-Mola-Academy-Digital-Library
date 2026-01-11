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
        brand: {
          DEFAULT: '#264F41', // Deep Green
          light: '#3B6B5A',
          dark: '#1E3E34',
          50: '#F2F7F5',
          100: '#E6EFEC',
          200: '#C0D8CF',
          300: '#9AC0B2',
          400: '#4F8F75',
          500: '#264F41',
          600: '#1F3F34',
          700: '#182F27',
          800: '#11201A',
          900: '#0A100D',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          background: '#F7F9F8', // Very light warm gray
          muted: '#F3F4F6',
        },
        gold: {
          DEFAULT: '#C9A24D', // Muted Gold
          light: '#D4B63E',
          muted: '#C9A24D',
        },
        text: {
          primary: '#1F2933',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        serif: ['Amiri', 'serif'], // Keep for Arabic/Urdu if needed
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
export default config;