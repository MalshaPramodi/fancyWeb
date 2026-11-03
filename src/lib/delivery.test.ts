/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isSriLankanPhone,
  normalizePhone,
  validateDelivery,
} from './delivery.ts'

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
    Object.keys(validateDelivery({ name: ' ', phone: '', address: ' ' })),
    ['name', 'phone', 'address'],
  )
  assert.deepEqual(
    validateDelivery({
      name: 'Sample Customer',
      phone: '0771234567',
      address: '10 Example Street, Test Town',
    }),
    {},
  )
  const errors = validateDelivery({
    name: 'a'.repeat(101),
    phone: '0771234567',
    address: 'b'.repeat(601),
  })
  assert.ok(errors.name)
  assert.ok(errors.address)
})
