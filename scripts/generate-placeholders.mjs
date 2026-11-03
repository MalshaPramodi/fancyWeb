import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import theme from '../tailwind.config.js'

// Generated SVG colours share the Tailwind source of truth, including at build time.
const { colors } = theme.theme
mkdirSync('public/placeholders', { recursive: true })
const placeholders = [
  ['cookie-choco', 'Choco Chip', colors.cream],
  ['cookie-gingerbread', 'Gingerbread', colors.gold.soft],
  ['cookie-butter', 'Butter Star', colors.ivory],
  ['cookie-red-velvet', 'Red Velvet', colors.cream],
  ['cookie-cashew', 'Cashew Crunch', colors.gold.soft],
  ['cookie-coconut', 'Coconut Snow', colors.evergreen.soft],
  ['logo', 'Logo', colors.cream],
  ['box', 'Box', colors.cream],
  ['hero', 'Collection', colors.gold.soft],
]

for (const [name, label, background] of placeholders) {
  const path = `public/placeholders/${name}.svg`
  // Preserve owner-supplied replacements; regenerate only our marked placeholders.
  if (
    existsSync(path) &&
    !readFileSync(path, 'utf8').includes('Generated from Tailwind theme tokens')
  )
    continue
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" role="img">
  <title>${label} image placeholder</title>
  <desc>Neutral tinted photograph placeholder with an outline cookie silhouette.</desc>
  <!-- Generated from Tailwind theme tokens by scripts/generate-placeholders.mjs. -->
  <rect width="200" height="200" rx="6" fill="${background}"/>
  <g fill="none" stroke="${colors.evergreen.DEFAULT}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
    <circle cx="100" cy="87" r="43"/>
    <path d="m83 70 4 3-2 5-4-3Zm29-7 4 2-2 5-4-2ZM99 87l4 3-3 4-3-3Zm-24 14 4 2-1 4-4-2Zm40 6 4-2 2 4-4 2Z"/>
  </g>
  <text x="100" y="163" text-anchor="middle" fill="${colors.muted}" font-family="sans-serif" font-weight="400" font-size="8" letter-spacing="1.4">${label.toUpperCase()}</text>
  <text x="100" y="178" text-anchor="middle" fill="${colors.muted}" font-family="sans-serif" font-weight="400" font-size="7" letter-spacing="1.2">IMAGE PLACEHOLDER</text>
</svg>\n`
  writeFileSync(path, svg)
}
