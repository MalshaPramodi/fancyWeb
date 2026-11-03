/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildWhatsAppLink } from './whatsapp.ts'
import { initialBox } from '../store/box.ts'
import { initialDelivery } from '../store/order.ts'

test('missing or placeholder business numbers produce no WhatsApp link', () => {
  const order = { id: 'FT-DEMO-TEST', createdAt: '' }
  const delivery = { ...initialDelivery(), date: '2026-12-20' }
  assert.equal(buildWhatsAppLink(order, initialBox(), delivery, null), null)
  assert.equal(
    buildWhatsAppLink(order, initialBox(), delivery, 'WHATSAPP_PLACEHOLDER'),
    null,
  )
})
test('preview details are URL-encoded and pickup/non-gift orders omit address and hidden gift text', () => {
  const order = { id: 'FT-DEMO-TEST', createdAt: '' }
  const delivery = {
    ...initialDelivery(),
    name: 'Sample & Customer',
    phone: '0771234567',
    areaId: 'pickup',
    date: '2026-12-20',
    address: 'Hidden address',
    giftMessage: 'Hidden gift note',
  }
  // Synthetic test number only; never added to business config or contacted.
  const link = buildWhatsAppLink(
    order,
    initialBox(),
    delivery,
    '+94 77 000 0000',
  )!
  const url = new URL(link)
  assert.equal(url.hostname, 'wa.me')
  const message = url.searchParams.get('text')!
  assert.ok(message.includes(order.id))
  assert.ok(message.includes('Sample & Customer'))
  assert.ok(message.includes('not a real order'))
  assert.equal(message.includes('Hidden address'), false)
  assert.equal(message.includes('Hidden gift note'), false)
})
