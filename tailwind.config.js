import theme from './src/theme.js';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: theme.colors.background,
        surface: theme.colors.surface,
        accent: theme.colors.primary, // Using primary as the main accent
        text: theme.colors.text,
        textSecondary: theme.colors.textSecondary,
        danger: theme.colors.tertiary, 
        success: theme.colors.secondary,
        border: theme.colors.border,
      },
      boxShadow: {
        glow: `0 0 10px ${theme.colors.glow}`,
      },
    },
  },
  plugins: [],
};

export default config;
