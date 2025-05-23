// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useContainerTextSearch from '.'

function defaultRender() {
  const { result } = renderHook(() => useContainerTextSearch())
  const { rerender, getByRole } = render(result.current[2]())
  const defaultRerender = () => rerender(result.current[2]())
  return { result, defaultRerender, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole } = defaultRender()

  // (キーワードを入力する) テキストボックスがある
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  // (クリア) ボタンがある
  const buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  // (特性や遺業能力を含めるか否かの) チェックボックスがある
  const checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()
})

test('キーワードの入力とクリア', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()
  await waitFor(() => expect(result.current[0]).toEqual([]))
  expect(getByRole('textbox')).toHaveValue('')

  // テキストボックスに「けんしん」と入力する
  await userEvent.type(getByRole('textbox'), 'けんしん')
  await waitFor(() => expect(result.current[0]).toEqual(['けんしん']))
  defaultRerender()
  expect(getByRole('textbox')).toHaveValue('けんしん')

  // クリアボタンを押す
  await userEvent.click(getByRole('button'))
  await waitFor(() => expect(result.current[0]).toEqual([]))
  defaultRerender()
  expect(getByRole('textbox')).toHaveValue('')
})

test('チェックボックスの切り替え', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()
  expect(result.current[1]).toBe(true)
  expect(getByRole('checkbox')).toBeChecked()

  // チェックを外す
  await userEvent.click(getByRole('checkbox'))
  expect(result.current[1]).toBe(false)
  defaultRerender()
  expect(getByRole('checkbox')).not.toBeChecked()
})

test('スペース区切りのキーワード列', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()
  await waitFor(() => expect(result.current[0]).toEqual([]))
  expect(getByRole('textbox')).toHaveValue('')

  // テキストボックスに「_ハイケイ__ドロー_」と入力する (アンダーバーは空白文字)
  await userEvent.type(getByRole('textbox'), ' ハイケイ  ドロー ')
  await waitFor(() => expect(result.current[0]).toEqual(['ハイケイ', 'ドロー']))
  defaultRerender()
  expect(getByRole('textbox')).toHaveValue(' ハイケイ  ドロー ')
})
