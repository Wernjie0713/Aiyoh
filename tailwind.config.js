/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-lighter': '#121212',
        'primary-light': '#1A1A1A',
        secondary: '#ffffff',
        accent: '#FF6600',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'jost': ['Jost', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      keyframes: {
        rewardPopup: {
          '0%': { opacity: 0, transform: 'scale(0.5) translateY(20px)' },
          '20%': { opacity: 1, transform: 'scale(1.2) translateY(0)' },
          '80%': { opacity: 1, transform: 'scale(1) translateY(0)' },
          '100%': { opacity: 0, transform: 'scale(1) translateY(-20px)' }
        }
      },
      animation: {
        'reward-popup': 'rewardPopup 2s ease-out forwards'
      }
    },
  },
  plugins: [],
} 