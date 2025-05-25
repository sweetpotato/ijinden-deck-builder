// SPDX-License-Identifier: MIT

import { useCallback, useReducer } from 'react'

import TabPaneSimulator from './TabPaneSimulator'

const enumStateSimulator = {
  INITIAL: 0,
  STARTING: 1,
  RUNNING: 2,
  ABORTED: 3,
  LESS_THAN_TEN: 4,
}

const enumActionSimulator = {
  RESET: 0,
  START: 1,
  CONTINUE: 2,
  INTERRUPT: 3,
  CHECK_MAIN_DECK: 4,
}

function reducerSimulator(state, action) {
  switch (state) {
    case enumStateSimulator.INITIAL:
      switch (action) {
        case enumActionSimulator.START:
          return enumStateSimulator.STARTING
        case enumActionSimulator.CHECK_MAIN_DECK:
          return enumStateSimulator.LESS_THAN_TEN
        default:
          break
      }
      break
    case enumStateSimulator.STARTING:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL
        case enumActionSimulator.CONTINUE:
          return enumStateSimulator.RUNNING
        case enumActionSimulator.INTERRUPT:
          return enumStateSimulator.ABORTED
        default:
          break
      }
      break
    case enumStateSimulator.RUNNING:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL
        case enumActionSimulator.INTERRUPT:
          return enumStateSimulator.ABORTED
        default:
          break
      }
      break
    case enumStateSimulator.ABORTED:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL
        default:
          break
      }
      break
    case enumStateSimulator.LESS_THAN_TEN:
      switch (action) {
        case enumActionSimulator.RESET:
          return enumStateSimulator.INITIAL
        default:
          break
      }
      break
    default:
    // Do nothing
  }

  return state
}

function useTabPaneSimulator() {
  const [state, dispatch] = useReducer(
    reducerSimulator,
    enumStateSimulator.INITIAL
  )
  const stateInternal = {
    isInitial: () => state === enumStateSimulator.INITIAL,
    isStarting: () => state === enumStateSimulator.STARTING,
    isRunning: () => state === enumStateSimulator.RUNNING,
    isAborted: () => state === enumStateSimulator.ABORTED,
    isLessThanTen: () => state === enumStateSimulator.LESS_THAN_TEN,
  }
  const dispatchInternal = {
    reset: () => dispatch(enumActionSimulator.RESET),
    start: () => dispatch(enumActionSimulator.START),
    continue: () => dispatch(enumActionSimulator.CONTINUE),
    checkMainDeck: () => dispatch(enumActionSimulator.CHECK_MAIN_DECK),
  }
  const interrupt = useCallback(() => {
    dispatch(enumActionSimulator.INTERRUPT)
  }, [dispatch])
  const render = (deck) => {
    return (
      <TabPaneSimulator
        deck={deck}
        state={stateInternal}
        dispatch={dispatchInternal}
      />
    )
  }
  return [interrupt, render]
}

export default useTabPaneSimulator
