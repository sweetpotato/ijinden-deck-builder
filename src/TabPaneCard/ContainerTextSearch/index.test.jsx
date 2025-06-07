// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useContainerTextSearch from '.'

function getKeywords(result) {
  return result.current[0]
}

function getIncludes(result) {
  return result.current[1]
}

function getRenderFn(result) {
  return result.current[2]
}

function defaultRender() {
  const { result } = renderHook(() => useContainerTextSearch())
  const { rerender, getByPlaceholderText, getByRole } = render(
    getRenderFn(result)()
  )
  const defaultRerender = () => rerender(getRenderFn(result)())
  return { result, defaultRerender, getByPlaceholderText, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole } = defaultRender()

  // キーワードを入力するテキストボックスがある
  expect(getByRole('textbox')).toBeVisible()
  expect(getByRole('textbox')).toHaveValue('')
  // クリアボタンがある
  expect(getByRole('button')).toBeVisible()
  // 特性や遺業能力を含めるか否かのチェックボックスがある
  expect(getByRole('checkbox')).toBeVisible()
  expect(getByRole('checkbox')).toBeChecked()
})

test('アクセシビリティ', () => {
  const { getByPlaceholderText, getByRole } = defaultRender()

  expect(getByPlaceholderText('カード名やルールテキストで検索')).toHaveValue('')
  expect(getByRole('button', { name: 'クリア' })).toBeVisible()
  // prettier-ignore
  expect(getByRole('checkbox', { name: '特性と遺業能力も検索する' })).toBeChecked()
})

test('キーワードの入力とクリア', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  await waitFor(() => expect(getKeywords(result)).toEqual([]))
  expect(getByRole('textbox')).toHaveValue('')

  // テキストボックスに「けんしん」と入力する
  await userEvent.type(getByRole('textbox'), 'けんしん')
  defaultRerender()

  await waitFor(() => expect(getKeywords(result)).toEqual(['けんしん']))
  expect(getByRole('textbox')).toHaveValue('けんしん')

  // クリアボタンを押す
  await userEvent.click(getByRole('button'))
  defaultRerender()

  await waitFor(() => expect(getKeywords(result)).toEqual([]))
  expect(getByRole('textbox')).toHaveValue('')
})

test('チェックボックスの切り替え', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  expect(getIncludes(result)).toBe(true)
  expect(getByRole('checkbox')).toBeChecked()

  // チェックを外す
  await userEvent.click(getByRole('checkbox'))
  defaultRerender()

  expect(getIncludes(result)).toBe(false)
  expect(getByRole('checkbox')).not.toBeChecked()
})

test('スペース区切りのキーワード列', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  await waitFor(() => expect(getKeywords(result)).toEqual([]))
  expect(getByRole('textbox')).toHaveValue('')

  // テキストボックスに「_ハイケイ__ドロー_」と入力する (アンダーバーは空白文字)
  await userEvent.type(getByRole('textbox'), ' ハイケイ  ドロー ')
  defaultRerender()

  // prettier-ignore
  await waitFor(() => expect(getKeywords(result)).toEqual(['ハイケイ', 'ドロー']))
  expect(getByRole('textbox')).toHaveValue(' ハイケイ  ドロー ')
})
