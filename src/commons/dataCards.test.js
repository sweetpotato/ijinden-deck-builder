// SPDX-License-Identifier: MIT

import { dataCardsArrayForTable, dataCardsArrayForDeck, dataCardsMap } from './dataCards';

test('dataCardsArrayForTable は orderTable 順', () => {
  expect(Array.isArray(dataCardsArrayForTable)).toBe(true);
  const { length } = dataCardsArrayForTable;
  expect(dataCardsArrayForTable[0].orderTable).toBe(1);
  expect(dataCardsArrayForTable[length - 1].orderTable).toBe(length);
});

test('dataCardsArrayForDeck は orderDeck 順', () => {
  expect(Array.isArray(dataCardsArrayForDeck)).toBe(true);
  const { length } = dataCardsArrayForDeck;
  expect(dataCardsArrayForDeck[0].orderDeck).toBe(1);
  expect(dataCardsArrayForDeck[length - 1].orderDeck).toBe(length);
});

test('dataCardsMap は Map 型', () => {
  expect(dataCardsMap instanceof Map).toBe(true);
});

test('各 dataCards の要素数は同じ', () => {
  const lengthTable = dataCardsArrayForTable.length;
  const lengthDeck = dataCardsArrayForDeck.length;
  const sizeMap = dataCardsMap.size;
  expect(typeof lengthTable).toBe('number');
  expect(typeof lengthDeck).toBe('number');
  expect(typeof sizeMap).toBe('number');
  expect(sizeMap).toBe(lengthTable);
  expect(sizeMap).toBe(lengthDeck);
});
