import { brand } from './src/config/brand.ts'

const colors = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',
  evergreen: { DEFAULT: '#203c34', dark: '#172e27', soft: '#e8ece7' },
  burgundy: { DEFAULT: '#783b47', dark: '#60303a' },
  gold: { DEFAULT: '#ad976c', dark: '#75633f', soft: '#ede6d8' },
  ivory: '#fcfaf5',
  cream: '#f3efe7',
  ink: '#293b33',
  muted: '#666d65',
  line: '#d8d8ce',
  ice: brand.snowfall.color,
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors,
    snowDensity: brand.snowfall.count,
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '0.375rem', button: '0.25rem' },
      boxShadow: { card: `0 8px 30px ${colors.evergreen.DEFAULT}08` },
      transitionDuration: { gentle: '700ms' },
      transitionTimingFunction: { gentle: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    },
  },
  plugins: [],
}
