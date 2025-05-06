// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useContainerTextSearch from './useContainerTextSearch'

afterEach(cleanup)

test('レンダリング', async () => {
  const { result } = renderHook(() => useContainerTextSearch())
  let [keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

  const { rerender, getByRole } = render(renderContainer())
  let textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  let buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  let checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  // デフォルトではチェックされている
  expect(checkbox).toBeChecked()

  // テキストボックスに「けんしん」と入力する
  await userEvent.type(textbox, 'けんしん') // 4文字
  ;[keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual(['けんしん'])
  expect(includesTraitAndLegacy).toBe(true)

  rerender(renderContainer())
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('けんしん')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()

  // チェックボックスをタップする
  await userEvent.click(checkbox)
  ;[keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual(['けんしん'])
  expect(includesTraitAndLegacy).toBe(false)

  rerender(renderContainer())
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('けんしん')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).not.toBeChecked()

  // クリアボタンを押す
  await userEvent.click(buttonClear)
  ;[keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(false)

  rerender(renderContainer())
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).not.toBeChecked()
})

test('スペース区切りのキーワード列', async () => {
  const { result } = renderHook(() => useContainerTextSearch())
  let [keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

  const { rerender, getByRole } = render(renderContainer())
  let textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  let buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  let checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()

  // テキストボックスに「ハイケイ ドロー 」と入力する (末尾の空白文字に注意)
  await userEvent.type(textbox, 'ハイケイ ドロー ')
  ;[keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual(['ハイケイ', 'ドロー'])
  expect(includesTraitAndLegacy).toBe(true)

  rerender(renderContainer())
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('ハイケイ ドロー ')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()

  // クリアボタンを押す
  await userEvent.click(buttonClear)
  ;[keywords, includesTraitAndLegacy, renderContainer] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

  rerender(renderContainer())
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()
})
