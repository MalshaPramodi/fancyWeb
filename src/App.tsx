import { PageShell } from './components/PageShell'
import { brand } from './config/brand'
import { Stepper } from './components/Stepper'
import { BottomBar } from './components/BottomBar'
import { BuildBox } from './steps/BuildBox'
import { useBoxStore } from './store/useBoxStore'
import { boxCount, boxTotal } from './store/box'
import { useState } from 'react'
import { Delivery } from './steps/Delivery'
import { deliveryConfig } from './config/delivery'
import { Receipt } from './components/Receipt'

type Step = 0 | 1 | 2

function App() {
  const box = useBoxStore()
  const [step, setStep] = useState<Step>(0)
  const full = boxCount(box) === box.size
  const navigate = (next: Step) => {
    setStep(next)
    requestAnimationFrame(() => {
      document.getElementById('builder-title')?.focus({ preventScroll: true })
      document
        .querySelector('[aria-label="Order progress"]')
        ?.scrollIntoView({ block: 'start' })
    })
  }
  const title =
    step === 0
      ? brand.builderTitle
      : step === 1
        ? deliveryConfig.title
        : deliveryConfig.copy.reviewTitle
  const description =
    step === 0
      ? brand.builderDescription
      : step === 1
        ? deliveryConfig.description
        : deliveryConfig.copy.reviewDescription
  return (
    <PageShell>
      {step === 0 && (
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
      )}
      <div className={step > 0 ? 'pt-10 sm:pt-14' : ''}>
        <Stepper currentStep={step} />
      </div>
      <section
        className="rounded-card border border-line bg-ivory p-5 shadow-card sm:p-10"
        aria-labelledby="builder-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="builder-title"
              tabIndex={-1}
              className="font-display text-2xl font-normal sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
          </div>
          <span className="rounded-button border border-line px-3 py-2 text-[10px] font-normal uppercase tracking-wider text-muted">
            Preview
          </span>
        </div>
        <div className="my-8 h-px bg-line" aria-hidden="true" />
        {step === 0 && <BuildBox />}
        {step === 1 && (
          <Delivery
            onContinue={() => {
              if (full) navigate(2)
            }}
          />
        )}
        {step === 2 && (
          <div className="mx-auto max-w-lg">
            <Receipt />
            <p id="next-step-help" className="mt-6 text-sm text-muted">
              {deliveryConfig.copy.reviewDescription}
            </p>
          </div>
        )}
      </section>
      <p className="mt-5 text-center text-xs text-muted">
        {brand.previewLabel}
      </p>
      <BottomBar
        count={boxCount(box)}
        capacity={box.size}
        total={boxTotal(box)}
        canGoBack={step > 0}
        canGoNext={step === 0 ? full : step === 1}
        onBack={() => navigate(step === 2 ? 1 : 0)}
        onNext={
          step === 0
            ? () => {
                if (full) navigate(1)
              }
            : undefined
        }
        nextForm={step === 1 ? 'delivery-form' : undefined}
      />
    </PageShell>
  )
}

export default App
