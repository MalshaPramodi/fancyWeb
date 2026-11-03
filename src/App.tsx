import { PageShell } from './components/PageShell'
import { brand } from './config/brand'

function App() {
  return (
    <PageShell>
      <section
        className="relative py-10 text-center sm:py-14"
        aria-labelledby="hero-title"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-holly sm:text-xs">
          {brand.seasonLabel}
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight text-pine sm:text-7xl"
        >
          {brand.headline}
          <br />
          <span className="text-holly">{brand.headlineAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {brand.introduction}
        </p>
      </section>
      <section
        className="rounded-card border-2 border-pine bg-snow p-5 shadow-card sm:p-9"
        aria-labelledby="builder-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="builder-title"
              className="font-display text-3xl font-bold sm:text-4xl"
            >
              {brand.builderTitle}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              {brand.builderDescription}
            </p>
          </div>
          <span className="rounded-full border border-pine/20 bg-pine-soft px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider">
            Preview
          </span>
        </div>
        <div
          className="candy-divider my-6 h-1.5 rounded-full"
          aria-hidden="true"
        />
        <div className="flex min-h-64 flex-col items-center justify-center rounded-card border-2 border-dashed border-pine/25 bg-cream/60 p-6 text-center sm:min-h-80">
          <span
            className="mb-4 font-display text-6xl text-holly"
            aria-hidden="true"
          >
            ✧
          </span>
          <p className="font-bold">{brand.builderPlaceholder}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            {brand.builderNote}
          </p>
        </div>
      </section>
      <p className="mt-5 text-center text-xs text-muted">
        {brand.previewLabel}
      </p>
    </PageShell>
  )
}

export default App
