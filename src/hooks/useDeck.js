// SPDX-License-Identifier: MIT

import { useCallback, useMemo, useReducer } from 'react'

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
  const incrementMain = useCallback(
    (id) => dispatchMain({ type: enumDeckActionType.INCREMENT, id }),
    [dispatchMain]
  )
  const decrementMain = useCallback(
    (id) => dispatchMain({ type: enumDeckActionType.DECREMENT, id }),
    [dispatchMain]
  )
  const incrementSide = useCallback(
    (id) => dispatchSide({ type: enumDeckActionType.INCREMENT, id }),
    [dispatchSide]
  )
  const decrementSide = useCallback(
    (id) => dispatchSide({ type: enumDeckActionType.DECREMENT, id }),
    [dispatchSide]
  )
  const moveOutMain = useCallback(
    (id) => {
      dispatchMain({ type: enumDeckActionType.DECREMENT, id })
      dispatchSide({ type: enumDeckActionType.INCREMENT, id })
    },
    [dispatchMain, dispatchSide]
  )
  const moveOutSide = useCallback(
    (id) => {
      dispatchSide({ type: enumDeckActionType.DECREMENT, id })
      dispatchMain({ type: enumDeckActionType.INCREMENT, id })
    },
    [dispatchMain, dispatchSide]
  )
  const setFromEntries = useCallback(
    (newEntriesMain, newEntriesSide) => {
      dispatchMain({
        type: enumDeckActionType.UNCONDITIONAL_SET,
        deck: new Map(newEntriesMain),
      })
      dispatchSide({
        type: enumDeckActionType.UNCONDITIONAL_SET,
        deck: new Map(newEntriesSide),
      })
    },
    [dispatchMain, dispatchSide]
  )
  const clear = useCallback(() => {
    dispatchMain({
      type: enumDeckActionType.UNCONDITIONAL_SET,
      deck: new Map(),
    })
    dispatchSide({
      type: enumDeckActionType.UNCONDITIONAL_SET,
      deck: new Map(),
    })
  }, [dispatchMain, dispatchSide])
  const dispatch = useMemo(() => {
    return {
      incrementMain,
      incrementSide,
      decrementMain,
      decrementSide,
      moveOutMain,
      moveOutSide,
      setFromEntries,
      clear,
    }
  }, [
    incrementMain,
    incrementSide,
    decrementMain,
    decrementSide,
    moveOutMain,
    moveOutSide,
    setFromEntries,
    clear,
  ])
  return [main, side, dispatch]
}

export default useDeck
