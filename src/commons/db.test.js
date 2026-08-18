// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { afterEach, expect, test } from 'vitest'
import { cleanup, renderHook, waitFor } from '@testing-library/react'

import {
  dbAddDeck,
  dbPutFavorite,
  dbBulkAddDecks,
  dbClearDecks,
  dbClearFavorites,
  dbDeleteDeck,
  dbDeleteFavorite,
  dbQueryDecks,
  dbQueryFavorites,
} from './db'

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
  await dbClearFavorites()
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

test('お気に入りカードの直接操作', async () => {
  const { result } = renderHook(() => useLiveQuery(dbQueryFavorites))
  await waitFor(() => expect(result.current).not.toBeUndefined())
  expect(result.current).toStrictEqual([])

  // 追加
  await dbPutFavorite('R-1')
  await waitFor(() => expect(result.current.length).toBe(1))
  expect(result.current).toStrictEqual([{ id: 'R-1' }])

  await dbPutFavorite('R-2')
  await waitFor(() => expect(result.current.length).toBe(2))
  expect(result.current).toStrictEqual([{ id: 'R-1' }, { id: 'R-2' }])

  await dbPutFavorite('R-3')
  await waitFor(() => expect(result.current.length).toBe(3))
  expect(result.current).toStrictEqual([
    { id: 'R-1' },
    { id: 'R-2' },
    { id: 'R-3' },
  ])

  // 削除
  await dbDeleteFavorite('R-2')
  await waitFor(() => expect(result.current.length).toBe(2))
  expect(result.current).toStrictEqual([{ id: 'R-1' }, { id: 'R-3' }])
})

test('お気に入りカードの Set ラップ操作', async () => {
  const { result } = renderHook(() => useLiveQuery(dbQueryFavorites))
  await waitFor(() => expect(result.current).not.toBeUndefined())

  let favorites = new Set(result.current)
  expect(favorites.size).toBe(0)

  // 追加
  await dbPutFavorite('R-1')
  await waitFor(() => expect(result.current.length).toBe(1))
  favorites = new Set(result.current.map(({ id }) => id))
  expect(favorites.has('R-1')).toBeTruthy()

  await dbPutFavorite('R-2')
  await waitFor(() => expect(result.current.length).toBe(2))
  favorites = new Set(result.current.map(({ id }) => id))
  expect(favorites.has('R-1')).toBeTruthy()
  expect(favorites.has('R-2')).toBeTruthy()

  await dbPutFavorite('R-3')
  await waitFor(() => expect(result.current.length).toBe(3))
  favorites = new Set(result.current.map(({ id }) => id))
  expect(favorites.has('R-1')).toBeTruthy()
  expect(favorites.has('R-2')).toBeTruthy()
  expect(favorites.has('R-3')).toBeTruthy()

  // 削除
  await dbDeleteFavorite('R-2')
  await waitFor(() => expect(result.current.length).toBe(2))
  favorites = new Set(result.current.map(({ id }) => id))
  expect(favorites.has('R-1')).toBeTruthy()
  expect(favorites.has('R-2')).toBeFalsy()
  expect(favorites.has('R-3')).toBeTruthy()
})

test('お気に入りカードの並行 Put', async () => {
  expect(await dbQueryFavorites()).toStrictEqual([])

  const p0 = dbPutFavorite('R-1')
  const p1 = dbPutFavorite('R-1')
  const p2 = dbPutFavorite('R-1')
  const p3 = dbPutFavorite('R-1')
  const p4 = dbPutFavorite('R-1')
  const p5 = dbPutFavorite('R-1')
  const p6 = dbPutFavorite('R-1')
  const p7 = dbPutFavorite('R-1')
  const p8 = dbPutFavorite('R-1')
  const p9 = dbPutFavorite('R-1')

  await expect(p0).resolves.toEqual('R-1')
  await expect(p1).resolves.toEqual('R-1')
  await expect(p2).resolves.toEqual('R-1')
  await expect(p3).resolves.toEqual('R-1')
  await expect(p4).resolves.toEqual('R-1')
  await expect(p5).resolves.toEqual('R-1')
  await expect(p6).resolves.toEqual('R-1')
  await expect(p7).resolves.toEqual('R-1')
  await expect(p8).resolves.toEqual('R-1')
  await expect(p9).resolves.toEqual('R-1')

  expect(await dbQueryFavorites()).toStrictEqual([{ id: 'R-1' }])
})

test('お気に入りカードの並行 Delete', async () => {
  await dbPutFavorite('R-1')
  expect(await dbQueryFavorites()).toStrictEqual([{ id: 'R-1' }])

  const p0 = dbDeleteFavorite('R-1')
  const p1 = dbDeleteFavorite('R-1')
  const p2 = dbDeleteFavorite('R-1')
  const p3 = dbDeleteFavorite('R-1')
  const p4 = dbDeleteFavorite('R-1')
  const p5 = dbDeleteFavorite('R-1')
  const p6 = dbDeleteFavorite('R-1')
  const p7 = dbDeleteFavorite('R-1')
  const p8 = dbDeleteFavorite('R-1')
  const p9 = dbDeleteFavorite('R-1')

  await expect(p0).resolves.toBeUndefined()
  await expect(p1).resolves.toBeUndefined()
  await expect(p2).resolves.toBeUndefined()
  await expect(p3).resolves.toBeUndefined()
  await expect(p4).resolves.toBeUndefined()
  await expect(p5).resolves.toBeUndefined()
  await expect(p6).resolves.toBeUndefined()
  await expect(p7).resolves.toBeUndefined()
  await expect(p8).resolves.toBeUndefined()
  await expect(p9).resolves.toBeUndefined()

  expect(await dbQueryFavorites()).toStrictEqual([])
})

test('お気に入りカードの並行 Put/Delete (最後は Delete)', async () => {
  expect(await dbQueryFavorites()).toStrictEqual([])

  const p0 = dbPutFavorite('R-1')
  const p1 = dbDeleteFavorite('R-1')
  const p2 = dbPutFavorite('R-1')
  const p3 = dbDeleteFavorite('R-1')
  const p4 = dbPutFavorite('R-1')
  const p5 = dbDeleteFavorite('R-1')
  const p6 = dbPutFavorite('R-1')
  const p7 = dbDeleteFavorite('R-1')
  const p8 = dbPutFavorite('R-1')

  await expect(p0).resolves.toEqual('R-1')
  await expect(p1).resolves.toBeUndefined()
  await expect(p2).resolves.toEqual('R-1')
  await expect(p3).resolves.toBeUndefined()
  await expect(p4).resolves.toEqual('R-1')
  await expect(p5).resolves.toBeUndefined()
  await expect(p6).resolves.toEqual('R-1')
  await expect(p7).resolves.toBeUndefined()
  await expect(p8).resolves.toEqual('R-1')

  const p9 = dbDeleteFavorite('R-1')
  await expect(p9).resolves.toBeUndefined()

  expect(await dbQueryFavorites()).toStrictEqual([])
})

test('お気に入りカードの並行 Put/Delete (最後は Put)', async () => {
  expect(await dbQueryFavorites()).toStrictEqual([])

  const p0 = dbDeleteFavorite('R-1')
  const p1 = dbPutFavorite('R-1')
  const p2 = dbDeleteFavorite('R-1')
  const p3 = dbPutFavorite('R-1')
  const p4 = dbDeleteFavorite('R-1')
  const p5 = dbPutFavorite('R-1')
  const p6 = dbDeleteFavorite('R-1')
  const p7 = dbPutFavorite('R-1')
  const p8 = dbDeleteFavorite('R-1')

  await expect(p0).resolves.toBeUndefined()
  await expect(p1).resolves.toEqual('R-1')
  await expect(p2).resolves.toBeUndefined()
  await expect(p3).resolves.toEqual('R-1')
  await expect(p4).resolves.toBeUndefined()
  await expect(p5).resolves.toEqual('R-1')
  await expect(p6).resolves.toBeUndefined()
  await expect(p7).resolves.toEqual('R-1')
  await expect(p8).resolves.toBeUndefined()

  const p9 = dbPutFavorite('R-1')
  await expect(p9).resolves.toEqual('R-1')

  expect(await dbQueryFavorites()).toStrictEqual([{ id: 'R-1' }])
})

test('4-01から4-09まで', async () => {
  // 実際のデータベースを模倣した別のデータベースでテストする
  // DB操作やアップグレード処理などの内部実装も既知のものとする
  let dbTest = new Dexie('db-four-zero')
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
  dbTest = new Dexie('db-four-zero')
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

test('バージョン2からバージョン3へ', async () => {
  // 実際のデータベースを模倣した別のデータベースでテストする
  // DB操作やアップグレード処理などの内部実装も既知のものとする
  let dbTest = new Dexie('db-v2-v3')
  dbTest.version(2).stores({ decks: '++id' })
  // データベースを開いてデータを保存する
  const timestamp = new Date()
  await dbTest.open()
  await dbTest.decks.add({
    timestamp,
    main: [
      ['4-1', 1],
      ['4-2', 2],
      ['4-3', 3],
      ['4-4', 4],
      ['4-5', 1],
    ],
    side: [
      ['4-6', 2],
      ['4-7', 3],
      ['4-8', 4],
      ['4-9', 1],
    ],
  })
  let decks = await dbTest.decks.orderBy(':id').reverse().toArray()
  expect(decks.length).toBe(1)
  expect(decks[0].timestamp).toEqual(timestamp)
  expect(decks[0].main).toStrictEqual([
    ['4-1', 1],
    ['4-2', 2],
    ['4-3', 3],
    ['4-4', 4],
    ['4-5', 1],
  ])
  expect(decks[0].side).toStrictEqual([
    ['4-6', 2],
    ['4-7', 3],
    ['4-8', 4],
    ['4-9', 1],
  ])

  // データベースを開き直してアップグレードする
  dbTest.close()
  dbTest = new Dexie('db-v2-v3')
  dbTest.version(3).stores({ decks: '++id', favorites: 'id' })

  // アップグレードは open によってトリガーされる
  await dbTest.open()

  // decks は変わらず
  decks = await dbTest.decks.orderBy(':id').reverse().toArray()
  expect(decks.length).toBe(1)
  expect(decks[0].timestamp).toEqual(timestamp)
  expect(decks[0].main).toStrictEqual([
    ['4-1', 1],
    ['4-2', 2],
    ['4-3', 3],
    ['4-4', 4],
    ['4-5', 1],
  ])
  expect(decks[0].side).toStrictEqual([
    ['4-6', 2],
    ['4-7', 3],
    ['4-8', 4],
    ['4-9', 1],
  ])

  // favorites は空
  const favorites = await dbTest.favorites.toArray()
  expect(favorites).toStrictEqual([])
})
