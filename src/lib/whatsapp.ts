import { brand } from '../config/brand.ts'
import { products } from '../config/products.ts'
import { paymentConfig } from '../config/payment.ts'
import type { OrderConfirmation } from '../store/order.ts'
import { formatDeliveryDate, getDeliveryArea } from './delivery.ts'
import { formatLkr } from './format.ts'

export function buildWhatsAppLink(
  order: OrderConfirmation,
  phone = brand.whatsappNumber,
): string | null {
  const digits = phone?.replace(/[\s()-]/g, '').replace(/^\+/, '') ?? ''
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null
  const copy = paymentConfig.done
  const { box, extras, delivery, totals } = order
  const area = getDeliveryArea(delivery.areaId)
  const lines = [
    brand.name,
    copy.whatsappPreview,
    `${copy.reference}: ${order.id}`,
    ...(box
      ? [`${copy.box}: ${box.size} · ${formatLkr(totals.boxTotal)}`]
      : []),
    ...products.flatMap((product) => {
      if (!box) return []
      const count = box.cookies.filter((id) => id === product.id).length
      return count ? [`${product.name} × ${count}`] : []
    }),
    ...extras.map(
      (line) =>
        `${line.name} × ${line.qty} · ${formatLkr(line.unitPrice)} each · ${formatLkr(line.lineTotal)}`,
    ),
    `${copy.deliveryFee}: ${formatLkr(totals.deliveryFee)}`,
    `${copy.total}: ${formatLkr(totals.grandTotal)}`,
    `${copy.name}: ${delivery.name}`,
    `${copy.phone}: ${delivery.phone}`,
    `${copy.area}: ${area?.label ?? ''}`,
    `${copy.date}: ${formatDeliveryDate(delivery.date)}`,
  ]
  if (!area?.pickup) lines.push(`${copy.address}: ${delivery.address}`)
  if (delivery.isGift && delivery.giftMessage)
    lines.push(`${copy.gift}: ${delivery.giftMessage}`)
  lines.push(copy.status)
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join('\n'))}`
}
