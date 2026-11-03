import { Box } from '../components/Box'
import { CookieTray } from '../components/CookieTray'
import { dispatchBox, useBoxStore } from '../store/useBoxStore'
import { boxSizes, productConfig, products } from '../config/products'
import type { ProductId } from '../config/products'
import { boxCount } from '../store/box'
import { useState } from 'react'
import { Receipt } from '../components/Receipt'
import { LineIcon } from '../components/LineIcon'
import { brand } from '../config/brand'

export function BuildBox() {
  const box = useBoxStore()
  const [fullFeedback, setFullFeedback] = useState(0)
  const count = boxCount(box)
  const add = (id: ProductId) => {
    if (count === box.size) setFullFeedback((value) => value + 1)
    else dispatchBox({ type: 'add', id })
  }
  return (
    <div>
      <p className="mb-8 rounded-button bg-gold-soft/50 px-4 py-3 text-center text-xs font-normal text-gold-dark">
        {productConfig.priceNotice}
      </p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <fieldset>
          <legend className="mb-2 text-xs font-normal uppercase tracking-widest">
            Box size · cookies
          </legend>
          <div className="flex gap-2">
            {boxSizes.map((size) => (
              <button
                type="button"
                key={size}
                aria-pressed={box.size === size}
                onClick={() => dispatchBox({ type: 'resize', size })}
                className={`min-h-11 min-w-11 rounded-button border px-4 text-sm font-normal ${box.size === size ? 'border-evergreen bg-evergreen text-ivory' : 'border-line bg-ivory hover:border-gold'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={() => {
            for (let i = count; i < box.size; i++)
              dispatchBox({
                type: 'add',
                id: products[Math.floor(Math.random() * products.length)].id,
              })
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-button border border-line bg-ivory px-4 text-sm font-normal hover:border-gold"
        >
          <LineIcon name="shuffle" /> Surprise me
        </button>
      </div>
      <p className="mb-5 text-xs text-muted">
        A smaller box keeps as many of your selected cookies as it can.
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-[.9fr_1.3fr_.9fr]">
        <div className="order-2 lg:order-1">
          <CookieTray box={box} onAdd={add} />
        </div>
        <div
          className={`order-1 lg:order-2 ${fullFeedback > 0 ? 'box-full-feedback' : ''}`}
        >
          <Box box={box} />
        </div>
        {count > 0 && (
          <div className="order-3">
            <Receipt />
          </div>
        )}
      </div>
      <p id="next-step-help" className="mt-5 text-center text-sm text-muted">
        Drag or tap to add. Tap a packed cookie to remove it. Keyboard: Tab,
        then Enter or Space.
      </p>
      <p role="status" className="mt-2 text-center text-sm font-normal">
        {count === box.size
          ? brand.packaging.ready
          : `${count} of ${box.size} cookies packed.`}
      </p>
    </div>
  )
}
