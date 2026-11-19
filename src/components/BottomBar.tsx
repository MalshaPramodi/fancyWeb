import { LineIcon } from './LineIcon'
import { formatLkr } from '../lib/format'
import { extraCount, getExtraLines, getOrderTotals } from '../store/selection'
import {
  useBoxStore,
  useDeliveryStore,
  useExtrasStore,
} from '../store/useBoxStore'
import { boxCount } from '../store/box'
import { getDeliveryFee } from '../lib/delivery'

type BottomBarProps = {
  onBack?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  nextForm?: string
  nextLabel?: string
  busy?: boolean
}

export function BottomBar({
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
  nextForm,
  nextLabel = 'Next',
  busy = false,
}: BottomBarProps) {
  const extras = useExtrasStore()
  const box = useBoxStore()
  const delivery = useDeliveryStore()
  const count = boxCount(box)
  const capacity = box.size
  const totals = getOrderTotals(box, extras, getDeliveryFee(delivery.areaId))
  const lines = getExtraLines(extras)
  const quantity = extraCount(extras)
  return (
    <aside
      aria-label="Box summary and navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-card md:static md:mt-8 md:rounded-card md:border md:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-normal">
            {count > 0 ? `Box ${count}/${capacity}` : 'No gift box'}
            {quantity > 0 ? `, ${quantity} extras` : ''}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatLkr(totals.grandTotal)}
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
      {(count > 0 || lines.length > 0) && (
        <ul className="mx-auto mt-3 max-w-6xl space-y-1 border-t border-line pt-2 text-xs text-muted">
          {count > 0 && (
            <li className="flex justify-between gap-3">
              <span>
                {capacity}-cookie gift box · {count}/{capacity}
              </span>
              <span className="shrink-0">{formatLkr(totals.boxTotal)}</span>
            </li>
          )}
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3">
              <span>
                {line.name} × {line.qty}
              </span>
              <span className="shrink-0">{formatLkr(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
