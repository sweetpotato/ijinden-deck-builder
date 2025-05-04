// SPDX-License-Identifier: MIT

import { Button, FormControl, InputGroup } from 'react-bootstrap'

import {
  handleClickDecrement,
  handleClickIncrement,
} from '../commons/handleClick'
import { enumActionSimulator } from '../TabPaneSimulator'

function InputGroupCounter({
  id,
  deck,
  handleSetDeck,
  dispatchSimulator = undefined,
}) {
  function handleClickMinus() {
    handleClickDecrement(id, deck, handleSetDeck)
    dispatchSimulator?.(enumActionSimulator.INTERRUPT)
  }

  function handleClickPlus() {
    handleClickIncrement(id, deck, handleSetDeck)
    dispatchSimulator?.(enumActionSimulator.INTERRUPT)
  }

  const name = (dispatchSimulator !== undefined ? 'main-' : 'side-') + id
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
