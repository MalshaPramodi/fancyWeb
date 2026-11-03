import { useSyncExternalStore } from 'react'
import { boxReducer, initialBox } from './box'
import type { BoxAction } from './box'
import { initialDelivery, initialPayment } from './order'
import type {
  DeliveryDetails,
  PaymentDetails,
  OrderConfirmation,
} from './order'

let state = {
  box: initialBox(),
  delivery: initialDelivery(),
  payment: initialPayment(),
  order: null as OrderConfirmation | null,
}
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => state.box
const deliverySnapshot = () => state.delivery
const paymentSnapshot = () => state.payment
const confirmationSnapshot = () => state.order
export function dispatchBox(action: BoxAction) {
  const next = boxReducer(state.box, action)
  if (next !== state.box) {
    state = {
      ...state,
      box: next,
      payment: { ...state.payment, confirmed: false },
    }
    listeners.forEach((listener) => listener())
  }
}
export const useBoxStore = () =>
  useSyncExternalStore(subscribe, snapshot, snapshot)
export const useDeliveryStore = () =>
  useSyncExternalStore(subscribe, deliverySnapshot, deliverySnapshot)
export function updateDelivery(patch: Partial<DeliveryDetails>) {
  state = {
    ...state,
    delivery: { ...state.delivery, ...patch },
    payment: { ...state.payment, confirmed: false },
  }
  listeners.forEach((listener) => listener())
}
export const usePaymentStore = () =>
  useSyncExternalStore(subscribe, paymentSnapshot, paymentSnapshot)
export function updatePayment(
  patch: Partial<Pick<PaymentDetails, 'confirmed' | 'preparing'>>,
) {
  state = { ...state, payment: { ...state.payment, ...patch } }
  listeners.forEach((listener) => listener())
}
export function setPaymentSlip(slip: File | null) {
  const previous = state.payment.previewUrl
  const previewUrl = slip ? URL.createObjectURL(slip) : null
  state = {
    ...state,
    payment: { ...state.payment, slip, previewUrl, confirmed: false },
  }
  if (previous) URL.revokeObjectURL(previous)
  listeners.forEach((listener) => listener())
}
export const useConfirmationStore = () =>
  useSyncExternalStore(subscribe, confirmationSnapshot, confirmationSnapshot)
export const getOrderSnapshot = () => state
export function completeMockOrder(order: OrderConfirmation) {
  state = { ...state, order }
  listeners.forEach((listener) => listener())
}
export function resetOrder() {
  if (state.payment.previewUrl) URL.revokeObjectURL(state.payment.previewUrl)
  state = {
    box: initialBox(),
    delivery: initialDelivery(),
    payment: initialPayment(),
    order: null,
  }
  listeners.forEach((listener) => listener())
}
