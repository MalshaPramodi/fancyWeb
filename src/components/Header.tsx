import { brand } from '../config/brand'

export function Header() {
  return (
    <header className="border-b border-pine/15 bg-snow">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <a
          href="#main"
          className="flex items-center gap-3"
          aria-label={`${brand.name} home`}
        >
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border-2 border-pine bg-gold font-display text-3xl font-bold"
          >
            f
          </span>
          <span className="font-display text-3xl font-bold tracking-tight">
            {brand.name}
          </span>
        </a>
        <span className="max-w-28 text-right text-xs font-extrabold uppercase tracking-widest text-pine sm:max-w-none">
          {brand.title}
        </span>
      </div>
    </header>
  )
}
