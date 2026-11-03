import { boxSizes, productConfig, products } from '../config/products.ts'
import type { BoxSize, ProductId } from '../config/products.ts'

export type BoxState = { size: BoxSize; cookies: (ProductId | null)[] }
export type BoxAction =
  | { type: 'add'; id: ProductId }
  | { type: 'remove'; index: number }
  | { type: 'resize'; size: BoxSize }
  | { type: 'reset' }
export const initialBox = (): BoxState => ({
  size: productConfig.defaultSize,
  cookies: Array<ProductId | null>(productConfig.defaultSize).fill(null),
})

export function boxReducer(state: BoxState, action: BoxAction): BoxState {
  if (action.type === 'reset') return initialBox()
  if (action.type === 'add') {
    const index = state.cookies.indexOf(null)
    if (index < 0 || !products.some((p) => p.id === action.id)) return state
    return {
      ...state,
      cookies: state.cookies.map((id, i) => (i === index ? action.id : id)),
    }
  }
  if (action.type === 'remove') {
    if (!state.cookies[action.index]) return state
    return {
      ...state,
      cookies: state.cookies.map((id, i) => (i === action.index ? null : id)),
    }
  }
  if (!boxSizes.includes(action.size) || action.size === state.size)
    return state
  const cookies = state.cookies.slice(0, action.size)
  const overflow = state.cookies
    .slice(action.size)
    .filter((id): id is ProductId => id !== null)
  for (let i = 0; i < cookies.length && overflow.length; i++)
    if (cookies[i] === null) cookies[i] = overflow.shift()!
  while (cookies.length < action.size) cookies.push(null)
  return { size: action.size, cookies }
}

export const boxCount = (state: BoxState) =>
  state.cookies.filter(Boolean).length
export const boxTotal = (state: BoxState, deliveryFee = 0) =>
  productConfig.prices[state.size] + deliveryFee
