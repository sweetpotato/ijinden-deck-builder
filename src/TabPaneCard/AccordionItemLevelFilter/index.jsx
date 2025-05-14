// SPDX-License-Identifier: MIT

import { useState } from 'react'

import constLevel from '../constLevel'
import enumComparator from '../enumComparator'
import AccordionItemLevelFilter from './AccordionItemLevelFilter'

function useAccordionItemLevelFilter() {
  const [level, setLevel] = useState(constLevel.MIN)
  const [comparator, setComparator] = useState(enumComparator.GE)

  function handleChangeLevel(e) {
    const currentValue = Number(e.currentTarget.value)
    // レベル11から16までのカードは存在しないため、
    // その値に設定してもあまり有益ではない。
    // 代わりに、レベル10または17の近い方に四捨五入的に寄せる。
    if (10 <= currentValue && currentValue < constLevel.MAX) {
      setLevel(currentValue < (10 + constLevel.MAX) / 2 ? 10 : constLevel.MAX)
    } else {
      setLevel(currentValue)
    }
  }

  function handleChangeComparator(e) {
    setComparator(e.currentTarget.value)
  }

  const reset = () => {
    setLevel(constLevel.MIN)
    setComparator(enumComparator.GE)
  }

  const render = (eventKey) => {
    return (
      <AccordionItemLevelFilter
        eventKey={eventKey}
        level={level}
        comparator={comparator}
        handleChangeLevel={handleChangeLevel}
        handleChangeComparator={handleChangeComparator}
      />
    )
  }

  return [level, comparator, reset, render]
}

export default useAccordionItemLevelFilter
