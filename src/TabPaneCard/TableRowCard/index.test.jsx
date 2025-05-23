// SPDX-License-Identifier: MIT

import { Table } from 'react-bootstrap'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumChromagic from '../enumChromagic'
import enumColor from '../enumColor'
import enumTerm from '../enumTerm'
import TableRowCard from '.'

const TERM_CHROMAGIC_RED = enumTerm.CHROMAGIC | enumChromagic.RED
const TERM_CHROMAGIC_BLUE = enumTerm.CHROMAGIC | enumChromagic.BLUE
const TERM_CHROMAGIC_GREEN = enumTerm.CHROMAGIC | enumChromagic.GREEN
const TERM_CHROMAGIC_YELLOW = enumTerm.CHROMAGIC | enumChromagic.YELLOW
const TERM_CHROMAGIC_PURPLE = enumTerm.CHROMAGIC | enumChromagic.PURPLE

function defaultRender(id, name, term, color, counterMain, counterSide) {
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByText, getByRole, getAllByRole } = render(
    <Table>
      <tbody>
        <TableRowCard
          id={id}
          name={name}
          term={term}
          color={color}
          counterMain={counterMain}
          counterSide={counterSide}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )
  const defaultRerender = (counterMain, counterSide) =>
    rerender(
      <Table>
        <tbody>
          <TableRowCard
            id={id}
            name={name}
            term={term}
            color={color}
            counterMain={counterMain}
            counterSide={counterSide}
            dispatchDeck={dispatchDeck}
            zoomIn={zoomIn}
            interruptSimulator={interruptSimulator}
          />
        </tbody>
      </Table>
    )
  return {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByText,
    getByRole,
    getAllByRole,
  }
}

function defaultRenderColor(id, name, term, color) {
  return render(
    <Table>
      <tbody>
        <TableRowCard
          id={id}
          name={name}
          term={term}
          color={color}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          handleSetDeckMain={vi.fn()}
          handleSetDeckSide={vi.fn()}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole } = defaultRender('1-1', '織田信長', 0, enumColor.RED, 0, 0)

  // 表の行としてレンダリングされる
  const row = getByRole('row')
  expect(row).toBeVisible()
  // 列は4つある
  const columns = within(row).getAllByRole('cell')
  expect(columns.length).toBe(4)
  // 1列目 (1-origin, 以下同様) には ID が表示される
  const columnId = columns[0]
  expect(columnId).toBeVisible()
  expect(columnId).toHaveTextContent('1-1')
  // 2列目にはカード名が表示される
  const columnName = columns[1]
  expect(columnName).toBeVisible()
  expect(columnName).toHaveTextContent('織田信長')
  // 2列目にはさらに虫眼鏡ボタンがある
  const buttonZoom = within(columns[1]).getByRole('button')
  expect(buttonZoom).toBeVisible()
  expect(buttonZoom).toHaveTextContent('🔎')
  // 3列目には (メインデッキの) カウンターがある
  const columnMain = columns[2]
  expect(columnMain).toBeVisible()
  const buttonMinusMain = within(columnMain).getByRole('button', { name: '-' })
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).toBeDisabled() // 無効
  const spinMain = within(columnMain).getByRole('spinbutton')
  expect(spinMain).toBeVisible()
  expect(spinMain).toHaveAttribute('readonly')
  expect(spinMain).toHaveValue(0)
  const buttonPlusMain = within(columnMain).getByRole('button', { name: '+' })
  expect(buttonPlusMain).toBeVisible()
  expect(buttonPlusMain).toBeEnabled()
  // 4列目には (サイドデッキの) カウンターがある
  const columnSide = columns[3]
  expect(columnSide).toBeVisible()
  const buttonMinusSide = within(columnSide).getByRole('button', { name: '-' })
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).toBeDisabled() // 無効
  const spinSide = within(columnSide).getByRole('spinbutton')
  expect(spinSide).toBeVisible()
  expect(spinSide).toHaveAttribute('readonly')
  expect(spinSide).toHaveValue(0)
  const buttonPlusSide = within(columnSide).getByRole('button', { name: '+' })
  expect(buttonPlusSide).toBeVisible()
  expect(buttonPlusSide).toBeEnabled()
})

test('虫眼鏡ボタンを押す', async () => {
  const id = '1-1'
  const {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender(id, '織田信長', 0, enumColor.RED, 0, 0)

  await userEvent.click(getByRole('button', { name: '🔎' }))
  defaultRerender(0, 0)

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(0)
})

test('メインデッキのカウンターを0から1に増やす', async () => {
  const id = '1-1'
  const {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender(id, '織田信長', 0, enumColor.RED, 0, 0)
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

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(1) // 呼ばれた
  expect(incrementMain.mock.lastCall.length).toBe(1)
  expect(incrementMain.mock.lastCall[0]).toBe(id)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(1, 0)
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled()
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('メインデッキのカウンターを1から0に減らす', async () => {
  const id = '1-1'
  const {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender(id, '織田信長', 0, enumColor.RED, 1, 1)
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

  expect(decrementMain.mock.calls.length).toBe(1) // 呼ばれた
  expect(decrementMain.mock.lastCall.length).toBe(1)
  expect(decrementMain.mock.lastCall[0]).toBe(id)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.lastCall.length).toBe(0)

  defaultRerender(0, 1)
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
  const id = '1-1'
  const {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender(id, '織田信長', 0, enumColor.RED, 0, 0)
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

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(1) // 呼ばれた
  expect(incrementSide.mock.lastCall.length).toBe(1)
  expect(incrementSide.mock.lastCall[0]).toBe(id)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender(0, 1)
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeDisabled()
  expect(main.getByRole('spinbutton')).toHaveValue(0)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeEnabled() // 有効になった
  expect(side.getByRole('spinbutton')).toHaveValue(1)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('サイドデッキのカウンターを1から0に減らす', async () => {
  const id = '1-1'
  const {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
    zoomIn,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender(id, '織田信長', 0, enumColor.RED, 1, 1)
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

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(1) // 呼ばれた
  expect(decrementSide.mock.lastCall.length).toBe(1)
  expect(decrementSide.mock.lastCall[0]).toBe(id)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender(1, 0)
  main = within(within(getByRole('row')).getAllByRole('cell')[2])
  side = within(within(getByRole('row')).getAllByRole('cell')[3])

  expect(main.getByRole('button', { name: '-' })).toBeEnabled()
  expect(main.getByRole('spinbutton')).toHaveValue(1)
  expect(main.getByRole('button', { name: '+' })).toBeEnabled()
  expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効になった
  expect(side.getByRole('spinbutton')).toHaveValue(0)
  expect(side.getByRole('button', { name: '+' })).toBeEnabled()
})

test('レンダリング赤', () => {
  const { getByText } = defaultRenderColor('R-1', '上杉謙信', 0, enumColor.RED)
  expect(getByText('R-1')).toHaveClass('bg-ijinden-red')
})

test('レンダリング青', () => {
  const { getByText } = defaultRenderColor(
    'B-1',
    'レオナルド・ダ・ヴィンチ',
    0,
    enumColor.BLUE
  )
  expect(getByText('B-1')).toHaveClass('bg-ijinden-blue')
})

test('レンダリング緑', () => {
  const { getByText } = defaultRenderColor(
    'G-1',
    '出雲の阿国',
    0,
    enumColor.GREEN
  )
  expect(getByText('G-1')).toHaveClass('bg-ijinden-green')
})

test('レンダリング黄', () => {
  const { getByText } = defaultRenderColor('Y-1', '諸葛亮', 0, enumColor.YELLOW)
  expect(getByText('Y-1')).toHaveClass('bg-ijinden-yellow')
})

test('レンダリング紫', () => {
  const { getByText } = defaultRenderColor(
    'P-1',
    'マリ・キュリー',
    0,
    enumColor.PURPLE
  )
  expect(getByText('P-1')).toHaveClass('bg-ijinden-purple')
})

test('レンダリング赤黄', () => {
  const { getByText } = defaultRenderColor(
    '2-78',
    'RYマーブルオーブ',
    0,
    enumColor.RED_YELLOW
  )
  expect(getByText('2-78')).toHaveClass('bg-ijinden-red-yellow')
})

test('レンダリング青黄', () => {
  const { getByText } = defaultRenderColor(
    '2-79',
    'BYマーブルオーブ',
    0,
    enumColor.BLUE_YELLOW
  )
  expect(getByText('2-79')).toHaveClass('bg-ijinden-blue-yellow')
})

test('レンダリング青黄', () => {
  const { getByText } = defaultRenderColor(
    '2-80',
    'GYマーブルオーブ',
    0,
    enumColor.GREEN_YELLOW
  )
  expect(getByText('2-80')).toHaveClass('bg-ijinden-green-yellow')
})

test('レンダリング赤の黄魔導', () => {
  const { getByText } = defaultRenderColor(
    '2-57',
    'スペクター',
    TERM_CHROMAGIC_YELLOW,
    enumColor.RED
  )
  expect(getByText('2-57')).toHaveClass('bg-chromagic-red-yellow')
})

test('レンダリング黄の赤魔導', () => {
  const { getByText } = defaultRenderColor(
    '2-69',
    'スカーレット',
    TERM_CHROMAGIC_RED,
    enumColor.YELLOW
  )
  expect(getByText('2-69')).toHaveClass('bg-chromagic-yellow-red')
})

test('レンダリング黄の青魔導', () => {
  const { getByText } = defaultRenderColor(
    '2-70',
    'ピーコック',
    TERM_CHROMAGIC_BLUE,
    enumColor.YELLOW
  )
  expect(getByText('2-70')).toHaveClass('bg-chromagic-yellow-blue')
})

test('レンダリング黄の緑魔導', () => {
  const { getByText } = defaultRenderColor(
    '2-71',
    'シャトルーズ',
    TERM_CHROMAGIC_GREEN,
    enumColor.YELLOW
  )
  expect(getByText('2-71')).toHaveClass('bg-chromagic-yellow-green')
})

test('レンダリング無色の赤魔導', () => {
  const { getByText } = defaultRenderColor(
    '4-61',
    'ソリッドビジョンα',
    TERM_CHROMAGIC_RED,
    enumColor.COLORLESS
  )
  expect(getByText('4-61')).toHaveClass('bg-chromagic-colorless-red')
})

test('レンダリング無色の青魔導', () => {
  const { getByText } = defaultRenderColor(
    '4-62',
    'ソリッドビジョンδ',
    TERM_CHROMAGIC_BLUE,
    enumColor.COLORLESS
  )
  expect(getByText('4-62')).toHaveClass('bg-chromagic-colorless-blue')
})

test('レンダリング無色の緑魔導', () => {
  const { getByText } = defaultRenderColor(
    '4-63',
    'ソリッドビジョンΩ',
    TERM_CHROMAGIC_GREEN,
    enumColor.COLORLESS
  )
  expect(getByText('4-63')).toHaveClass('bg-chromagic-colorless-green')
})

test('レンダリング無色の黄魔導', () => {
  const { getByText } = defaultRenderColor(
    '4-64',
    'ソリッドビジョンβ',
    TERM_CHROMAGIC_YELLOW,
    enumColor.COLORLESS
  )
  expect(getByText('4-64')).toHaveClass('bg-chromagic-colorless-yellow')
})

test('レンダリング無色の紫魔導', () => {
  const { getByText } = defaultRenderColor(
    '4-65',
    'ソリッドビジョンγ',
    TERM_CHROMAGIC_PURPLE,
    enumColor.COLORLESS
  )
  expect(getByText('4-65')).toHaveClass('bg-chromagic-colorless-purple')
})
