// SPDX-License-Identifier: MIT

import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
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

  // 見た目はボタンのチェックボックスが並んでいる
  expect(getByRole('checkbox', { name: 'すべて' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked() // 選択されている
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

  // ヘッダ部分はボタンとして得られる
  // prettier-ignore
  expect(getByRole('button', { name: /フェイズ/, expanded: false })).toBeVisible()
})

describe('チェックボックスの選択', () => {
  let result, defaultRerender, getByRole

  beforeEach(() => {
    const obj = defaultRender('フェイズ', dataPhases)
    result = obj.result
    defaultRerender = obj.defaultRerender
    getByRole = obj.getByRole

    // 初期状態では「すべて」が選択されている
    expect(getState(result)).toBe(0)
    expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
    expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
    expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
    expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
    expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
  })

  describe('最後は「すべて」を選択してリセットする', () => {
    afterEach(async () => {
      await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
      defaultRerender()

      expect(getState(result)).toBe(0)
      expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('スタートを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('ドローを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(2)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('メインを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(4)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('エンドを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(8)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })

    test('全項目を選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(3)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(7)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(15)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })

    test('スタートとエンドを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(9)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })
  })

  describe('最後はリセット関数を呼び出してリセットする', () => {
    afterEach(async () => {
      await act(() => getResetFn(result)())
      defaultRerender()

      expect(getState(result)).toBe(0)
      expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('スタートを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('ドローを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(2)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('メインを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(4)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('エンドを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(8)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })

    test('全項目を選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(3)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(7)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(15)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })

    test('スタートとエンドを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(9)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()
    })
  })

  describe('チェックボックスを再選択する', () => {
    // このグループの各テストは最後に状態を「すべて」に戻してから終了すること
    afterEach(() => {
      expect(getState(result)).toBe(0)
      expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()
    })

    test('スタートを再選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()
    })

    test('ドローを再選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(2)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()
    })

    test('メインを再選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(4)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()
    })

    test('エンドを再選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(8)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()
    })

    test('全項目を再選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(3)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(7)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(15)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(14)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'ドロー' }))
      defaultRerender()

      expect(getState(result)).toBe(12)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'メイン' }))
      defaultRerender()

      expect(getState(result)).toBe(8)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()
    })

    test('スタートとエンドを選択する', async () => {
      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(1)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).not.toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()

      expect(getState(result)).toBe(9)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'スタート' }))
      defaultRerender()

      expect(getState(result)).toBe(8)
      expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'スタート' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'ドロー' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'メイン' })).not.toBeChecked()
      expect(getByRole('checkbox', { name: 'エンド' })).toBeChecked()

      await userEvent.click(getByRole('checkbox', { name: 'エンド' }))
      defaultRerender()
    })
  })
})
