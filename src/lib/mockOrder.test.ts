/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { submitMockOrder } from './mockOrder.ts'
import { initialBox } from '../store/box.ts'
import { initialDelivery } from '../store/order.ts'
import { createOrderPayload } from '../store/selection.ts'

test('mock submission returns a clearly marked demo reference and timestamp', async () => {
  const payload = createOrderPayload(
    initialBox(),
    { 'danish-butter-cookies': 2, 'mini-christmas-pack': 3 },
    initialDelivery(),
  )
  const pending = submitMockOrder(payload, 0)
  payload.extras[0].qty = 9
  payload.delivery.name = 'Changed after submission'
  const order = await pending
  assert.match(order.id, /^FT-DEMO-[A-F0-9]{8}$/)
  assert.ok(Number.isFinite(Date.parse(order.createdAt)))
  assert.equal(order.box, null)
  assert.equal(order.extras[0].qty, 2)
  assert.equal(order.extras[1].qty, 3)
  assert.equal(order.delivery.name, '')
  assert.deepEqual(order.totals, payload.totals)
  assert.deepEqual(JSON.parse(JSON.stringify(order)), order)
})
