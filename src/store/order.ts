export type DeliveryDetails = { name: string; phone: string; address: string }
export const initialDelivery = (): DeliveryDetails => ({
  name: '',
  phone: '',
  address: '',
})
