/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#1a1a1a',
      }
    }
  },
  darkMode: 'class', // Enable dark mode support
  plugins: [],
}

