import { memo, useId } from 'react'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  ToggleButton,
} from 'react-bootstrap'

import enumSortBy from '../enumSortBy'

const dataSortBy = [
  { value: enumSortBy.ID, label: 'ID' },
  { value: enumSortBy.COLOR_TYPE, label: '色' },
  { value: enumSortBy.TYPE_COLOR, label: '種類' },
  { value: enumSortBy.POWER_COLOR_TYPE, label: 'パワー' },
  { value: enumSortBy.LEVEL_COLOR_TYPE, label: 'レベル・色' },
  { value: enumSortBy.LEVEL_TYPE_COLOR, label: 'レベル・種類' },
]

const AccordionItemSortBy = memo(function AccordionItemSortBy({
  eventKey,
  sortBy,
  handleChangeSortBy,
}) {
  const idTitle = useId()
  const name = useId()

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader id={idTitle} as="h2" className="header-sort">
        並べ替えβ
      </AccordionHeader>
      <AccordionBody>
        <div className="container-button">
          {dataSortBy.map((element) => (
            <ToggleButton
              key={`${name}-${element.value}`}
              type="radio"
              variant="outline-primary"
              id={`${name}-${element.value}`}
              name={name}
              value={element.value}
              onChange={handleChangeSortBy}
              checked={sortBy === element.value}
            >
              {element.label}
            </ToggleButton>
          ))}
        </div>
      </AccordionBody>
    </AccordionItem>
  )
})

export default AccordionItemSortBy
