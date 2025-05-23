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

test('レンダリング赤', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="R-1"
          name="上杉謙信"
          term={0}
          color={enumColor.RED}
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
  expect(getByText('上杉謙信')).toBeVisible()

  const columnId = getByText('R-1')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-red')
})

test('レンダリング青', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="B-1"
          name="レオナルド・ダ・ヴィンチ"
          term={0}
          color={enumColor.BLUE}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('レオナルド・ダ・ヴィンチ')).toBeVisible()

  const columnId = getByText('B-1')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-blue')
})

test('レンダリング緑', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="G-1"
          name="出雲の阿国"
          term={0}
          color={enumColor.GREEN}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('出雲の阿国')).toBeVisible()

  const columnId = getByText('G-1')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-green')
})

test('レンダリング黄', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="Y-1"
          name="諸葛亮"
          term={0}
          color={enumColor.YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('諸葛亮')).toBeVisible()

  const columnId = getByText('Y-1')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-yellow')
})

test('レンダリング紫', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="P-1"
          name="マリ・キュリー"
          term={0}
          color={enumColor.PURPLE}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('マリ・キュリー')).toBeVisible()

  const columnId = getByText('P-1')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-purple')
})

test('レンダリング赤黄', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-78"
          name="RYマーブルオーブ"
          term={0}
          color={enumColor.RED_YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('RYマーブルオーブ')).toBeVisible()

  const columnId = getByText('2-78')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-red-yellow')
})

test('レンダリング青黄', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-79"
          name="BYマーブルオーブ"
          term={0}
          color={enumColor.BLUE_YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('BYマーブルオーブ')).toBeVisible()

  const columnId = getByText('2-79')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-blue-yellow')
})

test('レンダリング青黄', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-80"
          name="GYマーブルオーブ"
          term={0}
          color={enumColor.GREEN_YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('GYマーブルオーブ')).toBeVisible()

  const columnId = getByText('2-80')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-ijinden-green-yellow')
})

test('レンダリング赤の黄魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-57"
          name="スペクター"
          term={TERM_CHROMAGIC_YELLOW}
          color={enumColor.RED}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('スペクター')).toBeVisible()

  const columnId = getByText('2-57')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-red-yellow')
})

test('レンダリング黄の赤魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-69"
          name="スカーレット"
          term={TERM_CHROMAGIC_RED}
          color={enumColor.YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('スカーレット')).toBeVisible()

  const columnId = getByText('2-69')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-yellow-red')
})

test('レンダリング黄の青魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-70"
          name="ピーコック"
          term={TERM_CHROMAGIC_BLUE}
          color={enumColor.YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ピーコック')).toBeVisible()

  const columnId = getByText('2-70')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-yellow-blue')
})

test('レンダリング黄の緑魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="2-71"
          name="シャトルーズ"
          term={TERM_CHROMAGIC_GREEN}
          color={enumColor.YELLOW}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('シャトルーズ')).toBeVisible()

  const columnId = getByText('2-71')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-yellow-green')
})

test('レンダリング無色の赤魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="4-61"
          name="ソリッドビジョンα"
          term={TERM_CHROMAGIC_RED}
          color={enumColor.COLORLESS}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ソリッドビジョンα')).toBeVisible()

  const columnId = getByText('4-61')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-colorless-red')
})

test('レンダリング無色の青魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="4-62"
          name="ソリッドビジョンδ"
          term={TERM_CHROMAGIC_BLUE}
          color={enumColor.COLORLESS}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ソリッドビジョンδ')).toBeVisible()

  const columnId = getByText('4-62')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-colorless-blue')
})

test('レンダリング無色の緑魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="4-63"
          name="ソリッドビジョンΩ"
          term={TERM_CHROMAGIC_GREEN}
          color={enumColor.COLORLESS}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ソリッドビジョンΩ')).toBeVisible()

  const columnId = getByText('4-63')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-colorless-green')
})

test('レンダリング無色の黄魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="4-64"
          name="ソリッドビジョンβ"
          term={TERM_CHROMAGIC_YELLOW}
          color={enumColor.COLORLESS}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ソリッドビジョンβ')).toBeVisible()

  const columnId = getByText('4-64')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-colorless-yellow')
})

test('レンダリング無色の紫魔導', async () => {
  const { getByText } = render(
    <Table>
      <tbody>
        <TableRowCard
          id="4-65"
          name="ソリッドビジョンγ"
          term={TERM_CHROMAGIC_PURPLE}
          color={enumColor.COLORLESS}
          counterMain={0}
          counterSide={0}
          dispatchDeck={{
            decrementMain: vi.fn(),
            incrementMain: vi.fn(),
            decrementSide: vi.fn(),
            incrementSide: vi.fn(),
          }}
          zoomIn={vi.fn()}
          interruptSimulator={vi.fn()}
        />
      </tbody>
    </Table>
  )
  expect(getByText('ソリッドビジョンγ')).toBeVisible()

  const columnId = getByText('4-65')
  expect(columnId).toBeVisible()
  expect(columnId).toHaveClass('bg-chromagic-colorless-purple')
})
