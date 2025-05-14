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
import FormRange from 'react-bootstrap/esm/FormRange'

import enumComparator from '../enumComparator'

// TODO 二重定義
const LEVEL_VALUE_MIN = 0
const LEVEL_VALUE_MAX = 17
const dataLevelComparators = [
  { value: enumComparator.GE, label: '以上' },
  { value: enumComparator.LE, label: '以下' },
  { value: enumComparator.EQ, label: '等しい' },
]

function AccordionItemLevelFilter({
  eventKey,
  stateValue,
  stateComparator,
  handleChangeValue,
  handleChangeComparator,
}) {
  const name = useId()
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
          `➖ レベル`
        ) : !enphasized ? (
          `➕ レベル ― ${label}`
        ) : (
          <>
            {`➕ レベル`}
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
          {dataLevelComparators.map((element) => {
            const id = `${name}-${element.value}`
            return (
              <ToggleButton
                key={id}
                type="radio"
                variant="outline-primary"
                id={id}
                name={name}
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
