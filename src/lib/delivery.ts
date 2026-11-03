import { deliveryConfig } from '../config/delivery.ts'
import type { DeliveryDetails } from '../store/order.ts'

export type DeliveryErrors = Partial<Record<keyof DeliveryDetails, string>>
export const normalizePhone = (phone: string) => phone.replace(/[\s()-]/g, '')
export const isSriLankanPhone = (phone: string) =>
  /^(?:07\d{8}|\+947\d{8})$/.test(normalizePhone(phone))

export function validateDelivery(details: DeliveryDetails): DeliveryErrors {
  const errors: DeliveryErrors = {}
  const copy = deliveryConfig.errors
  if (details.name.trim().length < 2) errors.name = copy.name
  else if (details.name.length > deliveryConfig.limits.name)
    errors.name = copy.nameLength
  if (!isSriLankanPhone(details.phone)) errors.phone = copy.phone
  if (details.address.trim().length < 10) errors.address = copy.address
  else if (details.address.length > deliveryConfig.limits.address)
    errors.address = copy.addressLength
  return errors
}
