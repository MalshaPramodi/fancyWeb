import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <a
        href="#main"
        className="sr-only z-50 rounded-button bg-snow p-3 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-5 sm:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
