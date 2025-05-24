import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumComparator from '../enumComparator'
import enumType from '../enumType'
import useAccordionItemTypeFilter from '.'

function defaultRenderHook() {
  const { result } = renderHook(() => useAccordionItemTypeFilter())
  const defaultRender = () => {
    const { rerender, getByRole } = render(
      <Accordion alwaysOpen>{result.current[4]('0')}</Accordion>
    )
    const defaultRerender = () =>
      rerender(<Accordion alwaysOpen>{result.current[4]('0')}</Accordion>)
    return { defaultRerender, getByRole }
  }
  return { result, defaultRender }
}

function getType(result) {
  return result.current[0]
}

function getPower(result) {
  return result.current[1]
}

function getComparator(result) {
  return result.current[2]
}

function getResetFn(result) {
  return result.current[3]
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { defaultRender } = defaultRenderHook()
  const { getByRole } = defaultRender()

  // 「すべて」「イジン」「ハイケイ」「マホウ」「マリョク」ボタンがある
  const buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).toBeChecked() // 選択されている
  const buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  const buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  const buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  const buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()
  // スライダーと「以上」「以下」「等しい」ボタンがあって非活性である
  const slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toBeDisabled()
  expect(slider).toHaveValue('0')
  const buttonGe = getByRole('radio', { name: '以上' })
  expect(buttonGe).toBeVisible()
  expect(buttonGe).toBeDisabled()
  expect(buttonGe).toBeChecked() // 選択されている
  const buttonLe = getByRole('radio', { name: '以下' })
  expect(buttonLe).toBeVisible()
  expect(buttonLe).toBeDisabled()
  expect(buttonLe).not.toBeChecked()
  const buttonEq = getByRole('radio', { name: '等しい' })
  expect(buttonEq).toBeVisible()
  expect(buttonEq).toBeDisabled()
  expect(buttonEq).not.toBeChecked()
})

test('イジン以外を選択する', async () => {
  // 初期状態では「すべて」が選択されている
  const { result, defaultRender } = defaultRenderHook()
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('radio', { name: 'ハイケイ' }))
  expect(getType(result)).toBe(enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(getByRole('radio', { name: 'マホウ' }))
  expect(getType(result)).toBe(enumType.MAHOU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(getByRole('radio', { name: 'マリョク' }))
  expect(getType(result)).toBe(enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択してスライダーを操作する', async () => {
  // 初期状態ではスライダーは無効である
  const { result, defaultRender } = defaultRenderHook()
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択するとスライダーが有効になる
  await userEvent.click(getByRole('radio', { name: 'イジン' }))
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // スライダーを500にする
  fireEvent.change(getByRole('slider'), { target: { value: '500' } })
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(500)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('500')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // スライダーを10000にする
  fireEvent.change(getByRole('slider'), { target: { value: '10000' } })
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(10000)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('10000')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // リセットすると無効になって0になる
  act(() => getResetFn(result)())
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択して比較方法ボタンを選択する', async () => {
  // 初期状態では比較方法ボタンは無効
  const { result, defaultRender } = defaultRenderHook()
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択すると比較方法ボタンが有効になる
  await userEvent.click(getByRole('radio', { name: 'イジン' }))
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「以下」を選択する
  await userEvent.click(getByRole('radio', { name: '以下' }))
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.LE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「等しい」を選択する
  await userEvent.click(getByRole('radio', { name: '等しい' }))
  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.EQ)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).toBeChecked()

  // リセットすると無効になって「以上」が選択される
  act(() => getResetFn(result)())
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})
