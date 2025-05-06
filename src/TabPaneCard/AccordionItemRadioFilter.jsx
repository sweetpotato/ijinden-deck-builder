// SPDX-License-Identifier: MIT

import { useContext, useId } from 'react'
import {
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'

function AccordionItemRadioFilter({
  eventKey,
  title,
  state,
  handleChange,
  data,
}) {
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = new Map(data.map((e) => [e.value, e.label])).get(state)

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ ${title}`
        ) : state === 0 ? (
          `➕ ${title} ― ${label}`
        ) : (
          <>
            ➕ {title}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody className="container-button">
        {data.map((element) => {
          const id = `${name}-${element.value}`
          return (
            <ToggleButton
              key={id}
              type="radio"
              variant="outline-primary"
              id={id}
              name={name}
              value={element.value}
              onChange={handleChange}
              checked={state === element.value}
            >
              {element.label}
            </ToggleButton>
          )
        })}
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemRadioFilter
