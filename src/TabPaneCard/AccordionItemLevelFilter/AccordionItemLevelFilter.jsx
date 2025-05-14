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
          <div>{level}</div>
          <FormRange
            data-testid="slider-level"
            min={constLevel.MIN}
            max={constLevel.MAX}
            value={level}
            onChange={handleChangeLevel}
          />
        </div>
        <div className="container-button">
          <span data-testid="button-level-ge">
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
          </span>
          <span data-testid="button-level-le">
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
          </span>
          <span data-testid="button-level-eq">
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
          </span>
        </div>
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemLevelFilter
