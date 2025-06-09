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

const AccordionItemTypeFilter = memo(function AccordionItemTypeFilter({
  eventKey,
  type,
  power,
  comparator,
  handleChangeType,
  handleChangePower,
  handleChangeComparator,
}) {
  const idTitle = useId()
  const nameType = useId()
  const nameComparator = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = makeLabel(type, power, comparator)
  const powerEnabled = type === enumType.IJIN

  return (
    <AccordionItem
      role="listitem"
      aria-labelledby={idTitle}
      eventKey={eventKey}
    >
      <AccordionHeader as="h3">
        {expanded ? (
          <span>
            ➖&nbsp;
            <span id={idTitle}>種類とパワー</span>
          </span>
        ) : type === 0 ? (
          <span>
            ➕&nbsp;
            <span id={idTitle}>種類とパワー</span>
            &nbsp;―&nbsp;
            {label}
          </span>
        ) : (
          <span>
            ➕&nbsp;
            <span id={idTitle}>種類とパワー</span>
            &nbsp;―&nbsp;
            <b>{label}</b>
          </span>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div className="container-button">
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
        </div>
        <div>
          <div
            className="mt-3"
            {...(powerEnabled ? {} : { style: { color: '#adb5bd' } })}
          >
            パワー{power}
          </div>
          <FormRange
            min={0}
            max={10000}
            step={500}
            value={power}
            onChange={handleChangePower}
            disabled={!powerEnabled}
          />
        </div>
        <div className="container-button">
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
        </div>
      </AccordionBody>
    </AccordionItem>
  )
})

export default AccordionItemTypeFilter
