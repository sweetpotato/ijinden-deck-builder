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
  let [state, reset, renderItem] = result.current
  expect(state).toBe(0)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderItem('0')}</Accordion>
  )

  let buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).toBeChecked() // 選択されている
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
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(10) // 伝説の武将
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).toBeChecked() // 選択されている
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
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(11) // 美と知の革命
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).toBeChecked() // 選択されている
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
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(12) // 日本の大天才
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

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
  expect(buttonExpansionGreen).toBeChecked() // // 選択されている
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 三国の英傑を選択する
  await userEvent.click(buttonExpansionYellow)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(20) // 三国の英傑
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

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
  expect(buttonExpansionYellow).toBeChecked() // 選択されている
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()

  // 発展する医学を選択する
  await userEvent.click(buttonExpansionPurple)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(30) // 発展する医学
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

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
  expect(buttonExpansionPurple).toBeChecked() // 選択されている

  // 状態をリセットする
  await act(() => reset())
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonExpansionAll = getByRole('radio', { name: 'すべて' })
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).toBeChecked() // 選択されている
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
  let [state, reset, renderItem] = result.current
  expect(state).toBe(0) // すべて
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderItem('0')}</Accordion>
  )

  let buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked() // 選択されている
  let buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  let buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  let buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  let buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  let buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  let buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  let buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 赤を選択する
  await userEvent.click(buttonColorRed)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(1) // 赤
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).toBeChecked() // 選択されている
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 青を選択する
  await userEvent.click(buttonColorBlue)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(2) // 青
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible() // 選択されている
  expect(buttonColorBlue).toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 緑を選択する
  await userEvent.click(buttonColorGreen)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(4) // 緑
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible() // 選択されている
  expect(buttonColorGreen).toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 黄を選択する
  await userEvent.click(buttonColorYellow)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(8) // 黄
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible() // 選択されている
  expect(buttonColorYellow).toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 紫を選択する
  await userEvent.click(buttonColorPurple)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(16) // 紫
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible() // 選択されている
  expect(buttonColorPurple).toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 多色を選択する
  await userEvent.click(buttonColorMulticolor)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(32) // 多色
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible() // 選択されている
  expect(buttonColorMulticolor).toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()

  // 無色を選択する
  await userEvent.click(buttonColorColorless)
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(64) // 無色
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible() // 選択されている
  expect(buttonColorColorless).toBeChecked()

  // 状態をリセットする
  await act(() => reset())
  ;[state, reset, renderItem] = result.current
  expect(state).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonColorAll = getByRole('radio', { name: 'すべて' })
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked() // 選択されている
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()
})
