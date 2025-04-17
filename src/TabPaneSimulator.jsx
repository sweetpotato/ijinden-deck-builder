// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import { dataCardsMap as dataCards } from './commons/dataCards'
import { sum } from './commons/utils'
import ImageCard from './components/ImageCard'
import {
  enumActionSimulator,
  enumStateSimulator,
} from './hooks/reducerSimulator'

const enumToggle = {
  OPAQUE: 0,
  TRANSPARENT: 1,
  RED: 2,
  BLUE: 3,
  YELLOW: 4,
  WHITE: 5,
  BLACK: 6,
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

function TabPaneSimulator({ deck, state, dispatch }) {
  const [guardians, setGuardians] = useState(null)
  const [handAndDeck, setHandAndDeck] = useState(null)
  const [togglesGuardians, setTogglesGuardians] = useState(null)
  const [togglesHandAndDeck, setTogglesHandAndDeck] = useState(null)

  function handleClickReset() {
    setGuardians(null)
    setHandAndDeck(null)
    setTogglesGuardians(null)
    setTogglesHandAndDeck(null)
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
    // ガーディアン4枚は不可視
    setTogglesGuardians([
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
    ])
    // 初期手札6枚は可視で、山札は不可視
    const newTogglesHandAndDeck = [
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
    ]
    for (let i = 6; i < newHandAndDeck.length; ++i) {
      newTogglesHandAndDeck.push(enumToggle.OPAQUE)
    }
    setTogglesHandAndDeck(newTogglesHandAndDeck)
    dispatch(enumActionSimulator.START)
  }

  function handleClickMulligan() {
    setHandAndDeck(makeShuffledArray(handAndDeck))
    dispatch(enumActionSimulator.CONTINUE)
  }

  // Given to children
  function handleToggleGuardiansAt(index) {
    handleToggleAt(setTogglesGuardians, togglesGuardians, index)
  }

  // Given to children
  function handleToggleHandAndDeckAt(index) {
    handleToggleAt(setTogglesHandAndDeck, togglesHandAndDeck, index)
  }

  function handleToggleAt(setToggles, toggles, index) {
    const newToggle = toggles.slice()
    switch (newToggle[index]) {
      case enumToggle.OPAQUE:
        newToggle[index] = enumToggle.TRANSPARENT
        break
      case enumToggle.TRANSPARENT:
        newToggle[index] = enumToggle.RED
        break
      case enumToggle.RED:
        newToggle[index] = enumToggle.BLUE
        break
      case enumToggle.BLUE:
        newToggle[index] = enumToggle.YELLOW
        break
      case enumToggle.YELLOW:
        newToggle[index] = enumToggle.WHITE
        break
      case enumToggle.WHITE:
        newToggle[index] = enumToggle.BLACK
        break
      case enumToggle.BLACK:
        newToggle[index] = enumToggle.TRANSPARENT
        break
      default:
        break
    }
    setToggles(newToggle)
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
            title="ガーディアン"
            cards={guardians}
            toggles={togglesGuardians}
            handleToggleAt={handleToggleGuardiansAt}
          />
          <ContainerSection
            title="手札"
            cards={handAndDeck}
            toggles={togglesHandAndDeck}
            handleToggleAt={handleToggleHandAndDeckAt}
          />
        </>
      )}
    </>
  )
}

function ContainerSection({ title, cards, toggles, handleToggleAt }) {
  return (
    <>
      <h3 className="m-2">{title}</h3>
      <div className="container-card-line-up ms-2">
        {cards.map((id, index) => {
          const key = `${id}-${index}`
          const card = dataCards.get(id)
          return (
            <ImageCardWithToggle
              key={key}
              imageUrl={card.imageUrl}
              alt={card.name}
              toggle={toggles[index]}
              handleToggleAt={handleToggleAt}
              index={index}
            />
          )
        })}
      </div>
    </>
  )
}

function ImageCardWithToggle({ imageUrl, alt, toggle, handleToggleAt, index }) {
  const classesButton = classNames({
    'btn-toggled': true,
    'btn-toggled-opaque': toggle === enumToggle.OPAQUE,
    'btn-toggled-transparent': toggle === enumToggle.TRANSPARENT,
    'btn-toggled-red': toggle === enumToggle.RED,
    'btn-toggled-blue': toggle === enumToggle.BLUE,
    'btn-toggled-yellow': toggle === enumToggle.YELLOW,
    'btn-toggled-white': toggle === enumToggle.WHITE,
    'btn-toggled-black': toggle === enumToggle.BLACK,
  })

  return (
    <ImageCard imageUrl={imageUrl} alt={alt}>
      <Button className={classesButton} onClick={() => handleToggleAt(index)} />
    </ImageCard>
  )
}

export default TabPaneSimulator
