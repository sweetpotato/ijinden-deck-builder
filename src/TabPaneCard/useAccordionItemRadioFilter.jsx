import { useState } from 'react'
import AccordionItemRadioFilter from './AccordionItemRadioFilter'

function useAccordionItemRadioFilter({
  eventKey,
  title,
  name,
  defaultState,
  data,
}) {
  const [state, setState] = useState(defaultState)
  const resetState = () => setState(0)
  const render = () => (
    <AccordionItemRadioFilter
      eventKey={eventKey}
      title={title}
      name={name}
      state={state}
      handleChange={(e) => setState(Number(e.currentTarget.value))}
      data={data}
    />
  )
  return [state, resetState, render]
}

export default useAccordionItemRadioFilter
