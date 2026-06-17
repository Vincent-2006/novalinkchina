/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        novablue: {
          50: '#eef2ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#1a365d',
          600: '#1e2d4d',
          700: '#0f1b33',
          800: '#0a1223',
          900: '#050a14',
        },
        novagreen: {
          500: '#00a651',
          600: '#008c44',
        },
      },
    },
  },
  plugins: [],
};
