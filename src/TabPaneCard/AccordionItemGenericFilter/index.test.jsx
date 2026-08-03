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

  // チェックボックスが並んでいる
  expect(getByRole('checkbox', { name: 'すべて' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // 最初のチェックボックスを得る
  const item = getByRole('listitem', { name: 'フェイズ' })
  expect(within(item).getByRole('checkbox', { name: 'すべて' })).toBeVisible()
  expect(within(item).getByRole('checkbox', { name: 'すべて' })).toBeChecked()

  // 開閉箇所はボタンとして得られる
  expect(
    getByRole('button', {
      name: /フェイズ/,
      expanded: false,
    }),
  ).toBeVisible()
})

test('ボタンをひとつ選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // ドローを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(2)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // メインを選択する
  await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
  defaultRerender()

  expect(getState(result)).toBe(4)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // エンドを選択する
  await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
  defaultRerender()

  expect(getState(result)).toBe(8)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
})

test('ボタンを再選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // スタートを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // ドローを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(2)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // ドローを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
})

test('ボタンを複数選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // さらにドローを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(3)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // さらにメインを選択する
  await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
  defaultRerender()

  expect(getState(result)).toBe(7)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // さらにエンドを選択する
  await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
  defaultRerender()

  expect(getState(result)).toBe(15)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

  // スタートを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(14)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

  // ドローを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(12)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

  // メインを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
  defaultRerender()

  expect(getState(result)).toBe(8)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

  // エンドを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
})

test('状態をリセットする', async () => {
  const { result, defaultRerender, getByRole } = defaultRender(
    'フェイズ',
    dataPhases,
  )

  // 初期状態では「すべて」が選択されている
  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
  defaultRerender()

  expect(getState(result)).toBe(1)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // ドローを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
  defaultRerender()

  expect(getState(result)).toBe(3)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getState(result)).toBe(0)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
})
