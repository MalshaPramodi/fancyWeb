import { brand } from '../config/brand.ts'
import { products } from '../config/products.ts'
import { paymentConfig } from '../config/payment.ts'
import type { BoxState } from '../store/box.ts'
import { boxTotal } from '../store/box.ts'
import type { DeliveryDetails, OrderConfirmation } from '../store/order.ts'
import {
  formatDeliveryDate,
  getDeliveryArea,
  getDeliveryFee,
} from './delivery.ts'
import { formatLkr } from './format.ts'

export function buildWhatsAppLink(
  order: OrderConfirmation,
  box: BoxState,
  delivery: DeliveryDetails,
  phone = brand.whatsappNumber,
): string | null {
  const digits = phone?.replace(/[\s()-]/g, '').replace(/^\+/, '') ?? ''
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null
  const copy = paymentConfig.done
  const area = getDeliveryArea(delivery.areaId)
  const lines = [
    brand.name,
    copy.whatsappPreview,
    `${copy.reference}: ${order.id}`,
    `${copy.box}: ${box.size}`,
    ...products.flatMap((product) => {
      const count = box.cookies.filter((id) => id === product.id).length
      return count ? [`${product.name} × ${count}`] : []
    }),
    `${copy.total}: ${formatLkr(boxTotal(box, getDeliveryFee(delivery.areaId)))}`,
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
