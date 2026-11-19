import type { BoxSize, ExtraProductId, ProductId } from '../config/products.ts'

export type DeliveryDetails = {
  name: string
  phone: string
  address: string
  areaId: string
  date: string
  isGift: boolean
  giftMessage: string
}
export const initialDelivery = (): DeliveryDetails => ({
  name: '',
  phone: '',
  address: '',
  areaId: '',
  date: '',
  isGift: false,
  giftMessage: '',
})

export type PaymentDetails = {
  slip: File | null
  previewUrl: string | null
  confirmed: boolean
  preparing: boolean
}
export const initialPayment = (): PaymentDetails => ({
  slip: null,
  previewUrl: null,
  confirmed: false,
  preparing: false,
})
export type OrderConfirmation = { id: string; createdAt: string }

export type Extras = Partial<Record<ExtraProductId, number>>
export type ExtraLine = {
  id: ExtraProductId
  name: string
  qty: number
  unitPrice: number
  lineTotal: number
}
export type OrderTotals = {
  boxTotal: number
  extrasTotal: number
  deliveryFee: number
  grandTotal: number
}
export type OrderPayload = {
  box: { size: BoxSize; cookies: ProductId[] } | null
  extras: ExtraLine[]
  delivery: DeliveryDetails
  totals: OrderTotals
}
