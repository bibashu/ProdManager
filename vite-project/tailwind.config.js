const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|checkbox|input|modal|ripple|spinner|form).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        abril: ['Abril Fatface', 'cursive'],
        oleo: ['Oleo Script', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        slab: ['Roboto Slab', 'serif'],
      },
    },
  },
  
  darkMode: "class",
  plugins: [heroui()],
};
