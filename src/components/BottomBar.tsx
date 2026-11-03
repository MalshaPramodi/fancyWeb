type BottomBarProps = {
  count: number
  capacity: number
  total: number | null
  onBack?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
}

export function BottomBar({
  count,
  capacity,
  total,
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
}: BottomBarProps) {
  return (
    <aside
      aria-label="Box summary and navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-pine bg-snow px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-card md:static md:mt-6 md:rounded-card md:border-2 md:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black">
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
            className="min-h-11 rounded-button border-2 border-pine px-3 text-sm font-extrabold disabled:opacity-40 sm:px-5"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            aria-describedby={!canGoNext ? 'next-step-help' : undefined}
            className="min-h-11 rounded-button border-2 border-pine bg-pine px-4 text-sm font-extrabold text-snow disabled:opacity-40 sm:px-6"
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
