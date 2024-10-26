export function handleClickIncrement(id, deck, handleSetDeck) {
  const deckNew = new Map(deck.entries());
  const counter = deckNew.has(id) ? deckNew.get(id) : 0;
  deckNew.set(id, counter + 1);
  handleSetDeck(deckNew);
}

export function handleClickDecrement(id, deck, handleSetDeck) {
  const deckNew = new Map(deck.entries());
  if (deckNew.has(id)) {
    const counter = deckNew.get(id);
    if (counter > 1) {
      deckNew.set(id, counter - 1);
    } else {
      deckNew.delete(id);
    }
  }
  handleSetDeck(deckNew);
}
