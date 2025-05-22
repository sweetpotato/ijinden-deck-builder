// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import InputGroupCounter from '.'

// interruptSimulator がある
function defaultRenderMain(id, counter) {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={counter}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
    />
  )
  return { dispatchDecrement, dispatchIncrement, interruptSimulator, getByRole }
}

// interruptSimulator がない
function defaultRenderSide(id, counter) {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={counter}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
    />
  )
  return { dispatchDecrement, dispatchIncrement, getByRole }
}

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const id = 'R-1'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    getByRole,
  } = defaultRenderMain(id, 0)

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeDisabled() // 無効
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '0' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const id = 'B-1'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    getByRole,
  } = defaultRenderMain(id, 1)

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeEnabled()
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // マイナスボタンを押す
  await userEvent.click(buttonMinus)

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const id = 'G-1'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    getByRole,
  } = defaultRenderMain(id, 1)

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeEnabled()
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const id = 'Y-2'
  const { dispatchDecrement, dispatchIncrement, getByRole } = defaultRenderSide(
    id,
    0
  )

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeDisabled() // 無効
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '0' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const id = 'P-2'
  const { dispatchDecrement, dispatchIncrement, getByRole } = defaultRenderSide(
    id,
    1
  )

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeEnabled()
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // マイナスボタンを押す
  await userEvent.click(buttonMinus)

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const id = '1-2'
  const { dispatchDecrement, dispatchIncrement, getByRole } = defaultRenderSide(
    id,
    1
  )

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeEnabled()
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton', { value: '1' })
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')

  // プラスボタンを押す
  await userEvent.click(buttonPlus)

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
})
