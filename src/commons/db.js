// SPDX-License-Identifier: MIT

import Dexie from 'dexie';

const DATABASE_NAME = 'ijinden-deck-builder';

const db = new Dexie(DATABASE_NAME);
db.version(1).stores({ decks: '++id' });

export default db;
