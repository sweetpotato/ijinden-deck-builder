// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { useLiveQuery } from 'dexie-react-hooks'
import { afterEach, expect, test } from 'vitest'
import { cleanup, renderHook, waitFor } from '@testing-library/react'

import {
  dbAddDeck,
  dbBulkAddDecks,
  dbClearDecks,
  dbDeleteDeck,
  dbQueryDecks,
} from './db'

afterEach(async () => {
  await dbClearDecks()
  cleanup()
})

test('空のDBからは何も読み取れない', async () => {
  const { result } = renderHook(() => useLiveQuery(dbQueryDecks))
  // 初期値は undefined だが、しばらく経つと実際の値になる
  await waitFor(() => expect(result.current).not.toBeUndefined())
  expect(result.current).toStrictEqual([])
})

test('基本的な読み書き操作', async () => {
  const timestamp1 = new Date()
  const timestamp2 = new Date()
  const timestamp3 = new Date()
  await dbBulkAddDecks([
    { timestamp: timestamp1, main: [['R-1', 1]], side: [] },
    { timestamp: timestamp2, main: [['B-1', 2]], side: [['G-1', 3]] },
    { timestamp: timestamp3, main: [], side: [['Y-1', 4]] },
  ])

  const { result } = renderHook(() => useLiveQuery(dbQueryDecks))
  await waitFor(() => expect(result.current).not.toBeUndefined())
  expect(result.current.length).toBe(3)
  expect(result.current[0].timestamp).toEqual(timestamp3)
  expect(result.current[0].main).toStrictEqual([])
  expect(result.current[0].side).toStrictEqual([['Y-1', 4]])
  expect(result.current[1].timestamp).toEqual(timestamp2)
  expect(result.current[1].main).toStrictEqual([['B-1', 2]])
  expect(result.current[1].side).toStrictEqual([['G-1', 3]])
  expect(result.current[2].timestamp).toEqual(timestamp1)
  expect(result.current[2].main).toStrictEqual([['R-1', 1]])
  expect(result.current[2].side).toStrictEqual([])

  // 削除
  await dbDeleteDeck(2)
  await waitFor(() => expect(result.current.length).toBe(2))
  expect(result.current[0].timestamp).toEqual(timestamp3)
  expect(result.current[0].main).toStrictEqual([])
  expect(result.current[0].side).toStrictEqual([['Y-1', 4]])
  expect(result.current[1].timestamp).toEqual(timestamp1)
  expect(result.current[1].main).toStrictEqual([['R-1', 1]])
  expect(result.current[1].side).toStrictEqual([])

  // 追加
  const timestamp4 = new Date()
  await dbAddDeck({
    timestamp: timestamp4,
    main: [['1-1', 4]],
    side: [['2-1', 4]],
  })
  await waitFor(() => expect(result.current.length).toBe(3))
  expect(result.current[0].timestamp).toEqual(timestamp4)
  expect(result.current[0].main).toStrictEqual([['1-1', 4]])
  expect(result.current[0].side).toStrictEqual([['2-1', 4]])
  expect(result.current[1].timestamp).toEqual(timestamp3)
  expect(result.current[1].main).toStrictEqual([])
  expect(result.current[1].side).toStrictEqual([['Y-1', 4]])
  expect(result.current[2].timestamp).toEqual(timestamp1)
  expect(result.current[2].main).toStrictEqual([['R-1', 1]])
  expect(result.current[2].side).toStrictEqual([])
})

test('4-01から4-09まで', async () => {
  const timestamp = new Date()
  await dbBulkAddDecks([
    {
      timestamp,
      main: [
        ['4-01', 1],
        ['4-02', 1],
        ['4-03', 1],
        ['4-04', 1],
        ['4-05', 1],
        ['4-06', 1],
        ['4-07', 1],
        ['4-08', 1],
        ['4-09', 1],
      ],
      side: [],
    },
  ])

  const { result } = renderHook(() => useLiveQuery(dbQueryDecks))
  await waitFor(() => expect(result.current).not.toBeUndefined())
  expect(result.current.length).toBe(1)
  expect(result.current[0].timestamp).toEqual(timestamp)
  expect(result.current[0].main).toStrictEqual([
    ['4-01', 1],
    ['4-02', 1],
    ['4-03', 1],
    ['4-04', 1],
    ['4-05', 1],
    ['4-06', 1],
    ['4-07', 1],
    ['4-08', 1],
    ['4-09', 1],
  ])
  expect(result.current[0].side).toStrictEqual([])
})
