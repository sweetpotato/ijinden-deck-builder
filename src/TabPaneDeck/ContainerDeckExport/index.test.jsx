// SPDX-License-Identifier: MIT

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'

import ContainerDeckExport from '.'
import userEvent from '@testing-library/user-event'

function defaultRender(deckMain, deckSide) {
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
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

test('レンダリングとアクセシビリティ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)

  // 「テキストデータをコピー」ボタンがある
  expect(getByRole('button')).toBeVisible()
  expect(getByRole('button')).toHaveTextContent('▼テキストデータをコピー')
  // テキストデータを保持したテキストエリアがある
  // prettier-ignore
  expect(getByRole('textbox'), { name: '▼テキストデータをコピー' }).toBeVisible()
  // 空のデッキのテキストデータ
  // 改行は LF である
  expect(getByRole('textbox')).toHaveValue('メインデッキ\t0\n\nサイドデッキ\t0')

  // 「テキストデータをコピーボタン」を押すと
  // テキストデータがクリップボードにコピーされる
  // 改行は CRLF である
  await userEvent.click(getByRole('button'))
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    'メインデッキ\t0\r\n\r\nサイドデッキ\t0'
  )
})

test.each([
  [
    'メインデッキ4枚',
    new Map([['R-1', 4]]),
    new Map(),
    // 改行は LF (\n) とすること。以下同様。
    'メインデッキ\t4\n上杉謙信\t4\n\nサイドデッキ\t0',
  ],
  [
    'サイドデッキ4枚',
    new Map(),
    new Map([['R-1', 4]]),
    'メインデッキ\t0\n\nサイドデッキ\t4\n上杉謙信\t4',
  ],
  [
    'メインデッキ5枚',
    new Map([['R-1', 5]]),
    new Map(),
    'メインデッキ\t5\n上杉謙信\t5\n\nサイドデッキ\t0',
  ],
  [
    'サイドデッキ5枚',
    new Map(),
    new Map([['R-1', 5]]),
    'メインデッキ\t0\n\nサイドデッキ\t5\n上杉謙信\t5',
  ],
  [
    'メインデッキ64枚',
    new Map([['R-1', 64]]),
    new Map(),
    'メインデッキ\t64\n上杉謙信\t64\n\nサイドデッキ\t0',
  ],
  [
    'サイドデッキ64枚',
    new Map(),
    new Map([['R-1', 64]]),
    'メインデッキ\t0\n\nサイドデッキ\t64\n上杉謙信\t64',
  ],
  [
    'メインデッキ65枚',
    new Map([['R-1', 65]]),
    new Map(),
    'メインデッキ\t65\n上杉謙信\t65\n\nサイドデッキ\t0',
  ],
  [
    'サイドデッキ65枚',
    new Map(),
    new Map([['R-1', 65]]),
    'メインデッキ\t0\n\nサイドデッキ\t65\n上杉謙信\t65',
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
    'メインデッキ\t40\n源義経\t2\n武田勝頼\t2\nヴラド・ツェペシュ\t2\n' +
      '坂上田村麻呂\t2\n楠木正成\t2\nジェームズ・バトラー・ヒコック\t2\n' +
      '上杉謙信\t2\nアレクサンドロス大王\t2\n神剣眠る氏社\t2\n連なる天守閣\t2\n' +
      'ロイヤリティ\t2\nデスペラード\t2\nレッドストーン\t16\n\nサイドデッキ\t0',
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
    'メインデッキ\t40\n鑑真\t4\n高杉晋作\t4\nメアリー1世\t4\n' +
      'ジャン＝ジャック・ルソー\t3\n曹操\t4\nピョートル大帝\t3\n' +
      '円形闘技場\t4\nストーム\t4\n怖れの種\t4\nブルーオーブ\t2\n' +
      'BYマーブルオーブ\t4\n\nサイドデッキ\t0',
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
    'メインデッキ\t40\n天草四郎\t2\n藤原道長\t2\n石田三成\t4\n' +
      '土方歳三\t1\nスピリットアウェイ\t4\nロイヤリティ\t4\n' +
      'サモン\t2\nコーザリティ\t2\nメロウ\t2\n喜びの種\t4\n' +
      '遁甲式水鏡\t1\nラ・コロール\t2\n悲しみの種\t4\n' +
      'パープルオーブ\t1\nRYマーブルオーブ\t1\nカルドロン\t4\n\n' +
      'サイドデッキ\t10\n徳川慶喜\t4\n藤原道長\t1\n遁甲式水鏡\t1\n' +
      '苦しみの種\t1\nディ・クローネ\t2\nRYマーブルオーブ\t1',
  ],
])(
  '同じカードの枚数が何枚でもテキストデータをコピーできる (%s)',
  async (_, deckMain, deckSide, expectedText) => {
    const { getByRole } = defaultRender(deckMain, deckSide)
    expect(getByRole('textbox')).toHaveValue(expectedText)

    await userEvent.click(getByRole('button'))
    expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
    expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
    // LF を CRLF に変換してアサーションする
    expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
      expectedText.replaceAll('\n', '\r\n')
    )
  }
)
