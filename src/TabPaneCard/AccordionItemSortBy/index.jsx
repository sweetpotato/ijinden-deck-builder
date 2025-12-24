import { useCallback, useState } from 'react'
import AccordionItemSortBy from './AccordionItemSortBy'

function useAccordionItemSortBy() {
  const [sortBy, setSortBy] = useState(0)
  const handleChangeSortBy = useCallback(
    (e) => setSortBy(Number(e.currentTarget.value)),
    [setSortBy]
  )
  const render = (eventKey) => {
    return (
      <AccordionItemSortBy
        eventKey={eventKey}
        sortBy={sortBy}
        handleChangeSortBy={handleChangeSortBy}
      />
    )
  }
  return [sortBy, render]
}

export default useAccordionItemSortBy
