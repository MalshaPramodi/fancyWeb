import { useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import '../styles/festive.css'

const motionQuery = '(prefers-reduced-motion: reduce)'
const subscribe = (callback: () => void) => {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches

export function FestiveEffects({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    getReducedMotion,
    () => true,
  )
  return (
    <>
      <div
        className="festive-effects"
        data-animated={enabled && !reducedMotion}
        aria-hidden="true"
      >
        <div className="light-string">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              className="bulb"
              key={i}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </div>
        {enabled && !reducedMotion && (
          <div className="snowfall">
            {Array.from({ length: 18 }, (_, i) => (
              <span
                className="snowflake"
                key={i}
                style={{ '--i': i } as CSSProperties}
              >
                ✦
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto flex max-w-6xl justify-end px-5 pt-7 sm:px-8">
        <button
          type="button"
          aria-pressed={enabled}
          onClick={onToggle}
          className="min-h-11 rounded-full border border-pine/25 bg-snow px-4 text-xs font-bold text-pine"
        >
          <span aria-hidden="true">{enabled ? '✧' : '○'} </span>Snow & lights:{' '}
          {enabled ? 'on' : 'off'}
        </button>
      </div>
    </>
  )
}
