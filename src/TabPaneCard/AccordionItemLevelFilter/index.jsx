// SPDX-License-Identifier: MIT

import { useState } from 'react'
import AccordionItemLevelFilter from './AccordionItemLevelFilter'
import enumComparator from '../enumComparator'

// TODO 二重定義
const LEVEL_VALUE_MIN = 0
const LEVEL_VALUE_MAX = 17

function useAccordionItemLevelFilter() {
  const [levelValue, setLevelValue] = useState(LEVEL_VALUE_MIN)
  const [levelComparator, setLevelComparator] = useState(enumComparator.GE)

  function handleChangeLevelValue(e) {
    const currentValue = Number(e.currentTarget.value)
    // レベル11から16までのカードは存在しないため、
    // その値に設定してもあまり有益ではない。
    // 代わりに、レベル10または17の近い方に四捨五入的に寄せる。
    if (10 <= currentValue && currentValue < LEVEL_VALUE_MAX) {
      setLevelValue(
        currentValue < (10 + LEVEL_VALUE_MAX) / 2 ? 10 : LEVEL_VALUE_MAX
      )
    } else {
      setLevelValue(currentValue)
    }
  }

  function handleChangeLevelComparator(e) {
    setLevelComparator(e.currentTarget.value)
  }

  const resetLevel = () => {
    setLevelValue(LEVEL_VALUE_MIN)
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
