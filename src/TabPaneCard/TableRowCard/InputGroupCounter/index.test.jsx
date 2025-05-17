// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import InputGroupCounter from '.'

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const deck = new Map()
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="R-1"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
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
  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe('R-1')

  // シミュレータに通知が送られる
  expect(interruptSimulator.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const deck = new Map([['B-1', 1]])
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="B-1"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
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
  expect(dispatchDecrement.mock.calls.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe('B-1')
  expect(dispatchIncrement.mock.calls.length).toBe(0)

  // シミュレータに通知が送られる
  expect(interruptSimulator.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const deck = new Map([['G-1', 1]])
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="G-1"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
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
  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe('G-1')

  // シミュレータに通知が送られる
  expect(interruptSimulator.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const deck = new Map([['Y-1', 3]])
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="Y-2"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
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
  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe('Y-2')
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const deck = new Map([
    ['P-1', 4],
    ['P-2', 1],
  ])
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="P-2"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
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
  expect(dispatchDecrement.mock.calls.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe('P-2')
  expect(dispatchIncrement.mock.calls.length).toBe(0)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const deck = new Map([
    ['1-1', 5],
    ['1-2', 1],
  ])
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { findByRole } = render(
    <InputGroupCounter
      id="1-2"
      deck={deck}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
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
  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe('1-2')
})
