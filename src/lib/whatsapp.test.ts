/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildWhatsAppLink } from './whatsapp.ts'
import { initialBox, boxReducer } from '../store/box.ts'
import { initialDelivery } from '../store/order.ts'
import { createOrderPayload } from '../store/selection.ts'

test('missing or placeholder business numbers produce no WhatsApp link', () => {
  const delivery = { ...initialDelivery(), date: '2026-12-20' }
  const order = {
    ...createOrderPayload(
      initialBox(),
      { 'danish-butter-cookies': 2 },
      delivery,
    ),
    id: 'FT-DEMO-TEST',
    createdAt: '',
  }
  assert.equal(buildWhatsAppLink(order, null), null)
  assert.equal(buildWhatsAppLink(order, 'WHATSAPP_PLACEHOLDER'), null)
})
test('preview details are URL-encoded and pickup/non-gift orders omit address and hidden gift text', () => {
  const delivery = {
    ...initialDelivery(),
    name: 'Sample & Customer',
    phone: '0771234567',
    areaId: 'pickup',
    date: '2026-12-20',
    address: 'Hidden address',
    giftMessage: 'Hidden gift note',
  }
  const order = {
    ...createOrderPayload(
      initialBox(),
      { 'danish-butter-cookies': 2, 'mini-christmas-pack': 3 },
      delivery,
    ),
    id: 'FT-DEMO-TEST',
    createdAt: '',
  }
  // Synthetic test number only; never added to business config or contacted.
  const link = buildWhatsAppLink(order, '+94 77 000 0000')!
  const url = new URL(link)
  assert.equal(url.hostname, 'wa.me')
  const message = url.searchParams.get('text')!
  assert.ok(message.includes(order.id))
  assert.ok(message.includes('Sample & Customer'))
  assert.ok(message.includes('not a real order'))
  assert.equal(message.includes('Hidden address'), false)
  assert.equal(message.includes('Hidden gift note'), false)
  assert.ok(message.includes('Danish Butter Cookies × 2'))
  assert.ok(message.includes('Mini Christmas Cookie Packs × 3'))
  assert.equal(message.includes('Cookie box:'), false)
})

test('combined WhatsApp order includes box cookies, extra quantities, line totals, delivery and grand total', () => {
  let box = initialBox()
  for (let i = 0; i < box.size; i++)
    box = boxReducer(box, { type: 'add', id: 'butter' })
  const payload = createOrderPayload(
    box,
    { 'mini-christmas-pack': 3 },
    {
      ...initialDelivery(),
      areaId: 'colombo',
      date: '2026-12-20',
      address: 'Test address',
      isGift: true,
      giftMessage: 'For you',
    },
  )
  // Nonzero fixture prices verify displayed amounts, independent of LKR 0 placeholders.
  payload.extras[0].unitPrice = 100
  payload.extras[0].lineTotal = 300
  payload.totals = {
    boxTotal: 2600,
    extrasTotal: 300,
    deliveryFee: 400,
    grandTotal: 3300,
  }
  const order = { ...payload, id: 'FT-DEMO-TEST', createdAt: '' }
  const message = new URL(
    buildWhatsAppLink(order, '+94770000000')!,
  ).searchParams.get('text')!
  assert.ok(message.includes(`Cookie box: ${box.size} · LKR 2,600`))
  assert.ok(message.includes(`Butter Star × ${box.size}`))
  assert.ok(
    message.includes(
      'Mini Christmas Cookie Packs × 3 · LKR 100 each · LKR 300',
    ),
  )
  assert.ok(message.includes('Delivery fee: LKR 400'))
  assert.ok(message.includes('Total: LKR 3,300'))
  assert.ok(message.includes('Test address'))
  assert.ok(message.includes('For you'))
})
