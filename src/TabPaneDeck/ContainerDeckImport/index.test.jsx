import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ContainerDeckImport from '.'

function defaultRender() {
  const dispatchSetFromEntries = vi.fn()
  const { rerender, getByPlaceholderText, getByRole, queryByRole } = render(
    <ContainerDeckImport dispatchSetFromEntries={dispatchSetFromEntries} />,
  )
  const defaultRerender = () =>
    rerender(
      <ContainerDeckImport dispatchSetFromEntries={dispatchSetFromEntries} />,
    )
  return {
    dispatchSetFromEntries,
    defaultRerender,
    getByPlaceholderText,
    getByRole,
    queryByRole,
  }
}

window.scrollTo = vi.fn()
beforeEach(vi.resetAllMocks)
afterEach(cleanup)

test('デフォルトのレンダリングとアクセシビリティ', () => {
  const { getByPlaceholderText, getByRole, queryByRole } = defaultRender()
  // インポートボタンがある
  expect(getByRole('button', { name: 'インポート◀' })).toBeVisible()
  // 共有リンクを貼り付けるテキストボックスがある
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toBeVisible()
  // アラートはまだ表示されていない
  expect(queryByRole('alert')).toBeNull()
})

test('共有リンクが正しくない', async () => {
  const {
    dispatchSetFromEntries,
    defaultRerender,
    getByPlaceholderText,
    getByRole,
    queryByRole,
  } = defaultRender()

  // 共有リンクを入力してインポートボタンを押す
  await userEvent.type(
    getByPlaceholderText('ここに共有リンクを貼り付け'),
    '/#/deck/BAAA', // 1文字多い
  )
  await userEvent.click(getByRole('button', { name: 'インポート◀' }))
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(window.scrollTo.mock.calls.length).toBe(0)

  defaultRerender()
  // 入力した値はまだ残っている
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue(
    '/#/deck/BAAA',
  )
  // prettier-ignore
  expect(getByRole('alert')).toHaveTextContent('共有リンクが正しくありません。')

  // 正しい共有リンクを入力し直してインポートボタンを押す
  await userEvent.clear(getByPlaceholderText('ここに共有リンクを貼り付け'))
  await userEvent.type(
    getByPlaceholderText('ここに共有リンクを貼り付け'),
    '/#/deck/BAA', // 空のデッキ
  )
  await userEvent.click(getByRole('button', { name: 'インポート◀' }))
  expect(dispatchSetFromEntries.mock.calls.length).toBe(1)
  expect(dispatchSetFromEntries.mock.lastCall.length).toBe(2)
  expect(dispatchSetFromEntries.mock.lastCall[0]).toEqual([])
  expect(dispatchSetFromEntries.mock.lastCall[1]).toEqual([])
  expect(window.scrollTo.mock.calls.length).toBe(1)
  expect(window.scrollTo.mock.lastCall.length).toBe(1)
  // prettier-ignore
  expect(window.scrollTo.mock.lastCall[0]).toEqual({ top: 0, behavior: 'smooth' })

  defaultRerender()
  // 成功すると入力した値はクリアされる
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue('')
  // prettier-ignore
  expect(queryByRole('alert')).toBeNull()
})

test.each([
  [
    '伝説の武将デッキ',
    '/#/deck/CBABCABDABEABFABGABHABIABJABKABLABMABNAPAAA',
    [
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
    ],
    [],
  ],
  [
    'イジンデンフェス優勝デッキ',
    '/#/deck/B8wBxXxexoRGiVikyTz6zs0AA',
    [
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
    ],
    [],
  ],
  [
    'RSコロッセオ優勝デッキ',
    '/#/deck/BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V',
    [
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
    ],
    [
      ['1-17', 1], // 藤原道長
      ['2-78', 1], // RYマーブルオーブ
      ['3-47', 4], // 徳川慶喜
      ['3-74', 1], // 苦しみの種
      ['4-68', 1], // 遁甲式水鏡
      ['4-74', 2], // ディ・クローネ
    ],
  ],
])('インポート成功 (%s)', async (_, code, expectedMain, expectedSide) => {
  const {
    dispatchSetFromEntries,
    defaultRerender,
    getByPlaceholderText,
    getByRole,
    queryByRole,
  } = defaultRender()

  // 共有リンクを入力してインポートボタンを押す
  await userEvent.type(getByPlaceholderText('ここに共有リンクを貼り付け'), code)
  await userEvent.click(getByRole('button', { name: 'インポート◀' }))
  expect(dispatchSetFromEntries.mock.calls.length).toBe(1)
  expect(dispatchSetFromEntries.mock.lastCall.length).toBe(2)
  expect(dispatchSetFromEntries.mock.lastCall[0]).toEqual(expectedMain)
  expect(dispatchSetFromEntries.mock.lastCall[1]).toEqual(expectedSide)
  expect(window.scrollTo.mock.calls.length).toBe(1)
  expect(window.scrollTo.mock.lastCall.length).toBe(1)
  // prettier-ignore
  expect(window.scrollTo.mock.lastCall[0]).toEqual({ top: 0, behavior: 'smooth' })

  defaultRerender()
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue('')
  expect(queryByRole('alert')).toBeNull()
})
