// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ContainerTextSearch from './ContainerTextSearch'

afterEach(cleanup)

test('レンダリング', async () => {
  const handleChangeKeywords = vi.fn()
  const handleChangeIncludesTraitAndLegacy = vi.fn()
  const { rerender, getByRole } = render(
    <ContainerTextSearch
      handleChangeKeywords={handleChangeKeywords}
      handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
    />
  )
  expect(handleChangeKeywords.mock.calls.length).toBe(0)
  expect(handleChangeIncludesTraitAndLegacy.mock.calls.length).toBe(0)

  let textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  let checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  // デフォルトではチェックされている
  expect(checkbox).toBeChecked()

  // テキストボックスに「けんしん」と入力する
  await userEvent.type(textbox, 'けんしん') // 4文字

  expect(handleChangeKeywords.mock.calls.length).toBe(4)
  expect(handleChangeKeywords.mock.lastCall.length).toBe(1)
  // TODO defaultTarget が null になる
  expect(handleChangeKeywords.mock.lastCall[0].target.value).toBe('けんしん')
  expect(handleChangeIncludesTraitAndLegacy.mock.calls.length).toBe(0)

  rerender(
    <ContainerTextSearch
      handleChangeKeywords={handleChangeKeywords}
      handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
    />
  )

  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('けんしん')
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()

  // チェックボックスをタップする
  await userEvent.click(checkbox)

  expect(handleChangeKeywords.mock.calls.length).toBe(4)
  expect(handleChangeIncludesTraitAndLegacy.mock.calls.length).toBe(1)
  expect(handleChangeIncludesTraitAndLegacy.mock.lastCall.length).toBe(1)
  // TODO defaultTarget が null になる
  expect(
    handleChangeIncludesTraitAndLegacy.mock.lastCall[0].target.checked
  ).toBe(false)

  rerender(
    <ContainerTextSearch
      handleChangeKeywords={handleChangeKeywords}
      handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
    />
  )

  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('けんしん')
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).not.toBeChecked()
})

test('スペース区切りのキーワード列', async () => {
  const handleChangeKeywords = vi.fn()
  const handleChangeIncludesTraitAndLegacy = vi.fn()
  const { rerender, getByRole } = render(
    <ContainerTextSearch
      handleChangeKeywords={handleChangeKeywords}
      handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
    />
  )
  expect(handleChangeKeywords.mock.calls.length).toBe(0)
  expect(handleChangeIncludesTraitAndLegacy.mock.calls.length).toBe(0)

  let textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('')
  let checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()

  // テキストボックスに「ハイケイ ドロー」と入力する
  await userEvent.type(textbox, 'ハイケイ ドロー') // 8文字

  expect(handleChangeKeywords.mock.calls.length).toBe(8)
  expect(handleChangeKeywords.mock.lastCall.length).toBe(1)
  // TODO defaultTarget が null になる
  expect(handleChangeKeywords.mock.lastCall[0].target.value).toBe(
    'ハイケイ ドロー'
  )
  expect(handleChangeIncludesTraitAndLegacy.mock.calls.length).toBe(0)

  rerender(
    <ContainerTextSearch
      handleChangeKeywords={handleChangeKeywords}
      handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
    />
  )

  textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveValue('ハイケイ ドロー')
  checkbox = getByRole('checkbox')
  expect(checkbox).toBeVisible()
  expect(checkbox).toBeChecked()
})
