import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumComparator from '../enumComparator'
import useAccordionItemLevelFilter from '.'

function defaultRenderHook() {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  const defaultRender = () => {
    const { rerender, getByRole, getByTestId } = render(
      <Accordion alwaysOpen>{result.current[3]('0')}</Accordion>
    )
    const defaultRerender = () =>
      rerender(<Accordion alwaysOpen>{result.current[3]('0')}</Accordion>)
    return { defaultRerender, getByRole, getByTestId }
  }
  return { result, defaultRender }
}

afterEach(cleanup)

test('ボタンの選択', async () => {
  const { result, defaultRender } = defaultRenderHook()
  let [level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()

  let slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  let buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked() // 選択されている
  let buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  let buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 以下を選択する
  await userEvent.click(buttonLE)
  ;[level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.LE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).not.toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible() // 選択されている
  expect(buttonLE).toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 等しいを選択する
  await userEvent.click(buttonEQ)
  ;[level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.EQ)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).not.toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).toBeChecked() // 選択されている

  // 状態をリセットする
  await act(() => reset())
  ;[level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked() // 以上が選択されている
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()
})

test('スライダーの選択', async () => {
  const { result, defaultRender } = defaultRenderHook()
  let [level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()

  let slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  let buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked() // 選択されている
  let buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  let buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 値を1にする
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(slider, { target: { value: '1' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(1) // 1になっている
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('1') // 1になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 値を10にする
  fireEvent.change(slider, { target: { value: '10' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(10) // 10になっている
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('10') // 10になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 値を11にしようとする
  fireEvent.change(slider, { target: { value: '11' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(10) // 11ではなく10になっている
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('10') // 11ではなく10になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 値を17にする
  fireEvent.change(slider, { target: { value: '17' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(17) // 17になっている
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('17') // 17になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 値を16にしようとする
  fireEvent.change(slider, { target: { value: '16' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(17) // 16ではなく17になっている
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('17') // 16ではなく17になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 状態をリセットする
  await act(() => reset())
  ;[level, comparator, reset] = result.current
  expect(level).toBe(0) // 0になっている
  expect(comparator).toBe(enumComparator.GE) // 以上になっている
  defaultRerender()

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0') // 0になっている
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked() // 選択されている
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()
})

test('getByTestId による選択', async () => {
  const { result, defaultRender } = defaultRenderHook()
  let [level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.GE)
  const { defaultRerender, getByTestId } = defaultRender()

  expect(getByTestId('slider-level')).toHaveValue('0')
  const spanGE = getByTestId('button-level-ge')
  expect(spanGE.querySelector('input')).toBeChecked()
  expect(spanGE.querySelector('label')).toHaveTextContent('以上')
  const spanLE = getByTestId('button-level-le')
  expect(spanLE.querySelector('input')).not.toBeChecked()
  expect(spanLE.querySelector('label')).toHaveTextContent('以下')
  const spanEQ = getByTestId('button-level-eq')
  expect(spanEQ.querySelector('input')).not.toBeChecked()
  expect(spanEQ.querySelector('label')).toHaveTextContent('等しい')

  fireEvent.change(getByTestId('slider-level'), { target: { value: '5' } })
  ;[level, comparator, reset] = result.current
  expect(level).toBe(5)
  defaultRerender()
  expect(getByTestId('slider-level')).toHaveValue('5')

  await userEvent.click(getByTestId('button-level-le').querySelector('input'))
  ;[level, comparator, reset] = result.current
  expect(comparator).toBe(enumComparator.LE)
  defaultRerender()
  expect(getByTestId('button-level-le').querySelector('input')).toBeChecked()

  await userEvent.click(getByTestId('button-level-eq').querySelector('input'))
  ;[level, comparator, reset] = result.current
  expect(comparator).toBe(enumComparator.EQ)
  defaultRerender()
  expect(getByTestId('button-level-eq').querySelector('input')).toBeChecked()

  await act(() => reset())
  ;[level, comparator, reset] = result.current
  expect(level).toBe(0)
  expect(comparator).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByTestId('slider-level')).toHaveValue('0')
  expect(getByTestId('button-level-ge').querySelector('input')).toBeChecked()
})
