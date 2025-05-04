import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'

import ImageCardWithToggle from './ImageCardWithToggle'
import enumToggle from './enumToggle'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

test('ガーディアンのレンダリング', async () => {
  const handleToggleAt = vi.fn()
  const { rerender, findByRole } = render(
    <ImageCardWithToggle
      toggle={enumToggle.OPAQUE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )
  expect(handleToggleAt.mock.calls.length).toBe(0)

  let buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-opaque')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(1)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.TRANSPARENT}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(2)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.RED}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-red')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(3)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.BLUE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-blue')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(4)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.YELLOW}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-yellow')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(5)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.WHITE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-white')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(6)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.BLACK}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-black')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(7)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.TRANSPARENT}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')
})

test('初期手札のレンダリング', async () => {
  const handleToggleAt = vi.fn()
  const { rerender, findByRole } = render(
    <ImageCardWithToggle
      toggle={enumToggle.TRANSPARENT}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )
  expect(handleToggleAt.mock.calls.length).toBe(0)

  let buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(1)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.RED}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-red')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(2)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.BLUE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-blue')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(3)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.YELLOW}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-yellow')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(4)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.WHITE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-white')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(5)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.BLACK}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-black')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(6)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)

  rerender(
    <ImageCardWithToggle
      toggle={enumToggle.TRANSPARENT}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )

  buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-transparent')
})
