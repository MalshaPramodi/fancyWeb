import { Box } from '../components/Box'
import { CookieTray } from '../components/CookieTray'
import { dispatchBox, useBoxStore } from '../store/useBoxStore'
import { boxSizes, productConfig, products } from '../config/products'
import type { ProductId } from '../config/products'
import { boxCount } from '../store/box'
import { useState } from 'react'

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
      <p className="mb-6 rounded-button bg-gold/20 px-4 py-3 text-center text-xs font-bold text-gold-dark">
        {productConfig.priceNotice}
      </p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <fieldset>
          <legend className="mb-2 text-xs font-black uppercase tracking-widest">
            Choose your box
          </legend>
          <div className="flex gap-2">
            {boxSizes.map((size) => (
              <button
                type="button"
                key={size}
                aria-pressed={box.size === size}
                onClick={() => dispatchBox({ type: 'resize', size })}
                className={`min-h-11 rounded-button border-2 border-pine px-4 text-sm font-extrabold ${box.size === size ? 'bg-pine text-snow' : 'bg-snow'}`}
              >
                {size} cookies
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
          className="min-h-11 rounded-button border-2 border-pine bg-gold px-4 text-sm font-black shadow-chunky"
        >
          Surprise me ✧
        </button>
      </div>
      <p className="mb-5 text-xs text-muted">
        A smaller box keeps as many of your selected cookies as it can.
      </p>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="order-2 lg:order-1">
          <CookieTray box={box} onAdd={add} />
        </div>
        <div
          key={fullFeedback}
          className={`order-1 lg:order-2 ${fullFeedback > 0 ? 'box-full-shake' : ''}`}
        >
          <Box box={box} />
        </div>
      </div>
      <p id="next-step-help" className="mt-5 text-center text-sm text-muted">
        Drag a cookie into the box, or tap to add. Tap a packed cookie to remove
        it. Keyboard: Tab to a cookie, then Enter or Space.
      </p>
      <p role="status" className="mt-2 text-center text-sm font-bold">
        {count === box.size
          ? 'Box is full! Remove a cookie to make room for another.'
          : `${count} of ${box.size} cookies packed.`}
      </p>
    </div>
  )
}
