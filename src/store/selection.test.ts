/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extraProducts, productConfig } from '../config/products.ts'
import { deliveryConfig } from '../config/delivery.ts'
import { getDeliveryFee } from '../lib/delivery.ts'
import { boxReducer, initialBox } from './box.ts'
import { initialDelivery } from './order.ts'
import {
  canCheckout,
  createOrderPayload,
  extraCount,
  getExtraLines,
  getOrderTotals,
  setExtraQuantity,
  sumOrderTotals,
} from './selection.ts'

const first = extraProducts[0].id
const second = extraProducts[1].id
const fullBox = () => {
  let box = initialBox()
  for (let i = 0; i < box.size; i++)
    box = boxReducer(box, { type: 'add', id: 'butter' })
  return box
}

test('extras quantities add, increment, decrement and remove without mutating earlier state', () => {
  const empty = {}
  const one = setExtraQuantity(empty, first, 1)
  const both = setExtraQuantity(one, second, 3)
  assert.deepEqual(empty, {})
  assert.equal(extraCount(both), 4)
  assert.equal(extraCount(setExtraQuantity(both, second, 2)), 3)
  assert.deepEqual(setExtraQuantity(one, first, 0), {})
  assert.equal(one[first], 1)
})

test('quantity limits clamp negative, fractional and excessive inputs and ignore unknown/nonfinite values', () => {
  assert.deepEqual(setExtraQuantity({}, first, -3), {})
  assert.equal(
    setExtraQuantity({}, first, 99)[first],
    extraProducts[0].maxQuantity,
  )
  assert.equal(setExtraQuantity({}, first, 2.9)[first], 2)
  for (const qty of [NaN, Infinity, -Infinity])
    assert.deepEqual(setExtraQuantity({}, first, qty), {})
  assert.deepEqual(setExtraQuantity({}, 'unknown', 3), {})
  assert.equal(
    getExtraLines({ [first]: 999 })[0].qty,
    extraProducts[0].maxQuantity,
  )
})

test('extras-only skips an empty box, while empty orders and partially filled boxes cannot proceed', () => {
  const box = initialBox()
  const extras = setExtraQuantity({}, first, 2)
  assert.equal(canCheckout(box, {}), false)
  assert.equal(canCheckout(box, extras), true)
  const payload = createOrderPayload(box, extras, initialDelivery())
  assert.equal(payload.box, null)
  assert.equal(payload.totals.boxTotal, 0)
  assert.equal(payload.extras[0].qty, 2)
  const partial = boxReducer(box, { type: 'add', id: 'butter' })
  assert.equal(canCheckout(partial, extras), false)
  assert.throws(() => createOrderPayload(partial, extras, initialDelivery()))
  assert.throws(() => createOrderPayload(box, {}, initialDelivery()))
})

test('combined and box-only orders retain cookie contents and serialize a detached payload', () => {
  const box = fullBox()
  assert.equal(canCheckout(box, {}), true)
  const extras = { [first]: 2, [second]: 3 }
  const delivery = initialDelivery()
  const order = createOrderPayload(box, extras, delivery)
  assert.equal(order.box?.cookies.length, box.size)
  assert.equal(order.extras.length, 2)
  assert.equal(extraCount(extras), 5)
  assert.deepEqual(JSON.parse(JSON.stringify(order)), order)
  delivery.name = 'Changed'
  extras[first] = 9
  assert.equal(order.delivery.name, '')
  assert.equal(order.extras[0].qty, 2)
})

test('totals use configured prices and each delivery area for extras-only and combined orders', () => {
  const extras = { [first]: 2, [second]: 3 }
  for (const area of deliveryConfig.areas) {
    const fee = getDeliveryFee(area.id)
    const expectedExtras =
      extraProducts[0].unitPrice * 2 + extraProducts[1].unitPrice * 3
    const standalone = createOrderPayload(initialBox(), extras, {
      ...initialDelivery(),
      areaId: area.id,
    })
    assert.deepEqual(standalone.totals, {
      boxTotal: 0,
      extrasTotal: expectedExtras,
      deliveryFee: fee,
      grandTotal: expectedExtras + fee,
    })
    const full = fullBox()
    const totals = getOrderTotals(full, extras, fee)
    assert.equal(
      totals.grandTotal,
      productConfig.prices[full.size] + expectedExtras + fee,
    )
    assert.equal(
      createOrderPayload(full, extras, {
        ...initialDelivery(),
        areaId: area.id,
      }).totals.grandTotal,
      totals.grandTotal,
    )
  }
})

test('nonzero price fixtures sum every extra line and delivery exactly once', () => {
  const lines = [
    { id: first, name: 'Test product', qty: 2, unitPrice: 350, lineTotal: 700 },
    { id: second, name: 'Test pack', qty: 3, unitPrice: 125, lineTotal: 375 },
  ]
  assert.deepEqual(sumOrderTotals(2600, lines, 400), {
    boxTotal: 2600,
    extrasTotal: 1075,
    deliveryFee: 400,
    grandTotal: 4075,
  })
  assert.equal(sumOrderTotals(0, lines, 400).grandTotal, 1475)
})
