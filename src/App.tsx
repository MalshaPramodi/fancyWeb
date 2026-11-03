import { PageShell } from './components/PageShell'
import { brand } from './config/brand'
import { Stepper } from './components/Stepper'
import { BottomBar } from './components/BottomBar'
import { BuildBox } from './steps/BuildBox'
import { useBoxStore } from './store/useBoxStore'
import { boxCount, boxTotal } from './store/box'

function App() {
  const box = useBoxStore()
  return (
    <PageShell>
      <section
        className="relative pb-12 pt-10 text-center sm:pb-16 sm:pt-14"
        aria-labelledby="hero-title"
      >
        <p className="text-[10px] font-normal uppercase tracking-[0.22em] text-burgundy sm:text-xs">
          {brand.seasonLabel}
        </p>
        <h1
          id="hero-title"
          className="mt-5 font-display text-[3.25rem] font-light leading-[1.04] tracking-tight text-evergreen sm:text-7xl"
        >
          {brand.headline}
          <br />
          <span className="text-burgundy">{brand.headlineAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {brand.introduction}
        </p>
      </section>
      <Stepper currentStep={0} />
      <section
        className="rounded-card border border-line bg-ivory p-5 shadow-card sm:p-10"
        aria-labelledby="builder-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="builder-title"
              className="font-display text-2xl font-normal sm:text-4xl"
            >
              {brand.builderTitle}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              {brand.builderDescription}
            </p>
          </div>
          <span className="rounded-button border border-line px-3 py-2 text-[10px] font-normal uppercase tracking-wider text-muted">
            Preview
          </span>
        </div>
        <div className="my-8 h-px bg-line" aria-hidden="true" />
        <BuildBox />
      </section>
      <p className="mt-5 text-center text-xs text-muted">
        {brand.previewLabel}
      </p>
      <BottomBar
        count={boxCount(box)}
        capacity={box.size}
        total={boxTotal(box)}
      />
    </PageShell>
  )
}

export default App
