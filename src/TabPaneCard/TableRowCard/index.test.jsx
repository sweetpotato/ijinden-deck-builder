// SPDX-License-Identifier: MIT

import { Table } from 'react-bootstrap'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
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

test('インタラクション', async () => {
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
  const interruptSimulator = vi.fn()
  const zoomIn = vi.fn()
  const { rerender, getByText, getByRole, getAllByRole } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="1-1"
          name="織田信長"
          term={0}
          color={enumColor.RED}
          counterMain={0}
          counterSide={0}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(getByText('1-1')).toBeVisible()
  expect(getByText('織田信長')).toBeVisible()

  let buttonZoom = getByRole('button', { name: '🔎' })
  expect(buttonZoom).toBeVisible()
  let buttonMinusMain = getAllByRole('button', { name: '-' })[0]
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).toBeDisabled() // 0枚なので無効
  let textboxMain = getAllByRole('spinbutton')[0]
  expect(textboxMain).toBeVisible()
  expect(textboxMain).toHaveAttribute('readonly')
  expect(textboxMain).toHaveValue(0)
  let buttonPlusMain = getAllByRole('button', { name: '+' })[0]
  expect(buttonPlusMain).toBeVisible()
  let textboxSide = getAllByRole('spinbutton')[1]
  expect(textboxSide).toBeVisible()
  expect(textboxSide).toHaveAttribute('readonly')
  expect(textboxSide).toHaveValue(0)
  let buttonMinusSide = getAllByRole('button', { name: '-' })[1]
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).toBeDisabled() // 0枚なので無効
  let buttonPlusSide = getAllByRole('button', { name: '+' })[1]
  expect(buttonPlusSide).toBeVisible()

  // メインのプラスボタンを押す
  await userEvent.click(buttonPlusMain)

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(1) // 呼ばれた
  expect(incrementMain.mock.lastCall.length).toBe(1)
  expect(incrementMain.mock.lastCall[0]).toBe('1-1')
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.calls.length).toBe(0)

  rerender(
    <Table>
      <tbody>
        <TableRowCard
          id="1-1"
          name="織田信長"
          term={0}
          color={enumColor.RED}
          counterMain={1}
          counterSide={0}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )

  buttonZoom = getByRole('button', { name: '🔎' })
  expect(buttonZoom).toBeVisible()
  buttonMinusMain = getAllByRole('button', { name: '-' })[0]
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).not.toBeDisabled()
  textboxMain = getAllByRole('spinbutton')[0]
  expect(textboxMain).toBeVisible()
  expect(textboxMain).toHaveAttribute('readonly')
  expect(textboxMain).toHaveValue(1) // 増えた
  buttonPlusMain = getAllByRole('button', { name: '+' })[0]
  expect(buttonPlusMain).toBeVisible()
  textboxSide = getAllByRole('spinbutton')[1]
  expect(textboxSide).toBeVisible()
  expect(textboxSide).toHaveAttribute('readonly')
  expect(textboxSide).toHaveValue(0)
  buttonMinusSide = getAllByRole('button', { name: '-' })[1]
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).toBeDisabled() // 0枚なので無効
  buttonPlusSide = getAllByRole('button', { name: '+' })[1]
  expect(buttonPlusSide).toBeVisible()

  // サイドのプラスボタンを押す
  await userEvent.click(buttonPlusSide)

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(1)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(1) // 呼ばれた
  expect(incrementSide.mock.lastCall.length).toBe(1)
  expect(incrementSide.mock.lastCall[0]).toBe('1-1')
  expect(interruptSimulator.mock.calls.length).toBe(1)
  expect(zoomIn.mock.calls.length).toBe(0)

  rerender(
    <Table>
      <tbody>
        <TableRowCard
          id="1-1"
          name="織田信長"
          term={0}
          color={enumColor.RED}
          counterMain={1}
          counterSide={1}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )

  buttonZoom = getByRole('button', { name: '🔎' })
  expect(buttonZoom).toBeVisible()
  buttonMinusMain = getAllByRole('button', { name: '-' })[0]
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).not.toBeDisabled()
  textboxMain = getAllByRole('spinbutton')[0]
  expect(textboxMain).toBeVisible()
  expect(textboxMain).toHaveAttribute('readonly')
  expect(textboxMain).toHaveValue(1)
  buttonPlusMain = getAllByRole('button', { name: '+' })[0]
  expect(buttonPlusMain).toBeVisible()
  textboxSide = getAllByRole('spinbutton')[1]
  expect(textboxSide).toBeVisible()
  expect(textboxSide).toHaveAttribute('readonly')
  expect(textboxSide).toHaveValue(1) // 増えた
  buttonMinusSide = getAllByRole('button', { name: '-' })[1]
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).not.toBeDisabled()
  buttonPlusSide = getAllByRole('button', { name: '+' })[1]
  expect(buttonPlusSide).toBeVisible()

  // メインのマイナスボタンを押す
  await userEvent.click(buttonMinusMain)

  expect(decrementMain.mock.calls.length).toBe(1) // 呼ばれた
  expect(decrementMain.mock.lastCall.length).toBe(1)
  expect(decrementMain.mock.lastCall[0]).toBe('1-1')
  expect(incrementMain.mock.calls.length).toBe(1)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.calls.length).toBe(2) // 呼ばれた
  expect(zoomIn.mock.calls.length).toBe(0)

  rerender(
    <Table>
      <tbody>
        <TableRowCard
          id="1-1"
          name="織田信長"
          term={0}
          color={enumColor.RED}
          counterMain={0}
          counterSide={1}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )

  buttonZoom = getByRole('button', { name: '🔎' })
  expect(buttonZoom).toBeVisible()
  buttonMinusMain = getAllByRole('button', { name: '-' })[0]
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).toBeDisabled() // 0枚なので無効
  textboxMain = getAllByRole('spinbutton')[0]
  expect(textboxMain).toBeVisible()
  expect(textboxMain).toHaveAttribute('readonly')
  expect(textboxMain).toHaveValue(0) // 減った
  buttonPlusMain = getAllByRole('button', { name: '+' })[0]
  expect(buttonPlusMain).toBeVisible()
  textboxSide = getAllByRole('spinbutton')[1]
  expect(textboxSide).toBeVisible()
  expect(textboxSide).toHaveAttribute('readonly')
  expect(textboxSide).toHaveValue(1)
  buttonMinusSide = getAllByRole('button', { name: '-' })[1]
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).not.toBeDisabled()
  buttonPlusSide = getAllByRole('button', { name: '+' })[1]
  expect(buttonPlusSide).toBeVisible()

  // サイドのマイナスボタンを押す
  await userEvent.click(buttonMinusSide)

  expect(decrementMain.mock.calls.length).toBe(1)
  expect(incrementMain.mock.calls.length).toBe(1)
  expect(decrementSide.mock.calls.length).toBe(1) // 呼ばれた
  expect(decrementSide.mock.lastCall.length).toBe(1)
  expect(decrementSide.mock.lastCall[0]).toBe('1-1')
  expect(incrementSide.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.calls.length).toBe(2) // 呼ばれていない
  expect(zoomIn.mock.calls.length).toBe(0)

  rerender(
    <Table>
      <tbody>
        <TableRowCard
          id="1-1"
          name="織田信長"
          term={0}
          color={enumColor.RED}
          counterMain={0}
          counterSide={0}
          dispatchDeck={dispatchDeck}
          zoomIn={zoomIn}
          interruptSimulator={interruptSimulator}
        />
      </tbody>
    </Table>
  )

  buttonZoom = getByRole('button', { name: '🔎' })
  expect(buttonZoom).toBeVisible()
  buttonMinusMain = getAllByRole('button', { name: '-' })[0]
  expect(buttonMinusMain).toBeVisible()
  expect(buttonMinusMain).toBeDisabled() // 0枚なので無効
  textboxMain = getAllByRole('spinbutton')[0]
  expect(textboxMain).toBeVisible()
  expect(textboxMain).toHaveAttribute('readonly')
  expect(textboxMain).toHaveValue(0)
  buttonPlusMain = getAllByRole('button', { name: '+' })[0]
  expect(buttonPlusMain).toBeVisible()
  textboxSide = getAllByRole('spinbutton')[1]
  expect(textboxSide).toBeVisible()
  expect(textboxSide).toHaveAttribute('readonly')
  expect(textboxSide).toHaveValue(0) // 減った
  buttonMinusSide = getAllByRole('button', { name: '-' })[1]
  expect(buttonMinusSide).toBeVisible()
  expect(buttonMinusSide).toBeDisabled() // 0枚なので無効
  buttonPlusSide = getAllByRole('button', { name: '+' })[1]
  expect(buttonPlusSide).toBeVisible()

  // 虫眼鏡ボタンを押す
  await userEvent.click(buttonZoom)

  expect(decrementMain.mock.calls.length).toBe(1)
  expect(incrementMain.mock.calls.length).toBe(1)
  expect(decrementSide.mock.calls.length).toBe(1)
  expect(incrementSide.mock.calls.length).toBe(1)
  expect(interruptSimulator.mock.calls.length).toBe(2)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
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
