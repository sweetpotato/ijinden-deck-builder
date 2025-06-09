// SPDX-License-Identifier: MIT

import { memo, useContext, useId } from 'react'
import {
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'

const AccordionItemGenericFilter = memo(function AccordionItemGenericFilter({
  eventKey,
  title,
  state,
  handleChangeState,
  data,
}) {
  const idTitle = useId()
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = new Map(data.map((e) => [e.value, e.label])).get(state)

  return (
    <AccordionItem
      role="listitem"
      aria-labelledby={idTitle}
      eventKey={eventKey}
    >
      <AccordionHeader as="h3">
        {expanded ? (
          <span>
            <span id={idTitle}>{title}</span>
          </span>
        ) : state === 0 ? (
          <span>
            <span id={idTitle}>{title}</span>
            &nbsp;―&nbsp;
            {label}
          </span>
        ) : (
          <span>
            <span id={idTitle}>{title}</span>
            &nbsp;―&nbsp;
            <b>{label}</b>
          </span>
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
              onChange={handleChangeState}
              checked={state === element.value}
            >
              {element.label}
            </ToggleButton>
          )
        })}
      </AccordionBody>
    </AccordionItem>
  )
})

export default AccordionItemGenericFilter
