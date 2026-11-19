import { extraProducts, extrasCopy } from '../config/products'
import { formatLkr } from '../lib/format'
import { getExtraLines } from '../store/selection'
import { updateExtra, useExtrasStore } from '../store/useBoxStore'

export function ExtraProducts() {
  const extras = useExtrasStore()
  const lines = getExtraLines(extras)
  return (
    <section
      className="mt-12 border-t border-line pt-10"
      aria-labelledby="extras-title"
    >
      <h3 id="extras-title" className="font-display text-3xl sm:text-4xl">
        {extrasCopy.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{extrasCopy.description}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {extraProducts.map((product) => {
          const qty = extras[product.id] ?? 0
          const line = lines.find((item) => item.id === product.id)
          return (
            <article
              key={product.id}
              className="min-w-0 rounded-card border border-line bg-ivory p-5"
              aria-labelledby={`${product.id}-title`}
            >
              <img
                src={product.image}
                alt={`${product.name} image placeholder`}
                width={200}
                height={200}
                className="mx-auto aspect-square w-full max-w-48 rounded-card object-contain"
                loading="lazy"
              />
              <h4
                id={`${product.id}-title`}
                className="mt-5 font-display text-2xl"
              >
                {product.name}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
              <p className="mt-4 text-sm">
                {formatLkr(product.unitPrice)}{' '}
                <span className="text-xs text-burgundy">
                  · {extrasCopy.placeholderPrice}
                </span>
              </p>
              <label
                htmlFor={`${product.id}-qty`}
                className="mt-5 block text-xs text-muted"
              >
                {extrasCopy.quantity}
              </label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease ${product.name} quantity`}
                  onClick={() => updateExtra(product.id, qty - 1)}
                  disabled={qty === 0}
                  className="min-h-11 min-w-11 rounded-button border border-line text-xl hover:border-gold disabled:opacity-40"
                >
                  −
                </button>
                <input
                  id={`${product.id}-qty`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={product.maxQuantity}
                  step={1}
                  value={qty}
                  aria-label={`${product.name} quantity`}
                  aria-describedby={`${product.id}-limit`}
                  onChange={(event) =>
                    updateExtra(
                      product.id,
                      event.target.value === ''
                        ? 0
                        : event.target.valueAsNumber,
                    )
                  }
                  className="form-control w-20 text-center"
                />
                <button
                  type="button"
                  aria-label={`Increase ${product.name} quantity`}
                  onClick={() => updateExtra(product.id, qty + 1)}
                  disabled={qty >= product.maxQuantity}
                  className="min-h-11 min-w-11 rounded-button border border-line text-xl hover:border-gold disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p id={`${product.id}-limit`} className="mt-2 text-xs text-muted">
                {extrasCopy.limit}: {product.maxQuantity}
              </p>
              <p role="status" className="mt-4 min-h-5 text-sm text-evergreen">
                {line
                  ? `${extrasCopy.lineTotal}: ${formatLkr(line.lineTotal)}`
                  : ''}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
