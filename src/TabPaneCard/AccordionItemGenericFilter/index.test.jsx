// SPDX-License-Identifier: MIT

import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAccordionItemGenericFilter from '.'

afterEach(cleanup)

const dataExpansionsForTest = [
  { value: 0, label: 'すべて' },
  { value: 10, label: '伝説の武将' },
  { value: 11, label: '美と知の革命' },
  { value: 12, label: '日本の大天才' },
  { value: 20, label: '三国の英傑' },
  { value: 30, label: '発展する医学' },
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

test('エキスパンションのようにビットセットでないフィルタ', async () => {
  const { result } = renderHook(() =>
    useAccordionItemGenericFilter(
      'button-expansion-all',
      '種類',
      dataExpansionsForTest
    )
  )
  let [state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>
  )

  let buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  // すべてが選択されている
  expect(buttonExpansionAll).toBeChecked()
  let buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  let buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  let buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  let buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  let buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 伝説の武将を選択する
  await userEvent.click(buttonExpansionRed)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(10) // 伝説の武将
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  // 伝説の武将が選択されている
  expect(buttonExpansionRed).toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 美と知の革命を選択する
  await userEvent.click(buttonExpansionBlue)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(11) // 伝説の武将
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  // 美と知の革命が選択されている
  expect(buttonExpansionBlue).toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 日本の大天才を選択する
  await userEvent.click(buttonExpansionGreen)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(12) // 伝説の武将
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  // 日本の大天才が選択されている
  expect(buttonExpansionGreen).toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 三国の英傑を選択する
  await userEvent.click(buttonExpansionYellow)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(20) // 三国の英傑
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  // 三国の英傑が選択されている
  expect(buttonExpansionYellow).toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 発展する医学を選択する
  await userEvent.click(buttonExpansionPurple)
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(30) // 発展する医学
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  // 発展する医学が選択されている
  expect(buttonExpansionPurple).toBeChecked()

  // 状態をリセットする
  act(() => resetState())
  ;[state, resetState, renderAccordionItem] = result.current
  expect(state).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderAccordionItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  // すべてが選択されている
  expect(buttonExpansionAll).toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()
})

test('色のようにビットセットであるフィルタ', async () => {
  const { result } = renderHook(() =>
    useAccordionItemGenericFilter('button-color-all', '色', dataColors)
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
