// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import {
  cleanup,
  render,
  renderHook,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { dbAddDeck, dbClearDecks, dbQueryDecks } from '../commons/db'
import useTabPaneLoad from '.'
import { act } from 'react'

function getExpandFn(result) {
  return result.current[0]
}

function getRenderFn(result) {
  return result.current[1]
}

function defaultRender() {
  const setDeckTitle = vi.fn()
  const dispatchSetFromEntries = vi.fn()
  const moveToDeck = vi.fn()
  const interruptSimulator = vi.fn()

  const { result } = renderHook(() =>
    useTabPaneLoad(dispatchSetFromEntries, moveToDeck, interruptSimulator)
  )
  const { rerender, getByRole, getAllByRole, queryByRole } = render(
    getRenderFn(result)(setDeckTitle)
  )
  const defaultRerender = () => rerender(getRenderFn(result)(setDeckTitle))

  return {
    result,
    setDeckTitle,
    dispatchSetFromEntries,
    moveToDeck,
    interruptSimulator,
    defaultRerender,
    getByRole,
    getAllByRole,
    queryByRole,
  }
}

beforeEach(async () => {
  await dbClearDecks()
})

afterEach(cleanup)

test('デフォルトのレンダリング', async () => {
  // 初期状態ではデータベースは空
  expect((await dbQueryDecks()).length).toBe(0)

  const { getByRole, queryByRole } = defaultRender()

  // 保存済みデッキはない
  expect(queryByRole('listitem')).toBeNull()

  // 「保存済みレシピをすべて削除」ボタンがある
  // prettier-ignore
  expect(getByRole('button', { name: '保存済みレシピをすべて削除' })).toBeVisible()
})

test('保存済みデッキの表示と読込み', async () => {
  // 初期状態ではデータベースは空
  expect((await dbQueryDecks()).length).toBe(0)
  // デッキを1つ保存する
  const id = await dbAddDeck({
    title: 'サンプルレシピ',
    timestamp: Date.now(),
    main: [
      ['R-2', 4], // 源義経
      ['R-3', 3], // 武田勝頼
    ],
    side: [
      ['R-5', 2], // 坂上田村麻呂
      ['R-6', 1], // 楠木正成
    ],
  })
  // デッキが保存された
  expect((await dbQueryDecks()).length).toBe(1)

  const {
    setDeckTitle,
    dispatchSetFromEntries,
    moveToDeck,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' })).toBeVisible())
  // 保存済みデッキは1つ
  expect(getByRole('list', { name: 'ロード' }).children.length).toBe(1)
  // 各保存済みデッキには #ID 形式の名前がついている
  let deck = getByRole('listitem', { name: `#${id}` })
  expect(deck).toHaveTextContent('サンプルレシピ')

  // デッキを開く
  await userEvent.click(within(deck).getByRole('button', { expanded: false }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender()

  // デッキが開かれた
  deck = getByRole('listitem', { name: `#${id}` })
  expect(within(deck).getByRole('button', { expanded: true })).toBeVisible()

  // 含まれているカードと枚数の確認
  const main = within(deck).getByRole('region', { name: 'メインデッキ' })
  expect(within(main).getAllByRole('listitem').length).toBe(2)
  const r2 = within(main).getAllByRole('listitem')[0]
  expect(within(r2).getByRole('img')).toHaveAttribute('alt', '源義経')
  expect(within(r2).getByRole('textbox')).toHaveTextContent(4)
  const r3 = within(main).getAllByRole('listitem')[1]
  expect(within(r3).getByRole('img')).toHaveAttribute('alt', '武田勝頼')
  expect(within(r3).getByRole('textbox')).toHaveTextContent(3)
  const side = within(deck).getByRole('region', { name: 'サイドデッキ' })
  expect(within(side).getAllByRole('listitem').length).toBe(2)
  const r5 = within(side).getAllByRole('listitem')[0]
  expect(within(r5).getByRole('img')).toHaveAttribute('alt', '坂上田村麻呂')
  expect(within(r5).getByRole('textbox')).toHaveTextContent(2)
  const r6 = within(side).getAllByRole('listitem')[1]
  expect(within(r6).getByRole('img')).toHaveAttribute('alt', '楠木正成')
  expect(within(r6).getByRole('textbox')).toHaveTextContent(1)

  // 読込みボタンと削除ボタンがある
  expect(within(deck).getByRole('button', { name: '読込み' })).toBeVisible()
  expect(within(deck).getByRole('button', { name: '削除' })).toBeVisible()

  // 読込みボタンを押す
  await userEvent.click(within(deck).getByRole('button', { name: '読込み' }))

  expect(setDeckTitle.mock.calls.length).toBe(1) // 呼ばれた
  expect(setDeckTitle.mock.lastCall.length).toBe(1)
  expect(setDeckTitle.mock.lastCall[0]).toBe('サンプルレシピ')
  expect(dispatchSetFromEntries.mock.calls.length).toBe(1) // 呼ばれた
  expect(dispatchSetFromEntries.mock.lastCall.length).toBe(2)
  // prettier-ignore
  expect(dispatchSetFromEntries.mock.lastCall[0]).toEqual([['R-2', 4], ['R-3', 3]])
  // prettier-ignore
  expect(dispatchSetFromEntries.mock.lastCall[1]).toEqual([['R-5', 2], ['R-6', 1]])
  expect(moveToDeck.mock.calls.length).toBe(1) // 呼ばれた
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
})

test('たったいま保存したデッキの表示', async () => {
  // 初期状態ではデータベースは空
  expect((await dbQueryDecks()).length).toBe(0)
  // デッキを2つ保存する
  await dbAddDeck({
    title: 'サンプルレシピ1',
    timestamp: Date.now(),
    main: [['R-1', 1]],
    side: [],
  })
  // いま保存したばかり
  const id2 = await dbAddDeck({
    title: 'サンプルレシピ2',
    timestamp: Date.now(),
    main: [['R-2', 1]],
    side: [],
  })

  const { result, defaultRerender, getByRole } = defaultRender()
  await act(() => getExpandFn(result)(id2))
  defaultRerender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' }).children.length).toBe(2))
  // 後に保存されたデッキの方が先 (上) に来る
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[0]).toHaveTextContent('サンプルレシピ2')
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[1]).toHaveTextContent('サンプルレシピ1')

  let deck2 = getByRole('listitem', { name: `#${id2}` })
  expect(deck2).toHaveTextContent('サンプルレシピ2')
  // デッキは既に開いている
  expect(within(deck2).getByRole('button', { expanded: true })).toBeVisible()
})

test('保存済みデッキの削除', async () => {
  // 初期状態ではデータベースは空
  expect((await dbQueryDecks()).length).toBe(0)
  // デッキを3つ保存する
  await dbAddDeck({
    title: 'サンプルレシピ1',
    timestamp: Date.now(),
    main: [['R-1', 1]],
    side: [],
  })
  const id2 = await dbAddDeck({
    title: 'サンプルレシピ2',
    timestamp: Date.now(),
    main: [['R-2', 1]],
    side: [],
  })
  await dbAddDeck({
    title: 'サンプルレシピ3',
    timestamp: Date.now(),
    main: [['R-3', 1]],
    side: [],
  })

  const {
    setDeckTitle,
    dispatchSetFromEntries,
    moveToDeck,
    interruptSimulator,
    defaultRerender,
    getByRole,
  } = defaultRender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' }).children.length).toBe(3))
  // 後に保存されたデッキの方が先 (上) に来る
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[0]).toHaveTextContent('サンプルレシピ3')
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[1]).toHaveTextContent('サンプルレシピ2')
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[2]).toHaveTextContent('サンプルレシピ1')

  let deck2 = getByRole('listitem', { name: `#${id2}` })
  expect(deck2).toHaveTextContent('サンプルレシピ2')

  // デッキを開く
  await userEvent.click(within(deck2).getByRole('button', { expanded: false }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender()

  // デッキが開かれた
  deck2 = getByRole('listitem', { name: `#${id2}` })
  expect(within(deck2).getByRole('button', { expanded: true })).toBeVisible()

  // 読込みボタンと削除ボタンがある
  expect(within(deck2).getByRole('button', { name: '読込み' })).toBeVisible()
  expect(within(deck2).getByRole('button', { name: '削除' })).toBeVisible()

  // 削除ボタンを押す
  await userEvent.click(within(deck2).getByRole('button', { name: '削除' }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // データベースから削除された
  await waitFor(async () => expect((await dbQueryDecks()).length).toBe(2))

  defaultRerender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' }).children.length).toBe(2))
  // 後に保存されたデッキの方が先 (上) に来る
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[0]).toHaveTextContent('サンプルレシピ3')
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[1]).toHaveTextContent('サンプルレシピ1')
})

test('保存済みレシピをすべて削除', async () => {
  // 初期状態ではデータベースは空
  expect((await dbQueryDecks()).length).toBe(0)
  // デッキを2つ保存する
  await dbAddDeck({
    title: 'サンプルレシピ1',
    timestamp: Date.now(),
    main: [['R-1', 1]],
    side: [],
  })
  await dbAddDeck({
    title: 'サンプルレシピ2',
    timestamp: Date.now(),
    main: [['R-2', 1]],
    side: [],
  })

  const {
    setDeckTitle,
    dispatchSetFromEntries,
    moveToDeck,
    interruptSimulator,
    defaultRerender,
    getByRole,
    queryByRole,
  } = defaultRender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' }).children.length).toBe(2))
  // 後に保存されたデッキの方が先 (上) に来る
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[0]).toHaveTextContent('サンプルレシピ2')
  // prettier-ignore
  expect(getByRole('list', { name: 'ロード' }).children[1]).toHaveTextContent('サンプルレシピ1')

  // ダイアログはまだ表示されていない
  expect(queryByRole('dialog')).toBeNull()

  // すべて削除ボタンを押す
  // prettier-ignore
  await userEvent.click(getByRole('button', { name: '保存済みレシピをすべて削除' }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender()

  // ダイアログが表示された
  // ダイアログ表示の変化は waitFor した方がテストが安定する模様
  await waitFor(() => expect(getByRole('dialog')).toBeVisible())

  // キャンセルボタンを押す
  // prettier-ignore
  await userEvent.click(within(getByRole('dialog')).getByRole('button', { name: 'キャンセル' }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // データベースからはまだ削除されていない
  expect((await dbQueryDecks()).length).toBe(2)

  defaultRerender()

  // ダイアログが引っ込んだ
  await waitFor(() => expect(queryByRole('dialog')).toBeNull())

  // 再度、すべて削除ボタンを押す
  // prettier-ignore
  await userEvent.click(getByRole('button', { name: '保存済みレシピをすべて削除' }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender()

  // またダイアログが表示された
  await waitFor(() => expect(getByRole('dialog')).toBeVisible())

  // 「削除する」ボタンを押して削除を確定する
  // prettier-ignore
  await userEvent.click(within(getByRole('dialog')).getByRole('button', { name: '削除する' }))

  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(dispatchSetFromEntries.mock.calls.length).toBe(0)
  expect(moveToDeck.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // データベースから削除された
  await waitFor(async () => expect((await dbQueryDecks()).length).toBe(0))

  defaultRerender()

  // ライブクエリの完了を waitFor で待つ
  // prettier-ignore
  await waitFor(() => expect(getByRole('list', { name: 'ロード' }).children.length).toBe(0))
})
