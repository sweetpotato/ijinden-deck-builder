// SPDX-License-Identifier: MIT

import { useState } from 'react'

import AccordionItemTypeFilter from './AccordionItemTypeFilter'

function useAccordionItemTypeFilter() {
  const [type, setType] = useState(0)
  const reset = () => setType(0)
  const render = (eventKey) => (
    <AccordionItemTypeFilter
      eventKey={eventKey}
      type={type}
      handleChangeType={(e) => setType(Number(e.currentTarget.value))}
    />
  )
  return [type, reset, render]
}

export default useAccordionItemTypeFilter
