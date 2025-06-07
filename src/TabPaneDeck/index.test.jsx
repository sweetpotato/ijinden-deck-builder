// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'

import { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import {
  cleanup,
  render,
  renderHook,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { decodeDeck } from '../commons/dataCards'
import useDeck from '../hooks/useDeck'
import TabPaneDeck from '.'
import Dexie from 'dexie'

function getDeckMain(result) {
  return result.current[0]
}

function getDeckSide(result) {
  return result.current[1]
}

function getDispatchDeck(result) {
  return result.current[2]
}

function getDeckTitle(result) {
  return result.current[0]
}

function getSetDeckTitleFn(result) {
  return result.current[1]
}

function defaultRender(entriesMain, entriesSide, initialDeckTitle) {
  const { result: resultDeck } = renderHook(() =>
    useDeck(entriesMain, entriesSide)
  )
  const { result: resultDeckTitle } = renderHook(() =>
    useState(initialDeckTitle)
  )
  const setShowCodeError = vi.fn()
  const zoomIn = vi.fn()
  const moveToLoad = vi.fn()
  const expandAccordion = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getAllByRole,
    queryByRole,
  } = render(
    <TabPaneDeck
      code={undefined}
      showCodeError={false}
      setShowCodeError={setShowCodeError}
      deckTitle={getDeckTitle(resultDeckTitle)}
      setDeckTitle={getSetDeckTitleFn(resultDeckTitle)}
      deckMain={getDeckMain(resultDeck)}
      deckSide={getDeckSide(resultDeck)}
      dispatchDeck={getDispatchDeck(resultDeck)}
      zoomIn={zoomIn}
      moveToLoad={moveToLoad}
      expandAccordion={expandAccordion}
      interruptSimulator={interruptSimulator}
    />
  )
  const defaultRerender = (resultDeck) =>
    rerender(
      <TabPaneDeck
        code={undefined}
        showCodeError={false}
        setShowCodeError={setShowCodeError}
        deckTitle={getDeckTitle(resultDeckTitle)}
        setDeckTitle={getSetDeckTitleFn(resultDeckTitle)}
        deckMain={getDeckMain(resultDeck)}
        deckSide={getDeckSide(resultDeck)}
        dispatchDeck={getDispatchDeck(resultDeck)}
        zoomIn={zoomIn}
        moveToLoad={moveToLoad}
        expandAccordion={expandAccordion}
        interruptSimulator={interruptSimulator}
      />
    )
  return {
    resultDeck,
    resultDeckTitle,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    defaultRerender,
    getByPlaceholderText,
    getByRole,
    getAllByRole,
    queryByRole,
  }
}

beforeEach(() => {
  Dexie.dependencies.indexedDB = new IDBFactory()
})

afterEach(cleanup)

test('コードが正しい場合のレンダリング', () => {
  // RSコロッセオ優勝デッキ
  const code = 'BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V'
  const link = `/ijinden-deck-builder/#/deck/${code}`
  const resultsDecode = decodeDeck(code)
  expect(resultsDecode).not.toBeFalsy()
  const [entriesMain, entriesSide] = resultsDecode
  const { result } = renderHook(() => useDeck(entriesMain, entriesSide))

  // defaultRender は使用しない
  const { getByPlaceholderText, getByRole, queryByRole } = render(
    <TabPaneDeck
      code={code}
      showCodeError={false}
      setShowCodeError={vi.fn()}
      deckTitle=""
      setDeckTitle={vi.fn()}
      deckMain={getDeckMain(result)}
      deckSide={getDeckSide(result)}
      dispatchDeck={getDispatchDeck(result)}
      zoomIn={vi.fn()}
      moveToLoad={vi.fn()}
      expandAccordion={vi.fn()}
      interruptSimulator={vi.fn()}
    />
  )

  // アラートは表示されない
  expect(queryByRole('alert')).toBeNull()

  // テキストボックスには共有リンクとテキストデータ
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toHaveValue('')
  // prettier-ignore
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(link)
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t40\n天草四郎\t2\n藤原道長\t2\n石田三成\t4\n' +
      '土方歳三\t1\nスピリットアウェイ\t4\nロイヤリティ\t4\n' +
      'サモン\t2\nコーザリティ\t2\nメロウ\t2\n喜びの種\t4\n' +
      '遁甲式水鏡\t1\nラ・コロール\t2\n悲しみの種\t4\n' +
      'パープルオーブ\t1\nRYマーブルオーブ\t1\nカルドロン\t4\n\n' +
      'サイドデッキ\t10\n徳川慶喜\t4\n藤原道長\t1\n遁甲式水鏡\t1\n' +
      '苦しみの種\t1\nディ・クローネ\t2\nRYマーブルオーブ\t1'
  )
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue('')
})

test('コードが誤っている場合のレンダリング', async () => {
  const code = 'BAAA'
  expect(decodeDeck(code)).toBeNull()
  const { result } = renderHook(() => useDeck([], []))

  const setShowCodeError = vi.fn()
  const setDeckTitle = vi.fn()
  const zoomIn = vi.fn()
  const moveToLoad = vi.fn()
  const expandAccordion = vi.fn()
  const interruptSimulator = vi.fn()

  // defaultRender は使用しない
  const { rerender, getByPlaceholderText, getByRole, queryByRole } = render(
    <TabPaneDeck
      code={code}
      showCodeError={true}
      setShowCodeError={setShowCodeError}
      deckTitle=""
      setDeckTitle={setDeckTitle}
      deckMain={getDeckMain(result)}
      deckSide={getDeckSide(result)}
      dispatchDeck={getDispatchDeck(result)}
      zoomIn={zoomIn}
      moveToLoad={moveToLoad}
      expandAccordion={expandAccordion}
      interruptSimulator={interruptSimulator}
    />
  )

  // アラートが表示される
  expect(getByRole('alert')).toHaveTextContent(/デッキコードが正しくありません/)

  // テキストボックスには空のデッキの値
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toHaveValue('')
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(
    '/ijinden-deck-builder/#/deck/BAA'
  )
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t0'
  )
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue('')

  // アラートを閉じる
  expect(getByRole('button', { name: 'Close alert' })).toBeVisible()
  await userEvent.click(getByRole('button', { name: 'Close alert' }))

  expect(setShowCodeError.mock.calls.length).toBe(1) // 呼ばれた
  expect(setShowCodeError.mock.lastCall.length).toBe(1)
  expect(setShowCodeError.mock.lastCall[0]).toBe(false)
  expect(setDeckTitle.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  rerender(
    <TabPaneDeck
      code={code}
      showCodeError={true}
      setShowCodeError={setShowCodeError}
      deckTitle=""
      setDeckTitle={setDeckTitle}
      deckMain={getDeckMain(result)}
      deckSide={getDeckSide(result)}
      dispatchDeck={getDispatchDeck(result)}
      zoomIn={zoomIn}
      moveToLoad={moveToLoad}
      expandAccordion={expandAccordion}
      interruptSimulator={interruptSimulator}
    />
  )

  // アラートは閉じられた
  expect(queryByRole('alert')).toBeNull()
})

test('デフォルトのレンダリング', () => {
  // prettier-ignore
  const { getByPlaceholderText, getByRole, queryByRole } = defaultRender([], [], '')

  // モーダルダイアログは表示されていない
  expect(queryByRole('dialog')).toBeNull()

  // アラートは表示されていない
  expect(queryByRole('alert')).toBeNull()

  // 画像は表示されていない
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).queryByRole('img')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).queryByRole('img')).toBeNull()

  // テキストボックスには空のデッキの値
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toBeVisible()
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toHaveValue('')
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toBeVisible()
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(
    '/ijinden-deck-builder/#/deck/BAA'
  )
  // prettier-ignore
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toBeVisible()
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t0'
  )
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toBeVisible()
  expect(getByPlaceholderText('ここに共有リンクを貼り付け')).toHaveValue('')

  // ボタンがいくつかある
  expect(getByRole('button', { name: 'マイデッキに保存' })).toBeVisible()
  expect(getByRole('button', { name: 'レシピをクリア' })).toBeVisible()
  expect(getByRole('button', { name: '▶共有リンクをコピー' })).toBeVisible()
  expect(getByRole('button', { name: '▼テキストデータをコピー' })).toBeVisible()
  expect(getByRole('button', { name: 'インポート◀' })).toBeVisible()
})

test('マイデッキに保存', async () => {
  const {
    resultDeck,
    defaultRerender,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
    queryByRole,
  } = defaultRender(
    [
      ['R-1', 1],
      ['R-2', 2],
    ],
    [['R-3', 3]],
    ''
  )

  expect(queryByRole('dialog')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).getAllByRole('img').length).toBe(2)
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).getAllByRole('img').length).toBe(1)

  await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  // handleClickSave は async 関数のため完了を待つ必要がある
  await waitFor(() => expect(moveToLoad.mock.calls.length).toBe(1)) // 呼ばれた
  await waitFor(() => expect(expandAccordion.mock.calls.length).toBe(1)) // 呼ばれた
  expect(expandAccordion.mock.lastCall.length).toBe(1)
  expect(expandAccordion.mock.lastCall[0]).toBe(1) // 最初のレコード
  expect(interruptSimulator.mock.calls.length).toBe(0)

  defaultRerender(resultDeck)
  expect(queryByRole('dialog')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).getAllByRole('img').length).toBe(2)
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).getAllByRole('img').length).toBe(1)
})

test('空のデッキは保存できない', async () => {
  const {
    resultDeck,
    defaultRerender,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
    queryByRole,
  } = defaultRender([], [], '')

  expect(queryByRole('dialog')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).queryByRole('img')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).queryByRole('img')).toBeNull()

  await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // ダイアログが表示される
  defaultRerender(resultDeck)
  expect(getByRole('dialog')).toBeVisible()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).queryByRole('img')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).queryByRole('img')).toBeNull()

  // ダイアログを閉じる
  await userEvent.click(
    within(getByRole('dialog')).getByRole('button', { name: 'OK' })
  )
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // ダイアログは閉じられた
  defaultRerender(resultDeck)
  expect(queryByRole('dialog')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).queryByRole('img')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).queryByRole('img')).toBeNull()
})

test('レシピをクリア', async () => {
  const {
    resultDeck,
    defaultRerender,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
    queryByRole,
  } = defaultRender(
    [['R-1', 1]],
    [
      ['R-2', 2],
      ['R-3', 3],
    ],
    ''
  )

  expect(queryByRole('dialog')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).getAllByRole('img').length).toBe(1)
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).getAllByRole('img').length).toBe(2)

  await userEvent.click(getByRole('button', { name: 'レシピをクリア' }))
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた

  defaultRerender(resultDeck)
  expect(queryByRole('img')).toBeNull()
  expect(queryByRole('alert')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'メインデッキ'})).queryByRole('img')).toBeNull()
  // prettier-ignore
  expect(within(getByRole('region', { name: 'サイドデッキ'})).queryByRole('img')).toBeNull()
})
