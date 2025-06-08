// SPDX-License-Identifier: MIT

import { useState } from 'react'

import TabPaneLoad from './TabPaneLoad'

function useTabPaneLoad(
  setDeckTitle,
  dispatchSetFromEntries,
  moveToDeck,
  interruptSimulator
) {
  const [activeDeckSaved, setActiveDeckSaved] = useState(null)
  const render = () => {
    return (
      <TabPaneLoad
        activeDeckSaved={activeDeckSaved}
        setActiveDeckSaved={setActiveDeckSaved}
        setDeckTitle={setDeckTitle}
        dispatchSetFromEntries={dispatchSetFromEntries}
        moveToDeck={moveToDeck}
        interruptSimulator={interruptSimulator}
      />
    )
  }
  return [setActiveDeckSaved, render]
}

export default useTabPaneLoad
