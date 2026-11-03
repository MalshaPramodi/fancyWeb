/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { submitMockOrder } from './mockOrder.ts'

test('mock submission returns a clearly marked demo reference and timestamp', async () => {
  const order = await submitMockOrder(0)
  assert.match(order.id, /^FT-DEMO-[A-F0-9]{8}$/)
  assert.ok(Number.isFinite(Date.parse(order.createdAt)))
})
