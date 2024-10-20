import enumStateSimulator from "./enumStateSimulator";

export function handleClickIncrement(
    id, deck, setDeck,
    stateSimulator=undefined,
    setStateSimulator=undefined) {
  const deckNew = new Map(deck.entries());
  const counter = deckNew.has(id) ? deckNew.get(id) : 0;
  deckNew.set(id, counter + 1);
  setDeck(deckNew);
  if (stateSimulator !== undefined && setStateSimulator !== undefined) {
    if (stateSimulator === enumStateSimulator.RUNNING) {
      setStateSimulator(enumStateSimulator.ABORTED);
    }
  }
}

export function handleClickDecrement(
    id, deck, setDeck,
    stateSimulator=undefined,
    setStateSimulator=undefined) {
  const deckNew = new Map(deck.entries());
  if (deckNew.has(id)) {
    const counter = deckNew.get(id);
    if (counter > 1) {
      deckNew.set(id, counter - 1);
    } else {
      deckNew.delete(id);
    }
  }
  setDeck(deckNew);
  if (stateSimulator !== undefined && setStateSimulator !== undefined) {
    if (stateSimulator === enumStateSimulator.RUNNING) {
      setStateSimulator(enumStateSimulator.ABORTED);
    }
  }
}
