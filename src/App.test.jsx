// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { createRoutesStub } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { dataCardsMap } from './commons/dataCards'
import { dbAddDeck, dbClearDecks } from './commons/db'
import Home from './Home'

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

test('タブをクリックするとペインが表示される', async () => {
  const { getByRole, getAllByRole, getTabPanelByName } = defaultRender()

  // タブの数は5個
  expect(getAllByRole('tab').length).toBe(5)
  expect(getAllByRole('tabpanel').length).toBe(5)

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')

  // 次のアサーションは成功するが、ほぼ意味がない。
  expect(getTabPanelByName('カード')).toBeVisible()
  // なぜなら、次のアサーションも成功してしまうからだ。
  expect(getTabPanelByName('レシピ')).toBeVisible()
  expect(getTabPanelByName('マイデッキ')).toBeVisible()
  expect(getTabPanelByName('シミュ')).toBeVisible()
  expect(getTabPanelByName('ヘルプ')).toBeVisible()
  // Bootstrap を使用しているおかげか、可視性はスタイルで直接的にではなく、
  // CSS の active クラスで間接的に制御されているようだ。
  // したがって、toBeVisible のアサーションは上のものにとどめ、以降は行わない。

  // 代わりに active クラスを持っているか否かで可視性をテストする。
  expect(getTabPanelByName('カード')).toHaveClass('active')
  expect(getTabPanelByName('レシピ')).not.toHaveClass('active')
  expect(getTabPanelByName('マイデッキ')).not.toHaveClass('active')
  expect(getTabPanelByName('シミュ')).not.toHaveClass('active')
  expect(getTabPanelByName('ヘルプ')).not.toHaveClass('active')

  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  expect(getByRole('tab', { selected: true })).toHaveTextContent('レシピ')

  expect(getTabPanelByName('カード')).not.toHaveClass('active')
  expect(getTabPanelByName('レシピ')).toHaveClass('active')
  expect(getTabPanelByName('マイデッキ')).not.toHaveClass('active')
  expect(getTabPanelByName('シミュ')).not.toHaveClass('active')
  expect(getTabPanelByName('ヘルプ')).not.toHaveClass('active')

  await userEvent.click(getByRole('tab', { name: 'マイデッキ' }))
  expect(getByRole('tab', { selected: true })).toHaveTextContent('マイデッキ')

  expect(getTabPanelByName('カード')).not.toHaveClass('active')
  expect(getTabPanelByName('レシピ')).not.toHaveClass('active')
  expect(getTabPanelByName('マイデッキ')).toHaveClass('active')
  expect(getTabPanelByName('シミュ')).not.toHaveClass('active')
  expect(getTabPanelByName('ヘルプ')).not.toHaveClass('active')

  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  expect(getByRole('tab', { selected: true })).toHaveTextContent('シミュ')

  expect(getTabPanelByName('カード')).not.toHaveClass('active')
  expect(getTabPanelByName('レシピ')).not.toHaveClass('active')
  expect(getTabPanelByName('マイデッキ')).not.toHaveClass('active')
  expect(getTabPanelByName('シミュ')).toHaveClass('active')
  expect(getTabPanelByName('ヘルプ')).not.toHaveClass('active')

  await userEvent.click(getByRole('tab', { name: 'ヘルプ' }))
  expect(getByRole('tab', { selected: true })).toHaveTextContent('ヘルプ')

  expect(getTabPanelByName('カード')).not.toHaveClass('active')
  expect(getTabPanelByName('レシピ')).not.toHaveClass('active')
  expect(getTabPanelByName('マイデッキ')).not.toHaveClass('active')
  expect(getTabPanelByName('シミュ')).not.toHaveClass('active')
  expect(getTabPanelByName('ヘルプ')).toHaveClass('active')
})

test('カードペインからレシピペインへの作用', async () => {
  const id = 'R-1'
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')

  // メイン・サイドとも「0」枚
  let row = within(paneCard).getByRole('row', { name: id })
  let cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  let cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)

  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  let listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  let listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: id })).toBeNull()

  // 1a. カードペインでメインのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('+'))

  // 1b. レシピペインのメインデッキに当該カードが表示される
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  let itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('1')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem')).toBeNull()

  // 2a. カードペインでサイドのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('+'))

  // 2b. レシピペインのサイドデッキに当該カードが表示される
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('1')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  let itemSide = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')

  // 3a. カードペインでメインのプラスボタンを再度押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('+'))

  // 3b. レシピペインのメインデッキで当該カードの枚数が増える
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('2')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')

  // 4a. カードペインでサイドのプラスボタンを再度押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('+'))

  // 4b. レシピペインのサイドデッキで当該カードの枚数が増える
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('2')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('2')

  // 5a. カードペインでメインのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('-'))

  // 5b. レシピペインのメインデッキで当該カードの枚数が減る
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('1')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('2')

  // 6a. カードペインでサイドのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('-'))

  // 6b. レシピペインのサイドデッキで当該カードの枚数が減る
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('1')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')

  // 7a. カードペインでメインのマイナスボタンを再度押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('-'))

  // 7b. レシピペインのメインデッキで当該カードが非表示になる
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')

  // 8a. カードペインでサイドのマイナスボタンを再度押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('-'))

  // 8b. レシピペインのサイドデッキで当該カードが非表示になる
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: id })).toBeNull()
})

test('レシピペインからカードペインへの作用', async () => {
  const id = 'R-1'
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')

  // メイン・サイドとも「0」枚
  let row = within(paneCard).getByRole('row', { name: id })
  let cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  let cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)

  // レシピタブには何も表示されていない
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  let listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  let listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: id })).toBeNull()

  // 初期状態として、カードペインでメインとサイドのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('+'))
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('+'))
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(1)

  // レシピペインのメインデッキとサイドデッキに当該カードが表示される
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  let itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('1')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  let itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')

  // 既にレシピペインにいる
  // 1a. レシピペインのメインデッキのプラスボタンを押す
  await userEvent.click(within2(itemMain).getButtonByName('+'))

  // 1b. カードペインのメインで当該カードの枚数が増える
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(2)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(1)

  // 2a. レシピペインのサイドデッキのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('+'))

  // 2b. カードペインのサイドで当該カードの枚数が増える
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(2)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(2)

  // 3a. レシピペインのメインデッキの「v」ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemMain).getButtonByName('v'))

  // 3b. カードペインのメインとサイドで当該カードの枚数が変わる
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(3)

  // 4a. レシピペインのサイドデッキの「^」ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('^'))

  // 4b. カードペインのメインとサイドで当該カードの枚数が変わる
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(2)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(2)

  // 5a. レシピペインのメインデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemMain).getButtonByName('-'))

  // 5b. カードペインのメインで当該カードの枚数が減る
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(2)

  // 6a. レシピペインのサイドデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('-'))

  // 6b. カードペインのサイドで当該カードの枚数が減る
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(1)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(1)

  // 7a. レシピペインのレシピをクリアボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  await userEvent.click(within2(paneDeck).getButtonByName('レシピをクリア'))

  // 7b. カードペインで当該カードの枚数がゼロになる
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)
})

test('保存したデッキを読み込んでレシピペインに表示する', async () => {
  const deckSaved = {
    timestamp: new Date(),
    main: [['R-1', 3]],
    side: [['R-2', 4]],
  }
  await dbClearDecks()
  await dbAddDeck(deckSaved)

  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')

  // レシピタブをクリックする
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')

  // 初期状態でカードは非表示
  let listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: 'R-1' })).toBeNull()
  let listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: 'R-2' })).toBeNull()

  // マイデッキタブをクリックしてアコーディオンを開き、読込みボタンを押す
  await userEvent.click(getByRole('tab', { name: 'マイデッキ' }))
  let paneSave = getTabPanelByName('マイデッキ')
  expect(paneSave).toHaveClass('active')
  const listSaved = within(paneSave).getByRole('list', { name: 'ロード' })
  const itemSaved = within(listSaved).getByRole('listitem', { name: /^#/ })
  await userEvent.click(
    within(within(itemSaved).getAllByRole('heading')[0]).getByRole('button'),
  )
  await userEvent.click(within2(itemSaved).getButtonByName('読込み'))

  // レシピタブに遷移し、読み込まれたデッキのカードが表示された
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  // 初期状態でカードは非表示
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  const itemMain = within(listMain).getByRole('listitem', { name: 'R-1' })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('3')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  const itemSide = within(listSide).getByRole('listitem', { name: 'R-2' })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('4')
})

test('シミュレータがカードペインの操作でアボートする', async () => {
  const id = 'R-1'
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')

  // メイン・サイドとも「0」枚
  let row = within(paneCard).getByRole('row', { name: id })
  let cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  let cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)

  // レシピタブには何も表示されていない
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  let listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  let listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: id })).toBeNull()

  // シミュレータタブも同様
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  let paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 初期状態として、メインデッキにカードを10枚適当に加える
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  for (let i = 0; i < 10; ++i) {
    row = within(paneCard).getByRole('row', { name: id })
    cellMain = within(row).getAllByRole('cell')[2]
    await userEvent.click(within2(cellMain).getButtonByName('+'))
  }

  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 既にシミュタブにいる
  // 1a. スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 1b. カードペインでメインデッキのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('+'))

  // 1c. 手札シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 2a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 2b. カードペインでメインデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellMain = within(row).getAllByRole('cell')[2]
  await userEvent.click(within2(cellMain).getButtonByName('-'))

  // 2c. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 3a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 3b. カードペインでサイドデッキのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('+'))

  // 3c. シミュレータはアボートしない
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 4a. カードペインでサイドデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('-'))

  // 4b. やはりシミュレータはアボートしない
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()
})

test('シミュレータがレシピペインの操作でアボートする', async () => {
  const id = 'R-1'
  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  // メイン・サイドとも「0」枚
  let row = within(paneCard).getByRole('row', { name: id })
  let cellMain = within(row).getAllByRole('cell')[2]
  expect(within(cellMain).getByRole('spinbutton')).toHaveValue(0)
  let cellSide = within(row).getAllByRole('cell')[3]
  expect(within(cellSide).getByRole('spinbutton')).toHaveValue(0)

  // レシピタブには何も表示されていない
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  let paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  let listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  expect(within(listMain).queryByRole('listitem', { name: id })).toBeNull()
  let listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  expect(within(listSide).queryByRole('listitem', { name: id })).toBeNull()

  // シミュレータタブも同様
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  let paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 初期状態として、メインデッキにカードを10枚適当に加える
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  for (let i = 0; i < 10; ++i) {
    row = within(paneCard).getByRole('row', { name: id })
    cellMain = within(row).getAllByRole('cell')[2]
    await userEvent.click(within2(cellMain).getButtonByName('+'))
  }
  // サイドデッキにもカードを1枚適当に加える
  row = within(paneCard).getByRole('row', { name: id })
  cellSide = within(row).getAllByRole('cell')[3]
  await userEvent.click(within2(cellSide).getButtonByName('+'))

  // レシピペインのメインデッキとサイドデッキに当該カードが表示される
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  let itemMain = within(listMain).getByRole('listitem', { name: id })
  expect(within(itemMain).getByRole('img')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toBeVisible()
  expect(within(itemMain).getByRole('textbox')).toHaveTextContent('10')
  expect(within2(itemMain).getButtonByName('+')).toBeVisible()
  expect(within2(itemMain).getButtonByName('-')).toBeVisible()
  expect(within2(itemMain).getButtonByName('v')).toBeVisible()
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  let itemSide = within(listSide).getByRole('listitem', { name: id })
  expect(within(itemSide).getByRole('img')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toBeVisible()
  expect(within(itemSide).getByRole('textbox')).toHaveTextContent('1')
  expect(within2(itemSide).getButtonByName('+')).toBeVisible()
  expect(within2(itemSide).getButtonByName('-')).toBeVisible()
  expect(within2(itemSide).getButtonByName('^')).toBeVisible()

  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 既にシミュペインにいる
  // 1a. スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 1b. レシピペインでメインデッキのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemMain).getButtonByName('+'))

  // 1c. 手札シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 2a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 2b. レシピペインでメインデッキの「v」ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemMain).getButtonByName('v'))

  // 2c. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 3a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 3b. レシピペインでサイドデッキの「^」ボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('^'))

  // 3c. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 4a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 4b. レシピペインでメインデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listMain = within(paneDeck).getByRole('list', { name: 'メインデッキ' })
  itemMain = within(listMain).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemMain).getButtonByName('-'))

  // 4c. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 5a. リセットボタン、スタートボタンと押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 5b. レシピペインでサイドデッキのプラスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('+'))

  // 5c. シミュレータはアボートしない
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 6a. レシピペインでサイドデッキのマイナスボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  listSide = within(paneDeck).getByRole('list', { name: 'サイドデッキ' })
  itemSide = within(listSide).getByRole('listitem', { name: id })
  await userEvent.click(within2(itemSide).getButtonByName('-'))

  // 6b. やはりシミュレータはアボートしない
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 7a. レシピペインでレシピをクリアボタンを押す
  await userEvent.click(getByRole('tab', { name: 'レシピ' }))
  paneDeck = getTabPanelByName('レシピ')
  expect(paneDeck).toHaveClass('active')
  await userEvent.click(within2(paneDeck).getButtonByName('レシピをクリア'))

  // 7b. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()
})

test('シミュレータがマイデッキペインの操作でアボートする', async () => {
  const deckSaved = { timestamp: new Date(), main: [['R-1', 10]], side: [] }

  await dbClearDecks()
  await dbAddDeck(deckSaved)

  const { getByRole, queryByRole, getTabPanelByName } = defaultRender()

  // 初期タブは「カード」
  expect(getByRole('tab', { selected: true })).toHaveTextContent('カード')
  let paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')

  // シミュレータタブには何も表示されていない
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  let paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 1. メインデッキにカードが10枚入った保存済みデッキを読み込む
  await userEvent.click(getByRole('tab', { name: 'マイデッキ' }))
  let paneSave = getTabPanelByName('マイデッキ')
  expect(paneSave).toHaveClass('active')
  let listSaved = within(paneSave).getByRole('list', { name: 'ロード' })
  let itemSaved = within(listSaved).getByRole('listitem', { name: /^#/ })
  // prettier-ignore
  await userEvent.click(within(within(itemSaved).getAllByRole('heading')[0]).getByRole('button'))
  await userEvent.click(within2(itemSaved).getButtonByName('読込み'))

  // 2a. スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 2b. マイデッキペインで読込みボタンを押す
  await userEvent.click(getByRole('tab', { name: 'マイデッキ' }))
  paneSave = getTabPanelByName('マイデッキ')
  expect(paneSave).toHaveClass('active')
  listSaved = within(paneSave).getByRole('list', { name: 'ロード' })
  itemSaved = within(listSaved).getByRole('listitem', { name: /^#/ })
  // prettier-ignore
  await userEvent.click(within(within(itemSaved).getAllByRole('heading')[0]).getByRole('button'))
  await userEvent.click(within2(itemSaved).getButtonByName('読込み'))

  // 2c. シミュレータがアボートする
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(within(paneSim).getByRole('alert')).toHaveTextContent(
    'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。',
  )
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()
})
