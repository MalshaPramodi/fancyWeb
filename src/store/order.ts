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
