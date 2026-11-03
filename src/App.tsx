import { PageShell } from './components/PageShell'
import { brand } from './config/brand'
import { Stepper } from './components/Stepper'
import { BottomBar } from './components/BottomBar'
import { BuildBox } from './steps/BuildBox'

function App() {
  return (
    <PageShell>
      <section
        className="relative py-6 text-center sm:py-10"
        aria-labelledby="hero-title"
      >
        <img
          src={brand.images.hero}
          alt=""
          width={180}
          height={130}
          className="pointer-events-none absolute left-0 top-10 hidden lg:block"
        />
        <img
          src={brand.images.hero}
          alt=""
          width={180}
          height={130}
          className="pointer-events-none absolute right-0 top-10 hidden -scale-x-100 lg:block"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-holly sm:text-xs">
          {brand.seasonLabel}
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-pine sm:text-7xl"
        >
          {brand.headline}
          <br />
          <span className="text-holly">{brand.headlineAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {brand.introduction}
        </p>
      </section>
      <Stepper currentStep={0} />
      <section
        className="rounded-card border-2 border-pine bg-snow p-5 shadow-card sm:p-9"
        aria-labelledby="builder-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="builder-title"
              className="font-display text-2xl font-bold sm:text-4xl"
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
        <BuildBox />
      </section>
      <p className="mt-5 text-center text-xs text-muted">
        {brand.previewLabel}
      </p>
      <BottomBar count={0} capacity={brand.previewBoxSize} total={null} />
    </PageShell>
  )
}

export default App
