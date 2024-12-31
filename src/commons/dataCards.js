// SPDX-License-Identifier: MIT

import cards from './cards.json'

const ORDER_TABLE_HIJIKATA_TOSHIZO_PSR = 309 // 土方歳三 (PSR)
const ORDER_TABLE_CHARLEMAGNE_PSR = 390 // カール大帝 (PSR)

export const dataCardsArrayForTable = [...cards].sort(
  (a, b) => a.orderTable - b.orderTable
)
export const dataCardsArrayForDeck = [...cards].sort(
  (a, b) => a.orderDeck - b.orderDeck
)
export const dataCardsMap = new Map(
  cards.map((element) => [element.id, element])
)

// private use only
const dataCardsMapFromOrderTable = new Map(
  cards.map((element) => [element.orderTable, element])
)

const VERSION_V1 = 1
const NRCHARS_PER_CARD_V1 = 2
const NRBITS_ORDER_TABLE_V1 = 10
const NRBITS_NUM_COPIES_V1 = 2

const VERSION_V2 = 2
const NRCHARS_PER_CARD_V2 = 3
const NRBITS_ORDER_TABLE_V2 = 12
const NRBITS_NUM_COPIES_V2 = 6

// 'base64url' binary-to-ascii map
const entriesBinaryToAscii = [
  [0, 'A'],
  [1, 'B'],
  [2, 'C'],
  [3, 'D'],
  [4, 'E'],
  [5, 'F'],
  [6, 'G'],
  [7, 'H'],
  [8, 'I'],
  [9, 'J'],
  [10, 'K'],
  [11, 'L'],
  [12, 'M'],
  [13, 'N'],
  [14, 'O'],
  [15, 'P'],
  [16, 'Q'],
  [17, 'R'],
  [18, 'S'],
  [19, 'T'],
  [20, 'U'],
  [21, 'V'],
  [22, 'W'],
  [23, 'X'],
  [24, 'Y'],
  [25, 'Z'],
  [26, 'a'],
  [27, 'b'],
  [28, 'c'],
  [29, 'd'],
  [30, 'e'],
  [31, 'f'],
  [32, 'g'],
  [33, 'h'],
  [34, 'i'],
  [35, 'j'],
  [36, 'k'],
  [37, 'l'],
  [38, 'm'],
  [39, 'n'],
  [40, 'o'],
  [41, 'p'],
  [42, 'q'],
  [43, 'r'],
  [44, 's'],
  [45, 't'],
  [46, 'u'],
  [47, 'v'],
  [48, 'w'],
  [49, 'x'],
  [50, 'y'],
  [51, 'z'],
  [52, '0'],
  [53, '1'],
  [54, '2'],
  [55, '3'],
  [56, '4'],
  [57, '5'],
  [58, '6'],
  [59, '7'],
  [60, '8'],
  [61, '9'],
  [62, '-'],
  [63, '_'],
]
const mapBinaryToAscii = new Map(entriesBinaryToAscii)
const mapAsciiToBinary = new Map(entriesBinaryToAscii.map(([b, a]) => [a, b]))

// デッキオブジェクトをデッキコードにシリアライズする
export function encodeDeck(entriesMain, entriesSide) {
  // 優先度は v1 > v2
  if (isDeckSerializableV1(entriesMain) && isDeckSerializableV1(entriesSide)) {
    return encodeDeckV1(entriesMain, entriesSide)
  } else if (
    isDeckSerializableV2(entriesMain) &&
    isDeckSerializableV2(entriesSide)
  ) {
    return encodeDeckV2(entriesMain, entriesSide)
  }
  return null
}

// 通番1023まで・4枚まで (通常のデッキ)
function isDeckSerializableV1(entries) {
  return isDeckSerializable(
    NRBITS_ORDER_TABLE_V1,
    NRBITS_NUM_COPIES_V1,
    entries
  )
}

function encodeDeckV1(entriesMain, entriesSide) {
  return encodeDeckGeneric(
    VERSION_V1,
    NRBITS_ORDER_TABLE_V1,
    NRCHARS_PER_CARD_V1,
    entriesMain,
    entriesSide
  )
}

// 通番4095まで・64枚まで (主に何枚でも入れていいカードを使うデッキ)
function isDeckSerializableV2(entries) {
  return isDeckSerializable(
    NRBITS_ORDER_TABLE_V2,
    NRBITS_NUM_COPIES_V2,
    entries
  )
}

function encodeDeckV2(entriesMain, entriesSide) {
  return encodeDeckGeneric(
    VERSION_V2,
    NRBITS_ORDER_TABLE_V2,
    NRCHARS_PER_CARD_V2,
    entriesMain,
    entriesSide
  )
}

function isDeckSerializable(nrbitsOrderTable, nrbitsNumCopies, entries) {
  return entries.every(([id, numCopies]) => {
    const orderTable = dataCardsMap.get(id)?.orderTable
    return !!(
      orderTable >= 1 &&
      orderTable <= (1 << nrbitsOrderTable) - 1 &&
      orderTable !== ORDER_TABLE_HIJIKATA_TOSHIZO_PSR &&
      orderTable !== ORDER_TABLE_CHARLEMAGNE_PSR &&
      numCopies >= 1 &&
      numCopies <= 1 << nrbitsNumCopies
    )
  })
}

function encodeDeckGeneric(
  version,
  nrbitsOrderTable,
  nrcharsPerCard,
  entriesMain,
  entriesSide
) {
  let code = mapBinaryToAscii.get(version)
  code += serializeDeck(nrbitsOrderTable, nrcharsPerCard, entriesMain)
  for (let i = 0; i < nrcharsPerCard; ++i) {
    code += mapBinaryToAscii.get(0)
  }
  code += serializeDeck(nrbitsOrderTable, nrcharsPerCard, entriesSide)
  return code
}

function serializeDeck(nrbitsOrderTable, nrcharsPerCard, entriesDeck) {
  return entriesDeck.length <= 0
    ? ''
    : entriesDeck
        .map(([k, numCopies]) => ({
          orderTable: dataCardsMap.get(k).orderTable,
          numCopies,
        }))
        .sort((a, b) => a.orderTable - b.orderTable)
        .map(({ orderTable, numCopies }) => {
          let bin = orderTable | ((numCopies - 1) << nrbitsOrderTable)
          let asc = ''
          for (let i = 0; i < nrcharsPerCard; ++i) {
            asc += mapBinaryToAscii.get(bin & ((1 << 6) - 1))
            bin >>= 6
          }
          return asc
        })
        .join('')
}

// デッキコードを [メインデッキ, サイドデッキ] にデシリアライズする
export function decodeDeck(code) {
  // まずはざっくり base64url っぽいかを判定する
  if (!/^[-_a-zA-Z0-9]+$/.test(code)) {
    return null
  }

  // バージョン (先頭1文字=6ビット分) で分岐する
  const version = mapAsciiToBinary.get(code.charAt(0))
  switch (version) {
    case 1: {
      return decodeDeckV1(code)
    }
    case 2: {
      return decodeDeckV2(code)
    }
  }
  return null
}

function decodeDeckV1(code) {
  return decodeDeckGeneric(
    NRCHARS_PER_CARD_V1,
    NRBITS_ORDER_TABLE_V1,
    NRBITS_NUM_COPIES_V1,
    code
  )
}

function decodeDeckV2(code) {
  return decodeDeckGeneric(
    NRCHARS_PER_CARD_V2,
    NRBITS_ORDER_TABLE_V2,
    NRBITS_NUM_COPIES_V2,
    code
  )
}

function decodeDeckGeneric(
  nrcharsPerCard,
  nrbitsOrderTable,
  nrbitsNumCopies,
  code
) {
  // 先頭1文字を取り除き、規定の文字数ごとに分割する
  code = code.substring(1)
  if (code.length % nrcharsPerCard !== 0) {
    return null
  }
  let subcodes = []
  for (let i = 0; i < code.length; i += nrcharsPerCard) {
    subcodes.push(code.substring(i, i + nrcharsPerCard))
  }

  // ASCII からバイナリに変化する
  subcodes = subcodes.map((e) => {
    let bin = 0
    for (let i = 0; i < nrcharsPerCard; ++i) {
      bin = bin | (mapAsciiToBinary.get(e.charAt(i)) << (i * 6))
    }
    return bin
  })

  // 厳密に1個存在する 0 でメインとサイドに分割する
  const numZeroes = subcodes.reduce((a, c) => (c === 0 ? a + 1 : a), 0)
  if (numZeroes !== 1) {
    return null
  }
  const indexZero = subcodes.findIndex((e) => e === 0)
  let main = deserializeDeck(nrbitsOrderTable, subcodes.slice(0, indexZero))
  let side = deserializeDeck(nrbitsOrderTable, subcodes.slice(indexZero + 1))
  if (
    !validateDeck(nrbitsNumCopies, main) ||
    !validateDeck(nrbitsNumCopies, side)
  ) {
    return null
  }
  return [fixupDeck(main), fixupDeck(side)]
}

function deserializeDeck(nrbitsOrderTable, subcodes) {
  return subcodes.map((e) => {
    const orderTable = e & ((1 << nrbitsOrderTable) - 1)
    const numCopies = (e >> nrbitsOrderTable) + 1
    return [orderTable, numCopies]
  })
}

function validateDeck(nrbitsNumCopies, entries) {
  if (entries.length === 0) {
    return true
  } else if (
    !entries.every(
      ([orderTable, numCopies]) =>
        !!(
          orderTable >= dataCardsArrayForTable[0].orderTable &&
          orderTable <=
            dataCardsArrayForTable[dataCardsArrayForTable.length - 1]
              .orderTable &&
          orderTable !== ORDER_TABLE_HIJIKATA_TOSHIZO_PSR &&
          orderTable !== ORDER_TABLE_CHARLEMAGNE_PSR &&
          numCopies >= 1 &&
          numCopies <= 1 << nrbitsNumCopies
        )
    )
  ) {
    return false
  }
  // orderTable が昇順に並んでいるか否かの確認
  return entries.every((e, i, a) => i === 0 || a[i - 1][0] < e[0])
}

function fixupDeck(entries) {
  return entries.map(([orderTable, numCopies]) => [
    dataCardsMapFromOrderTable.get(orderTable).id,
    numCopies,
  ])
}
