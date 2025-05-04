// SPDX-License-Identifier: MIT

import { useReducer, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import { dataCardsMap as dataCards } from '../commons/dataCards'
import { sum } from '../commons/utils'
import {
  ImageCardWithToggleOpaque,
  ImageCardWithToggleTransparent,
} from './ImageCardWithToggle'

import './index.css'

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

function makeIdArray(deck) {
  const result = []
  for (const [id, numCopies] of deck.entries()) {
    for (let i = 0; i < numCopies; ++i) {
      result.push(id)
    }
  }
  return result
}

function makeShuffledArray(array) {
  const result = array.slice()
  // シャッフルする
  for (let i = result.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// "Library" の先頭から n 枚を取り出して "Picked" の末尾に加え、
// 新しい Library と Picked の対を返す。
function pickCards(currentLibrary, currentPicked, n) {
  const newLibrary = currentLibrary.slice()
  const newPicked = currentPicked.slice()
  for (let i = 0; i < n; ++i) {
    newPicked.push(newLibrary.shift())
  }
  return [newLibrary, newPicked]
}

function useTabPaneSimulator() {
  const [state, dispatch] = useReducer(
    reducerSimulator,
    enumStateSimulator.INITIAL
  )
  const interrupt = () => {
    dispatch(enumActionSimulator.INTERRUPT)
  }
  const render = (deck) => {
    return <TabPaneSimulator deck={deck} state={state} dispatch={dispatch} />
  }
  return [interrupt, render]
}

function TabPaneSimulator({ deck, state, dispatch }) {
  const [guardians, setGuardians] = useState(null)
  const [handAndDeck, setHandAndDeck] = useState(null)

  function handleClickReset() {
    setGuardians(null)
    setHandAndDeck(null)
    dispatch(enumActionSimulator.RESET)
  }

  function handleClickStart() {
    if (sum(deck.values()) < 10) {
      dispatch(enumActionSimulator.CHECK_MAIN_DECK)
      return
    }

    let newHandAndDeck = makeShuffledArray(makeIdArray(deck))
    // ガーディアンが4枚、残りは手札と山札
    let newGuardians
    ;[newHandAndDeck, newGuardians] = pickCards(newHandAndDeck, [], 4)

    setGuardians(newGuardians)
    setHandAndDeck(newHandAndDeck)
    dispatch(enumActionSimulator.START)
  }

  function handleClickMulligan() {
    setHandAndDeck(makeShuffledArray(handAndDeck))
    dispatch(enumActionSimulator.CONTINUE)
  }

  const enabledStart = state === enumStateSimulator.INITIAL
  const enabledReset = state !== enumStateSimulator.INITIAL
  const enabledMulligan = state === enumStateSimulator.STARTING
  const showGuardiansAndHands =
    state === enumStateSimulator.STARTING ||
    state === enumStateSimulator.RUNNING ||
    state === enumStateSimulator.ABORTED
  return (
    <>
      <h2 className="m-2">手札シミュレータ</h2>
      <div className="container-button mx-2 mt-2 mb-3">
        <Button
          variant="outline-danger"
          onClick={handleClickReset}
          disabled={!enabledReset}
        >
          リセット
        </Button>
        <Button
          variant="outline-success"
          onClick={handleClickStart}
          disabled={!enabledStart}
        >
          スタート
        </Button>
        <Button
          variant="outline-secondary"
          onClick={handleClickMulligan}
          disabled={!enabledMulligan}
        >
          マリガン
        </Button>
      </div>
      {state === enumStateSimulator.LESS_THAN_TEN && (
        <Alert variant="warning">
          メインデッキの枚数が少なすぎます。10枚以上にしてください。
        </Alert>
      )}
      {state === enumStateSimulator.ABORTED && (
        <Alert variant="warning">
          シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。
        </Alert>
      )}
      {showGuardiansAndHands && (
        <>
          <ContainerSection
            id="guardians"
            title="ガーディアン"
            cards={guardians}
            defaultNumTransparent={0}
            continueSimulator={() => dispatch(enumActionSimulator.CONTINUE)}
          />
          <ContainerSection
            id="hand"
            title="手札"
            cards={handAndDeck}
            defaultNumTransparent={6}
            continueSimulator={() => dispatch(enumActionSimulator.CONTINUE)}
          />
        </>
      )}
    </>
  )
}

function ContainerSection({
  id,
  title,
  cards,
  defaultNumTransparent,
  continueSimulator,
}) {
  return (
    <div role="group" aria-labelledby={id}>
      <h3 id={id} className="m-2">
        {title}
      </h3>
      <div className="container-card-line-up ms-2">
        {cards?.map((id, index) => {
          const key = `${id}-${index}`
          const card = dataCards.get(id)
          return index < defaultNumTransparent ? (
            <ImageCardWithToggleTransparent
              key={key}
              imageUrl={card.imageUrl}
              alt={card.name}
              continueSimulator={continueSimulator}
            />
          ) : (
            <ImageCardWithToggleOpaque
              key={key}
              imageUrl={card.imageUrl}
              alt={card.name}
              continueSimulator={continueSimulator}
            />
          )
        })}
      </div>
    </div>
  )
}

export default useTabPaneSimulator
export { enumActionSimulator }
