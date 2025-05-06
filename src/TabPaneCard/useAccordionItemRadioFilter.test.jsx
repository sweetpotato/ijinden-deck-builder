// SPDX-License-Identifier: MIT

import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAccordionItemRadioFilter from './useAccordionItemRadioFilter'

afterEach(cleanup)

const dataTypes = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'イジン' },
  { value: 2, label: 'ハイケイ' },
  { value: 3, label: 'マホウ' },
  { value: 4, label: 'マリョク' },
]

const dataColors = [
  { value: 0, label: 'すべて' },
  { value: 1, label: '赤' },
  { value: 2, label: '青' },
  { value: 4, label: '緑' },
  { value: 8, label: '黄' },
  { value: 16, label: '紫' },
  { value: 32, label: '多色' },
  { value: 64, label: '無色' },
]

test('種類のようにビットセットでないフィルタ', async () => {
  const { result } = renderHook(() =>
    useAccordionItemRadioFilter('種類', dataTypes)
  )
  let [state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>
  )

  let buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  let buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  let buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  let buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  let buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(buttonIjin)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(1) // イジン
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  // イジンが選択されている
  expect(buttonIjin).toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(buttonHaikei)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(2) // ハイケイ
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  // ハイケイが選択されている
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(buttonMahou)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(3) // マホウ
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  // マホウが選択されている
  expect(buttonMahou).toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(buttonMaryoku)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(4) // マリョク
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  // マリョクが選択されている
  expect(buttonMaryoku).toBeChecked()

  // 状態をリセットする
  act(() => resetState())
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()
})

test('色のようにビットセットであるフィルタ', async () => {
  const { result } = renderHook(() =>
    useAccordionItemRadioFilter('色', dataColors)
  )
  let [state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>
  )

  let buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  let buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  let buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  let buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  let buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  let buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  let buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  let buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 赤を選択する
  await userEvent.click(buttonRed)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(1) // 赤
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  // 赤が選択されている
  expect(buttonRed).toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 青を選択する
  await userEvent.click(buttonBlue)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(2) // 青
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  // 青が選択されている
  expect(buttonBlue).toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 緑を選択する
  await userEvent.click(buttonGreen)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(4) // 緑
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  // 緑が選択されている
  expect(buttonGreen).toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 黄を選択する
  await userEvent.click(buttonYellow)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(8) // 黄
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  // 緑が選択されている
  expect(buttonYellow).toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 紫を選択する
  await userEvent.click(buttonPurple)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(16) // 紫
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  // 紫が選択されている
  expect(buttonPurple).toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 多色を選択する
  await userEvent.click(buttonMulticolor)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(32) // 多色
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  // 多色が選択されている
  expect(buttonMulticolor).toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 無色を選択する
  await userEvent.click(buttonColorless)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(64) // 無色
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  // 無色が選択されている
  expect(buttonColorless).toBeChecked()

  // 状態をリセットする
  act(() => resetState())
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()
})
