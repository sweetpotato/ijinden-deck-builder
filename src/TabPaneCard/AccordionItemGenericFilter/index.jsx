// SPDX-License-Identifier: MIT

import { useCallback, useState } from 'react'

import AccordionItemGenericFilter from './AccordionItemGenericFilter'

function useAccordionItemGenericFilter(title, data) {
  const [state, setState] = useState(0)
  const reset = () => setState(0)
  const handleChangeState = useCallback(
    (e) => setState(Number(e.currentTarget.value)),
    [setState]
  )
  const render = (eventKey) => (
    <AccordionItemGenericFilter
      eventKey={eventKey}
      title={title}
      state={state}
      handleChangeState={handleChangeState}
      data={data}
    />
  )
  return [state, reset, render]
}

export default useAccordionItemGenericFilter
