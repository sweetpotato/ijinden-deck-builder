// SPDX-License-Identifier: MIT

import { useState } from 'react'

import TabPaneLoad from './TabPaneLoad'

function useTabPaneLoad(
  setDeckTitle,
  dispatchSetFromEntries,
  moveToDeck,
  interruptSimulator
) {
  const [activeDeckSaved, expandAccordion] = useState(null)
  const render = () => {
    return (
      <TabPaneLoad
        setDeckTitle={setDeckTitle}
        activeDeckSaved={activeDeckSaved}
        dispatchSetFromEntries={dispatchSetFromEntries}
        moveToDeck={moveToDeck}
        expandAccordion={expandAccordion}
        interruptSimulator={interruptSimulator}
      />
    )
  }
  return [expandAccordion, render]
}

export default useTabPaneLoad
