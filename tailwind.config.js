/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.{html,js}"], 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      colors: {
        brand: '#8b5cf6',
        accent: '#00e8f7',
        primary: '#24DBF7'
      }
    }
  },
  plugins: [],
}