import { useSyncExternalStore } from 'react'
import { boxReducer, initialBox } from './box'
import type { BoxAction } from './box'
import { initialDelivery } from './order'
import type { DeliveryDetails } from './order'

let state = { box: initialBox(), delivery: initialDelivery() }
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => state.box
const deliverySnapshot = () => state.delivery
export function dispatchBox(action: BoxAction) {
  const next = boxReducer(state.box, action)
  if (next !== state.box) {
    state = { ...state, box: next }
    listeners.forEach((listener) => listener())
  }
}
export const useBoxStore = () =>
  useSyncExternalStore(subscribe, snapshot, snapshot)
export const useDeliveryStore = () =>
  useSyncExternalStore(subscribe, deliverySnapshot, deliverySnapshot)
export function updateDelivery(patch: Partial<DeliveryDetails>) {
  state = { ...state, delivery: { ...state.delivery, ...patch } }
  listeners.forEach((listener) => listener())
}
