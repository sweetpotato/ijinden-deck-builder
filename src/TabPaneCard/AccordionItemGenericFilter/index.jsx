// SPDX-License-Identifier: MIT

import { useState } from 'react'

import AccordionItemGenericFilter from './AccordionItemGenericFilter'

function useAccordionItemGenericFilter(testIdForButton0, title, data) {
  const [state, setState] = useState(0)
  const resetState = () => setState(0)
  const render = (eventKey) => (
    <AccordionItemGenericFilter
      eventKey={eventKey}
      testIdForButton0={testIdForButton0}
      title={title}
      state={state}
      handleChange={(e) => setState(Number(e.currentTarget.value))}
      data={data}
    />
  )
  return [state, resetState, render]
}

export default useAccordionItemGenericFilter
