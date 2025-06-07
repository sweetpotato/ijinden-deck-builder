// SPDX-License-Identifier: MIT

import { useId, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import { dataCardsMap as dataCards } from '../commons/dataCards'
import { sum } from '../commons/utils'
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

  function handleClickReset() {
    setGuardians(null)
    setHandAndDeck(null)
    dispatch.reset()
  }

  function handleClickStart() {
    if (sum(deck.values()) < 10) {
      dispatch.checkMainDeck()
      return
    }

    const library = makeShuffledArray(makeIdArray(deck))
    // ガーディアンが4枚、残りは手札と山札
    setGuardians(library.slice(0, 4))
    setHandAndDeck(library.slice(4, library.length))
    dispatch.start()
  }

  function handleClickMulligan() {
    setHandAndDeck(makeShuffledArray(handAndDeck))
    dispatch.continue()
  }

  const showGuardiansAndHands =
    state.isStarting() || state.isRunning() || state.isAborted()
  return (
    <>
      <h2 className="m-2">手札シミュレータ</h2>
      <div className="container-button mx-2 mt-2 mb-3">
        <Button
          variant="outline-danger"
          onClick={handleClickReset}
          disabled={state.isInitial()}
        >
          リセット
        </Button>
        <Button
          variant="outline-success"
          onClick={handleClickStart}
          disabled={!state.isInitial()}
        >
          スタート
        </Button>
        <Button
          variant="outline-secondary"
          onClick={handleClickMulligan}
          disabled={!state.isStarting()}
        >
          マリガン
        </Button>
      </div>
      {state.isLessThanTen() && (
        <Alert variant="warning">
          メインデッキの枚数が少なすぎます。10枚以上にしてください。
        </Alert>
      )}
      {state.isAborted() && (
        <Alert variant="warning">
          シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。
        </Alert>
      )}
      {showGuardiansAndHands && (
        <>
          <ContainerSection
            title="ガーディアン"
            cards={guardians}
            defaultNumTransparent={0}
            continueSimulator={dispatch.continue}
          />
          <ContainerSection
            title="手札"
            cards={handAndDeck}
            defaultNumTransparent={6}
            continueSimulator={dispatch.continue}
          />
        </>
      )}
    </>
  )
}

function ContainerSection({
  title,
  cards,
  defaultNumTransparent,
  continueSimulator,
}) {
  const id = useId()
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="m-2">
        {title}
      </h3>
      <ul aria-labelledby={id} className="list-card list-card-medium ms-2">
        {cards?.map((cardId, index) => {
          const key = `${cardId}-${index}`
          const card = dataCards.get(cardId)
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
      </ul>
    </section>
  )
}

export default TabPaneSimulator
