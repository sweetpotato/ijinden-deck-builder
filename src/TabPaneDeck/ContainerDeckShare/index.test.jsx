// SPDX-License-Identifier: MIT

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ContainerDeckShare from '.'

function defaultRender(deckMain, deckSide) {
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  return { getByRole }
}

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  })
})

afterEach(cleanup)

test('レンダリングとアクセシビリティ', () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)

  // 「▶共有リンクをコピー」ボタンがある
  const button = getByRole('button')
  expect(button).toBeVisible()
  expect(button).toBeEnabled()
  expect(button).toHaveTextContent('▶共有リンクをコピー')
  // 共有リンクが入力された読み取り専用のテキストボックスがある
  // TODO テキストボックスのアクセシビリティを上げる
  // TODO 本体コードとあわせて修正する
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  // 空のデッキのデッキコード
  expect(textbox).toHaveValue('/ijinden-deck-builder/#/deck/BAA')
})

test.each([
  [
    '1枚',
    new Map([['R-1', 1]]),
    new Map(),
    '/ijinden-deck-builder/#/deck/BBAAA',
  ],
  [
    '4枚',
    new Map([['R-1', 4]]),
    new Map(),
    '/ijinden-deck-builder/#/deck/BBwAA',
  ],
  [
    '5枚',
    new Map([['R-1', 5]]),
    new Map(),
    '/ijinden-deck-builder/#/deck/CBAEAAA',
  ],
  [
    '64枚 (1/2)',
    new Map([['R-1', 64]]),
    new Map(),
    '/ijinden-deck-builder/#/deck/CBA_AAA',
  ],
  [
    '64枚 (2/2)',
    new Map([
      ['R-1', 64],
      ['R-2', 1],
    ]),
    new Map([['R-1', 1]]),
    '/ijinden-deck-builder/#/deck/CBA_CAAAAABAA',
  ],
  // ここから下はデッキの実例
  [
    '伝説の武将デッキ',
    new Map([
      ['R-1', 2],
      ['R-2', 2],
      ['R-3', 2],
      ['R-4', 2],
      ['R-5', 2],
      ['R-6', 2],
      ['R-7', 2],
      ['R-8', 2],
      ['R-9', 2],
      ['R-10', 2],
      ['R-11', 2],
      ['R-12', 2],
      ['R-13', 16],
    ]),
    new Map(),
    '/ijinden-deck-builder/#/deck/CBABCABDABEABFABGABHABIABJABKABLABMABNAPAAA',
  ],
  [
    'イジンデンフェス優勝デッキ',
    new Map([
      ['1-21', 4], // 鑑真
      ['1-26', 4], // メアリー1世
      ['1-48', 4], // 円形闘技場
      ['1-55', 4], // ストーム
      ['1-65', 2], // ブルーオーブ
      ['2-2', 3], // ピョートル大帝
      ['2-17', 3], // ジャン＝ジャック・ルソー
      ['2-32', 4], // 曹操
      ['2-79', 4], // BYマーブルオーブ
      ['3-22', 4], // 高杉晋作
      ['3-72', 4], // 怖れの種
    ]),
    new Map(),
    '/ijinden-deck-builder/#/deck/B8wBxXxexoRGiVikyTz6zs0AA',
  ],
  [
    'RSコロッセオ優勝デッキ',
    new Map([
      ['R-11', 4], // ロイヤリティ
      ['1-17', 2], // 藤原道長
      ['2-1', 2], // 天草四郎
      ['2-9', 4], // 石田三成
      ['2-59', 2], // サモン
      ['2-68', 2], // メロウ
      ['2-78', 1], // RYマーブルオーブ
      ['P-11', 4], // スピリットアウェイ
      ['P-15', 1], // パープルオーブ
      ['3-9', 1], // 土方歳三
      ['3-69', 2], // コーザリティ
      ['3-71', 4], // 喜びの種
      ['3-75', 4], // 悲しみの種
      ['4-68', 1], // 遁甲式水鏡
      ['4-72', 2], // ラ・コロール
      ['4-80', 4], // カルドロン
    ]),
    new Map([
      ['1-17', 1], // 藤原道長
      ['2-78', 1], // RYマーブルオーブ
      ['3-47', 4], // 徳川慶喜
      ['3-74', 1], // 苦しみの種
      ['4-68', 1], // 遁甲式水鏡
      ['4-74', 2], // ディ・クローネ
    ]),
    '/ijinden-deck-builder/#/deck/BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V',
  ],
])(
  '同じカードの枚数が64枚以下ならコードは有効 (%s)',
  async (_, deckMain, deckSide, expectedCode) => {
    const { getByRole } = defaultRender(deckMain, deckSide)

    // 共有リンクをコピーボタンは有効
    expect(getByRole('button')).toBeEnabled()
    expect(getByRole('textbox')).toHaveValue(expectedCode)

    // 共有リンクをコピーボタンを押す
    await userEvent.click(getByRole('button'))
    // クリップボードに共有リンクがコピーされる
    expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
    expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
    expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(expectedCode)
  }
)

test('同じカードの枚数が65枚以上ならコードは無効', async () => {
  const deckMain = new Map([['R-1', 65]])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)

  // 共有リンクをコピーボタンは無効
  expect(getByRole('button')).toBeDisabled()
  // 共有リンクは表示されない
  expect(getByRole('textbox')).toHaveValue('(共有できる条件を満たしていません)')
})
