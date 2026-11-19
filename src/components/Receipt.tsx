import { products } from '../config/products'
import {
  useBoxStore,
  useDeliveryStore,
  useExtrasStore,
} from '../store/useBoxStore'
import { boxCount } from '../store/box'
import { getOrderTotals, getExtraLines } from '../store/selection'
import type { OrderPayload } from '../store/order'
import { formatLkr } from '../lib/format'
import { getDeliveryFee } from '../lib/delivery'
import { deliveryConfig } from '../config/delivery'

export function Receipt({
  deliveryFee,
  order,
}: {
  deliveryFee?: number
  order?: OrderPayload
}) {
  const box = useBoxStore()
  const extras = useExtrasStore()
  const delivery = useDeliveryStore()
  const fee = deliveryFee ?? getDeliveryFee(delivery.areaId)
  const selectedBox = order ? order.box : boxCount(box) ? box : null
  const lines = order ? order.extras : getExtraLines(extras)
  const totals = order ? order.totals : getOrderTotals(box, extras, fee)
  return (
    <aside
      aria-label="Your order receipt"
      className="receipt-in rounded-card border border-line bg-ivory p-6 shadow-card"
    >
      <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-burgundy">
        Your selection
      </p>
      <h3 className="mt-2 font-display text-3xl font-normal">Order summary</h3>
      {selectedBox && (
        <p className="mt-1 text-xs text-muted">
          {selectedBox.cookies.filter(Boolean).length} / {selectedBox.size}{' '}
          cookies
        </p>
      )}
      {selectedBox && (
        <div className="mt-5 flex justify-between gap-3 text-sm">
          <p>{selectedBox.size}-cookie gift box</p>
          <p className="shrink-0">{formatLkr(totals.boxTotal)}</p>
        </div>
      )}
      {selectedBox && (
        <ul className="my-4 space-y-2 text-xs text-muted">
          {products.map((product) => {
            const count = selectedBox.cookies.filter(
              (id) => id === product.id,
            ).length
            return count > 0 ? (
              <li key={product.id} className="flex justify-between gap-3">
                <span>{product.name}</span>
                <span className="font-normal">× {count}</span>
              </li>
            ) : null
          })}
        </ul>
      )}
      <ul className="my-5 space-y-4 text-sm">
        {lines.map((line) => (
          <li key={line.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p>{line.name}</p>
              <p className="mt-1 text-xs text-muted">
                {line.qty} × {formatLkr(line.unitPrice)}
              </p>
            </div>
            <span className="shrink-0">{formatLkr(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex justify-between gap-3">
          <dt>Delivery</dt>
          <dd>
            {order || delivery.areaId || deliveryFee !== undefined
              ? formatLkr(totals.deliveryFee)
              : deliveryConfig.copy.areaPrompt}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-evergreen/20 pt-3 font-normal">
          <dt>Total</dt>
          <dd>{formatLkr(totals.grandTotal)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs font-normal text-burgundy">
        All prices are placeholders.
      </p>
    </aside>
  )
}
