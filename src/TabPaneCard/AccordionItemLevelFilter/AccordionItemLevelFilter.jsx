// SPDX-License-Identifier: MIT

import { useContext } from 'react'
import {
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'
import FormRange from 'react-bootstrap/esm/FormRange'

import enumComparator from '../enumComparator'

// TODO 二重定義
const LEVEL_VALUE_MIN = 0
const LEVEL_VALUE_MAX = 17

function AccordionItemLevelFilter({
  eventKey,
  title,
  nameComparator,
  stateValue,
  stateComparator,
  handleChangeValue,
  handleChangeComparator,
  data,
}) {
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label =
    stateComparator === enumComparator.GE
      ? `${stateValue}以上`
      : stateComparator === enumComparator.LE
      ? `${stateValue}以下`
      : `${stateValue}に等しい`
  const enphasized = stateValue !== 0 || stateComparator != enumComparator.GE

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ ${title}`
        ) : !enphasized ? (
          `➕ ${title} ― ${label}`
        ) : (
          <>
            ➕ {title}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div>
          <div>{stateValue}</div>
          <FormRange
            min={LEVEL_VALUE_MIN}
            max={LEVEL_VALUE_MAX}
            value={stateValue}
            onChange={handleChangeValue}
          />
        </div>
        <div className="container-button">
          {data.map((element) => {
            const id = `${nameComparator}-${element.value}`
            return (
              <ToggleButton
                key={id}
                type="radio"
                variant="outline-primary"
                id={id}
                name={nameComparator}
                value={element.value}
                onChange={handleChangeComparator}
                checked={stateComparator === element.value}
              >
                {element.label}
              </ToggleButton>
            )
          })}
        </div>
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemLevelFilter
