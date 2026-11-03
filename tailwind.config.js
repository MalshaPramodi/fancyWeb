/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: { DEFAULT: '#173f35', dark: '#102f28', soft: '#e8eee7' },
        holly: { DEFAULT: '#a53232', dark: '#842626' },
        gold: { DEFAULT: '#e9bf68', dark: '#795a24' },
        snow: '#fffdf7',
        cream: '#f7f0e2',
        ink: '#213b32',
        muted: '#59665b',
      },
      fontFamily: {
        display: ['"Mountains of Christmas"', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '1.5rem', button: '0.875rem' },
      boxShadow: {
        chunky: '0 5px 0 #102f28',
        card: '0 12px 36px #173f3510',
      },
    },
  },
  plugins: [],
}
