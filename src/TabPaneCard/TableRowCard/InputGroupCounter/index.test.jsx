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
  const { rerender, getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={counter}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
      interruptSimulator={interruptSimulator}
    />
  )
  const defaultRerender = (counter) =>
    rerender(
      <InputGroupCounter
        id={id}
        counter={counter}
        dispatchDecrement={dispatchDecrement}
        dispatchIncrement={dispatchIncrement}
        interruptSimulator={interruptSimulator}
      />
    )
  return {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    defaultRerender,
    getByRole,
  }
}

// interruptSimulator がない
function defaultRenderSide(id, counter) {
  const dispatchDecrement = vi.fn()
  const dispatchIncrement = vi.fn()
  const { rerender, getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={counter}
      dispatchDecrement={dispatchDecrement}
      dispatchIncrement={dispatchIncrement}
    />
  )
  const defaultRerender = (counter) =>
    rerender(
      <InputGroupCounter
        id={id}
        counter={counter}
        dispatchDecrement={dispatchDecrement}
        dispatchIncrement={dispatchIncrement}
      />
    )
  return { dispatchDecrement, dispatchIncrement, defaultRerender, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', async () => {
  const { getByRole } = defaultRenderMain('1-1', 0)

  const buttonMinus = getByRole('button', { name: '-' })
  expect(buttonMinus).toBeVisible()
  expect(buttonMinus).toBeDisabled() // 無効
  const buttonPlus = getByRole('button', { name: '+' })
  expect(buttonPlus).toBeVisible()
  expect(buttonPlus).toBeEnabled()
  const inputCounter = getByRole('spinbutton')
  expect(inputCounter).toBeVisible()
  expect(inputCounter).toHaveAttribute('readonly')
  expect(inputCounter).toHaveValue(0)
})

test('メインデッキのカウンターを0から1に増やす', async () => {
  const id = '1-2'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRenderMain(id, 0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(1)

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const id = '1-3'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRenderMain(id, 1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(2)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)
})

test('メインデッキのカウンターを2から1に減らす', async () => {
  const id = '1-4'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRenderMain(id, 2)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const id = '1-5'
  const {
    dispatchDecrement,
    dispatchIncrement,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRenderMain(id, 1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const id = '1-6'
  const { dispatchDecrement, dispatchIncrement, defaultRerender, getByRole } =
    defaultRenderSide(id, 0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)

  defaultRerender(1)

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const id = '1-7'
  const { dispatchDecrement, dispatchIncrement, defaultRerender, getByRole } =
    defaultRenderSide(id, 1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))

  expect(dispatchDecrement.mock.calls.length).toBe(0)
  expect(dispatchIncrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchIncrement.mock.lastCall.length).toBe(1)
  expect(dispatchIncrement.mock.lastCall[0]).toBe(id)

  defaultRerender(2)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)
})

test('サイドデッキのカウンターを2から1に減らす', async () => {
  const id = '1-8'
  const { dispatchDecrement, dispatchIncrement, defaultRerender, getByRole } =
    defaultRenderSide(id, 2)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)

  defaultRerender(1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const id = '1-9'
  const { dispatchDecrement, dispatchIncrement, defaultRerender, getByRole } =
    defaultRenderSide(id, 1)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))

  expect(dispatchDecrement.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchDecrement.mock.lastCall.length).toBe(1)
  expect(dispatchDecrement.mock.lastCall[0]).toBe(id)
  expect(dispatchIncrement.mock.calls.length).toBe(0)

  defaultRerender(0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})

test('ボタンを押さずにメインデッキのカウンターを0から4に増やす', () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-10', 0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  defaultRerender(4)

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(4)
})

test('ボタンを押さずにメインデッキのカウンターを4から0に減らす', () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-11', 4)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(4)

  defaultRerender(0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})

test('ボタンを押さずにサイドデッキのカウンターを0から4に増やす', () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-12', 0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  defaultRerender(4)

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(4)
})

test('ボタンを押さずにサイドデッキのカウンターを4から0に減らす', () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-13', 4)

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(4)

  defaultRerender(0)

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})
