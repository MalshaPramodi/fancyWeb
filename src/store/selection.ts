import { extraProducts, productConfig } from '../config/products.ts'
import { getDeliveryFee } from '../lib/delivery.ts'
import { boxCount } from './box.ts'
import type { BoxState } from './box.ts'
import type {
  DeliveryDetails,
  ExtraLine,
  Extras,
  OrderPayload,
  OrderTotals,
} from './order.ts'
import type { ProductId } from '../config/products.ts'

export function setExtraQuantity(
  extras: Extras,
  id: string,
  quantity: number,
): Extras {
  const product = extraProducts.find((item) => item.id === id)
  if (!product || !Number.isFinite(quantity)) return extras
  const qty = Math.max(0, Math.min(product.maxQuantity, Math.floor(quantity)))
  if ((extras[product.id] ?? 0) === qty) return extras
  const next = { ...extras }
  if (qty) next[product.id] = qty
  else delete next[product.id]
  return next
}

export function getExtraLines(extras: Extras): ExtraLine[] {
  return extraProducts.flatMap((product) => {
    const quantity = extras[product.id] ?? 0
    const qty = Number.isFinite(quantity)
      ? Math.max(0, Math.min(product.maxQuantity, Math.floor(quantity)))
      : 0
    return qty
      ? [
          {
            id: product.id,
            name: product.name,
            qty,
            unitPrice: product.unitPrice,
            lineTotal: qty * product.unitPrice,
          },
        ]
      : []
  })
}

export const extraCount = (extras: Extras) =>
  getExtraLines(extras).reduce((sum, line) => sum + line.qty, 0)

// An empty box is absent, not an incomplete gift box.
export function canCheckout(box: BoxState, extras: Extras): boolean {
  const count = boxCount(box)
  return count > 0 ? count === box.size : extraCount(extras) > 0
}

export function sumOrderTotals(
  boxPrice: number,
  lines: ExtraLine[],
  deliveryFee: number,
): OrderTotals {
  const extrasTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  return {
    boxTotal: boxPrice,
    extrasTotal,
    deliveryFee,
    grandTotal: boxPrice + extrasTotal + deliveryFee,
  }
}

export function getOrderTotals(
  box: BoxState,
  extras: Extras,
  deliveryFee = 0,
): OrderTotals {
  return sumOrderTotals(
    boxCount(box) ? productConfig.prices[box.size] : 0,
    getExtraLines(extras),
    deliveryFee,
  )
}

export function createOrderPayload(
  box: BoxState,
  extras: Extras,
  delivery: DeliveryDetails,
): OrderPayload {
  if (!canCheckout(box, extras))
    throw new Error(
      'Choose at least one item and complete any started gift box.',
    )
  return {
    box: boxCount(box)
      ? {
          size: box.size,
          cookies: box.cookies.filter((id): id is ProductId => id !== null),
        }
      : null,
    extras: getExtraLines(extras),
    delivery: { ...delivery },
    totals: getOrderTotals(box, extras, getDeliveryFee(delivery.areaId)),
  }
}
