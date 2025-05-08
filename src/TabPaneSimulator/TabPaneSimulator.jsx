// SPDX-License-Identifier: MIT

import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import { dataCardsMap as dataCards } from '../commons/dataCards'
import { sum } from '../commons/utils'
import { enumActionSimulator, enumStateSimulator } from '.'
import {
  ImageCardWithToggleOpaque,
  ImageCardWithToggleTransparent,
} from './ImageCardWithToggle'

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

function TabPaneSimulator({ deck, state, dispatch }) {
  const [guardians, setGuardians] = useState(null)
  const [handAndDeck, setHandAndDeck] = useState(null)

  function continueSimulator() {
    dispatch(enumActionSimulator.CONTINUE)
  }

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

    const library = makeShuffledArray(makeIdArray(deck))
    // ガーディアンが4枚、残りは手札と山札
    setGuardians(library.slice(0, 4))
    setHandAndDeck(library.slice(4, library.length))
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
            continueSimulator={continueSimulator}
          />
          <ContainerSection
            id="hand"
            title="手札"
            cards={handAndDeck}
            defaultNumTransparent={6}
            continueSimulator={continueSimulator}
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

export default TabPaneSimulator
