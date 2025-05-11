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
import Dexie from 'dexie'

// アップグレード処理の実装は既知とする
const upgradeDeck = (deck) => {
  return deck.map(([id, numCopies]) => {
    switch (id) {
      case '4-01': {
        return ['4-1', numCopies]
      }
      case '4-02': {
        return ['4-2', numCopies]
      }
      case '4-03': {
        return ['4-3', numCopies]
      }
      case '4-04': {
        return ['4-4', numCopies]
      }
      case '4-05': {
        return ['4-5', numCopies]
      }
      case '4-06': {
        return ['4-6', numCopies]
      }
      case '4-07': {
        return ['4-7', numCopies]
      }
      case '4-08': {
        return ['4-8', numCopies]
      }
      case '4-09': {
        return ['4-9', numCopies]
      }
    }
    return [id, numCopies]
  })
}

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
  // 実際のデータベースを模倣した別のデータベースでテストする
  // DB操作やアップグレード処理などの内部実装も既知のものとする
  let dbTest = new Dexie('db-test')
  dbTest.version(1).stores({ decks: '++id' })
  // データベースを開いてデータを保存する
  const timestamp = new Date()
  await dbTest.open()
  await dbTest.decks.add({
    timestamp,
    main: [
      ['4-01', 1],
      ['4-02', 2],
      ['4-03', 3],
      ['4-04', 4],
      ['4-05', 1],
    ],
    side: [
      ['4-06', 2],
      ['4-07', 3],
      ['4-08', 4],
      ['4-09', 1],
    ],
  })
  let result = await dbTest.decks.orderBy(':id').reverse().toArray()
  expect(result.length).toBe(1)
  expect(result[0].timestamp).toEqual(timestamp)
  expect(result[0].main).toStrictEqual([
    ['4-01', 1],
    ['4-02', 2],
    ['4-03', 3],
    ['4-04', 4],
    ['4-05', 1],
  ])
  expect(result[0].side).toStrictEqual([
    ['4-06', 2],
    ['4-07', 3],
    ['4-08', 4],
    ['4-09', 1],
  ])

  // データベースを開き直してアップグレードする
  dbTest.close()
  dbTest = new Dexie('db-test')
  dbTest.version(1).stores({ decks: '++id' })
  dbTest
    .version(2)
    .stores({ decks: '++id' })
    .upgrade((transaction) => {
      return transaction
        .table('decks')
        .toCollection()
        .modify((deck) => {
          deck.main = upgradeDeck(deck.main)
          deck.side = upgradeDeck(deck.side)
        })
    })

  // アップグレードは open によってトリガーされる
  await dbTest.open()
  result = await dbTest.decks.orderBy(':id').reverse().toArray()
  expect(result.length).toBe(1)
  expect(result[0].timestamp).toEqual(timestamp)
  expect(result[0].main).toStrictEqual([
    ['4-1', 1],
    ['4-2', 2],
    ['4-3', 3],
    ['4-4', 4],
    ['4-5', 1],
  ])
  expect(result[0].side).toStrictEqual([
    ['4-6', 2],
    ['4-7', 3],
    ['4-8', 4],
    ['4-9', 1],
  ])
})
