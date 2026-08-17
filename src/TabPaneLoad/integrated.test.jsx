// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { createRoutesStub } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { dbAddDeck, dbClearDecks, dbQueryDecks } from '../commons/db'
import Home from '../Home'

function within2(element) {
  const props = within(element)
  props['getButtonByName'] = (name) => props.getByRole('button', { name })
  return props
}

function defaultRender() {
  const Stub = createRoutesStub([{ path: '/', Component: Home }])
  const props = render(<Stub initialEntries={['/']} />)
  props['getTabPanelByName'] = (name) => props.getByRole('tabpanel', { name })
  return props
}

afterEach(cleanup)

test('レシピが空だと保存できない', async () => {
  await dbClearDecks()
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  // モーダルはまだない
  expect(queryByRole('dialog')).toBeNull()

  // レシピペインの保存ボタンをクリック
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  const paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  await userEvent.click(within2(paneDeck).getButtonByName('マイデッキに保存'))

  // モーダルが現れる
  await waitFor(() => expect(queryByRole('dialog')).not.toBeNull())
  const dialog = getByRole('dialog')
  await waitFor(() =>
    expect(dialog).toHaveTextContent('現在のレシピが空のため保存できません。'),
  )
  // 現在のレシピが空のため保存されない
  await waitFor(async () => expect(await dbQueryDecks()).toStrictEqual([]))

  // OK ボタンを押す
  await userEvent.click(within2(dialog).getButtonByName('OK'))
  // モーダルがひっこむ
  await waitFor(() => expect(queryByRole('dialog')).toBeNull())
})

test('レシピに1枚でもあるなら保存できる', async () => {
  await dbClearDecks()
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  // モーダルはない
  expect(queryByRole('dialog')).toBeNull()

  // カードペインの適当なカードのメインプラスボタンを押す
  // 既にカードペインにいる
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  let row = within(paneCard).getByRole('row', { name: 'R-1' })
  let cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  await userEvent.click(within2(cellMain).getButtonByName('+'))
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)

  // レシピペインの保存ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  await userEvent.click(within2(paneDeck).getButtonByName('マイデッキに保存'))

  // マイデッキペインに移動した
  await waitFor(() =>
    expect(getTabPanelByName('マイデッキ')).toHaveClass('active'),
  )
  let paneLoad = getTabPanelByName('マイデッキ')
  // 保存されたデッキの表示の確認
  await waitFor(() =>
    expect(
      within(
        within(paneLoad).getByRole('list', { name: 'ロード' }),
      ).getAllByRole('listitem', {
        name: /^#/,
      }),
    ).toHaveLength(1),
  )
  // モーダルは出ない
  expect(queryByRole('dialog')).toBeNull()

  // 保存されたデータの検証
  let decksSaved = await dbQueryDecks()
  expect(decksSaved).toHaveLength(1)
  expect(decksSaved[0].main).toStrictEqual([['R-1', 1]])
  expect(decksSaved[0].side).toStrictEqual([])

  // メインデッキに増やしたカードを元に戻して0枚にする
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = getByRole('row', { name: 'R-1' })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)
  await userEvent.click(within2(cellMain).getButtonByName('-'))
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)

  // カードペインの適当なカードのサイドプラスボタンを押す
  row = getByRole('row', { name: 'R-2' })
  let cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)
  await userEvent.click(within2(cellSide).getButtonByName('+'))
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(1)

  // レシピペインの保存ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  await userEvent.click(within2(paneDeck).getButtonByName('マイデッキに保存'))

  // マイデッキペインに移動した
  await waitFor(() =>
    expect(getTabPanelByName('マイデッキ')).toHaveClass('active'),
  )
  paneLoad = getTabPanelByName('マイデッキ')
  // 保存されたデッキの表示の確認
  await waitFor(() =>
    expect(
      within(
        within(paneLoad).getByRole('list', { name: 'ロード' }),
      ).getAllByRole('listitem', {
        name: /^#/,
      }),
    ).toHaveLength(2),
  )
  // モーダルは出ない
  expect(queryByRole('dialog')).toBeNull()

  // 新しく保存されたデッキはリストの先頭に追加される
  decksSaved = await dbQueryDecks()
  expect(decksSaved).toHaveLength(2)
  expect(decksSaved[0].main).toStrictEqual([])
  expect(decksSaved[0].side).toStrictEqual([['R-2', 1]])
  expect(decksSaved[1].main).toStrictEqual([['R-1', 1]])
  expect(decksSaved[1].side).toStrictEqual([])
})

test('保存済みデッキの表示と削除', async () => {
  let decksSaved = [
    { timestamp: new Date(), main: [['R-1', 1]], side: [] },
    { timestamp: new Date(), main: [['R-2', 2]], side: [['R-3', 3]] },
    { timestamp: new Date(), main: [], side: [['R-4', 4]] },
  ]

  await dbClearDecks()
  await dbAddDeck(decksSaved[0])
  await dbAddDeck(decksSaved[1])
  await dbAddDeck(decksSaved[2])
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  // モーダルはない
  expect(queryByRole('dialog')).toBeNull()

  // 初期状態では保存済みデッキが表示される
  await userEvent.click(getByRole('tab', { name: 'マイデッキ' }))
  let paneLoad = getTabPanelByName('マイデッキ')
  expect(paneLoad).toHaveClass('active')
  await waitFor(() =>
    expect(
      within(
        within(paneLoad).getByRole('list', { name: 'ロード' }),
      ).getAllByRole('listitem', {
        name: /^#/,
      }),
    ).toHaveLength(3),
  )

  // 3つあるデッキのうち2つ目を削除する
  const items = within(
    within(paneLoad).getByRole('list', { name: 'ロード' }),
  ).getAllByRole('listitem', {
    name: /^#/,
  })
  await userEvent.click(within2(items[1]).getButtonByName('削除'))

  // 保存済みデッキの表示が減る
  await waitFor(() =>
    expect(
      within(
        within(paneLoad).getByRole('list', { name: 'ロード' }),
      ).getAllByRole('listitem', {
        name: /^#/,
      }),
    ).toHaveLength(2),
  )

  // 保存されたデータの検証
  decksSaved = await dbQueryDecks()
  expect(decksSaved).toHaveLength(2)
  expect(decksSaved[0].main).toStrictEqual([])
  expect(decksSaved[0].side).toStrictEqual([['R-4', 4]])
  expect(decksSaved[1].main).toStrictEqual([['R-1', 1]])
  expect(decksSaved[1].side).toStrictEqual([])

  // 保存済みレシピをすべて削除ボタンを押す
  await userEvent.click(
    within2(paneLoad).getButtonByName('保存済みレシピをすべて削除'),
  )

  // モーダルが表示される
  await waitFor(() => expect(getByRole('dialog')).not.toBeNull())
  let dialog = getByRole('dialog')
  expect(dialog).toHaveTextContent(
    '保存済みレシピをすべて削除します。よろしいですか？',
  )
  // キャンセルボタンを押す
  await userEvent.click(within2(dialog).getButtonByName('キャンセル'))
  // モーダルがひっこむ
  await waitFor(() => expect(queryByRole('dialog')).toBeNull())

  // デッキはクリアされていない
  decksSaved = await dbQueryDecks()
  expect(decksSaved).toHaveLength(2)
  expect(decksSaved[0].main).toStrictEqual([])
  expect(decksSaved[0].side).toStrictEqual([['R-4', 4]])
  expect(decksSaved[1].main).toStrictEqual([['R-1', 1]])
  expect(decksSaved[1].side).toStrictEqual([])

  // 保存済みレシピをすべて削除ボタンを押す
  // prettier-ignore
  await userEvent.click(within2(paneLoad).getButtonByName('保存済みレシピをすべて削除'))
  // モーダルが表示される
  dialog = screen.getByRole('dialog')
  expect(dialog).toHaveTextContent(
    '保存済みレシピをすべて削除します。よろしいですか？',
  )
  // 削除を確定する
  await userEvent.click(within2(dialog).getButtonByName('削除する'))
  // モーダルがひっこむ
  await waitFor(() => expect(queryByRole('dialog')).toBeNull())
  // 保存済みデッキの表示がなくなる
  await waitFor(() =>
    expect(
      within(
        within(paneLoad).getByRole('list', { name: 'ロード' }),
      ).queryByRole('listitem', {
        name: /^#/,
      }),
    ).toBeNull(),
  )

  // 保存されたデータの検証
  decksSaved = await dbQueryDecks()
  expect(decksSaved).toHaveLength(0)
})
