import type { CSSProperties } from 'react'
import '../styles/festive.css'

export function FestiveEffects({ enabled }: { enabled: boolean }) {
  return (
    <div
      className="festive-effects absolute inset-x-0 bottom-0"
      data-animated={enabled}
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
    </div>
  )
}
