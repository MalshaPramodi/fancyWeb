/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isSriLankanPhone,
  normalizePhone,
  validateDelivery,
  colomboDate,
  availableDeliveryDates,
  getDeliveryArea,
  getDeliveryFee,
} from './delivery.ts'
import { initialDelivery } from '../store/order.ts'
import { deliveryConfig } from '../config/delivery.ts'

const previewNow = new Date('2026-11-04T00:00:00Z')
const validDetails = () => ({
  ...initialDelivery(),
  name: 'Sample Customer',
  phone: '0771234567',
  address: '10 Example Street, Test Town',
  areaId: 'colombo',
  date: deliveryConfig.dates[0],
})

test('Sri Lankan mobile validation accepts local and international numbers and common spacing', () => {
  for (const phone of [
    '0771234567',
    '+94771234567',
    '077 123 4567',
    '+94 (77) 123-4567',
  ])
    assert.equal(isSriLankanPhone(phone), true, phone)
  for (const phone of [
    '',
    '077123456',
    '07712345678',
    '+9477123456',
    '94771234567',
    '+44771234567',
    '0111234567',
    '077123456x',
  ])
    assert.equal(isSriLankanPhone(phone), false, phone)
  assert.equal(normalizePhone('+94 (77) 123-4567'), '+94771234567')
})
test('required details reject whitespace and excessive length', () => {
  assert.deepEqual(
    Object.keys(
      validateDelivery(
        { ...validDetails(), name: ' ', phone: '', address: ' ' },
        previewNow,
      ),
    ),
    ['name', 'phone', 'address'],
  )
  assert.deepEqual(validateDelivery(validDetails(), previewNow), {})
  const errors = validateDelivery(
    {
      ...validDetails(),
      name: 'a'.repeat(101),
      phone: '0771234567',
      address: 'b'.repeat(601),
    },
    previewNow,
  )
  assert.ok(errors.name)
  assert.ok(errors.address)
})

test('delivery choices validate known areas, require addresses for delivery and skip addresses for pickup', () => {
  assert.ok(
    validateDelivery({ ...validDetails(), areaId: 'unknown' }, previewNow)
      .areaId,
  )
  for (const area of deliveryConfig.areas) {
    assert.equal(getDeliveryArea(area.id)?.label, area.label)
    assert.equal(getDeliveryFee(area.id), area.fee)
    assert.equal(
      !!validateDelivery(
        { ...validDetails(), areaId: area.id, address: '' },
        previewNow,
      ).address,
      !area.pickup,
    )
  }
})
test('dates must be in the configured schedule and cannot be in the past', () => {
  assert.ok(validateDelivery({ ...validDetails(), date: '' }, previewNow).date)
  assert.ok(
    validateDelivery({ ...validDetails(), date: '2026-12-23' }, previewNow)
      .date,
  )
  assert.ok(
    validateDelivery({ ...validDetails(), date: 'invalid' }, previewNow).date,
  )
  assert.deepEqual(availableDeliveryDates(new Date('2026-12-21T00:00:00Z')), [
    '2026-12-21',
    '2026-12-22',
  ])
})
test('order deadline is inclusive through the last local day in Asia/Colombo', () => {
  const before = new Date('2026-12-18T18:29:59.999Z')
  const after = new Date('2026-12-18T18:30:00.000Z')
  assert.equal(colomboDate(before), '2026-12-18')
  assert.equal(colomboDate(after), '2026-12-19')
  assert.equal(validateDelivery(validDetails(), before).date, undefined)
  assert.equal(
    validateDelivery(validDetails(), after).date,
    deliveryConfig.errors.dateClosed,
  )
})
test('gift notes are optional and enforce the configured character limit when selected', () => {
  assert.equal(
    validateDelivery(
      { ...validDetails(), isGift: true, giftMessage: '' },
      previewNow,
    ).giftMessage,
    undefined,
  )
  assert.equal(
    validateDelivery(
      {
        ...validDetails(),
        isGift: true,
        giftMessage: 'a'.repeat(deliveryConfig.giftMessageLimit),
      },
      previewNow,
    ).giftMessage,
    undefined,
  )
  assert.ok(
    validateDelivery(
      {
        ...validDetails(),
        isGift: true,
        giftMessage: 'a'.repeat(deliveryConfig.giftMessageLimit + 1),
      },
      previewNow,
    ).giftMessage,
  )
})
