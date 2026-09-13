// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import {
  act,
  cleanup,
  render,
  renderHook,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { decodeDeck } from '../commons/dataCards'
import { dbClearDecks, dbQueryDecks } from '../commons/db'
import useDeck from '../hooks/useDeck'
import TabPaneDeck from './TabPaneDeck'
import useTabPaneDeck from '.'

function getDeckMain(result) {
  return result.current[0]
}

function getDeckSide(result) {
  return result.current[1]
}

function getDispatchDeck(result) {
  return result.current[2]
}

// TODO setDeckTitle する単体テストの追加

function getRenderFn(resultTabPaneDeck) {
  return resultTabPaneDeck.current[1]
}

async function defaultRender(entriesMain, entriesSide) {
  const zoomIn = vi.fn()
  const moveToLoad = vi.fn()
  const setActiveDeckSaved = vi.fn()
  const interruptSimulator = vi.fn()
  const { result } = renderHook(() => useDeck(entriesMain, entriesSide))
  const { result: resultTabPaneDeck } = renderHook(() =>
    useTabPaneDeck(
      false,
      getDispatchDeck(result),
      zoomIn,
      moveToLoad,
      interruptSimulator,
    ),
  )
  let props
  await act(async () => {
    props = render(
      getRenderFn(resultTabPaneDeck)(
        getDeckMain(result),
        getDeckSide(result),
        setActiveDeckSaved,
      ),
    )
  })
  const defaultRerender = async () => {
    await act(async () => {
      props.rerender(
        getRenderFn(resultTabPaneDeck)(
          getDeckMain(result),
          getDeckSide(result),
          setActiveDeckSaved,
        ),
      )
    })
  }
  const queryListItem = (list, item) =>
    within(props.getByRole('list', { name: list })).queryByRole(
      'listitem',
      item === undefined ? item : { name: item },
    )
  const getAllListItem = (name) =>
    within(props.getByRole('list', { name })).getAllByRole('listitem')
  const getListItem = (list, item) =>
    within(props.getByRole('list', { name: list })).getByRole('listitem', {
      name: item,
    })
  return {
    ...props,
    zoomIn,
    moveToLoad,
    setActiveDeckSaved,
    interruptSimulator,
    defaultRerender,
    getListItem,
    getAllListItem,
    queryListItem,
  }
}

beforeEach(dbClearDecks)
afterEach(cleanup)

test('コードが正しい場合のレンダリング', async () => {
  // RSコロッセオ優勝デッキ
  const code = 'BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V'
  const link = `/#/deck/${code}`
  const resultsDecode = decodeDeck(code)
  expect(resultsDecode).not.toBeFalsy()
  const [entriesMain, entriesSide] = resultsDecode
  const { result } = renderHook(() => useDeck(entriesMain, entriesSide))

  // defaultRender は使用しない
  let getByRole, queryByRole
  await act(async () => {
    ;({ getByRole, queryByRole } = render(
      <MemoryRouter initialEntries={[`/deck/${code}`]}>
        <Routes>
          <Route
            path="/deck/:code"
            element={
              <TabPaneDeck
                defaultShowCodeError={false}
                deckTitle=""
                setDeckTitle={vi.fn()}
                deckMain={getDeckMain(result)}
                deckSide={getDeckSide(result)}
                dispatchDeck={getDispatchDeck(result)}
                zoomIn={vi.fn()}
                moveToLoad={vi.fn()}
                setActiveDeckSaved={vi.fn()}
                interruptSimulator={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    ))
  })

  // アラートは表示されない
  expect(queryByRole('alert')).toBeNull()

  // テキストボックスには共有リンクとテキストデータ
  // prettier-ignore
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(link)
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t40\n天草四郎\t2\n藤原道長\t2\n石田三成\t4\n' +
      '土方歳三\t1\nスピリットアウェイ\t4\nロイヤリティ (スターター)\t4\n' +
      'サモン\t2\nコーザリティ\t2\nメロウ\t2\n喜びの種\t4\n' +
      '遁甲式水鏡\t1\nラ・コロール\t2\n悲しみの種\t4\n' +
      'パープルオーブ (スターター)\t1\nRYマーブルオーブ\t1\nカルドロン\t4\n\n' +
      'サイドデッキ\t10\n徳川慶喜\t4\n藤原道長\t1\n遁甲式水鏡\t1\n' +
      '苦しみの種\t1\nディ・クローネ\t2\nRYマーブルオーブ\t1',
  )
})

test('コードが誤っている場合のレンダリング', async () => {
  const code = 'BAAA'
  expect(decodeDeck(code)).toBeNull()
  const { result } = renderHook(() => useDeck([], []))

  const setDeckTitle = vi.fn()
  const zoomIn = vi.fn()
  const moveToLoad = vi.fn()
  const setActiveDeckSaved = vi.fn()
  const interruptSimulator = vi.fn()

  // defaultRender は使用しない
  // また、act で囲む必要はない (PixzleImage がレンダされないためか)
  const { rerender, getByRole, queryByRole } = render(
    <MemoryRouter initialEntries={[`/deck/${code}`]}>
      <Routes>
        <Route
          path="/deck/:code"
          element={
            <TabPaneDeck
              defaultShowCodeError={true}
              deckTitle=""
              setDeckTitle={setDeckTitle}
              deckMain={getDeckMain(result)}
              deckSide={getDeckSide(result)}
              dispatchDeck={getDispatchDeck(result)}
              zoomIn={zoomIn}
              moveToLoad={moveToLoad}
              setActiveDeckSaved={setActiveDeckSaved}
              interruptSimulator={interruptSimulator}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  )

  // アラートが表示される
  expect(getByRole('alert')).toHaveTextContent(/デッキコードが正しくありません/)

  // テキストボックスには空のデッキの値
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(
    '/#/deck/BAA',
  )
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t0',
  )

  // アラートを閉じる
  await userEvent.click(getByRole('button', { name: 'Close alert' }))

  expect(setDeckTitle).not.toHaveBeenCalled()
  expect(zoomIn).not.toHaveBeenCalled()
  expect(moveToLoad).not.toHaveBeenCalled()
  expect(setActiveDeckSaved).not.toHaveBeenCalled()
  expect(interruptSimulator).not.toHaveBeenCalled()

  rerender(
    <TabPaneDeck
      defaultShowCodeError={true}
      deckTitle=""
      setDeckTitle={setDeckTitle}
      deckMain={getDeckMain(result)}
      deckSide={getDeckSide(result)}
      dispatchDeck={getDispatchDeck(result)}
      zoomIn={zoomIn}
      moveToLoad={moveToLoad}
      setActiveDeckSaved={setActiveDeckSaved}
      interruptSimulator={interruptSimulator}
    />,
  )

  // アラートは閉じられた
  expect(queryByRole('alert')).toBeNull()
})

test('デフォルトのレンダリング', async () => {
  const { getByPlaceholderText, getByRole, queryByRole, queryListItem } =
    await defaultRender([], [], '')

  // モーダルダイアログは表示されていない
  expect(queryByRole('dialog')).toBeNull()

  // アラートは表示されていない
  expect(queryByRole('alert')).toBeNull()

  // 画像は表示されていない
  expect(queryListItem('メインデッキ')).toBeNull()
  expect(queryListItem('サイドデッキ')).toBeNull()

  // テキストボックスには空のデッキの値
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toBeVisible()
  expect(getByPlaceholderText('デッキ名を入力 (任意)')).toHaveValue('')
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toBeVisible()
  expect(getByRole('textbox', { name: '▶共有リンクをコピー' })).toHaveValue(
    '/#/deck/BAA',
  )
  // prettier-ignore
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toBeVisible()
  expect(getByRole('textbox', { name: '▼テキストデータをコピー' })).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t0',
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
  ['源義経', 'メインデッキ', 'R-2'],
  ['武田勝頼', 'メインデッキ', 'R-3'],
  ['坂上田村麻呂', 'サイドデッキ', 'R-5'],
  ['楠木正成', 'サイドデッキ', 'R-6'],
])('虫眼鏡ボタンで拡大 (%s)', async (_, section, id) => {
  const {
    zoomIn,
    moveToLoad,
    setActiveDeckSaved,
    interruptSimulator,
    getAllListItem,
    getListItem,
  } = await defaultRender(
    [
      ['R-2', 1],
      ['R-3', 1],
    ],
    [
      ['R-5', 1],
      ['R-6', 1],
    ],
  )

  expect(getAllListItem('メインデッキ')).toHaveLength(2)
  expect(getAllListItem('サイドデッキ')).toHaveLength(2)

  // 虫眼鏡ボタンを押す
  const item = within(getListItem(section, id))
  await userEvent.click(item.getByRole('button', { name: '🔍' }))

  expect(zoomIn).toHaveBeenCalledExactlyOnceWith(id) // 呼ばれた
  expect(moveToLoad).not.toHaveBeenCalled()
  expect(setActiveDeckSaved).not.toHaveBeenCalled()
  expect(interruptSimulator).not.toHaveBeenCalled()
})

test('マイデッキに保存', async () => {
  const {
    defaultRerender,
    zoomIn,
    moveToLoad,
    setActiveDeckSaved,
    interruptSimulator,
    getByRole,
    queryByRole,
    getAllListItem,
  } = await defaultRender(
    [
      ['R-1', 1],
      ['R-2', 2],
    ],
    [['R-3', 3]],
  )

  expect(queryByRole('dialog')).toBeNull()
  expect(getAllListItem('メインデッキ')).toHaveLength(2)
  expect(getAllListItem('サイドデッキ')).toHaveLength(1)

  // 初期状態ではデータベースは空
  expect(await dbQueryDecks()).toHaveLength(0)

  // 「マイデッキに保存」ボタンを押す
  // handleClickSave は async 関数のため完了を待つ必要がある
  await act(async () => {
    await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))
  })

  expect(zoomIn).not.toHaveBeenCalled()
  expect(moveToLoad).toHaveBeenCalledExactlyOnceWith() // 呼ばれた
  expect(setActiveDeckSaved).toHaveBeenCalledExactlyOnceWith(1) // 最初のレコード
  expect(interruptSimulator).not.toHaveBeenCalled()

  // 成功したらダイアログは表示されない
  await defaultRerender()
  expect(queryByRole('dialog')).toBeNull()

  // データベースにデッキが追加されている
  expect(await dbQueryDecks()).toHaveLength(1)
  const deck = (await dbQueryDecks())[0]
  expect(typeof deck.id).toBe('number')
  expect(deck.timestamp).not.toBeFalsy()
  expect(deck.main).toEqual([
    ['R-1', 1],
    ['R-2', 2],
  ])
  expect(deck.side).toEqual([['R-3', 3]])
})

test('空のデッキは保存できない', async () => {
  const {
    defaultRerender,
    zoomIn,
    moveToLoad,
    setActiveDeckSaved,
    interruptSimulator,
    getByRole,
    queryByRole,
    queryListItem,
  } = await defaultRender([], [])

  expect(queryByRole('dialog')).toBeNull()
  expect(queryListItem('メインデッキ')).toBeNull()
  expect(queryListItem('サイドデッキ')).toBeNull()
  // 初期状態ではデータベースは空
  expect(await dbQueryDecks()).toHaveLength(0)

  // 「マイデッキに保存」ボタンを押す
  await userEvent.click(getByRole('button', { name: 'マイデッキに保存' }))

  expect(zoomIn).not.toHaveBeenCalled()
  expect(moveToLoad).not.toHaveBeenCalled()
  expect(setActiveDeckSaved).not.toHaveBeenCalled()
  expect(interruptSimulator).not.toHaveBeenCalled()

  // ダイアログが表示される
  await defaultRerender()
  expect(getByRole('dialog')).toBeVisible()
  // データベースには追加されていない
  expect(await dbQueryDecks()).toHaveLength(0)

  // ダイアログを閉じる
  await userEvent.click(
    within(getByRole('dialog')).getByRole('button', { name: 'OK' }),
  )

  expect(zoomIn).not.toHaveBeenCalled()
  expect(moveToLoad).not.toHaveBeenCalled()
  expect(setActiveDeckSaved).not.toHaveBeenCalled()
  expect(interruptSimulator).not.toHaveBeenCalled()

  await defaultRerender()

  // ダイアログは閉じられた
  expect(queryByRole('dialog')).toBeNull()
})

test('レシピをクリア', async () => {
  const {
    defaultRerender,
    zoomIn,
    moveToLoad,
    setActiveDeckSaved,
    interruptSimulator,
    getByRole,
    queryListItem,
    getAllListItem,
  } = await defaultRender(
    [['R-1', 1]],
    [
      ['R-2', 2],
      ['R-3', 3],
    ],
  )

  expect(getAllListItem('メインデッキ')).toHaveLength(1)
  expect(getAllListItem('サイドデッキ')).toHaveLength(2)

  // 「レシピをクリア」ボタンを押す
  await userEvent.click(getByRole('button', { name: 'レシピをクリア' }))

  expect(zoomIn).not.toHaveBeenCalled()
  expect(moveToLoad).not.toHaveBeenCalled()
  expect(setActiveDeckSaved).not.toHaveBeenCalled()
  expect(interruptSimulator).toHaveBeenCalledExactlyOnceWith() // 呼ばれた

  await defaultRerender()

  // 画像リストが空になる
  expect(queryListItem('メインデッキ')).toBeNull()
  expect(queryListItem('サイドデッキ')).toBeNull()
})

test.each([
  [
    'メインデッキのR-2を1枚から2枚に増やす',
    'メインデッキ',
    'サイドデッキ',
    1,
    'R-2',
    '+',
    1,
    '2',
    '1',
    '1',
    '1',
  ],
  [
    'メインデッキのR-3を1枚から2枚に増やす',
    'メインデッキ',
    'サイドデッキ',
    1,
    'R-3',
    '+',
    1,
    '1',
    '2',
    '1',
    '1',
  ],
  [
    'サイドデッキのR-2を1枚から2枚に増やす',
    'サイドデッキ',
    'メインデッキ',
    1,
    'R-2',
    '+',
    0,
    '2',
    '1',
    '1',
    '1',
  ],
  [
    'サイドデッキのR-3を1枚から2枚に増やす',
    'サイドデッキ',
    'メインデッキ',
    1,
    'R-3',
    '+',
    0,
    '1',
    '2',
    '1',
    '1',
  ],
  [
    'メインデッキのR-2を2枚から1枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    2,
    'R-2',
    '-',
    1,
    '1',
    '2',
    '2',
    '2',
  ],
  [
    'メインデッキのR-3を2枚から1枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    2,
    'R-3',
    '-',
    1,
    '2',
    '1',
    '2',
    '2',
  ],
  [
    'サイドデッキのR-2を2枚から1枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    2,
    'R-2',
    '-',
    0,
    '1',
    '2',
    '2',
    '2',
  ],
  [
    'サイドデッキのR-3を2枚から1枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    2,
    'R-3',
    '-',
    0,
    '2',
    '1',
    '2',
    '2',
  ],
  [
    'メインデッキのR-2をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    2,
    'R-2',
    'v',
    1,
    '1',
    '2',
    '3',
    '2',
  ],
  [
    'メインデッキのR-3をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    2,
    'R-3',
    'v',
    1,
    '2',
    '1',
    '2',
    '3',
  ],
  [
    'サイドデッキのR-2をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    2,
    'R-2',
    '^',
    1,
    '1',
    '2',
    '3',
    '2',
  ],
  [
    'サイドデッキのR-3をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    2,
    'R-3',
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
    listThis,
    listThat,
    initial,
    id,
    buttonName,
    expectedInterrupted,
    expectedThis0,
    expectedThis1,
    expectedThat0,
    expectedThat1,
  ) => {
    const {
      zoomIn,
      moveToLoad,
      setActiveDeckSaved,
      interruptSimulator,
      defaultRerender,
      getAllListItem,
      getListItem,
    } = await defaultRender(
      [
        ['R-2', initial],
        ['R-3', initial],
      ],
      [
        ['R-2', initial],
        ['R-3', initial],
      ],
    )

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(getAllListItem(listThat)).toHaveLength(2)
    let itemThis0 = within(getListItem(listThis, 'R-2'))
    let itemThis1 = within(getListItem(listThis, 'R-3'))
    let itemThat0 = within(getListItem(listThat, 'R-2'))
    let itemThat1 = within(getListItem(listThat, 'R-3'))
    expect(itemThis0.getByRole('textbox')).toHaveTextContent(String(initial))
    expect(itemThis1.getByRole('textbox')).toHaveTextContent(String(initial))
    expect(itemThat0.getByRole('textbox')).toHaveTextContent(String(initial))
    expect(itemThat1.getByRole('textbox')).toHaveTextContent(String(initial))

    // ボタンを押す
    const item = within(getListItem(listThis, id))
    await userEvent.click(item.getByRole('button', { name: buttonName }))

    expect(zoomIn).not.toHaveBeenCalled()
    expect(moveToLoad).not.toHaveBeenCalled()
    expect(setActiveDeckSaved).not.toHaveBeenCalled()
    expect(interruptSimulator).toHaveBeenCalledTimes(expectedInterrupted)

    await defaultRerender()

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(getAllListItem(listThat)).toHaveLength(2)
    itemThis0 = within(getListItem(listThis, 'R-2'))
    itemThis1 = within(getListItem(listThis, 'R-3'))
    itemThat0 = within(getListItem(listThat, 'R-2'))
    itemThat1 = within(getListItem(listThat, 'R-3'))
    expect(itemThis0.getByRole('textbox')).toHaveTextContent(expectedThis0)
    expect(itemThis1.getByRole('textbox')).toHaveTextContent(expectedThis1)
    expect(itemThat0.getByRole('textbox')).toHaveTextContent(expectedThat0)
    expect(itemThat1.getByRole('textbox')).toHaveTextContent(expectedThat1)
  },
)

test.each([
  [
    'メインデッキのR-2を1枚から0枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    'R-2',
    'R-3',
    '-',
    1,
    '1',
  ],
  [
    'メインデッキのR-3を1枚から0枚に減らす',
    'メインデッキ',
    'サイドデッキ',
    'R-3',
    'R-2',
    '-',
    1,
    '1',
  ],
  [
    'サイドデッキのR-2を1枚から0枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    'R-2',
    'R-3',
    '-',
    0,
    '1',
  ],
  [
    'サイドデッキのR-3を1枚から0枚に減らす',
    'サイドデッキ',
    'メインデッキ',
    'R-3',
    'R-2',
    '-',
    0,
    '1',
  ],
  [
    'メインデッキのR-2をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    'R-2',
    'R-3',
    'v',
    1,
    '2',
  ],
  [
    'メインデッキのR-3をサイドデッキへ移動する',
    'メインデッキ',
    'サイドデッキ',
    'R-3',
    'R-2',
    'v',
    1,
    '2',
  ],
  [
    'サイドデッキのR-2をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    'R-2',
    'R-3',
    '^',
    1,
    '2',
  ],
  [
    'サイドデッキのR-3をメインデッキへ移動する',
    'サイドデッキ',
    'メインデッキ',
    'R-3',
    'R-2',
    '^',
    1,
    '2',
  ],
])(
  'アイテム数が減る枚数の変更 (%s)',
  async (
    _,
    listThis,
    listThat,
    idDec,
    idRem,
    buttonName,
    expectInterurpted,
    expectedRem,
  ) => {
    const {
      zoomIn,
      moveToLoad,
      setActiveDeckSaved,
      interruptSimulator,
      defaultRerender,
      getAllListItem,
      getListItem,
      queryListItem,
    } = await defaultRender(
      [
        ['R-2', 1],
        ['R-3', 1],
      ],
      [
        ['R-2', 1],
        ['R-3', 1],
      ],
    )

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(getAllListItem(listThat)).toHaveLength(2)
    let itemThisDec = within(getListItem(listThis, 'R-2'))
    let itemThisRem = within(getListItem(listThis, 'R-3'))
    let itemThatDec = within(getListItem(listThat, 'R-2'))
    let itemThatRem = within(getListItem(listThat, 'R-3'))
    expect(itemThisDec.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThatDec.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThatRem.getByRole('textbox')).toHaveTextContent('1')

    // ボタンを押す
    const item = within(getListItem(listThis, idDec))
    await userEvent.click(item.getByRole('button', { name: buttonName }))

    expect(zoomIn).not.toHaveBeenCalled()
    expect(moveToLoad).not.toHaveBeenCalled()
    expect(setActiveDeckSaved).not.toHaveBeenCalled()
    expect(interruptSimulator).toHaveBeenCalledTimes(expectInterurpted)

    await defaultRerender()

    // 減らしたアイテムが消える
    expect(queryListItem(listThis, idDec)).toBeNull()

    expect(getAllListItem(listThis)).toHaveLength(1) // 減った
    expect(getAllListItem(listThat)).toHaveLength(2)
    itemThisRem = within(getListItem(listThis, idRem))
    itemThatDec = within(getListItem(listThat, idDec))
    itemThatRem = within(getListItem(listThat, idRem))
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThatDec.getByRole('textbox')).toHaveTextContent(expectedRem)
    expect(itemThatRem.getByRole('textbox')).toHaveTextContent('1')
  },
)

test.each([
  [
    'メインデッキのR-2をサイドデッキへ移動する',
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    'R-2',
    'R-3',
    'v',
  ],
  [
    'メインデッキのR-3をサイドデッキへ移動する',
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    'R-3',
    'R-2',
    'v',
  ],
  [
    'サイドのR-2をメインデッキへ移動する',
    [],
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    'サイドデッキ',
    'メインデッキ',
    'R-2',
    'R-3',
    '^',
  ],
  [
    'サイドのR-3をメインデッキへ移動する',
    [],
    [
      ['R-2', 2],
      ['R-3', 2],
    ],
    'サイドデッキ',
    'メインデッキ',
    'R-3',
    'R-2',
    '^',
  ],
])(
  'アイテム数が増える枚数の変更 (%s)',
  async (
    _,
    initialMain,
    initialSide,
    listThis,
    listThat,
    idInc,
    idRem,
    buttonName,
  ) => {
    const {
      zoomIn,
      moveToLoad,
      setActiveDeckSaved,
      interruptSimulator,
      defaultRerender,
      queryListItem,
      getAllListItem,
      getListItem,
    } = await defaultRender(initialMain, initialSide)

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(queryListItem(listThat)).toBeNull()

    let itemThisInc = within(getListItem(listThis, 'R-2'))
    let itemThisRem = within(getListItem(listThis, 'R-3'))
    expect(itemThisInc.getByRole('textbox')).toHaveTextContent('2')
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('2')

    // ボタンを押す
    const item = within(getListItem(listThis, idInc))
    await userEvent.click(item.getByRole('button', { name: buttonName }))

    expect(zoomIn).not.toHaveBeenCalled()
    expect(moveToLoad).not.toHaveBeenCalled()
    expect(setActiveDeckSaved).not.toHaveBeenCalled()
    expect(interruptSimulator).toHaveBeenCalledExactlyOnceWith() // 呼ばれた

    await defaultRerender()

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(getAllListItem(listThat)).toHaveLength(1) // 増えた
    itemThisInc = within(getListItem(listThis, idInc))
    itemThisRem = within(getListItem(listThis, idRem))
    const itemThatInc = within(getListItem(listThis, idInc))
    expect(itemThisInc.getByRole('textbox')).toHaveTextContent('1') // 枚数は減った
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('2')
    expect(itemThatInc.getByRole('textbox')).toHaveTextContent('1') // アイテムは増えた
  },
)

test.each([
  [
    'メインデッキのR-1をサイドデッキへ移動する',
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    'R-1',
    'R-2',
    'v',
  ],
  [
    'メインデッキのR-2をサイドデッキへ移動する',
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    [],
    'メインデッキ',
    'サイドデッキ',
    'R-2',
    'R-1',
    'v',
  ],
  [
    'サイドデッキのR-1をメインデッキへ移動する',
    [],
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    'サイドデッキ',
    'メインデッキ',
    'R-1',
    'R-2',
    '^',
  ],
  [
    'サイドデッキのR-2をメインデッキへ移動する',
    [],
    [
      ['R-1', 1],
      ['R-2', 1],
    ],
    'サイドデッキ',
    'メインデッキ',
    'R-2',
    'R-1',
    '^',
  ],
])(
  'アイテム数が入れ替わる枚数の変更 (%s)',
  async (
    _,
    initialMain,
    initialSide,
    listThis,
    listThat,
    idMov,
    idRem,
    buttonName,
  ) => {
    const {
      zoomIn,
      moveToLoad,
      setActiveDeckSaved,
      interruptSimulator,
      defaultRerender,
      getListItem,
      getAllListItem,
      queryListItem,
    } = await defaultRender(initialMain, initialSide)

    expect(getAllListItem(listThis)).toHaveLength(2)
    expect(queryListItem(listThat)).toBeNull()

    let itemThisMov = within(getListItem(listThis, idMov))
    let itemThisRem = within(getListItem(listThis, idRem))
    expect(itemThisMov.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('1')

    // ボタンを押す
    const item = within(getListItem(listThis, idMov))
    await userEvent.click(item.getByRole('button', { name: buttonName }))

    expect(zoomIn).not.toHaveBeenCalled()
    expect(moveToLoad).not.toHaveBeenCalled()
    expect(setActiveDeckSaved).not.toHaveBeenCalled()
    expect(interruptSimulator).toHaveBeenCalledExactlyOnceWith() // 呼ばれた

    await defaultRerender()

    // 移動して行った
    expect(queryListItem(listThis, idMov)).toBeNull()

    expect(getAllListItem(listThis)).toHaveLength(1) // 減った
    expect(getAllListItem(listThat)).toHaveLength(1) // 増えた
    itemThisRem = within(getListItem(listThis, idRem))
    const itemThatMov = within(getListItem(listThat, idMov))
    expect(itemThisRem.getByRole('textbox')).toHaveTextContent('1')
    expect(itemThatMov.getByRole('textbox')).toHaveTextContent('1')
  },
)
