// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  ImageCardWithToggleOpaque,
  ImageCardWithToggleTransparent,
} from './ImageCardWithToggle'

afterEach(cleanup)

test('ガーディアンのレンダリング', async () => {
  const continueSimulator = vi.fn()
  const { rerender, findByRole } = render(
    <ImageCardWithToggleOpaque continueSimulator={continueSimulator} />
  )
  expect(continueSimulator.mock.calls.length).toBe(0)

  let buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-opaque')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(1)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(2)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-red')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(3)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-blue')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(4)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-yellow')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(5)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-white')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(6)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-black')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(7)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(<ImageCardWithToggleOpaque continueSimulator={continueSimulator} />)

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')
})

test('初期手札のレンダリング', async () => {
  const continueSimulator = vi.fn()
  const { rerender, findByRole } = render(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )
  expect(continueSimulator.mock.calls.length).toBe(0)

  let buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(1)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-red')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(2)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-blue')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(3)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-yellow')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(4)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-white')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(5)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-black')

  await userEvent.click(buttonToggle)
  expect(continueSimulator.mock.calls.length).toBe(6)
  expect(continueSimulator.mock.lastCall.length).toBe(0)

  rerender(
    <ImageCardWithToggleTransparent continueSimulator={continueSimulator} />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')
})
