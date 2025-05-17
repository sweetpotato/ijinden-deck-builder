// SPDX-License-Identifier: MIT

import { act } from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, renderHook } from '@testing-library/react'

import useDeck from './useDeck'

afterEach(cleanup)

test('単純な増減', async () => {
  const { result } = renderHook(() => useDeck([], []))
  let [main, side, dispatch] = result.current
  expect(main.size).toBe(0)
  expect(side.size).toBe(0)

  // [['R-1', 1]], []
  await act(() => dispatch.incrementMain('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(side.size).toBe(0)

  // [['R-1', 2]], []
  await act(() => dispatch.incrementMain('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(2)
  expect(side.size).toBe(0)

  // [['R-1', 2], ['R-2', 1]], []
  await act(() => dispatch.incrementMain('R-2'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(2)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(1)
  expect(side.size).toBe(0)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1]]
  await act(() => dispatch.incrementSide('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(2)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(1)
  expect(side.size).toBe(1)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1], ['R-3', 1]]
  await act(() => dispatch.incrementSide('R-3'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(2)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(1)
  expect(side.size).toBe(2)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(1)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => dispatch.incrementSide('R-3'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(2)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(1)
  expect(side.size).toBe(2)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(2)

  // [['R-1', 1], ['R-2', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => dispatch.decrementMain('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(1)
  expect(side.size).toBe(2)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => dispatch.decrementMain('R-2'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(side.size).toBe(2)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-3', 2]]
  await act(() => dispatch.decrementSide('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(side.size).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-3', 1]]
  await act(() => dispatch.decrementSide('R-3'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(side.size).toBe(1)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(1)

  // [['R-1', 1], ['R-3', 1]], []
  await act(() => dispatch.moveOutSide('R-3'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(1)
  expect(main.has('R-3')).toBe(true)
  expect(main.get('R-3')).toBe(1)
  expect(side.size).toBe(0)

  // [['R-3', 1]], [['R-1', 1]]
  await act(() => dispatch.moveOutMain('R-1'))
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(1)
  expect(main.has('R-3')).toBe(true)
  expect(main.get('R-3')).toBe(1)
  expect(side.size).toBe(1)
  expect(side.has('R-1')).toBe(true)
  expect(side.get('R-1')).toBe(1)
})

test('セットとクリア', async () => {
  const { result } = renderHook(() =>
    useDeck(
      [
        ['R-1', 4],
        ['R-2', 3],
      ],
      [
        ['R-3', 2],
        ['R-4', 1],
      ]
    )
  )
  let [main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('R-1')).toBe(true)
  expect(main.get('R-1')).toBe(4)
  expect(main.has('R-2')).toBe(true)
  expect(main.get('R-2')).toBe(3)
  expect(side.size).toBe(2)
  expect(side.has('R-3')).toBe(true)
  expect(side.get('R-3')).toBe(2)
  expect(side.has('R-4')).toBe(true)
  expect(side.get('R-4')).toBe(1)

  await act(() =>
    dispatch.setFromEntries(
      [
        ['B-1', 1],
        ['B-2', 2],
      ],
      [
        ['B-3', 3],
        ['B-4', 4],
      ]
    )
  )
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(2)
  expect(main.has('B-1')).toBe(true)
  expect(main.get('B-1')).toBe(1)
  expect(main.has('B-2')).toBe(true)
  expect(main.get('B-2')).toBe(2)
  expect(side.size).toBe(2)
  expect(side.has('B-3')).toBe(true)
  expect(side.get('B-3')).toBe(3)
  expect(side.has('B-4')).toBe(true)
  expect(side.get('B-4')).toBe(4)

  await act(() => dispatch.clear())
  ;[main, side, dispatch] = result.current
  expect(main.size).toBe(0)
  expect(side.size).toBe(0)
})
