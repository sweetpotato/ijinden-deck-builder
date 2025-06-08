import { useState } from 'react'

import TabPaneDeck from './TabPaneDeck'

function useTabPaneDeck(
  defaultShowCodeError,
  dispatchDeck,
  zoomIn,
  moveToLoad,
  interruptSimulator
) {
  const [deckTitle, setDeckTitle] = useState('')
  const render = (deckMain, deckSide, setActiveDeckSaved) => {
    return (
      <TabPaneDeck
        defaultShowCodeError={defaultShowCodeError}
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        deckMain={deckMain}
        deckSide={deckSide}
        dispatchDeck={dispatchDeck}
        zoomIn={zoomIn}
        moveToLoad={moveToLoad}
        setActiveDeckSaved={setActiveDeckSaved}
        interruptSimulator={interruptSimulator}
      />
    )
  }
  return [setDeckTitle, render]
}

export default useTabPaneDeck
