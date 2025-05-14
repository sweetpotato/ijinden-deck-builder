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

import enumType from '../enumType'

function makeLabel(type) {
  switch (type) {
    case enumType.IJIN: {
      return 'イジン'
    }
    case enumType.HAIKEI: {
      return 'ハイケイ'
    }
    case enumType.MAHOU: {
      return 'マホウ'
    }
    case enumType.MARYOKU: {
      return 'マリョク'
    }
  }
  return 'すべて'
}

function AccordionItemTypeFilter({ eventKey, type, handleChangeType }) {
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = makeLabel(type)

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ 種類`
        ) : type === 0 ? (
          `➕ 種類 ― ${label}`
        ) : (
          <>
            {'➕ 種類'}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody className="container-button">
        <span data-testid="button-type-all">
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-0`}
            name={name}
            value={0}
            onChange={handleChangeType}
            checked={type === 0}
          >
            すべて
          </ToggleButton>
        </span>
        <span>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumType.IJIN}`}
            name={name}
            value={enumType.IJIN}
            onChange={handleChangeType}
            checked={type === enumType.IJIN}
          >
            イジン
          </ToggleButton>
        </span>
        <span>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumType.HAIKEI}`}
            name={name}
            value={enumType.HAIKEI}
            onChange={handleChangeType}
            checked={type === enumType.HAIKEI}
          >
            ハイケイ
          </ToggleButton>
        </span>
        <span>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumType.MAHOU}`}
            name={name}
            value={enumType.MAHOU}
            onChange={handleChangeType}
            checked={type === enumType.MAHOU}
          >
            マホウ
          </ToggleButton>
        </span>
        <span>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${name}-${enumType.MARYOKU}`}
            name={name}
            value={enumType.MARYOKU}
            onChange={handleChangeType}
            checked={type === enumType.MARYOKU}
          >
            マリョク
          </ToggleButton>
        </span>
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemTypeFilter
