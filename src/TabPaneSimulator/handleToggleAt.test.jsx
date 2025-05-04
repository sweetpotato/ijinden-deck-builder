import { cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import handleToggleAt from './handleToggleAt'
import enumToggle from './enumToggle'

afterEach(cleanup)

test('指定したインデックスを変更する', () => {
  const setToggles = vi.fn()
  const continueSimulator = vi.fn()
  handleToggleAt(
    setToggles,
    [
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
    ],
    0,
    continueSimulator
  )

  expect(setToggles.mock.calls.length).toBe(1)
  expect(setToggles.mock.lastCall.length).toBe(1)
  expect(setToggles.mock.lastCall[0]).toEqual([
    enumToggle.TRANSPARENT,
    enumToggle.OPAQUE,
    enumToggle.OPAQUE,
    enumToggle.OPAQUE,
  ])

  expect(continueSimulator.mock.calls.length).toBe(1)
  expect(continueSimulator.mock.lastCall.length).toBe(0)
})
