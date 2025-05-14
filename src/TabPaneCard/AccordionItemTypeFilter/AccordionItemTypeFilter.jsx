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

const dataTypes = [
  { value: 0, label: 'すべて' },
  { value: enumType.IJIN, label: 'イジン' },
  { value: enumType.HAIKEI, label: 'ハイケイ' },
  { value: enumType.MAHOU, label: 'マホウ' },
  { value: enumType.MARYOKU, label: 'マリョク' },
]

function AccordionItemTypeFilter({
  eventKey,
  testIdForButton0,
  state,
  handleChange,
}) {
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = new Map(dataTypes.map((e) => [e.value, e.label])).get(state)

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ 種類`
        ) : state === 0 ? (
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
        {dataTypes.map((element) => {
          const id = `${name}-${element.value}`
          return (
            <span
              key={id}
              {
                /*
                 * 0番ボタンのテキストはフィルタが異なっていても
                 * 「すべて」「指定なし」と同じ文言を持っており、getByRole の
                 * name により一意に取得することが難しいので、data-testid を
                 * 設定する。実際のユーザは、これらのボタンがどのフィルタの
                 * アコーディオンの配下にあるかを見て一意に識別できるため、
                 * 視覚的なアクセシビリティとしては問題ないはずである。
                 *
                 * <ToggleButton> は <input type="button"> と <label> の組合せで
                 * 実現されており、<ToggleButton> に付けた data-testid は
                 * <input type="button"> ではなく <label> に付く。この <label> を
                 * getByTestId しても、そこから兄にあたる <input type="button"> を
                 * querySelector で取得することは困難なため、これらをラップする
                 * <span> を用意してそれに data-testid をつけることにする。
                 */
                ...(element.value === 0
                  ? { 'data-testid': testIdForButton0 }
                  : {})
              }
            >
              <ToggleButton
                type="radio"
                variant="outline-primary"
                id={id}
                name={name}
                value={element.value}
                onChange={handleChange}
                checked={state === element.value}
              >
                {element.label}
              </ToggleButton>
            </span>
          )
        })}
      </AccordionBody>
    </AccordionItem>
  )
}

export default AccordionItemTypeFilter
