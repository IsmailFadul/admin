/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // App Router (Next.js 13+)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Pages directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}"  // Components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5542F6',     // Main accent color
        highlight: '#eae8fb',   // Highlight elements
        bgGray: '#dfd8df',      // Background gray
      },
    },
  },
  plugins: [],
  // Optional: future-proof purge/unused CSS handling
  corePlugins: {},
};
