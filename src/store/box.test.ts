/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { boxReducer, boxCount, boxTotal, initialBox } from './box.ts'
import { productConfig } from '../config/products.ts'

test('add fills the first hole, preserves previous state and refuses overflow', () => {
  const empty = boxReducer(initialBox(), { type: 'resize', size: 6 })
  let filled = empty
  for (let i = 0; i < 6; i++)
    filled = boxReducer(filled, { type: 'add', id: 'choco' })
  assert.equal(boxCount(empty), 0)
  assert.equal(boxCount(filled), 6)
  assert.equal(boxReducer(filled, { type: 'add', id: 'butter' }), filled)
  const removed = boxReducer(filled, { type: 'remove', index: 2 })
  assert.equal(boxCount(removed), 5)
  assert.equal(
    boxReducer(removed, { type: 'add', id: 'butter' }).cookies[2],
    'butter',
  )
  assert.equal(boxReducer(removed, { type: 'remove', index: 99 }), removed)
})
test('resize preserves slots and moves overflow into empty retained slots', () => {
  const state = initialBox()
  state.cookies[1] = 'butter'
  state.cookies[10] = 'cashew'
  const small = boxReducer(state, { type: 'resize', size: 6 })
  assert.equal(small.cookies[1], 'butter')
  assert.equal(small.cookies[0], 'cashew')
  assert.equal(boxCount(small), 2)
  const large = boxReducer(small, { type: 'resize', size: 9 })
  assert.deepEqual(large.cookies.slice(0, 6), small.cookies)
  assert.equal(large.cookies.length, 9)
})
test('all configured sizes calculate box plus delivery fee once, independently of flavour count', () => {
  for (const size of [6, 9, 12] as const) {
    const state = boxReducer(initialBox(), { type: 'resize', size })
    assert.equal(boxTotal(state, 275), productConfig.prices[size] + 275)
    assert.equal(
      boxTotal(boxReducer(state, { type: 'add', id: 'choco' }), 275),
      boxTotal(state, 275),
    )
  }
})
