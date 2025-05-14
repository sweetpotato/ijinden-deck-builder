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
import enumType from '../enumType'

function makeLabel(type, power, comparator) {
  switch (type) {
    case enumType.IJIN: {
      switch (comparator) {
        case enumComparator.GE: {
          return `パワー${power}以上のイジン`
        }
        case enumComparator.LE: {
          return `パワー${power}以下のイジン`
        }
      }
      return `パワー${power}に等しいイジン`
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

function AccordionItemTypeFilter({
  eventKey,
  type,
  power,
  comparator,
  handleChangeType,
  handleChangePower,
  handleChangeComparator,
}) {
  const nameType = useId()
  const nameComparator = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = makeLabel(type, power, comparator)
  const powerEnabled = type === enumType.IJIN

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ 種類とパワー`
        ) : type === 0 ? (
          `➕ 種類とパワー ― ${label}`
        ) : (
          <>
            {'➕ 種類とパワー'}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div className="container-button">
          <span data-testid="button-type-all">
            <ToggleButton
              type="radio"
              variant="outline-primary"
              id={`${nameType}-0`}
              name={nameType}
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
              id={`${nameType}-${enumType.IJIN}`}
              name={nameType}
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
              id={`${nameType}-${enumType.HAIKEI}`}
              name={nameType}
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
              id={`${nameType}-${enumType.MAHOU}`}
              name={nameType}
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
              id={`${nameType}-${enumType.MARYOKU}`}
              name={nameType}
              value={enumType.MARYOKU}
              onChange={handleChangeType}
              checked={type === enumType.MARYOKU}
            >
              マリョク
            </ToggleButton>
          </span>
        </div>
        <div>
          <div
            className="mt-3"
            {...(powerEnabled ? {} : { style: { color: '#adb5bd' } })}
          >
            パワー{power}
          </div>
          <FormRange
            data-testid="slider-power"
            min={0}
            max={10000}
            step={500}
            value={power}
            onChange={handleChangePower}
            disabled={!powerEnabled}
          />
        </div>
        <div className="container-button">
          <span data-testid="button-power-ge">
            <ToggleButton
              type="radio"
              variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
              id={`${nameComparator}-${enumComparator.GE}`}
              name={nameComparator}
              value={enumComparator.GE}
              onChange={handleChangeComparator}
              disabled={!powerEnabled}
              checked={comparator === enumComparator.GE}
            >
              以上
            </ToggleButton>
          </span>
          <span data-testid="button-power-le">
            <ToggleButton
              type="radio"
              variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
              id={`${nameComparator}-${enumComparator.LE}`}
              name={nameComparator}
              value={enumComparator.LE}
              onChange={handleChangeComparator}
              disabled={!powerEnabled}
              checked={comparator === enumComparator.LE}
            >
              以下
            </ToggleButton>
          </span>
          <span data-testid="button-power-eq">
            <ToggleButton
              type="radio"
              variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
              id={`${nameComparator}-${enumComparator.EQ}`}
              name={nameComparator}
              value={enumComparator.EQ}
              onChange={handleChangeComparator}
              disabled={!powerEnabled}
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

export default AccordionItemTypeFilter
