import { products } from '../config/products'
import type { BoxState } from '../store/box'
import { boxCount } from '../store/box'
import { dispatchBox } from '../store/useBoxStore'
import { LineIcon } from './LineIcon'
import { useState } from 'react'
import { brand } from '../config/brand'

export function Box({ box }: { box: BoxState }) {
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const selection = JSON.stringify(box)
  const full = boxCount(box) === box.size
  const wrapped = full && openedFor !== selection
  return (
    <div
      id="box-drop"
      data-drop-target
      className="relative mx-auto min-h-[360px] w-full max-w-md rounded-card border border-gold/60 bg-cream/50 p-4 shadow-card sm:p-6"
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
        inert={wrapped}
        aria-hidden={wrapped}
        className={`grid gap-3 ${wrapped ? 'cookies-packing' : ''} ${box.size === 12 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-3'}`}
      >
        {box.cookies.map((id, i) => {
          const product = products.find((p) => p.id === id)
          return (
            <button
              type="button"
              disabled={!product}
              onClick={() => {
                setOpenedFor(null)
                dispatchBox({ type: 'remove', index: i })
              }}
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
      {wrapped && (
        <div className="builder-gift-lid absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden rounded-card border border-gold bg-evergreen px-6 py-8 text-center text-ivory shadow-card">
          <div
            className="pointer-events-none absolute inset-3 rounded-button border border-gold/50"
            aria-hidden="true"
          />
          <div
            className="gift-ribbon pointer-events-none absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 border-x border-gold bg-gold/20"
            aria-hidden="true"
          />
          <div
            className="gift-ribbon pointer-events-none absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 border-y border-gold bg-gold/20"
            aria-hidden="true"
          />
          <LineIcon
            name="snow"
            className="absolute left-7 top-7 size-5 text-gold/60"
          />
          <LineIcon
            name="snow"
            className="absolute bottom-7 right-7 size-7 text-gold/60"
          />
          <div className="gift-label relative flex w-full max-w-64 flex-col items-center rounded-button border border-gold/60 bg-evergreen px-3 py-5">
            <LineIcon name="ribbon" className="mb-3 size-10 text-gold" />
            <p className="text-[10px] uppercase tracking-[.18em] text-gold">
              {brand.packaging.label}
            </p>
            <p className="mt-3 font-display text-3xl leading-none">
              {brand.packaging.title}
              <br />
              <span className="italic">{brand.packaging.titleAccent}</span>
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-gold">
              {brand.name}
            </p>
            <button
              type="button"
              onClick={() => setOpenedFor(selection)}
              className="mt-4 min-h-11 rounded-button border border-gold/60 px-4 text-xs text-ivory hover:bg-gold/10"
            >
              {brand.packaging.edit}
            </button>
          </div>
        </div>
      )}
      {full && !wrapped && (
        <button
          type="button"
          onClick={() => setOpenedFor(null)}
          className="mt-4 min-h-11 w-full rounded-button border border-gold px-4 text-sm text-evergreen hover:bg-gold-soft"
        >
          {brand.packaging.close}
        </button>
      )}
    </div>
  )
}
