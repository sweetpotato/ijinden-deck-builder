// SPDX-License-Identifier: MIT

import { useState } from 'react'
import AccordionItemLevelFilter from './AccordionItemLevelFilter'
import constLevel from '../constLevel'
import enumComparator from '../enumComparator'

function useAccordionItemLevelFilter() {
  const [levelValue, setLevelValue] = useState(constLevel.MIN)
  const [levelComparator, setLevelComparator] = useState(enumComparator.GE)

  function handleChangeLevelValue(e) {
    const currentValue = Number(e.currentTarget.value)
    // レベル11から16までのカードは存在しないため、
    // その値に設定してもあまり有益ではない。
    // 代わりに、レベル10または17の近い方に四捨五入的に寄せる。
    if (10 <= currentValue && currentValue < constLevel.MAX) {
      setLevelValue(
        currentValue < (10 + constLevel.MAX) / 2 ? 10 : constLevel.MAX
      )
    } else {
      setLevelValue(currentValue)
    }
  }

  function handleChangeLevelComparator(e) {
    setLevelComparator(e.currentTarget.value)
  }

  const resetLevel = () => {
    setLevelValue(constLevel.MIN)
    setLevelComparator(enumComparator.GE)
  }

  const render = (eventKey) => {
    return (
      <AccordionItemLevelFilter
        eventKey={eventKey}
        stateValue={levelValue}
        stateComparator={levelComparator}
        handleChangeValue={handleChangeLevelValue}
        handleChangeComparator={handleChangeLevelComparator}
      />
    )
  }

  return [levelValue, levelComparator, resetLevel, render]
}

export default useAccordionItemLevelFilter
