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
          <img
            src={brand.images.logo}
            width={44}
            height={44}
            alt="Logo placeholder"
            className="size-11"
          />
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
