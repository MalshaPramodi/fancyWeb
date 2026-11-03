import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Snowfall } from './Snowfall'
import { brand } from '../config/brand'

export function PageShell({ children }: { children: ReactNode }) {
  const [snowEnabled, setSnowEnabled] = useState(() => {
    try {
      return localStorage.getItem(brand.snowfall.storageKey) !== 'false'
    } catch {
      return true
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(brand.snowfall.storageKey, String(snowEnabled))
    } catch {
      /* Snow still works when storage is unavailable. */
    }
  }, [snowEnabled])
  return (
    <div className="relative isolate min-h-svh">
      <Snowfall enabled={snowEnabled} />
      <a
        href="#main"
        className="sr-only z-50 rounded-button bg-ivory p-3 font-normal focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header
        snowEnabled={snowEnabled}
        onToggleSnow={() => setSnowEnabled((enabled) => !enabled)}
      />
      <main
        id="main"
        tabIndex={-1}
        className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
