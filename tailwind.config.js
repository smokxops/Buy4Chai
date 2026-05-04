/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chai: {
          50: '#FDF8F3',
          100: '#F7E9D9',
          200: '#E6D5C3',
          300: '#D4A373',
          400: '#B88B5B',
          500: '#8B5E3C',
          600: '#754F33',
          700: '#5F4029',
          800: '#4A3120',
          900: '#3D2B1F',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
