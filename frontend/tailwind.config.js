import mainTheme from './src/styles/tailwind/mainTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{ts,tsx,js,jsx}', './index.html'],
  theme: mainTheme,
  plugins: [require('tailwindcss-animate')],
}