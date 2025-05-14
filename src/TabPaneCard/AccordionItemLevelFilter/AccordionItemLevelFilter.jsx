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

import constLevel from '../constLevel'
import enumComparator from '../enumComparator'

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
            min={constLevel.MIN}
            max={constLevel.MAX}
            value={stateValue}
            onChange={handleChangeValue}
          />
        </div>
        <div className="container-button">
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumComparator.GE}`}
            name={name}
            value={enumComparator.GE}
            onChange={handleChangeComparator}
            checked={stateComparator === enumComparator.GE}
          >
            以上
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumComparator.LE}`}
            name={name}
            value={enumComparator.LE}
            onChange={handleChangeComparator}
            checked={stateComparator === enumComparator.LE}
          >
            以下
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumComparator.EQ}`}
            name={name}
            value={enumComparator.EQ}
            onChange={handleChangeComparator}
            checked={stateComparator === enumComparator.EQ}
          >
            等しい
          </ToggleButton>
        </div>
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemLevelFilter
