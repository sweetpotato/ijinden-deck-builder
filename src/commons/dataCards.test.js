// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest'

import {
  dataCardsArrayForTable,
  dataCardsArrayForDeck,
  dataCardsMap,
  encodeDeck,
  decodeDeck,
} from './dataCards'

test('dataCardsArrayForTable は orderTable 順', () => {
  expect(Array.isArray(dataCardsArrayForTable)).toBe(true)
  const { length } = dataCardsArrayForTable
  expect(dataCardsArrayForTable[0].orderTable).toBe(1)
  // ヴィクトリア女王 (SSR) を考慮
  expect(dataCardsArrayForTable[length - 1].orderTable).toBe(length + 1)
})

test('dataCardsArrayForDeck は orderDeck 順', () => {
  expect(Array.isArray(dataCardsArrayForDeck)).toBe(true)
  const { length } = dataCardsArrayForDeck
  expect(dataCardsArrayForDeck[0].orderDeck).toBe(1)
  // ヴィクトリア女王 (SSR) を考慮
  expect(dataCardsArrayForDeck[length - 1].orderDeck).toBe(length + 1)
})

test('dataCardsMap は Map 型', () => {
  expect(dataCardsMap instanceof Map).toBe(true)
})

test('各 dataCards の要素数は同じ', () => {
  const lengthTable = dataCardsArrayForTable.length
  const lengthDeck = dataCardsArrayForDeck.length
  const sizeMap = dataCardsMap.size
  expect(typeof lengthTable).toBe('number')
  expect(typeof lengthDeck).toBe('number')
  expect(typeof sizeMap).toBe('number')
  expect(sizeMap).toBe(lengthTable)
  expect(sizeMap).toBe(lengthDeck)
})

test('登録されているカードはすべてバージョン1でエンコード可', () => {
  dataCardsArrayForTable.forEach((e) => {
    // ASCII 'B' means binary 1
    expect(encodeDeck([[e.id, 1]], []).substring(0, 1)).toBe('B')
  })
})

test('登録されていないカードはすべてエンコード不可', () => {
  expect(encodeDeck([['R-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['R-14', 1]], [])).toBeFalsy()
  expect(encodeDeck([['B-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['B-14', 1]], [])).toBeFalsy()
  expect(encodeDeck([['G-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['G-14', 1]], [])).toBeFalsy()
  expect(encodeDeck([['1-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['1-81', 1]], [])).toBeFalsy()
  expect(encodeDeck([['Y-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['Y-14', 1]], [])).toBeFalsy()
  expect(encodeDeck([['2-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['2-81', 1]], [])).toBeFalsy()
  expect(encodeDeck([['P-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['P-17', 1]], [])).toBeFalsy()
  expect(encodeDeck([['3-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['3-82', 1]], [])).toBeFalsy()
  expect(encodeDeck([['4-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['4-82', 1]], [])).toBeFalsy()
  expect(encodeDeck([['5-00', 1]], [])).toBeFalsy()
  expect(encodeDeck([['5-01', 1]], [])).toBeFalsy()
})

test('順序の違いはエンコード時に正規化される', () => {
  const code1 = encodeDeck(
    [
      ['R-1', 3],
      ['R-2', 4],
    ],
    [],
  )
  const code2 = encodeDeck(
    [
      ['R-2', 4],
      ['R-1', 3],
    ],
    [],
  )
  expect(code1).toBe(code2)
})

test('万が一0枚のカードが含まれていると失敗する', () => {
  expect(encodeDeck([['R-1', 0]], [])).toBeFalsy()
})

test('4枚まではバージョン1', () => {
  // ASCII 'B' means binary 1
  expect(encodeDeck([['R-1', 1]], []).substring(0, 1)).toBe('B')
  expect(encodeDeck([['R-1', 2]], []).substring(0, 1)).toBe('B')
  expect(encodeDeck([['R-1', 3]], []).substring(0, 1)).toBe('B')
  expect(encodeDeck([['R-1', 4]], []).substring(0, 1)).toBe('B')
})

test('5枚から64枚まではバージョン2', () => {
  // ASCII 'C' means binary 2
  expect(encodeDeck([['R-1', 5]], []).substring(0, 1)).toBe('C')
  expect(encodeDeck([['R-1', 6]], []).substring(0, 1)).toBe('C')
  expect(encodeDeck([['R-1', 63]], []).substring(0, 1)).toBe('C')
  expect(encodeDeck([['R-1', 64]], []).substring(0, 1)).toBe('C')
})

test('64枚以上はエンコードできない', () => {
  expect(encodeDeck([['R-1', 65]], [])).toBeFalsy()
  expect(encodeDeck([['R-1', 127]], [])).toBeFalsy()
  expect(encodeDeck([['R-1', 128]], [])).toBeFalsy()
  expect(encodeDeck([['R-1', 129]], [])).toBeFalsy()
})

test('エンコードしてデコードしたら元に戻る', () => {
  const code = encodeDeck([['R-1', 3]], [['R-2', 4]])
  const resultsDecode = decodeDeck(code)
  expect(resultsDecode).toBeTruthy()
  const [main, side] = resultsDecode
  expect(main).toEqual([['R-1', 3]])
  expect(side).toEqual([['R-2', 4]])
})

test('空のデッキを表すコードは通常は生成されないが正しい', () => {
  const results1 = decodeDeck('BAA')
  expect(results1).toBeTruthy()
  expect(results1[0]).toEqual([])
  expect(results1[1]).toEqual([])

  const results2 = decodeDeck('CAAA')
  expect(results2).toBeTruthy()
  expect(results2[0]).toEqual([])
  expect(results2[1]).toEqual([])
})

test('存在しないバージョンのコードは不正である', () => {
  expect(decodeDeck('bAA')).toBeFalsy()
  expect(decodeDeck('cAAA')).toBeFalsy()
  expect(decodeDeck('DAAAA')).toBeFalsy()
  expect(decodeDeck('1AA')).toBeFalsy()
  expect(decodeDeck('2AAA')).toBeFalsy()
})

test('ゼロセパレータがちょうど1つでないコードは不正である', () => {
  expect(decodeDeck('B')).toBeFalsy()
  expect(decodeDeck('BAAAA')).toBeFalsy()
  expect(decodeDeck('C')).toBeFalsy()
  expect(decodeDeck('CAAAAAA')).toBeFalsy()

  const code = encodeDeck([['R-1', 4]], [])
  expect(code).toBe('BBwAA')
  expect(decodeDeck('BBw')).toBeFalsy()
  expect(decodeDeck('BBwAAAA')).toBeFalsy()
  expect(decodeDeck('BAABwAA')).toBeFalsy()
  expect(decodeDeck('BAAAABw')).toBeFalsy()

  const code2 = encodeDeck([['R-1', 5]], [])
  expect(code2).toBe('CBAEAAA')
  expect(decodeDeck('CBAE')).toBeFalsy()
  expect(decodeDeck('CBAEAAAAAA')).toBeFalsy()
  expect(decodeDeck('CAAABAEAAA')).toBeFalsy()
  expect(decodeDeck('CAAAAAABAE')).toBeFalsy()
})

test('半端に欠けたコードは不正である', () => {
  const code1 = encodeDeck([['R-2', 4]], [['R-3', 1]])
  expect(code1).toBe('BCwAADA')
  expect(decodeDeck('BCwAAD')).toBeFalsy()
  expect(decodeDeck('BCwAAA')).toBeFalsy()
  expect(decodeDeck('BCwADA')).toBeFalsy()
  expect(decodeDeck('BCwADA')).toBeFalsy()
  expect(decodeDeck('BCAADA')).toBeFalsy()

  const code2 = encodeDeck([['R-1', 2]], [['R-2', 5]])
  expect(code2).toBe('CBABAAACAE')
  expect(decodeDeck('CBABAAACA')).toBeFalsy()
  expect(decodeDeck('CBABAAACE')).toBeFalsy()
  expect(decodeDeck('CBABAAAAE')).toBeFalsy()
  expect(decodeDeck('CBABAACAE')).toBeFalsy()
  expect(decodeDeck('CBAAAACAE')).toBeFalsy()
  expect(decodeDeck('CBBAAACAE')).toBeFalsy()
  expect(decodeDeck('CABAAACAE')).toBeFalsy()
})

test('緑黄ハイケイデッキの実例', () => {
  const main = [
    ['G-9', 4], // 阿弥陀堂
    ['1-43', 3], // 清少納言
    ['1-45', 2], // 行基
    ['1-49', 4], // 巨大古墳
    ['1-69', 2], // グリーンオーブ
    ['2-3', 2], // エイブラハム・リンカン
    ['2-26', 4], // ハリエット・ビーチャー・ストウ
    ['2-54', 1], // 蒸気機関車
    ['2-80', 4], // GYマーブルオーブ
    ['3-8', 3], // ジェーン・オースティン
    ['3-42', 2], // ルイス・キャロル
    ['3-55', 3], // 商館並ぶ人工島
    ['3-73', 4], // 怒りの種
    ['3-74', 2], // 苦しみの種
  ]
  const side = [
    ['1-38', 3], // 鴨長明
    ['1-45', 1], // 行基
    ['2-68', 3], // メロウ
    ['3-58', 3], // 茅葺き屋根の張出し舞台
  ]
  const code = encodeDeck(main, side)
  expect(code).toBe('BjwShURYxsRHSey6CUzsjOUbkt0uUAANhUBIjek')
  const resultsDecode = decodeDeck(code)
  expect(resultsDecode).toBeTruthy()
  expect(resultsDecode[0]).toEqual(main)
  expect(resultsDecode[1]).toEqual(side)
})

test('赤スターターデッキの実例', () => {
  const main = [
    ['R-1', 2],
    ['R-2', 2],
    ['R-3', 2],
    ['R-4', 2],
    ['R-5', 2],
    ['R-6', 2],
    ['R-7', 2],
    ['R-8', 2],
    ['R-9', 2],
    ['R-10', 2],
    ['R-11', 2],
    ['R-12', 2],
    ['R-13', 16],
  ]
  const code = encodeDeck(main, [])
  expect(code).toBe('CBABCABDABEABFABGABHABIABJABKABLABMABNAPAAA')
  const resultsDecode = decodeDeck(code)
  expect(resultsDecode).toBeTruthy()
  expect(resultsDecode[0]).toEqual(main)
  expect(resultsDecode[1]).toEqual([])
})
