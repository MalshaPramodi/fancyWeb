import { deliveryConfig } from '../config/delivery.ts'
import type { DeliveryDetails } from '../store/order.ts'

export type DeliveryErrors = Partial<Record<keyof DeliveryDetails, string>>
export const normalizePhone = (phone: string) => phone.replace(/[\s()-]/g, '')
export const isSriLankanPhone = (phone: string) =>
  /^(?:07\d{8}|\+947\d{8})$/.test(normalizePhone(phone))

const calendarFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: deliveryConfig.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const dateLabelFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeZone: deliveryConfig.timezone,
})

export function colomboDate(now = new Date()) {
  const parts = calendarFormat.formatToParts(now)
  return ['year', 'month', 'day']
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join('-')
}
export const getDeliveryArea = (areaId: string) =>
  deliveryConfig.areas.find((area) => area.id === areaId)
export const getDeliveryFee = (areaId: string) =>
  getDeliveryArea(areaId)?.fee ?? 0
export const availableDeliveryDates = (now = new Date()) => {
  const today = colomboDate(now)
  return deliveryConfig.dates.filter((date) => date >= today).sort()
}
export const formatDeliveryDate = (date: string) =>
  dateLabelFormat.format(new Date(`${date}T12:00:00Z`))

export function validateDelivery(
  details: DeliveryDetails,
  now = new Date(),
): DeliveryErrors {
  const errors: DeliveryErrors = {}
  const copy = deliveryConfig.errors
  if (details.name.trim().length < 2) errors.name = copy.name
  else if (details.name.length > deliveryConfig.limits.name)
    errors.name = copy.nameLength
  if (!isSriLankanPhone(details.phone)) errors.phone = copy.phone
  const area = getDeliveryArea(details.areaId)
  if (!area) errors.areaId = copy.areaId
  if (!area?.pickup && details.address.trim().length < 10)
    errors.address = copy.address
  else if (
    !area?.pickup &&
    details.address.length > deliveryConfig.limits.address
  )
    errors.address = copy.addressLength
  if (colomboDate(now) > deliveryConfig.lastOrderDate)
    errors.date = copy.dateClosed
  else if (!availableDeliveryDates(now).includes(details.date))
    errors.date = copy.date
  if (
    details.isGift &&
    details.giftMessage.length > deliveryConfig.giftMessageLimit
  )
    errors.giftMessage = copy.giftMessage
  return errors
}
