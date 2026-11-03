import { products } from '../config/products'
import type { BoxState } from '../store/box'
import { boxCount } from '../store/box'
import { dispatchBox } from '../store/useBoxStore'

export function Box({ box }: { box: BoxState }) {
  return (
    <div
      id="box-drop"
      data-drop-target
      className="relative mx-auto w-full max-w-md rounded-card border-[3px] border-pine bg-cream p-4 shadow-chunky sm:p-6"
      role="group"
      aria-label="Your cookie box"
    >
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-pine/20 pb-3">
        <span className="text-xs font-black uppercase tracking-widest">
          Made by you
        </span>
        <span className="rounded-full bg-pine px-3 py-1 text-xs font-bold text-snow">
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
              className="flex aspect-square min-w-0 items-center justify-center rounded-2xl border-2 border-dashed border-pine/25 bg-snow/70"
              aria-label={
                product
                  ? `Remove ${product.name} from slot ${i + 1}`
                  : `Slot ${i + 1}: empty`
              }
            >
              {product ? (
                <img
                  key={`${i}-${product.id}`}
                  src={product.image}
                  alt={product.name}
                  className="slot-filled size-full rounded-2xl object-contain"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="font-display text-2xl text-pine/35"
                >
                  +
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2" aria-hidden="true">
        <span className="h-2 flex-1 rounded bg-holly" />
        <span className="font-display text-xl text-holly">∞</span>
        <span className="h-2 flex-1 rounded bg-holly" />
      </div>
    </div>
  )
}
