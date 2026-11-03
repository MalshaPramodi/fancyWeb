import { products } from '../config/products'
import type { BoxState } from '../store/box'

export function CookieTray({ box }: { box: BoxState }) {
  return (
    <section
      aria-label="Cookie flavours"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2"
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="relative rounded-2xl border-2 border-pine/20 bg-snow p-2 text-center"
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
        </div>
      ))}
    </section>
  )
}
