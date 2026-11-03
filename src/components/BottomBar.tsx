import { LineIcon } from './LineIcon'

type BottomBarProps = {
  count: number
  capacity: number
  total: number | null
  onBack?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  nextForm?: string
  nextLabel?: string
  busy?: boolean
}

export function BottomBar({
  count,
  capacity,
  total,
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
  nextForm,
  nextLabel = 'Next',
  busy = false,
}: BottomBarProps) {
  return (
    <aside
      aria-label="Box summary and navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-card md:static md:mt-8 md:rounded-card md:border md:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-normal">
            {count}/{capacity} cookies
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {total === null
              ? 'LKR — · price placeholder'
              : `LKR ${new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(total)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="min-h-11 rounded-button border border-line px-3 text-sm font-normal disabled:opacity-40 sm:px-5"
          >
            Back
          </button>
          <button
            type={nextForm ? 'submit' : 'button'}
            form={nextForm}
            aria-busy={busy}
            onClick={onNext}
            disabled={!canGoNext}
            aria-describedby={!canGoNext ? 'next-step-help' : undefined}
            className="inline-flex min-h-11 items-center gap-2 rounded-button border border-evergreen bg-evergreen px-4 text-sm font-normal text-ivory disabled:opacity-40 sm:px-6"
          >
            {nextLabel} <LineIcon name="arrow" />
          </button>
        </div>
      </div>
    </aside>
  )
}
