import { PageShell } from './components/PageShell'
import { brand } from './config/brand'
import { Stepper } from './components/Stepper'
import { BottomBar } from './components/BottomBar'
import { BuildBox } from './steps/BuildBox'
import {
  useBoxStore,
  useDeliveryStore,
  usePaymentStore,
  useConfirmationStore,
  getOrderSnapshot,
  completeMockOrder,
  resetOrder,
  updatePayment,
} from './store/useBoxStore'
import { boxCount, boxTotal } from './store/box'
import { useRef, useState } from 'react'
import { Delivery } from './steps/Delivery'
import { deliveryConfig } from './config/delivery'
import { Payment } from './steps/Payment'
import { paymentConfig } from './config/payment'
import { getDeliveryFee, validateDelivery } from './lib/delivery'
import { Done } from './steps/Done'
import { submitMockOrder } from './lib/mockOrder'

type Step = 0 | 1 | 2 | 3

function App() {
  const box = useBoxStore()
  const delivery = useDeliveryStore()
  const payment = usePaymentStore()
  const order = useConfirmationStore()
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [deliveryReview, setDeliveryReview] = useState(false)
  const submissionLock = useRef(false)
  const [step, setStep] = useState<Step>(0)
  const full = boxCount(box) === box.size
  const navigate = (next: Step, focusId = 'builder-title') => {
    setStep(next)
    requestAnimationFrame(() => {
      document.getElementById('builder-title')?.focus({ preventScroll: true })
      document
        .querySelector('[aria-label="Order progress"]')
        ?.scrollIntoView({ block: 'start' })
      if (focusId !== 'builder-title') document.getElementById(focusId)?.focus()
    })
  }
  const confirm = async () => {
    if (submissionLock.current) return
    const current = getOrderSnapshot()
    if (boxCount(current.box) !== current.box.size) {
      navigate(0)
      return
    }
    const invalid = Object.keys(validateDelivery(current.delivery))[0]
    if (invalid) {
      updatePayment({ confirmed: false })
      setDeliveryReview(true)
      navigate(1, `delivery-${invalid}`)
      return
    }
    if (
      !current.payment.slip ||
      !current.payment.confirmed ||
      current.payment.preparing
    )
      return
    submissionLock.current = true
    setSubmitting(true)
    setSubmissionError('')
    try {
      completeMockOrder(await submitMockOrder())
      navigate(3)
    } catch {
      setSubmissionError(paymentConfig.errors.submission)
    } finally {
      submissionLock.current = false
      setSubmitting(false)
    }
  }
  const orderAgain = () => {
    resetOrder()
    setDeliveryReview(false)
    setSubmissionError('')
    navigate(0)
  }
  const title =
    step === 0
      ? brand.builderTitle
      : step === 1
        ? deliveryConfig.title
        : step === 2
          ? paymentConfig.title
          : paymentConfig.done.title
  const description =
    step === 0
      ? brand.builderDescription
      : step === 1
        ? deliveryConfig.description
        : step === 2
          ? paymentConfig.description
          : paymentConfig.done.description
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
            showErrors={deliveryReview}
            onContinue={() => {
              if (full) {
                setDeliveryReview(false)
                navigate(2)
              }
            }}
          />
        )}
        {step === 2 && (
          <Payment
            onConfirm={() => void confirm()}
            submitting={submitting}
            error={submissionError}
          />
        )}
        {step === 3 && order && (
          <Done order={order} onOrderAgain={orderAgain} />
        )}
      </section>
      <p className="mt-5 text-center text-xs text-muted">
        {brand.previewLabel}
      </p>
      {step < 3 && (
        <BottomBar
          count={boxCount(box)}
          capacity={box.size}
          total={boxTotal(box, getDeliveryFee(delivery.areaId))}
          canGoBack={step > 0 && !submitting}
          canGoNext={step === 0 ? full : !submitting && !payment.preparing}
          busy={submitting}
          nextLabel={
            step === 2
              ? submitting
                ? paymentConfig.copy.confirming
                : paymentConfig.copy.confirm
              : 'Next'
          }
          onBack={() => navigate(step === 2 ? 1 : 0)}
          onNext={
            step === 0
              ? () => {
                  if (full) navigate(1)
                }
              : undefined
          }
          nextForm={
            step === 1
              ? 'delivery-form'
              : step === 2
                ? 'payment-form'
                : undefined
          }
        />
      )}
    </PageShell>
  )
}

export default App
