// SPDX-License-Identifier: MIT

import Dexie from 'dexie'

const DATABASE_NAME = 'ijinden-deck-builder'

const db = new Dexie(DATABASE_NAME)
db.version(1).stores({ decks: '++id' })

const dbQueryDecks = () => db.decks.orderBy(':id').reverse().toArray()
const dbAddDeck = (deck) => db.decks.add(deck)
const dbDeleteDeck = (id) => db.decks.delete(id)
const dbClearDecks = () => db.decks.clear()
const dbBulkAddDecks = (decks) => db.decks.bulkAdd(decks)

export { dbQueryDecks, dbAddDeck, dbDeleteDeck, dbClearDecks, dbBulkAddDecks }
