import { cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import handleToggleAt from './handleToggleAt'
import enumToggle from './enumToggle'
import { enumActionSimulator } from '.'

afterEach(cleanup)

test('指定したインデックスを変更する', () => {
  const setToggles = vi.fn()
  const dispatch = vi.fn()
  handleToggleAt(
    setToggles,
    [
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
    ],
    0,
    dispatch
  )

  expect(setToggles.mock.calls.length).toBe(1)
  expect(setToggles.mock.lastCall.length).toBe(1)
  expect(setToggles.mock.lastCall[0]).toEqual([
    enumToggle.TRANSPARENT,
    enumToggle.OPAQUE,
    enumToggle.OPAQUE,
    enumToggle.OPAQUE,
  ])

  expect(dispatch.mock.calls.length).toBe(1)
  expect(dispatch.mock.lastCall.length).toBe(1)
  expect(dispatch.mock.lastCall[0]).toBe(enumActionSimulator.CONTINUE)
})
