import { products } from '../config/products'
import type { ProductId } from '../config/products'
import type { BoxState } from '../store/box'
import { usePointerDrag } from '../lib/usePointerDrag'
import { createPortal } from 'react-dom'

export function CookieTray({
  box,
  onAdd,
}: {
  box: BoxState
  onAdd: (id: ProductId) => void
}) {
  const { bind, ghost, consumeDragClick } = usePointerDrag(onAdd)
  const draggedProduct = products.find((product) => product.id === ghost?.id)
  return (
    <>
      <section
        aria-label="Cookie flavours"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2"
      >
        {products.map((product) => (
          <button
            type="button"
            {...bind(product.id)}
            aria-label={`Add ${product.name} to your box`}
            onClick={() => {
              if (!consumeDragClick()) onAdd(product.id)
            }}
            key={product.id}
            className="relative touch-none select-none rounded-2xl border-2 border-pine/20 bg-snow p-2 text-center hover:border-pine"
          >
            <span
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-pine text-xs font-black text-snow"
              aria-label={`${box.cookies.filter((id) => id === product.id).length} selected`}
            >
              {box.cookies.filter((id) => id === product.id).length}
            </span>
            <img
              src={product.image}
              alt={`${product.name} image placeholder`}
              width={120}
              height={120}
              className="mx-auto w-24 rounded-xl"
            />
            <p className="mt-1 text-xs font-extrabold">{product.name}</p>
          </button>
        ))}
      </section>
      {ghost &&
        draggedProduct &&
        createPortal(
          <img
            src={draggedProduct.image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none fixed z-50 size-20 rounded-2xl opacity-90 shadow-card"
            style={{
              left: ghost.x,
              top: ghost.y,
              transform: 'translate(-50%, -50%) rotate(-8deg)',
            }}
          />,
          document.body,
        )}
    </>
  )
}
