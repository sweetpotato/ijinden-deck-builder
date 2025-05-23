// SPDX-License-Identifier: MIT

import { Table } from 'react-bootstrap'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, renderHook, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useDeck from '../../hooks/useDeck'
import enumColor from '../enumColor'
import TableRowCard from '.'

function defaultRender(id, name, term, color, main, side) {
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { result } = renderHook(() => useDeck(main, side))
  const { rerender, getByRole } = render(
    <Table>
      <tbody>
        <TableRowCard
          id={id}
          name={name}
          term={term}
          color={color}
          counterMain={
            result.current[0].has(id) ? result.current[0].get(id) : 0
          }
          counterSide={
            result.current[1].has(id) ? result.current[1].get(id) : 0
          }
          dispatchDeck={result.current[2]}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )
  const defaultRerender = () =>
    rerender(
      <Table>
        <tbody>
          <TableRowCard
            id={id}
            name={name}
            term={term}
            color={color}
            counterMain={
              result.current[0].has(id) ? result.current[0].get(id) : 0
            }
            counterSide={
              result.current[1].has(id) ? result.current[1].get(id) : 0
            }
            dispatchDeck={result.current[2]}
            zoomIn={zoomIn}
            interruptSimulator={interruptSimulator}
          />
        </tbody>
      </Table>
    )
  return { defaultRerender, getByRole }
}

afterEach(cleanup)

test('メインデッキのカウンターを0から1に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [],
    []
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(main.getByRole('spinbutton')).toHaveValue(0)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // メインデッキのプラスボタンを押す
  await userEvent.click(main.getByRole('button', { name: '+' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled()
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('メインデッキのカウンターを1から2に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 1]],
    [['1-1', 1]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // メインデッキのプラスボタンを押す
  await userEvent.click(main.getByRole('button', { name: '+' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(2)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('メインデッキのカウンターを2から1に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 2]],
    [['1-1', 2]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(2)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(2)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // メインデッキのマイナスボタンを押す
  await userEvent.click(main.getByRole('button', { name: '-' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(2)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 1]],
    [['1-1', 1]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // メインデッキのマイナスボタンを押す
  await userEvent.click(main.getByRole('button', { name: '-' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(main.getByRole('spinbutton')).toHaveValue(0)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('サイドデッキのカウンターを0から1に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [],
    []
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(main.getByRole('spinbutton')).toHaveValue(0)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // サイドデッキのプラスボタンを押す
  await userEvent.click(side.getByRole('button', { name: '+' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeDisabled()
  expect(main.getByRole('spinbutton')).toHaveValue(0)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('サイドデッキのカウンターを1から2に増やす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 1]],
    [['1-1', 1]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // サイドデッキのプラスボタンを押す
  await userEvent.click(side.getByRole('button', { name: '+' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(2)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('サイドデッキのカウンターを2から1に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 2]],
    [['1-1', 2]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(2)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(2)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // サイドデッキのマイナスボタンを押す
  await userEvent.click(side.getByRole('button', { name: '-' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(2)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const { defaultRerender, getByRole } = defaultRender(
    '1-1',
    '織田信長',
    0,
    enumColor.RED,
    [['1-1', 1]],
    [['1-1', 1]]
  )
  let main = within(within(getByRole('row')).getAllByRole('cell')[2])
  let side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled()
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()

  // サイドデッキのマイナスボタンを押す
  await userEvent.click(side.getByRole('button', { name: '-' }))
  defaultRerender()
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})
