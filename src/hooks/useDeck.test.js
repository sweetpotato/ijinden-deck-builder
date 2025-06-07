// SPDX-License-Identifier: MIT

import { act } from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, renderHook } from '@testing-library/react'

import useDeck from './useDeck'

function getMain(result) {
  return result.current[0]
}

function getSide(result) {
  return result.current[1]
}

function getDispatch(result) {
  return result.current[2]
}

afterEach(cleanup)

test('単純な増減', async () => {
  const { result } = renderHook(() => useDeck([], []))
  expect(getMain(result).size).toBe(0)
  expect(getSide(result).size).toBe(0)

  // [['R-1', 1]], []
  await act(() => getDispatch(result).incrementMain('R-1'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getSide(result).size).toBe(0)

  // [['R-1', 2]], []
  await act(() => getDispatch(result).incrementMain('R-1'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(2)
  expect(getSide(result).size).toBe(0)

  // [['R-1', 2], ['R-2', 1]], []
  await act(() => getDispatch(result).incrementMain('R-2'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(2)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(1)
  expect(getSide(result).size).toBe(0)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1]]
  await act(() => getDispatch(result).incrementSide('R-1'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(2)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(1)
  expect(getSide(result).size).toBe(1)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1], ['R-3', 1]]
  await act(() => getDispatch(result).incrementSide('R-3'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(2)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(1)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(1)

  // [['R-1', 2], ['R-2', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => getDispatch(result).incrementSide('R-3'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(2)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(1)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(2)

  // [['R-1', 1], ['R-2', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => getDispatch(result).decrementMain('R-1'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(1)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-1', 1], ['R-3', 2]]
  await act(() => getDispatch(result).decrementMain('R-2'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-3', 2]]
  await act(() => getDispatch(result).decrementSide('R-1'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getSide(result).size).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(2)

  // [['R-1', 1]], [['R-3', 1]]
  await act(() => getDispatch(result).decrementSide('R-3'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getSide(result).size).toBe(1)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(1)

  // [['R-1', 1], ['R-3', 1]], []
  await act(() => getDispatch(result).moveOutSide('R-3'))
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(1)
  expect(getMain(result).has('R-3')).toBe(true)
  expect(getMain(result).get('R-3')).toBe(1)
  expect(getSide(result).size).toBe(0)

  // [['R-3', 1]], [['R-1', 1]]
  await act(() => getDispatch(result).moveOutMain('R-1'))
  expect(getMain(result).size).toBe(1)
  expect(getMain(result).has('R-3')).toBe(true)
  expect(getMain(result).get('R-3')).toBe(1)
  expect(getSide(result).size).toBe(1)
  expect(getSide(result).has('R-1')).toBe(true)
  expect(getSide(result).get('R-1')).toBe(1)
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
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('R-1')).toBe(true)
  expect(getMain(result).get('R-1')).toBe(4)
  expect(getMain(result).has('R-2')).toBe(true)
  expect(getMain(result).get('R-2')).toBe(3)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('R-3')).toBe(true)
  expect(getSide(result).get('R-3')).toBe(2)
  expect(getSide(result).has('R-4')).toBe(true)
  expect(getSide(result).get('R-4')).toBe(1)

  await act(() =>
    getDispatch(result).setFromEntries(
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
  expect(getMain(result).size).toBe(2)
  expect(getMain(result).has('B-1')).toBe(true)
  expect(getMain(result).get('B-1')).toBe(1)
  expect(getMain(result).has('B-2')).toBe(true)
  expect(getMain(result).get('B-2')).toBe(2)
  expect(getSide(result).size).toBe(2)
  expect(getSide(result).has('B-3')).toBe(true)
  expect(getSide(result).get('B-3')).toBe(3)
  expect(getSide(result).has('B-4')).toBe(true)
  expect(getSide(result).get('B-4')).toBe(4)

  await act(() => getDispatch(result).clear())
  expect(getMain(result).size).toBe(0)
  expect(getSide(result).size).toBe(0)
})
