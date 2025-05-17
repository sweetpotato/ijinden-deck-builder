// SPDX-License-Identifier: MIT

import { useReducer } from 'react'

const enumDeckActionType = {
  INCREMENT: 1,
  DECREMENT: 2,
  UNCONDITIONAL_SET: 3,
}

function reducerDeck(deck, action) {
  switch (action.type) {
    case enumDeckActionType.INCREMENT: {
      const newDeck = new Map(deck.entries())
      const value = newDeck.has(action.id) ? newDeck.get(action.id) : 0
      newDeck.set(action.id, value + 1)
      return newDeck
    }
    case enumDeckActionType.DECREMENT: {
      const newDeck = new Map(deck.entries())
      if (newDeck.has(action.id)) {
        const value = newDeck.get(action.id)
        if (value > 1) {
          newDeck.set(action.id, value - 1)
        } else {
          newDeck.delete(action.id)
        }
      }
      return newDeck
    }
    case enumDeckActionType.UNCONDITIONAL_SET: {
      return action.deck
    }
  }
}

function useDeck(initialEntriesMain, initialEntriesSide) {
  const [main, dispatchMain] = useReducer(
    reducerDeck,
    new Map(initialEntriesMain)
  )
  const [side, dispatchSide] = useReducer(
    reducerDeck,
    new Map(initialEntriesSide)
  )
  const incrementMain = (id) =>
    dispatchMain({ type: enumDeckActionType.INCREMENT, id })
  const decrementMain = (id) =>
    dispatchMain({ type: enumDeckActionType.DECREMENT, id })
  const incrementSide = (id) =>
    dispatchSide({ type: enumDeckActionType.INCREMENT, id })
  const decrementSide = (id) =>
    dispatchSide({ type: enumDeckActionType.DECREMENT, id })
  const moveOutMain = (id) => {
    decrementMain(id)
    incrementSide(id)
  }
  const moveOutSide = (id) => {
    decrementSide(id)
    incrementMain(id)
  }
  const setFromEntries = (newEntriesMain, newEntriesSide) => {
    dispatchMain({
      type: enumDeckActionType.UNCONDITIONAL_SET,
      deck: new Map(newEntriesMain),
    })
    dispatchSide({
      type: enumDeckActionType.UNCONDITIONAL_SET,
      deck: new Map(newEntriesSide),
    })
  }
  const clear = () => setFromEntries([], [])
  const dispatch = {
    incrementMain,
    incrementSide,
    decrementMain,
    decrementSide,
    moveOutSide,
    moveOutMain,
    setFromEntries,
    clear,
  }
  return [main, side, dispatch]
}

export default useDeck
