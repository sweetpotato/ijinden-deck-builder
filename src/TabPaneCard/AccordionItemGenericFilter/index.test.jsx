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
  { value: 3, label: 'メイン' },
  { value: 4, label: 'エンド' },
]

const dataAreas = [
  { value: 0, label: '指定なし' },
  { value: 1, label: '山札' },
  { value: 2, label: '手札' },
  { value: 4, label: '魔力ゾーン' },
  { value: 8, label: '戦場' },
  { value: 16, label: '墓地' },
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

function defaultRenderHoook(title, data) {
  const { result } = renderHook(() =>
    useAccordionItemGenericFilter(title, data)
  )
  const defaultRender = () => {
    const { rerender, getByRole } = render(
      <Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>
    )
    const defaultRerender = () =>
      rerender(<Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>)
    return { defaultRerender, getByRole }
  }
  return { result, defaultRender }
}

afterEach(cleanup)

test('デフォルトのレンダリング1', () => {
  // 初期状態はゼロ
  const { result, defaultRender } = defaultRenderHoook('フェイズ', dataPhases)
  expect(getState(result)).toBe(0)

  // ラジオボタンが並んでいる
  const { getByRole } = defaultRender()
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
  expect(getByRole('button'), {
    name: /フェイズ/,
    expanded: false,
  }).toBeVisible()
})

test('デフォルトのレンダリング2', () => {
  // 初期状態はゼロ
  const { result, defaultRender } = defaultRenderHoook('場所', dataAreas)
  expect(getState(result)).toBe(0)

  // ラジオボタンが並んでいる
  const { getByRole } = defaultRender()
  expect(getByRole('radio', { name: '指定なし' })).toBeVisible()
  expect(getByRole('radio', { name: '指定なし' })).toBeChecked()
  expect(getByRole('radio', { name: '山札' })).toBeVisible()
  expect(getByRole('radio', { name: '山札' })).not.toBeChecked()
  expect(getByRole('radio', { name: '手札' })).toBeVisible()
  expect(getByRole('radio', { name: '手札' })).not.toBeChecked()
  expect(getByRole('radio', { name: '魔力ゾーン' })).toBeVisible()
  expect(getByRole('radio', { name: '魔力ゾーン' })).not.toBeChecked()
  expect(getByRole('radio', { name: '戦場' })).toBeVisible()
  expect(getByRole('radio', { name: '戦場' })).not.toBeChecked()
  expect(getByRole('radio', { name: '墓地' })).toBeVisible()
  expect(getByRole('radio', { name: '墓地' })).not.toBeChecked()

  // 最初のラジオボタンを得る
  const item = getByRole('listitem', { name: '場所' })
  expect(within(item).getByRole('radio', { name: '指定なし' })).toBeVisible()
  expect(within(item).getByRole('radio', { name: '指定なし' })).toBeChecked()

  // 開閉箇所はボタンとして得られる
  expect(getByRole('button'), {
    name: /場所/,
    expanded: false,
  }).toBeVisible()
})

test('ボタンを選択する', async () => {
  // 初期状態では「すべて」が選択されている
  const { result, defaultRender } = defaultRenderHoook('フェイズ', dataPhases)
  expect(getState(result)).toBe(0)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // スタートを選択する
  await userEvent.click(getByRole('radio', { name: 'スタート' }))
  expect(getState(result)).toBe(1)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // ドローを選択する
  await userEvent.click(getByRole('radio', { name: 'ドロー' }))
  expect(getState(result)).toBe(2)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // メインを選択する
  await userEvent.click(getByRole('radio', { name: 'メイン' }))
  expect(getState(result)).toBe(3)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // エンドを選択する
  await userEvent.click(getByRole('radio', { name: 'エンド' }))
  expect(getState(result)).toBe(4)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).toBeChecked()

  // 「すべて」を再度選択する
  await userEvent.click(getByRole('radio', { name: 'すべて' }))
  expect(getState(result)).toBe(0)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()
})

test('状態をリセットする', async () => {
  // 初期状態では「すべて」が選択されている
  const { result, defaultRender } = defaultRenderHoook('フェイズ', dataPhases)
  expect(getState(result)).toBe(0)
  const { defaultRerender, getByRole } = defaultRender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // 適当なボタンとしてスタートを選択する
  await userEvent.click(getByRole('radio', { name: 'スタート' }))
  expect(getState(result)).toBe(1)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  expect(getState(result)).toBe(0)
  defaultRerender()
  expect(getByRole('radio', { name: 'すべて' })).toBeChecked()
  expect(getByRole('radio', { name: 'スタート' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'ドロー' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'メイン' })).not.toBeChecked()
  expect(getByRole('radio', { name: 'エンド' })).not.toBeChecked()
})
