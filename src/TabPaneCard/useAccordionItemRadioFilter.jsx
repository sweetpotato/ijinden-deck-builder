// SPDX-License-Identifier: MIT

import { useState } from 'react'

import AccordionItemRadioFilter from './AccordionItemRadioFilter'

function useAccordionItemRadioFilter({ title, data }) {
  const [state, setState] = useState(0)
  const resetState = () => setState(0)
  const render = (eventKey) => (
    <AccordionItemRadioFilter
      eventKey={eventKey}
      title={title}
      state={state}
      handleChange={(e) => setState(Number(e.currentTarget.value))}
      data={data}
    />
  )
  return [state, resetState, render]
}

export default useAccordionItemRadioFilter
