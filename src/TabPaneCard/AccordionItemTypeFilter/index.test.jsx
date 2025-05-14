import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumType from '../enumType'
import useAccordionItemTypeFilter from '.'

afterEach(cleanup)

test('レンダリングとインタラクション', async () => {
  const { result } = renderHook(() => useAccordionItemTypeFilter())
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
  expect(state).toBe(enumType.IJIN)
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
  expect(state).toBe(enumType.HAIKEI)
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
  expect(state).toBe(enumType.MAHOU)
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
  expect(state).toBe(enumType.MARYOKU)
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
