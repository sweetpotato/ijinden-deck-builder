// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useDeck from '../../../hooks/useDeck'
import InputGroupCounter from '.'

// interruptSimulator がある
function defaultRenderMain(id, deck) {
  const interruptSimulator = vi.fn()
  const { result } = renderHook(() => useDeck(deck, []))
  const { rerender, getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={result.current[0].has(id) ? result.current[0].get(id) : 0}
      dispatchDecrement={result.current[2].decrementMain}
      dispatchIncrement={result.current[2].incrementMain}
      interruptSimulator={interruptSimulator}
    />
  )
  const defaultRerender = () => {
    rerender(
      <InputGroupCounter
        id={id}
        counter={result.current[0].has(id) ? result.current[0].get(id) : 0}
        dispatchDecrement={result.current[2].decrementMain}
        dispatchIncrement={result.current[2].incrementMain}
        interruptSimulator={interruptSimulator}
      />
    )
  }
  return { defaultRerender, getByRole }
}

// interruptSimulator がない
function defaultRenderSide(id, deck) {
  const { result } = renderHook(() => useDeck([], deck))
  const { rerender, getByRole } = render(
    <InputGroupCounter
      id={id}
      counter={result.current[1].has(id) ? result.current[1].get(id) : 0}
      dispatchDecrement={result.current[2].decrementSide}
      dispatchIncrement={result.current[2].incrementSide}
    />
  )
  const defaultRerender = () => {
    rerender(
      <InputGroupCounter
        id={id}
        counter={result.current[1].has(id) ? result.current[1].get(id) : 0}
        dispatchDecrement={result.current[2].decrementSide}
        dispatchIncrement={result.current[2].incrementSide}
      />
    )
  }
  return { defaultRerender, getByRole }
}

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-1', [])

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-2', [['1-2', 1]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)
})

test('メインデッキのカウンターを2から1に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-3', [['1-3', 2]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRenderMain('1-4', [['1-4', 1]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-5', [])

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-6', [['1-6', 1]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // プラスボタンを押す
  await userEvent.click(getByRole('button', { name: '+' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)
})

test('サイドデッキのカウンターを2から1に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-7', [['1-7', 2]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(2)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRenderSide('1-8', [['1-8', 1]])

  expect(getByRole('button', { name: '-' })).toBeEnabled()
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(1)

  // マイナスボタンを押す
  await userEvent.click(getByRole('button', { name: '-' }))
  defaultRerender()

  expect(getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(getByRole('button', { name: '+' })).toBeEnabled()
  expect(getByRole('spinbutton')).toHaveValue(0)
})
