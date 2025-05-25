// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TabPaneCard from '.'

function getColumnMain(getByRole, id) {
  return within(getByRole('row', { name: id })).getAllByRole('cell')[2]
}

function getColumnSide(getByRole, id) {
  return within(getByRole('row', { name: id })).getAllByRole('cell')[3]
}

function defaultRender(deckMain, deckSide) {
  const dispatchDeck = {
    decrementMain: vi.fn(),
    incrementMain: vi.fn(),
    decrementSide: vi.fn(),
    incrementSide: vi.fn(),
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  return {
    dispatchDeck,
    zoomIn,
    interruptSimulator,
    getByRole,
  }
}

afterEach(cleanup)

test.each(['R-1', 'R-2'])(
  'メインデッキのカウンターを1から2に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // メインデッキのプラスボタンを押す
    await userEvent.click(main.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementMain.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementMain.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
    expect(interruptSimulator.mock.lastCall.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'メインデッキのカウンターを1から0に減らす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // メインデッキのマイナスボタンを押す
    await userEvent.click(main.getByRole('button', { name: '-' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.decrementMain.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.decrementMain.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
    expect(interruptSimulator.mock.lastCall.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを0から1に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map(), new Map())

    const main = within(getColumnMain(getByRole, id))
    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(0)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    const side = within(getColumnSide(getByRole, id))
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(0)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのプラスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementSide.mock.lastCall[0]).toBe(id)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを1から2に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのプラスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementSide.mock.lastCall[0]).toBe(id)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを1から0に減らす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのマイナスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '-' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.decrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.decrementSide.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])('虫眼鏡ボタンの操作 (%s)', async (id) => {
  const { dispatchDeck, zoomIn, interruptSimulator, getByRole } = defaultRender(
    new Map(),
    new Map()
  )

  expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 虫眼鏡ボタンを押す
  // prettier-ignore
  await userEvent.click(within(getByRole('row', { name: id })).getByRole('button', { name: '🔎' }))
  expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(0)
})
