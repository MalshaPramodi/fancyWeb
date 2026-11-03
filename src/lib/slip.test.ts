/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { paymentConfig } from '../config/payment.ts'
import { prepareSlip, validSlipHeader, validateSlipFile } from './slip.ts'

test('slip validation accepts supported types and rejects wrong, empty and oversized files', () => {
  for (const [name, type] of [
    ['slip.jpg', 'image/jpeg'],
    ['slip.PNG', 'image/png'],
    ['slip.pdf', 'application/pdf'],
    ['slip.jpeg', ''],
  ])
    assert.equal(validateSlipFile({ name, type, size: 100 }), null)
  assert.equal(
    validateSlipFile({ name: 'slip.txt', type: 'text/plain', size: 100 }),
    paymentConfig.errors.type,
  )
  assert.equal(
    validateSlipFile({ name: 'slip.jpg', type: 'application/pdf', size: 100 }),
    paymentConfig.errors.type,
  )
  assert.equal(
    validateSlipFile({ name: 'slip.jpg', type: 'image/jpeg', size: 0 }),
    paymentConfig.errors.empty,
  )
  assert.equal(
    validateSlipFile({
      name: 'slip.jpg',
      type: 'image/jpeg',
      size: paymentConfig.upload.maxInputBytes + 1,
    }),
    paymentConfig.errors.tooLarge,
  )
  assert.equal(
    validateSlipFile({
      name: 'slip.pdf',
      type: 'application/pdf',
      size: paymentConfig.upload.maxUploadBytes + 1,
    }),
    paymentConfig.errors.pdfLarge,
  )
})
test('file signatures reject mismatched or incomplete headers', () => {
  assert.equal(
    validSlipHeader(new Uint8Array([0xff, 0xd8, 0xff]), 'image/jpeg'),
    true,
  )
  assert.equal(
    validSlipHeader(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      'image/png',
    ),
    true,
  )
  assert.equal(
    validSlipHeader(new TextEncoder().encode('%PDF-1.4'), 'application/pdf'),
    true,
  )
  assert.equal(
    validSlipHeader(new TextEncoder().encode('not an image'), 'image/jpeg'),
    false,
  )
  assert.equal(validSlipHeader(new Uint8Array([0xff]), 'image/jpeg'), false)
})
test('a PDF remains local, retains its bytes and is not image-compressed', async () => {
  const input = new File(['%PDF-1.4\npreview fixture'], 'preview.pdf', {
    type: 'application/pdf',
  })
  const prepared = await prepareSlip(input)
  assert.equal(prepared.type, 'application/pdf')
  assert.equal(await prepared.text(), await input.text())
  await assert.rejects(
    prepareSlip(
      new File(['wrong bytes'], 'preview.jpg', { type: 'image/jpeg' }),
    ),
    { message: paymentConfig.errors.type },
  )
})
