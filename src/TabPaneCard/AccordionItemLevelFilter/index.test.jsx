import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumComparator from '../enumComparator'
import useAccordionItemLevelFilter from '.'

function defaultRenderHook() {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  const defaultRender = () => {
    const { rerender, getByRole } = render(
      <Accordion alwaysOpen>{result.current[3]('0')}</Accordion>
    )
    const defaultRerender = () =>
      rerender(<Accordion alwaysOpen>{result.current[3]('0')}</Accordion>)
    return { defaultRerender, getByRole }
  }
  return { result, defaultRender }
}

function getLevel(result) {
  return result.current[0]
}

function getComparator(result) {
  return result.current[1]
}

function getResetFn(result) {
  return result.current[2]
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { defaultRender } = defaultRenderHook()
  const { getByRole } = defaultRender()

  // スライダーがある
  const slider = getByRole('slider')
  expect(slider).toBeVisible()
  expect(slider).toHaveValue('0')
  // 「以上」「以下」「等しい」ボタンがある
  const buttonGe = getByRole('radio', { name: '以上' })
  expect(buttonGe).toBeVisible()
  expect(buttonGe).toBeChecked() // 選択されている
  const buttonLe = getByRole('radio', { name: '以下' })
  expect(buttonLe).toBeVisible()
  expect(buttonLe).not.toBeChecked()
  const buttonEq = getByRole('radio', { name: '等しい' })
  expect(buttonEq).toBeVisible()
  expect(buttonEq).not.toBeChecked()
})

test('ボタンの選択', async () => {
  // 初期状態では「以上」が選択されている
  const { result, defaultRender } = defaultRenderHook()
  expect(getComparator(result)).toBe(enumComparator.GE)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「以下」を選択する
  await userEvent.click(getByRole('radio', { name: '以下' }))
  expect(getComparator(result)).toBe(enumComparator.LE)
  defaultRerender()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「等しい」を選択する
  await userEvent.click(getByRole('radio', { name: '等しい' }))
  expect(getComparator(result)).toBe(enumComparator.EQ)
  defaultRerender()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeChecked()

  // リセットすると「以上」ボタンが選択される
  await act(() => getResetFn(result)())
  expect(getComparator(result)).toBe(enumComparator.GE)
  defaultRerender()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('スライダーの選択', async () => {
  // 初期値は0である
  const { result, defaultRender } = defaultRenderHook()
  expect(getLevel(result)).toBe(0)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('slider')).toHaveValue('0')

  // 値を1にする
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(getByRole('slider'), { target: { value: '1' } })
  expect(getLevel(result)).toBe(1)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('1')

  // 値を10にする
  fireEvent.change(getByRole('slider'), { target: { value: '10' } })
  expect(getLevel(result)).toBe(10)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('10')

  // 値を11にしようとすると10になる
  fireEvent.change(getByRole('slider'), { target: { value: '11' } })
  expect(getLevel(result)).toBe(10)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('10')

  // 値を17にする
  fireEvent.change(getByRole('slider'), { target: { value: '17' } })
  expect(getLevel(result)).toBe(17)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('17')

  // 値を16にしようとすると17になる
  fireEvent.change(getByRole('slider'), { target: { value: '16' } })
  expect(getLevel(result)).toBe(17)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('17')

  // リセットすると値は0になる
  await act(() => getResetFn(result)())
  expect(getLevel(result)).toBe(0)
  defaultRerender()
  expect(getByRole('slider')).toHaveValue('0')
})

test('アクセシブル名はヘッダに含まれている', () => {
  const { defaultRender } = defaultRenderHook()
  const { getByRole } = defaultRender()

  // リストアイテムとして取得できる
  const item = getByRole('listitem', { name: 'レベル' })
  expect(item).toBeVisible()
  // スライダーとボタンが取得できる
  expect(within(item).getByRole('slider')).toHaveValue('0')
  expect(within(item).getByRole('radio', { name: '以上' })).toBeChecked()
  expect(within(item).getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(within(item).getByRole('radio', { name: '等しい' })).not.toBeChecked()
  // ヘッダ部分はボタンとして取得できる
  // TODO 正規表現でなく部分文字列マッチさせたい
  expect(getByRole('button', { name: /レベル/ })).toBeVisible()
})
