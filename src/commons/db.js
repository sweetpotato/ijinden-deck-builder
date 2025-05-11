// SPDX-License-Identifier: MIT

import Dexie from 'dexie'

const DATABASE_NAME = 'ijinden-deck-builder'

const db = new Dexie(DATABASE_NAME)
db.version(1).stores({ decks: '++id' })
db.version(2)
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

/*
 * データ作成時の不注意が原因で、4-1 から 4-9 までとあるべきIDが
 * 「4-01」などと0付きになってしまっていた誤りを修正する。
 * See: https://github.com/sweetpotato/ijinden-deck-builder/issues/60
 */
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

const dbQueryDecks = () => db.decks.orderBy(':id').reverse().toArray()
const dbAddDeck = (deck) => db.decks.add(deck)
const dbDeleteDeck = (id) => db.decks.delete(id)
const dbClearDecks = () => db.decks.clear()
const dbBulkAddDecks = (decks) => db.decks.bulkAdd(decks)

export { dbQueryDecks, dbAddDeck, dbDeleteDeck, dbClearDecks, dbBulkAddDecks }
