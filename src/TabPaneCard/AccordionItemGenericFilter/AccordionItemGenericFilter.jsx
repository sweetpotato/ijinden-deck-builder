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

function AccordionItemGenericFilter({
  eventKey,
  testIdForButton0,
  title,
  state,
  handleChangeState,
  data,
}) {
  const name = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = new Map(data.map((e) => [e.value, e.label])).get(state)

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ ${title}`
        ) : state === 0 ? (
          `➕ ${title} ― ${label}`
        ) : (
          <>
            ➕ {title}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody className="container-button">
        {data.map((element) => {
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
                onChange={handleChangeState}
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

export default AccordionItemGenericFilter
