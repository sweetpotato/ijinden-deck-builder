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
  let [type, reset, renderItem] = result.current
  expect(type).toBe(0) // すべて
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderItem('0')}</Accordion>
  )

  let buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).toBeChecked() // すべてが選択されている
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
  ;[type, reset, renderItem] = result.current
  expect(type).toBe(enumType.IJIN)
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).toBeChecked() // 選択されている
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
  ;[type, reset, renderItem] = result.current
  expect(type).toBe(enumType.HAIKEI)
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).toBeChecked() // 選択されている
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(buttonMahou)
  ;[type, reset, renderItem] = result.current
  expect(type).toBe(enumType.MAHOU)
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

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
  expect(buttonMahou).toBeChecked() // 選択されている
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(buttonMaryoku)
  ;[type, reset, renderItem] = result.current
  expect(type).toBe(enumType.MARYOKU)
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

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
  expect(buttonMaryoku).toBeChecked() // 選択されている

  // 状態をリセットする
  await act(() => reset())
  ;[type, reset, renderItem] = result.current
  expect(type).toBe(0) // すべて
  rerender(<Accordion alwaysOpen>{renderItem('0')}</Accordion>)

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).toBeChecked() // 選択されている
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
