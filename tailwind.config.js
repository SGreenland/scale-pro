/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './public/index.html',
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      fontSize: {
       }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

