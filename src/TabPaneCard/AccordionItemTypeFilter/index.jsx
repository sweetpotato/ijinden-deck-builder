// SPDX-License-Identifier: MIT

import { useState } from 'react'

import AccordionItemTypeFilter from './AccordionItemTypeFilter'

function useAccordionItemTypeFilter() {
  const [state, setState] = useState(0)
  const resetState = () => setState(0)
  const render = (eventKey) => (
    <AccordionItemTypeFilter
      eventKey={eventKey}
      state={state}
      handleChange={(e) => setState(Number(e.currentTarget.value))}
    />
  )
  return [state, resetState, render]
}

export default useAccordionItemTypeFilter
