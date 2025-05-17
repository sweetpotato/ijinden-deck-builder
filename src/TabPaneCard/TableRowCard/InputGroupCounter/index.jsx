// SPDX-License-Identifier: MIT

import { Button, FormControl, InputGroup } from 'react-bootstrap'

function InputGroupCounter({
  id,
  deck,
  dispatchDecrement,
  dispatchIncrement,
  interruptSimulator = undefined,
}) {
  function handleClickMinus() {
    dispatchDecrement(id)
    interruptSimulator?.()
  }

  function handleClickPlus() {
    dispatchIncrement(id)
    interruptSimulator?.()
  }

  const name = (interruptSimulator !== undefined ? 'main-' : 'side-') + id
  const counter = deck.has(id) ? deck.get(id) : 0
  return (
    <InputGroup>
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={handleClickMinus}
        disabled={counter <= 0}
      >
        -
      </Button>
      <FormControl readOnly type="number" name={name} value={counter} />
      <Button size="sm" variant="outline-secondary" onClick={handleClickPlus}>
        +
      </Button>
    </InputGroup>
  )
}

export default InputGroupCounter
