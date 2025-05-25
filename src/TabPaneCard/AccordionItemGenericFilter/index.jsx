// SPDX-License-Identifier: MIT

import { useState } from 'react'

import AccordionItemGenericFilter from './AccordionItemGenericFilter'

function useAccordionItemGenericFilter(title, data) {
  const [state, setState] = useState(0)
  const reset = () => setState(0)
  const render = (eventKey) => (
    <AccordionItemGenericFilter
      eventKey={eventKey}
      title={title}
      state={state}
      handleChangeState={(e) => setState(Number(e.currentTarget.value))}
      data={data}
    />
  )
  return [state, reset, render]
}

export default useAccordionItemGenericFilter
