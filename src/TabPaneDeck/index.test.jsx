// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'

import Dexie from 'dexie'
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

function getAllListItem(getByRole, section) {
  return within(getByRole('list', { name: section })).getAllByRole('listitem')
}

function queryListItem(getByRole, section) {
  return within(getByRole('list', { name: section })).queryByRole('listitem')
}

function getButton(getByRole, section, index, name) {
  // prettier-ignore
  return within(getAllListItem(getByRole, section)[index]).getByRole('button', { name })
}

function getImg(getByRole, section, index) {
  return within(getAllListItem(getByRole, section)[index]).getByRole('img')
}

function getTextbox(getByRole, section, index) {
  return within(getAllListItem(getByRole, section)[index]).getByRole('textbox')
}

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

function defaultRender(entriesMain, entriesSide) {
  const { result } = renderHook(() => useDeck(entriesMain, entriesSide))
  const { result: resultDeckTitle } = renderHook(() => useState(''))
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
      deckMain={getDeckMain(result)}
      deckSide={getDeckSide(result)}
      dispatchDeck={getDispatchDeck(result)}
      zoomIn={zoomIn}
      moveToLoad={moveToLoad}
      expandAccordion={expandAccordion}
      interruptSimulator={interruptSimulator}
    />
  )
  const defaultRerender = (result) =>
    rerender(
      <TabPaneDeck
        code={undefined}
        showCodeError={false}
        setShowCodeError={setShowCodeError}
        deckTitle={getDeckTitle(resultDeckTitle)}
        setDeckTitle={getSetDeckTitleFn(resultDeckTitle)}
        deckMain={getDeckMain(result)}
        deckSide={getDeckSide(result)}
        dispatchDeck={getDispatchDeck(result)}
        zoomIn={zoomIn}
        moveToLoad={moveToLoad}
        expandAccordion={expandAccordion}
        interruptSimulator={interruptSimulator}
      />
    )
  return {
    result,
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
  const { getByRole, queryByRole } = render(
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
  const { rerender, getByRole, queryByRole } = render(
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
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(
    '/ijinden-deck-builder/#/deck/BAA'
  )
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t0'
  )

  // アラートを閉じる
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
  expect(queryListItem(getByRole, 'メインデッキ')).toBeNull()
  expect(queryListItem(getByRole, 'サイドデッキ')).toBeNull()

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

test.each([
  ['源義経', 'メインデッキ', 0, 'R-2'],
  ['武田勝頼', 'メインデッキ', 1, 'R-3'],
  ['坂上田村麻呂', 'サイドデッキ', 0, 'R-5'],
  ['楠木正成', 'サイドデッキ', 1, 'R-6'],
])('虫眼鏡ボタンで拡大 (%s)', async (_, section, index, expectedId) => {
  const {
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
  } = defaultRender(
    [
      ['R-2', 1],
      ['R-3', 1],
    ],
    [
      ['R-5', 1],
      ['R-6', 1],
    ]
  )

  expect(getAllListItem(getByRole, 'メインデッキ').length).toBe(2)
  expect(getAllListItem(getByRole, 'サイドデッキ').length).toBe(2)

  // 虫眼鏡ボタンを押す
  await userEvent.click(getButton(getByRole, section, index, '🔍'))

  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe(expectedId)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)
})

test('マイデッキに保存', async () => {
  const {
    result,
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
    [['R-3', 3]]
  )

  expect(queryByRole('dialog')).toBeNull()
  expect(getAllListItem(getByRole, 'メインデッキ').length).toBe(2)
  expect(getAllListItem(getByRole, 'サイドデッキ').length).toBe(1)

  // 「マイデッキに保存」ボタンを押す
  await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))

  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  // handleClickSave は async 関数のため完了を待つ必要がある
  await waitFor(() => expect(moveToLoad.mock.calls.length).toBe(1)) // 呼ばれた
  await waitFor(() => expect(expandAccordion.mock.calls.length).toBe(1)) // 呼ばれた
  expect(expandAccordion.mock.lastCall.length).toBe(1)
  expect(expandAccordion.mock.lastCall[0]).toBe(1) // 最初のレコード
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 成功したらダイアログは表示されない
  defaultRerender(result)
  expect(queryByRole('dialog')).toBeNull()
})

test('空のデッキは保存できない', async () => {
  const {
    result,
    defaultRerender,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
    queryByRole,
  } = defaultRender([], [])

  expect(queryByRole('dialog')).toBeNull()
  expect(queryListItem(getByRole, 'メインデッキ')).toBeNull()
  expect(queryListItem(getByRole, 'サイドデッキ')).toBeNull()

  // 「マイデッキに保存」ボタンを押す
  await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))

  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // ダイアログが表示される
  defaultRerender(result)
  expect(getByRole('dialog')).toBeVisible()

  // ダイアログを閉じる
  // prettier-ignore
  await userEvent.click(within(getByRole('dialog')).getByRole('button', { name: 'OK' }))
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // ダイアログは閉じられた
  defaultRerender(result)
  expect(queryByRole('dialog')).toBeNull()
})

test('レシピをクリア', async () => {
  const {
    result,
    defaultRerender,
    setShowCodeError,
    zoomIn,
    moveToLoad,
    expandAccordion,
    interruptSimulator,
    getByRole,
  } = defaultRender(
    [['R-1', 1]],
    [
      ['R-2', 2],
      ['R-3', 3],
    ]
  )

  expect(getAllListItem(getByRole, 'メインデッキ').length).toBe(1)
  expect(getAllListItem(getByRole, 'サイドデッキ').length).toBe(2)

  // 「レシピをクリア」ボタンを押す
  await userEvent.click(getByRole('button', { name: 'レシピをクリア' }))
  expect(setShowCodeError.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(moveToLoad.mock.calls.length).toBe(0)
  expect(expandAccordion.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた

  // 画像リストが空になる
  defaultRerender(result)
  expect(queryListItem(getByRole, 'メインデッキ')).toBeNull()
  expect(queryListItem(getByRole, 'サイドデッキ')).toBeNull()
})

test.each([
  [
    'メインデッキのインデックス0を1枚から2枚に増やす',
    'メインデッキ',
    'サイドデッキ',
    1,
    '1',
    0,
    '+',
    1,
    '2',
    '1',
    '1',
    '1',
  ],
  [
    'メインデッキのインデックス1を1枚から2枚に増やす',
    'メインデッキ',
    'サイドデッキ',
    1,
    '1',
    1,
    '+',
    1,
    '1',
    '2',
    '1',
    '1',
  ],
  [
    'サイドデッキのインデックス0を1枚から2枚に増やす',
    'サイドデッキ',
    'メインデッキ',
    1,
    '1',
    0,
    '+',
    0,
    '2',
    '1',
    '1',
    '1',
  ],
  [
    'サイドデッキのインデックス1を1枚から2枚に増やす',
    'サイドデッキ',
    'メインデッキ',
    1,
    '1',
    1,
    '+',
    0,
    '1',
    '2',
    '1',
    '1',
  ],
  [
    'メインデッキのインデックス0を2枚から1枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    2,
    '2',
    0,
    '-',
    1,
    '1',
    '2',
    '2',
    '2',
  ],
  [
    'メインデッキのインデックス1を2枚から1枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    2,
    '2',
    1,
    '-',
    1,
    '2',
    '1',
    '2',
    '2',
  ],
  [
    'サイドデッキのインデックス0を2枚から1枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    2,
    '2',
    0,
    '-',
    0,
    '1',
    '2',
    '2',
    '2',
  ],
  [
    'サイドデッキのインデックス1を2枚から1枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    2,
    '2',
    1,
    '-',
    0,
    '2',
    '1',
    '2',
    '2',
  ],
  [
    'メインデッキのインデックス0をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    2,
    '2',
    0,
    'v',
    1,
    '1',
    '2',
    '3',
    '2',
  ],
  [
    'メインデッキのインデックス1をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    2,
    '2',
    1,
    'v',
    1,
    '2',
    '1',
    '2',
    '3',
  ],
  [
    'サイドデッキのインデックス0をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    2,
    '2',
    0,
    '^',
    1,
    '1',
    '2',
    '3',
    '2',
  ],
  [
    'サイドデッキのインデックス1をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    2,
    '2',
    1,
    '^',
    1,
    '2',
    '1',
    '2',
    '3',
  ],
])(
  'アイテム数が変わらない枚数の変更 (%s)',
  async (
    _,
    sectionThis,
    sectionThat,
    initial,
    expectedInitial,
    index,
    buttonName,
    expectedInterrupted,
    expectedThis0,
    expectedThis1,
    expectedThat0,
    expectedThat1
  ) => {
    const {
      result,
      setShowCodeError,
      zoomIn,
      moveToLoad,
      expandAccordion,
      interruptSimulator,
      defaultRerender,
      getByRole,
    } = defaultRender(
      [
        ['R-2', initial],
        ['R-3', initial],
      ],
      [
        ['R-2', initial],
        ['R-3', initial],
      ]
    )

    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(getAllListItem(getByRole, sectionThat).length).toBe(2)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent(expectedInitial)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent(expectedInitial)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent(expectedInitial)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThat, 1)).toHaveTextContent(expectedInitial)

    await userEvent.click(getButton(getByRole, sectionThis, index, buttonName))
    expect(setShowCodeError.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(moveToLoad.mock.calls.length).toBe(0)
    expect(expandAccordion.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(expectedInterrupted)

    defaultRerender(result)
    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(getAllListItem(getByRole, sectionThat).length).toBe(2)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent(expectedThis0)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent(expectedThis1)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent(expectedThat0)
    // prettier-ignore
    expect(getTextbox(getByRole, sectionThat, 1)).toHaveTextContent(expectedThat1)
  }
)

test.each([
  [
    'メインデッキのインデックス0を1枚から0枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    0,
    1,
    '-',
    1,
    '1',
    '1',
  ],
  [
    'メインデッキのインデックス1を1枚から0枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    1,
    0,
    '-',
    1,
    '1',
    '1',
  ],
  [
    'サイドデッキのインデックス0を1枚から0枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    0,
    1,
    '-',
    0,
    '1',
    '1',
  ],
  [
    'サイドデッキのインデックス1を1枚から0枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    1,
    0,
    '-',
    0,
    '1',
    '1',
  ],
  [
    'メインデッキのインデックス0をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    0,
    1,
    'v',
    1,
    '2',
    '1',
  ],
  [
    'メインデッキのインデックス1をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    1,
    0,
    'v',
    1,
    '1',
    '2',
  ],
  [
    'サイドデッキのインデックス0をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    0,
    1,
    '^',
    1,
    '2',
    '1',
  ],
  [
    'サイドデッキのインデックス1をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    1,
    0,
    '^',
    1,
    '1',
    '2',
  ],
])(
  'アイテム数が減る枚数の変更 (%s)',
  async (
    _,
    sectionThis,
    sectionThat,
    indexDecrement,
    indexRemaining,
    buttonName,
    expectInterurpted,
    expected0,
    expected1
  ) => {
    const {
      result,
      setShowCodeError,
      zoomIn,
      moveToLoad,
      expandAccordion,
      interruptSimulator,
      defaultRerender,
      getByRole,
    } = defaultRender(
      [
        ['R-2', 1],
        ['R-3', 1],
      ],
      [
        ['R-2', 1],
        ['R-3', 1],
      ]
    )

    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(getAllListItem(getByRole, sectionThat).length).toBe(2)
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent('1')
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent('1')
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent('1')
    expect(getTextbox(getByRole, sectionThat, 1)).toHaveTextContent('1')

    // prettier-ignore
    const src = getImg(getByRole, sectionThis, indexRemaining).getAttribute('src')

    // prettier-ignore
    await userEvent.click(getButton(getByRole, sectionThis, indexDecrement, buttonName))

    expect(setShowCodeError.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(moveToLoad.mock.calls.length).toBe(0)
    expect(expandAccordion.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(expectInterurpted)

    defaultRerender(result)
    expect(getAllListItem(getByRole, sectionThis).length).toBe(1) // 減った
    expect(getAllListItem(getByRole, sectionThat).length).toBe(2)
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent('1')
    expect(getImg(getByRole, sectionThis, 0)).toHaveAttribute('src', src)
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent(expected0)
    expect(getTextbox(getByRole, sectionThat, 1)).toHaveTextContent(expected1)
  }
)

test.each([
  [
    'メインデッキのインデックス0をサイドデッキへ移動する',
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    0,
    'v',
    '1',
    '2',
  ],
  [
    'メインデッキのインデックス1をサイドデッキへ移動する',
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    1,
    'v',
    '2',
    '1',
  ],
  [
    'サイドのインデックス0をメインデッキへ移動する',
    [],
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    'サイドデッキ',
    'メインデッキ',
    0,
    '^',
    '1',
    '2',
  ],
  [
    'サイドのインデックス1をメインデッキへ移動する',
    [],
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    'サイドデッキ',
    'メインデッキ',
    1,
    '^',
    '2',
    '1',
  ],
])(
  'アイテム数が増える枚数の変更 (%s)',
  async (
    _,
    initialMain,
    initialSide,
    sectionThis,
    sectionThat,
    index,
    buttonName,
    expected0,
    expected1
  ) => {
    const {
      result,
      setShowCodeError,
      zoomIn,
      moveToLoad,
      expandAccordion,
      interruptSimulator,
      defaultRerender,
      getByRole,
    } = defaultRender(initialMain, initialSide)

    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(queryListItem(getByRole, sectionThat)).toBeNull()
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent('2')
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent('2')

    const src = getImg(getByRole, sectionThis, index).getAttribute('src')

    await userEvent.click(getButton(getByRole, sectionThis, index, buttonName))

    expect(setShowCodeError.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(moveToLoad.mock.calls.length).toBe(0)
    expect(expandAccordion.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた

    defaultRerender(result)
    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(getAllListItem(getByRole, sectionThat).length).toBe(1) // 増えた
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent(expected0)
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent(expected1)
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent(1)
    expect(getImg(getByRole, sectionThat, 0)).toHaveAttribute('src', src)
  }
)

test.each([
  [
    'メインデッキのインデックス0をサイドデッキへ移動する',
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    0,
    1,
    'v',
  ],
  [
    'メインデッキのインデックス1をサイドデッキへ移動する',
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    1,
    0,
    'v',
  ],
  [
    'サイドデッキのインデックス0をメインデッキへ移動する',
    [],
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    'サイドデッキ',
    'メインデッキ',
    0,
    1,
    '^',
  ],
  [
    'サイドデッキのインデックス1をメインデッキへ移動する',
    [],
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    'サイドデッキ',
    'メインデッキ',
    1,
    0,
    '^',
  ],
])(
  'アイテム数が入れ替わる枚数の変更 (%s)',
  async (
    _,
    initialMain,
    initialSide,
    sectionThis,
    sectionThat,
    indexMoved,
    indexRemaining,
    buttonName
  ) => {
    const {
      result,
      setShowCodeError,
      zoomIn,
      moveToLoad,
      expandAccordion,
      interruptSimulator,
      defaultRerender,
      getByRole,
    } = defaultRender(initialMain, initialSide)

    expect(getAllListItem(getByRole, sectionThis).length).toBe(2)
    expect(queryListItem(getByRole, sectionThat)).toBeNull()
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent('1')
    expect(getTextbox(getByRole, sectionThis, 1)).toHaveTextContent('1')

    // prettier-ignore
    const srcMoved = getImg(getByRole, sectionThis, indexMoved).getAttribute('src')
    // prettier-ignore
    const srcRemaining = getImg(getByRole, sectionThis, indexRemaining).getAttribute('src')

    // prettier-ignore
    await userEvent.click(getButton(getByRole, sectionThis, indexMoved, buttonName))

    expect(setShowCodeError.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(moveToLoad.mock.calls.length).toBe(0)
    expect(expandAccordion.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた

    defaultRerender(result)
    expect(getAllListItem(getByRole, sectionThis).length).toBe(1) // 減った
    expect(getAllListItem(getByRole, sectionThat).length).toBe(1) // 増えた
    expect(getTextbox(getByRole, sectionThis, 0)).toHaveTextContent(1)
    // prettier-ignore
    expect(getImg(getByRole, sectionThis, 0)).toHaveAttribute('src', srcRemaining)
    expect(getTextbox(getByRole, sectionThat, 0)).toHaveTextContent(1)
    expect(getImg(getByRole, sectionThat, 0)).toHaveAttribute('src', srcMoved)
  }
)
