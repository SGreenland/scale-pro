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
      },
      width: {
        tempo: 'calc(200% - 4px)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

