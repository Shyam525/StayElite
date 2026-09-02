import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF385C',
          hover: '#E31C5F',
        },
        secondary: '#222222',
        muted: '#717171',
        surface: '#F7F7F7',
        border: '#DDDDDD',
        white: '#FFFFFF',
        success: '#008A05',
        overlay: 'rgba(0,0,0,0.5)',
      },
      fontSize: {
        '2xs': '0.65rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      boxShadow: {
        'card': '0 6px 16px rgba(0,0,0,0.12)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.2)',
        'search': '0 3px 12px rgba(0,0,0,0.15)',
        'search-hover': '0 4px 20px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
