import { brand } from '../config/brand'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-pine/15 px-5 py-8 text-center text-sm text-muted">
      <p className="font-display text-2xl font-bold text-pine">
        {brand.footerMessage}
      </p>
      <p className="mt-2">
        {brand.name} · {brand.location}
      </p>
      <p className="mt-2 text-xs">{brand.contactPlaceholder}</p>
    </footer>
  )
}
