import { brand } from '../config/brand'
import { LineIcon } from './LineIcon'
import { FestiveEffects } from './FestiveEffects'

export function Header({
  snowEnabled,
  onToggleSnow,
}: {
  snowEnabled: boolean
  onToggleSnow: () => void
}) {
  return (
    <header className="relative z-10 border-b border-evergreen/15 bg-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-6 sm:px-8 sm:py-7">
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
          <span className="font-display text-2xl font-normal tracking-tight sm:text-3xl">
            {brand.name}
          </span>
        </a>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="max-w-28 text-right text-[10px] font-normal uppercase leading-relaxed tracking-[0.15em] text-muted sm:max-w-none">
            {brand.title}
          </span>
          <button
            type="button"
            aria-label="Snowfall"
            aria-pressed={snowEnabled}
            onClick={onToggleSnow}
            className="inline-flex min-h-11 w-28 items-center justify-center gap-2 rounded-button border border-line bg-ivory px-3 text-[11px] text-muted hover:border-gold"
          >
            <LineIcon name="snow" /> Snow: {snowEnabled ? 'on' : 'off'}
          </button>
        </div>
      </div>
      <FestiveEffects enabled={snowEnabled} />
    </header>
  )
}
