import { products, productConfig } from '../config/products'
import { useBoxStore } from '../store/useBoxStore'
import { boxCount, boxTotal } from '../store/box'
import { formatLkr } from '../lib/format'

export function Receipt({ deliveryFee = 0 }: { deliveryFee?: number }) {
  const box = useBoxStore()
  return (
    <aside
      aria-label="Your box receipt"
      className="receipt-in rounded-card border-2 border-pine/30 bg-snow p-5 shadow-card"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-holly">
        A little box of joy
      </p>
      <h3 className="mt-1 font-display text-3xl font-bold">Your receipt</h3>
      <p className="mt-1 text-xs text-muted">
        {boxCount(box)} / {box.size} cookies
      </p>
      <ul className="my-5 space-y-2 text-sm">
        {products.map((product) => {
          const count = box.cookies.filter((id) => id === product.id).length
          return count > 0 ? (
            <li key={product.id} className="flex justify-between gap-3">
              <span>{product.name}</span>
              <span className="font-bold">× {count}</span>
            </li>
          ) : null
        })}
      </ul>
      <dl className="space-y-2 border-t border-dashed border-pine/30 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt>{box.size}-cookie box</dt>
          <dd>{formatLkr(productConfig.prices[box.size])}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Delivery</dt>
          <dd>{formatLkr(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-pine/20 pt-3 font-black">
          <dt>Total</dt>
          <dd>{formatLkr(boxTotal(box, deliveryFee))}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs font-bold text-holly">
        All prices are placeholders.
      </p>
    </aside>
  )
}
