import { products } from '../config/products'
import type { BoxState } from '../store/box'
import { boxCount } from '../store/box'
import { dispatchBox } from '../store/useBoxStore'
import { LineIcon } from './LineIcon'

export function Box({ box }: { box: BoxState }) {
  return (
    <div
      id="box-drop"
      data-drop-target
      className="relative mx-auto w-full max-w-md rounded-card border border-gold/60 bg-cream/50 p-4 shadow-card sm:p-6"
      role="group"
      aria-label="Your cookie box"
    >
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-evergreen/20 pb-3">
        <span className="text-xs font-normal uppercase tracking-widest">
          Made by you
        </span>
        <span className="rounded-button border border-line px-3 py-1 text-xs font-normal text-muted">
          {boxCount(box)} / {box.size}
        </span>
      </div>
      <div
        className={`grid gap-3 ${box.size === 12 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-3'}`}
      >
        {box.cookies.map((id, i) => {
          const product = products.find((p) => p.id === id)
          return (
            <button
              type="button"
              disabled={!product}
              onClick={() => dispatchBox({ type: 'remove', index: i })}
              key={i}
              className="flex aspect-square min-w-0 items-center justify-center rounded-card border border-line bg-ivory/70 hover:enabled:border-gold"
              aria-label={
                product
                  ? `Remove ${product.name} from slot ${i + 1}`
                  : `Slot ${i + 1}: empty`
              }
            >
              {product ? (
                <img
                  draggable={false}
                  key={`${i}-${product.id}`}
                  src={product.image}
                  alt={product.name}
                  className="slot-filled size-full rounded-card object-contain"
                />
              ) : (
                <LineIcon name="plus" className="size-4 text-evergreen/25" />
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2" aria-hidden="true">
        <span className="h-px flex-1 bg-gold" />
        <LineIcon name="ribbon" className="size-7 text-gold" />
        <span className="h-px flex-1 bg-gold" />
      </div>
    </div>
  )
}
