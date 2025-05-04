import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'

import ImageCardWithToggle from './ImageCardWithToggle'
import enumToggle from './enumToggle'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

test('レンダリング', async () => {
  const handleToggleAt = vi.fn()
  const { findByRole } = render(
    <ImageCardWithToggle
      toggle={enumToggle.OPAQUE}
      handleToggleAt={handleToggleAt}
      index={0}
    />
  )
  const buttonToggle = await findByRole('button')
  expect(buttonToggle).toBeVisible()
  expect(buttonToggle).toHaveClass('btn-toggled-opaque')

  await userEvent.click(buttonToggle)
  expect(handleToggleAt.mock.calls.length).toBe(1)
  expect(handleToggleAt.mock.lastCall.length).toBe(1)
  expect(handleToggleAt.mock.lastCall[0]).toBe(0)
})
