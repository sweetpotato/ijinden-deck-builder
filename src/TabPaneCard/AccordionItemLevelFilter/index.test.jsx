// SPDX-License-Identifier: MIT

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

function getLevel(result) {
  return result.current[0]
}

function getComparator(result) {
  return result.current[1]
}

function getResetFn(result) {
  return result.current[2]
}

function getRenderFn(result) {
  return result.current[3]
}

function defaultRender() {
  const { result } = renderHook(() => useAccordionItemLevelFilter())
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>
  )
  const defaultRerender = () =>
    rerender(<Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>)
  return { result, defaultRerender, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole } = defaultRender()

  // スライダーがある
  expect(getByRole('slider')).toBeVisible()
  expect(getByRole('slider')).toHaveValue('0')

  // 「以上」「以下」「等しい」ボタンがある
  expect(getByRole('radio', { name: '以上' })).toBeVisible()
  expect(getByRole('radio', { name: '以上' })).toBeChecked() // 選択されている
  expect(getByRole('radio', { name: '以下' })).toBeVisible()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeVisible()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('アクセシビリティ', () => {
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

test('ボタンの選択', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「以上」が選択されている
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「以下」を選択する
  await userEvent.click(getByRole('radio', { name: '以下' }))
  defaultRerender()
  expect(getComparator(result)).toBe(enumComparator.LE)
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「等しい」を選択する
  await userEvent.click(getByRole('radio', { name: '等しい' }))
  defaultRerender()
  expect(getComparator(result)).toBe(enumComparator.EQ)
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeChecked()

  // リセットすると「以上」ボタンが選択される
  await act(() => getResetFn(result)())
  defaultRerender()
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('スライダーの選択', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期値は0である
  expect(getLevel(result)).toBe(0)
  expect(getByRole('slider')).toHaveValue('0')

  // 値を1にする
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(getByRole('slider'), { target: { value: '1' } })
  defaultRerender()
  expect(getLevel(result)).toBe(1)
  expect(getByRole('slider')).toHaveValue('1')

  // 値を10にする
  fireEvent.change(getByRole('slider'), { target: { value: '10' } })
  defaultRerender()
  expect(getLevel(result)).toBe(10)
  expect(getByRole('slider')).toHaveValue('10')

  // 値を11にしようとすると10になる
  fireEvent.change(getByRole('slider'), { target: { value: '11' } })
  defaultRerender()
  expect(getLevel(result)).toBe(10)
  expect(getByRole('slider')).toHaveValue('10')

  // 値を17にする
  fireEvent.change(getByRole('slider'), { target: { value: '17' } })
  defaultRerender()
  expect(getLevel(result)).toBe(17)
  expect(getByRole('slider')).toHaveValue('17')

  // 値を16にしようとすると17になる
  fireEvent.change(getByRole('slider'), { target: { value: '16' } })
  defaultRerender()
  expect(getLevel(result)).toBe(17)
  expect(getByRole('slider')).toHaveValue('17')

  // リセットすると値は0になる
  await act(() => getResetFn(result)())
  defaultRerender()
  expect(getLevel(result)).toBe(0)
  expect(getByRole('slider')).toHaveValue('0')
})
