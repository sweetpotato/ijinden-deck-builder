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
  level,
  comparator,
  handleChangeLevel,
  handleChangeComparator,
}) {
  const itemId = useId()
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label =
    comparator === enumComparator.GE
      ? `${level}以上`
      : comparator === enumComparator.LE
      ? `${level}以下`
      : `${level}に等しい`
  const enphasized = level !== 0 || comparator != enumComparator.GE

  return (
    <AccordionItem eventKey={eventKey} role="listitem" aria-labelledby={itemId}>
      <AccordionHeader as="h3">
        {expanded ? (
          <>
            ➖&nbsp;
            <span id={itemId}>レベル</span>
          </>
        ) : !enphasized ? (
          <>
            ➕&nbsp;
            <span id={itemId}>レベル</span>
            &nbsp;―&nbsp;
            {label}
          </>
        ) : (
          <>
            ➕&nbsp;
            <span id={itemId}>レベル</span>
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div>
          <div>{level}</div>
          <FormRange
            min={constLevel.MIN}
            max={constLevel.MAX}
            value={level}
            onChange={handleChangeLevel}
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
            checked={comparator === enumComparator.GE}
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
            checked={comparator === enumComparator.LE}
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
            checked={comparator === enumComparator.EQ}
          >
            等しい
          </ToggleButton>
        </div>
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemLevelFilter
