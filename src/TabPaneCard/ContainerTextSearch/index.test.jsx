// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useContainerTextSearch from '.'

function defaultRender() {
  const { result } = renderHook(() => useContainerTextSearch())
  const { rerender, getByRole } = render(result.current[2]())
  const defaultRerender = () => rerender(result.current[2]())
  return { result, defaultRerender, getByRole }
}

afterEach(cleanup)

test('レンダリング', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()
  let [keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

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
  ;[keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual(['けんしん'])
  expect(includesTraitAndLegacy).toBe(true)

  defaultRerender()
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
  ;[keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual(['けんしん'])
  expect(includesTraitAndLegacy).toBe(false)

  defaultRerender()
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
  ;[keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(false)

  defaultRerender()
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
  const { result, defaultRerender, getByRole } = defaultRender()
  let [keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

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
  ;[keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual(['ハイケイ', 'ドロー'])
  expect(includesTraitAndLegacy).toBe(true)

  defaultRerender()
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
  ;[keywords, includesTraitAndLegacy] = result.current
  expect(keywords).toEqual([])
  expect(includesTraitAndLegacy).toBe(true)

  defaultRerender()
  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  buttonClear = getByRole('button')
  expect(buttonClear).toBeVisible()
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()
})
