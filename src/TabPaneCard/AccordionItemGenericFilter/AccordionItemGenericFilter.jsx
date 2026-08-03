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

import { isBitButtonChecked } from '../../commons/utils'

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
  const label = data
    .filter((e) => isBitButtonChecked(e.value, state))
    .map((e) => e.label)
    .join('|')

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
              type="checkbox"
              variant="outline-primary"
              id={id}
              name={name}
              value={element.value}
              onChange={handleChangeState}
              checked={isBitButtonChecked(element.value, state)}
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
