// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TabPaneCard from '.'

afterEach(cleanup)

test('初期状態', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const handleSetDeckMain = vi.fn()
  const handleSetDeckSide = vi.fn()
  const handleSetIdZoom = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByPlaceholderText, getByRole, getByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(handleSetDeckMain.mock.calls.length).toBe(0)
  expect(handleSetDeckSide.mock.calls.length).toBe(0)
  expect(handleSetIdZoom.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  const textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toBeVisible()
  expect(textboxSearch).toHaveValue('')

  const checkboxIncludesTnL = getByRole('checkbox', {
    name: '特性と遺業能力も検索する',
  })
  expect(checkboxIncludesTnL).toBeVisible()
  expect(checkboxIncludesTnL).toBeChecked()

  const buttonFilterTop = getByRole('button', {
    name: '条件で絞り込む',
    expanded: false, // 初期状態では閉じている
  })
  expect(buttonFilterTop).toBeVisible()

  // TBD カードリストの初期状態のテスト

  // 条件で絞り込むボタンを押す
  await userEvent.click(buttonFilterTop)

  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const buttonExpansion = getByRole('button', {
    name: '➕ エキスパンション ― すべて',
    expanded: false,
  })
  expect(buttonExpansion).toBeVisible()

  const buttonRarity = getByRole('button', {
    name: '➕ レアリティ ― すべて',
    expanded: false,
  })
  expect(buttonRarity).toBeVisible()

  const buttonColor = getByRole('button', {
    name: '➖ 色',
    expanded: true,
  })
  expect(buttonColor).toBeVisible()

  const spanColorAll = getByTestId('button-color-all')
  expect(spanColorAll).toBeVisible()
  const buttonColorAll = spanColorAll.querySelector('input[type="radio"]')
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked()
  const labelColorAll = spanColorAll.querySelector('label')
  expect(labelColorAll).toBeVisible()
  expect(labelColorAll.textContent).toBe('すべて')

  const buttonType = getByRole('button', {
    name: '➖ 種類',
    expanded: true,
  })
  expect(buttonType).toBeVisible()

  const spanTypeAll = getByTestId('button-color-all')
  expect(spanTypeAll).toBeVisible()
  const buttonTypeAll = spanTypeAll.querySelector('input[type="radio"]')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).toBeChecked()
  const labelTypeAll = spanTypeAll.querySelector('label')
  expect(labelTypeAll).toBeVisible()
  expect(labelTypeAll.textContent).toBe('すべて')

  const buttonLevel = getByRole('button', {
    name: '➕ レベル ― 0以上',
    expanded: false,
  })
  expect(buttonLevel).toBeVisible()

  const buttonTrait = getByRole('button', {
    name: '➕ 特性 ― 指定なし',
    expanded: false,
  })
  expect(buttonTrait).toBeVisible()

  const buttonTerm = getByRole('button', {
    name: '➕ 能力語 ― 指定なし',
    expanded: false,
  })
  expect(buttonTerm).toBeVisible()

  const buttonLegacy = getByRole('button', {
    name: '➕ 遺業能力 ― 指定なし',
    expanded: false,
  })
  expect(buttonLegacy).toBeVisible()
})
