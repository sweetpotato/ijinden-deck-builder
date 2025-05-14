// SPDX-License-Identifier: MIT

import { useState } from 'react'

import enumComparator from '../enumComparator'
import AccordionItemTypeFilter from './AccordionItemTypeFilter'

function useAccordionItemTypeFilter() {
  const [type, setType] = useState(0)
  const [power, setPower] = useState(0)
  const [comparator, setComparator] = useState(enumComparator.GE)
  const reset = () => {
    setType(0)
    setPower(0)
    setComparator(enumComparator.GE)
  }
  const render = (eventKey) => (
    <AccordionItemTypeFilter
      eventKey={eventKey}
      type={type}
      power={power}
      comparator={comparator}
      handleChangeType={(e) => setType(Number(e.currentTarget.value))}
      handleChangePower={(e) => setPower(Number(e.currentTarget.value))}
      handleChangeComparator={(e) => setComparator(e.currentTarget.value)}
    />
  )
  return [type, power, comparator, reset, render]
}

export default useAccordionItemTypeFilter
