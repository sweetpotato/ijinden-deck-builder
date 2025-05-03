// SPDX-License-Identifier: MIT

import { Button, FormControl, InputGroup } from 'react-bootstrap'

import {
  handleClickDecrement,
  handleClickIncrement,
} from '../commons/handleClick'
import { enumActionSimulator } from '../hooks/reducerSimulator'

function InputGroupCounter({
  id,
  deck,
  handleSetDeck,
  dispatchSimulator = undefined,
}) {
  function handleClickMinus() {
    handleClickDecrement(id, deck, handleSetDeck)
    if (dispatchSimulator !== undefined) {
      dispatchSimulator(enumActionSimulator.INTERRUPT)
    }
  }

  function handleClickPlus() {
    handleClickIncrement(id, deck, handleSetDeck)
    if (dispatchSimulator !== undefined) {
      dispatchSimulator(enumActionSimulator.INTERRUPT)
    }
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
      <FormControl type="number" readOnly name={name} value={counter} />
      <Button size="sm" variant="outline-secondary" onClick={handleClickPlus}>
        +
      </Button>
    </InputGroup>
  )
}

export default InputGroupCounter
