// SPDX-License-Identifier: MIT

import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAccordionItemGenericFilter from '.'

const dataPhases = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'スタート' },
  { value: 2, label: 'ドロー' },
  { value: 4, label: 'メイン' },
  { value: 8, label: 'エンド' },
]

function getState(result) {
  return result.current[0]
}

function getResetFn(result) {
  return result.current[1]
}

function getRenderFn(result) {
  return result.current[2]
}

function defaultRender(title, data) {
  const { result } = renderHook(() =>
    useAccordionItemGenericFilter(title, data),
  )
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>,
  )
  const defaultRerender = () =>
    rerender(<Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>)
  return { result, defaultRerender, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { result, getByRole } = defaultRender('フェイズ', dataPhases)

  // 初期状態はゼロ
  expect(getState(result)).toBe(0)

  // ラジオボタンが並んでいる
  expect(getByRole('radio', { name: 'すべて' })).toBeVisible()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).toBeVisible()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).toBeVisible()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).toBeVisible()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).toBeVisible()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // 最初のラジオボタンを得る
  const item = getByRole('listitem', { name: 'フェイズ' })
  expect(within(item).getByRole('radio', { name: 'すべて' })).toBeVisible()
  expect(within(item).getByRole('radio', { name: 'すべて' })).toBeChecked()

  // 開閉箇所はボタンとして得られる
  expect(
    getByRole('button', {
      name: /フェイズ/,
      expanded: false,
    }),
  ).toBeVisible()
})

test('ボタンを選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('radio', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // ドローを選択する
  await userEvent.click(getByRole('radio', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(2)
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // メインを選択する
  await userEvent.click(getByRole('radio', { name: 'メイン' }))
  defaultRerender()

  expect(getState(result)).toBe(4)
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // エンドを選択する
  await userEvent.click(getByRole('radio', { name: 'エンド' }))
  defaultRerender()

  expect(getState(result)).toBe(8)
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('radio', { name: 'すべて' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()
})

test('状態をリセットする', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // 適当なボタンとしてスタートを選択する
  await userEvent.click(getByRole('radio', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()
})
