import { useSyncExternalStore } from 'react'
import { boxReducer, initialBox } from './box'
import type { BoxAction } from './box'

let state = initialBox()
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => state
export function dispatchBox(action: BoxAction) {
  const next = boxReducer(state, action)
  if (next !== state) {
    state = next
    listeners.forEach((listener) => listener())
  }
}
export const useBoxStore = () =>
  useSyncExternalStore(subscribe, snapshot, snapshot)
