// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { createRoutesStub } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

test('メインデッキが9枚以下だとスタートできない', async () => {
  const id = 'R-1'
  const { getByRole, getTabPanelByName } = defaultRender()

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

  // シミュレータも空
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  let paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // メインのプラスボタンを9回押す
  await userEvent.click(getByRole('tab', { name: 'カード' }))
  paneCard = getTabPanelByName('カード')
  expect(paneCard).toHaveClass('active')
  for (let i = 0; i < 9; ++i) {
    row = within(paneCard).getByRole('row', { name: id })
    cellMain = within(row).getAllByRole('cell')[2]
    await userEvent.click(within2(cellMain).getButtonByName('+'))
  }
  // サイドのプラスボタンを10回押す
  for (let i = 0; i < 10; ++i) {
    row = within(paneCard).getByRole('row', { name: id })
    cellSide = within(row).getAllByRole('cell')[3]
    await userEvent.click(within2(cellSide).getButtonByName('+'))
  }

  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 開始できず、アラートが表示される
  let alert = within(paneSim).getByRole('alert')
  expect(alert).toBeVisible()
  // prettier-ignore
  expect(alert).toHaveTextContent('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // リセットボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // アラートが消える
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()
})

test('メインデッキが10枚以上ならスタートできる', async () => {
  const id = 'R-1'
  const { getByRole, getTabPanelByName } = defaultRender()

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

  // シミュレータも空
  await userEvent.click(getByRole('tab', { name: 'シミュ' }))
  let paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // メインのプラスボタンを10回押す
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
  expect(paneSim).toHaveClass('active')
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 1a. スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 1b. シミュレータが開始される
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 1c. リセットボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 1d. 初期状態に戻る
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 2a. スタートボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('スタート'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 2b. シミュレータが開始される
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeEnabled()

  // 2c. マリガンボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('マリガン'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 2d. シミュレータは走り続ける
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()

  // 2e. リセットボタンを押す
  await userEvent.click(within2(paneSim).getButtonByName('リセット'))
  paneSim = getTabPanelByName('シミュ')
  expect(paneSim).toHaveClass('active')

  // 2f. 初期状態に戻る
  expect(within(paneSim).queryByRole('alert')).toBeNull()
  expect(within2(paneSim).getButtonByName('リセット')).toBeDisabled()
  expect(within2(paneSim).getButtonByName('スタート')).toBeEnabled()
  expect(within2(paneSim).getButtonByName('マリガン')).toBeDisabled()
})
