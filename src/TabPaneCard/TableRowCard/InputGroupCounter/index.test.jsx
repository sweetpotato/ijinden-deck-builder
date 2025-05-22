// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import InputGroupCounter from '.'

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="R-1"
      counter={0}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
    />
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
  expect(dispatchIncrement.mock.lastCall[0]).toBe('R-1')
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="B-1"
      counter={1}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
    />
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
  expect(dispatchDecrement.mock.lastCall[0]).toBe('B-1')
  expect(dispatchIncrement.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="G-1"
      counter={1}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
    />
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
  expect(dispatchIncrement.mock.lastCall[0]).toBe('G-1')
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="Y-2"
      counter={0}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
    />
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
  expect(dispatchIncrement.mock.lastCall[0]).toBe('Y-2')
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="P-2"
      counter={1}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
    />
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
  expect(dispatchDecrement.mock.lastCall[0]).toBe('P-2')
  expect(dispatchIncrement.mock.calls.length).toBe(0)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { getByRole } = render(
    <InputGroupCounter
      id="1-2"
      counter={1}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
    />
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
  expect(dispatchIncrement.mock.lastCall[0]).toBe('1-2')
})
