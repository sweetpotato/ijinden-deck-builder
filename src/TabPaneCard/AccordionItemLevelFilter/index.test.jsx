import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumComparator from '../enumComparator'
import useAccordionItemLevelFilter from '.'

afterEach(cleanup)

test('ボタンの選択', async () => {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  let [levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderLevel('0')}</Accordion>
  )

  let slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  let buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  // 以上が選択されている
  expect(buttonGE).toBeChecked()
  let buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  let buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 以下を選択する
  await userEvent.click(buttonLE)
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.LE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).not.toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  // 以下が選択されている
  expect(buttonLE).toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // 等しいを選択する
  await userEvent.click(buttonEQ)
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.EQ)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

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
  // 等しいが選択されている
  expect(buttonEQ).toBeChecked()

  // リセットする
  act(() => resetLevel())
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  // 以上が選択されている
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()
})

test('スライダーの選択', async () => {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  let [levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{renderLevel('0')}</Accordion>
  )

  let slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  let buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  // 以上が選択されている
  expect(buttonGE).toBeChecked()
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
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が1になっている
  expect(levelValue).toBe(1)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が1になっている
  expect(slider).toHaveValue('1')
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
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(slider, { target: { value: '10' } })
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が10になっている
  expect(levelValue).toBe(10)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が10になっている
  expect(slider).toHaveValue('10')
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
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(slider, { target: { value: '11' } })
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が11ではなく10になっている
  expect(levelValue).toBe(10)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が11ではなく10になっている
  expect(slider).toHaveValue('10')
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
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(slider, { target: { value: '17' } })
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が17になっている
  expect(levelValue).toBe(17)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が17になっている
  expect(slider).toHaveValue('17')
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
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(slider, { target: { value: '16' } })
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が16ではなく17になっている
  expect(levelValue).toBe(17)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が16ではなく17になっている
  expect(slider).toHaveValue('17')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()

  // リセットする
  act(() => resetLevel())
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  // 値が0になっている
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)

  slider = getByRole('slider')
  expect(slider).toBeVisible()
  // 値が0になっている
  expect(slider).toHaveValue('0')
  buttonGE = getByRole('radio', { name: '以上' })
  expect(buttonGE).toBeVisible()
  expect(buttonGE).toBeChecked()
  buttonLE = getByRole('radio', { name: '以下' })
  expect(buttonLE).toBeVisible()
  expect(buttonLE).not.toBeChecked()
  buttonEQ = getByRole('radio', { name: '等しい' })
  expect(buttonEQ).toBeVisible()
  expect(buttonEQ).not.toBeChecked()
})

test('getByTestId() による選択', async () => {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  let [levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  const { rerender, getByTestId } = render(
    <Accordion alwaysOpen>{renderLevel('0')}</Accordion>
  )

  expect(getByTestId('slider-level')).toHaveValue('0')
  const spanGE = getByTestId('button-level-ge')
  expect(spanGE.querySelector('input[type="radio"]')).toBeChecked()
  expect(spanGE.querySelector('label')).toHaveTextContent('以上')
  const spanLE = getByTestId('button-level-le')
  expect(spanLE.querySelector('input[type="radio"]')).not.toBeChecked()
  expect(spanLE.querySelector('label')).toHaveTextContent('以下')
  const spanEQ = getByTestId('button-level-eq')
  expect(spanEQ.querySelector('input[type="radio"]')).not.toBeChecked()
  expect(spanEQ.querySelector('label')).toHaveTextContent('等しい')

  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(getByTestId('slider-level'), { target: { value: '5' } })
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(5)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)
  expect(getByTestId('slider-level')).toHaveValue('5')

  await userEvent.click(
    getByTestId('button-level-le').querySelector('input[type="radio"]')
  )
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelComparator).toBe(enumComparator.LE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)
  expect(
    getByTestId('button-level-le').querySelector('input[type="radio"]')
  ).toBeChecked()

  await userEvent.click(
    getByTestId('button-level-eq').querySelector('input[type="radio"]')
  )
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelComparator).toBe(enumComparator.EQ)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)
  expect(
    getByTestId('button-level-eq').querySelector('input[type="radio"]')
  ).toBeChecked()

  act(() => resetLevel())
  ;[levelValue, levelComparator, resetLevel, renderLevel] = result.current
  expect(levelValue).toBe(0)
  expect(levelComparator).toBe(enumComparator.GE)
  rerender(<Accordion alwaysOpen>{renderLevel('0')}</Accordion>)
  expect(getByTestId('slider-level')).toHaveValue('0')
  expect(
    getByTestId('button-level-ge').querySelector('input[type="radio"]')
  ).toBeChecked()
})
