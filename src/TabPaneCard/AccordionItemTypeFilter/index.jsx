// SPDX-License-Identifier: MIT

import { useCallback, useDeferredValue, useState } from 'react'

import enumComparator from '../enumComparator'
import AccordionItemTypeFilter from './AccordionItemTypeFilter'

function useAccordionItemTypeFilter() {
  const [type, setType] = useState(0)
  const [power, setPower] = useState(0)
  const [comparator, setComparator] = useState(enumComparator.GE)
  // See AccordionItemGenericFilter
  const defferedType = useDeferredValue(type)
  const defferedPower = useDeferredValue(power)
  const defferedComparator = useDeferredValue(comparator)
  const handleChangeType = useCallback(
    (e) => {
      const currentValue = Number(e.currentTarget.value)
      if (currentValue === 0) {
        // 「すべて」が押された
        setType(0)
      } else if (e.currentTarget.checked) {
        // 未選択の状態で押された (選択済の状態にしたい)
        setType(currentValue)
      } else {
        // 選択済の状態で押された (未選択の状態にしたい)
        setType(0)
      }
    },
    [setType],
  )
  const handleChangePower = useCallback(
    (e) => setPower(Number(e.currentTarget.value)),
    [setPower],
  )
  const handleChangeComparator = useCallback(
    (e) => setComparator(e.currentTarget.value),
    [setComparator],
  )

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
      handleChangeType={handleChangeType}
      handleChangePower={handleChangePower}
      handleChangeComparator={handleChangeComparator}
    />
  )
  return [defferedType, defferedPower, defferedComparator, reset, render]
}

export default useAccordionItemTypeFilter
