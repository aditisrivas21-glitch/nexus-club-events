/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"DM Sans"', 'system-ui', 'sans-serif'], display: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
      colors: { ink: '#12132B', paper: '#F6F5FB', volt: { DEFAULT: '#6446F0', dark: '#4C32C9' }, coral: { DEFAULT: '#FF6A55', dark: '#E8523D' } },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'none' } },
        tilt: { '0%,100%': { transform: 'rotate(-3deg) translateY(0)' }, '50%': { transform: 'rotate(-1.5deg) translateY(-8px)' } },
        pop: { '0%': { transform: 'scale(.6)', opacity: 0 }, '70%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: { rise: 'rise .6s ease-out both', tilt: 'tilt 7s ease-in-out infinite', pop: 'pop .5s ease-out both' },
    },
  },
  plugins: [],
};
