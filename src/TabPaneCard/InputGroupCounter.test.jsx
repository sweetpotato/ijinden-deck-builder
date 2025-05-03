// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { enumActionSimulator } from '../hooks/reducerSimulator'
import InputGroupCounter from './InputGroupCounter'

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const deck = new Map()
  const handleSetDeck = vi.fn()
  const dispatchSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="R-1"
      deck={deck}
      handleSetDeck={handleSetDeck}
      dispatchSimulator={dispatchSimulator}
    />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  // マイナスボタンは無効である
  expect(buttonMinus).toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '0' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(1)
  expect(newDeck.has('R-1')).toBeTruthy()
  expect(newDeck.get('R-1')).toBe(1)

  // シミュレータに通知が送られる
  expect(dispatchSimulator.mock.calls.length).toBe(1)
  const action = dispatchSimulator.mock.lastCall[0]
  expect(action).toBe(enumActionSimulator.INTERRUPT)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const deck = new Map([['B-1', 1]])
  const handleSetDeck = vi.fn()
  const dispatchSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="B-1"
      deck={deck}
      handleSetDeck={handleSetDeck}
      dispatchSimulator={dispatchSimulator}
    />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).not.toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // マイナスボタンを押す
  await userEvent.click(buttonMinus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(0)

  // シミュレータに通知が送られる
  expect(dispatchSimulator.mock.calls.length).toBe(1)
  const action = dispatchSimulator.mock.lastCall[0]
  expect(action).toBe(enumActionSimulator.INTERRUPT)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const deck = new Map([['G-1', 1]])
  const handleSetDeck = vi.fn()
  const dispatchSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="G-1"
      deck={deck}
      handleSetDeck={handleSetDeck}
      dispatchSimulator={dispatchSimulator}
    />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).not.toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(1)
  expect(newDeck.has('G-1')).toBeTruthy()
  expect(newDeck.get('G-1')).toBe(2)

  // シミュレータに通知が送られる
  expect(dispatchSimulator.mock.calls.length).toBe(1)
  const action = dispatchSimulator.mock.lastCall[0]
  expect(action).toBe(enumActionSimulator.INTERRUPT)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const deck = new Map([['Y-1', 3]])
  const handleSetDeck = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter id="Y-2" deck={deck} handleSetDeck={handleSetDeck} />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  // マイナスボタンは無効である
  expect(buttonMinus).toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '0' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(2)
  expect(newDeck.has('Y-1')).toBeTruthy()
  expect(newDeck.get('Y-1')).toBe(3)
  expect(newDeck.has('Y-2')).toBeTruthy()
  expect(newDeck.get('Y-2')).toBe(1)
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const deck = new Map([
    ['P-1', 4],
    ['P-2', 1],
  ])
  const handleSetDeck = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter id="P-2" deck={deck} handleSetDeck={handleSetDeck} />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).not.toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // マイナスボタンを押す
  await userEvent.click(buttonMinus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(1)
  expect(newDeck.has('P-1')).toBeTruthy()
  expect(newDeck.get('P-1')).toBe(4)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const deck = new Map([
    ['1-1', 5],
    ['1-2', 1],
  ])
  const handleSetDeck = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter id="1-2" deck={deck} handleSetDeck={handleSetDeck} />
  )

  // 初期状態のチェック
  const buttonMinus = await findByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).not.toBeDisabled()
  const buttonPlus = await findByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).not.toBeDisabled()
  const inputCounter = await findByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  // テキストボックスは読み取り専用である
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  // 新しいデッキのチェック
  expect(handleSetDeck.mock.calls.length).toBe(1)
  const newDeck = handleSetDeck.mock.lastCall[0]
  expect(newDeck.size).toBe(2)
  expect(newDeck.has('1-1')).toBeTruthy()
  expect(newDeck.get('1-1')).toBe(5)
  expect(newDeck.has('1-2')).toBeTruthy()
  expect(newDeck.get('1-2')).toBe(2)
})
