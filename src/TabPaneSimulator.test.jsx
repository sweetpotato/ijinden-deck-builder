// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { createRoutesStub } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'

import Home from './Home'
import db from './commons/db'

function defaultRender() {
  const Stub = createRoutesStub([{ path: '/', Component: Home }])
  render(<Stub initialEntries={['/']} />)
}

afterEach(cleanup)

test('メインデッキが9枚以下だとスタートできない', async () => {
  defaultRender()

  const user = userEvent.setup()

  const tabCard = screen.getAllByRole('tab')[0]
  const tabSimulator = screen.getAllByRole('tab')[3]
  const paneCard = screen.getAllByRole('tabpanel')[0]
  const paneSimulator = screen.getAllByRole('tabpanel')[3]

  // 適当なカードのメインとサイドのプラスボタンを得る
  const buttonPlusMain = paneCard.querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  const buttonPlusSide = paneCard.querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )

  await user.click(tabSimulator)
  expect(paneSimulator).toHaveClass('active')
  expect(paneSimulator).toBeVisible()

  const buttonReset = paneSimulator.querySelector(
    '.container-button button:nth-child(1)'
  )
  const buttonStart = paneSimulator.querySelector(
    '.container-button button:nth-child(2)'
  )
  const buttonMulligan = paneSimulator.querySelector(
    '.container-button button:nth-child(3)'
  )

  expect(buttonReset.textContent).toBe('リセット')
  expect(buttonStart.textContent).toBe('スタート')
  expect(buttonMulligan.textContent).toBe('マリガン')

  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // メインのプラスボタンを9回押す
  await user.click(tabCard)
  expect(paneCard).toHaveClass('active')
  expect(paneCard).toBeVisible()
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)

  // サイドのプラスボタンを10回押す
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)
  await user.click(buttonPlusSide)

  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // スタートボタンを押す
  await user.click(buttonStart)

  // 開始できず、アラートが表示される
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeDisabled()
  let alert = paneSimulator.querySelector('.alert-warning')
  expect(alert.textContent).toBe(
    'メインデッキの枚数が少なすぎます。10枚以上にしてください。'
  )
  expect(alert).toBeVisible()

  // リセットボタンを押す
  await user.click(buttonReset)

  // アラートが消える
  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)
})

test('メインデッキが10枚以上ならスタートできるがドローボタンがない', async () => {
  defaultRender()

  const user = userEvent.setup()

  const tabCard = screen.getAllByRole('tab')[0]
  const tabSimulator = screen.getAllByRole('tab')[3]
  const paneCard = screen.getAllByRole('tabpanel')[0]
  const paneSimulator = screen.getAllByRole('tabpanel')[3]

  // 適当なカードのメインのプラスボタンを得る
  const buttonPlusMain = paneCard.querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )

  await user.click(tabSimulator)
  expect(paneSimulator).toHaveClass('active')
  expect(paneSimulator).toBeVisible()

  const buttonReset = paneSimulator.querySelector(
    '.container-button button:nth-child(1)'
  )
  const buttonStart = paneSimulator.querySelector(
    '.container-button button:nth-child(2)'
  )
  const buttonMulligan = paneSimulator.querySelector(
    '.container-button button:nth-child(3)'
  )

  expect(buttonReset.textContent).toBe('リセット')
  expect(buttonStart.textContent).toBe('スタート')
  expect(buttonMulligan.textContent).toBe('マリガン')

  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // メインのプラスボタンを10回押す
  await user.click(tabCard)
  expect(paneCard).toHaveClass('active')
  expect(paneCard).toBeVisible()
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)

  // 1a. スタートボタンを押す
  await user.click(buttonStart)

  // 1b. シミュレータが開始されるがドローボタンはない
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeEnabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 1c. リセットボタンを押す
  await user.click(buttonReset)

  // 1d. 初期状態に戻る
  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2a. スタートボタンを押す
  await user.click(buttonStart)

  // 2b. シミュレータが開始されるがドローボタンはない
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeEnabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2c. マリガンボタンを押す
  await user.click(buttonMulligan)

  // 2d. シミュレータは走り続けるがドローボタンはない
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2e. リセットボタンを押す
  await user.click(buttonReset)

  // 2f. 初期状態に戻る
  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)
})

test('メインデッキが11枚以上ならスタートできるてドローボタンがある', async () => {
  defaultRender()

  const user = userEvent.setup()

  const tabCard = screen.getAllByRole('tab')[0]
  const tabSimulator = screen.getAllByRole('tab')[3]
  const paneCard = screen.getAllByRole('tabpanel')[0]
  const paneSimulator = screen.getAllByRole('tabpanel')[3]

  // 適当なカードのメインのプラスボタンを得る
  const buttonPlusMain = paneCard.querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )

  await user.click(tabSimulator)
  expect(paneSimulator).toHaveClass('active')
  expect(paneSimulator).toBeVisible()

  const buttonReset = paneSimulator.querySelector(
    '.container-button button:nth-child(1)'
  )
  const buttonStart = paneSimulator.querySelector(
    '.container-button button:nth-child(2)'
  )
  const buttonMulligan = paneSimulator.querySelector(
    '.container-button button:nth-child(3)'
  )

  expect(buttonReset.textContent).toBe('リセット')
  expect(buttonStart.textContent).toBe('スタート')
  expect(buttonMulligan.textContent).toBe('マリガン')

  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // メインのプラスボタンを11回押す
  await user.click(tabCard)
  expect(paneCard).toHaveClass('active')
  expect(paneCard).toBeVisible()
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)
  await user.click(buttonPlusMain)

  // 1a. スタートボタンを押す
  await user.click(buttonStart)

  // 1b. シミュレータが開始されてドローボタンがある
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeEnabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 1c. リセットボタンを押す
  await user.click(buttonReset)

  // 1d. 初期状態に戻る
  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2a. スタートボタンを押す
  await user.click(buttonStart)

  // 2b. シミュレータが開始されるてドローボタンがある
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeEnabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2c. マリガンボタンを押す
  await user.click(buttonMulligan)

  // 2d. シミュレータは走り続けてドローボタンがある
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 2e. リセットボタンを押す
  await user.click(buttonReset)

  // 2f. 初期状態に戻る
  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)
})

test('ドローボタンを押していくと手札が増える', async () => {
  // 赤スターター
  const decksSaved = [
    {
      timestamp: new Date(),
      main: [
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
      side: [],
    },
  ]

  await db.decks.clear()
  await db.decks.bulkAdd(decksSaved)

  defaultRender()

  const user = userEvent.setup()

  const tabSave = screen.getAllByRole('tab')[2]
  const tabSimulator = screen.getAllByRole('tab')[3]
  const paneSave = screen.getAllByRole('tabpanel')[2]
  const paneSimulator = screen.getAllByRole('tabpanel')[3]

  await user.click(tabSimulator)
  expect(paneSimulator).toHaveClass('active')
  expect(paneSimulator).toBeVisible()

  const buttonReset = paneSimulator.querySelector(
    '.container-button button:nth-child(1)'
  )
  const buttonStart = paneSimulator.querySelector(
    '.container-button button:nth-child(2)'
  )
  const buttonMulligan = paneSimulator.querySelector(
    '.container-button button:nth-child(3)'
  )

  expect(buttonReset).toBeDisabled()
  expect(buttonStart).toBeEnabled()
  expect(buttonMulligan).toBeDisabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)

  // 1. メインデッキにカードが40枚入った保存済みデッキを読み込む
  await user.click(tabSave)
  expect(paneSave).toHaveClass('active')
  expect(paneSave).toBeVisible()
  const buttonLoad = paneSave.querySelector(
    '.accordion-item .container-button button:nth-child(1)'
  )
  expect(buttonLoad.textContent).toBe('読込み')
  await user.click(buttonLoad)

  // 2. スタートボタンを押す
  await user.click(tabSimulator)
  expect(paneSimulator).toHaveClass('active')
  expect(paneSimulator).toBeVisible()
  await user.click(buttonStart)
  expect(buttonReset).toBeEnabled()
  expect(buttonStart).toBeDisabled()
  expect(buttonMulligan).toBeEnabled()
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0)
})
