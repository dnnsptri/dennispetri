/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sailec)', 'sans-serif'],
      },
      colors: {
        white: '#FFFFFF',
        light: '#E9E9E7',
        yellow: '#FFFF33',
        dark: '#2A2C2B',
      },
    },
  },
  plugins: [],
}