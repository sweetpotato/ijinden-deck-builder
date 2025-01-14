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
  ORANGE: 2,
  BLUE: 3,
  WHITE: 4,
  GRAY: 5,
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
  const [hand, setHand] = useState(null)
  const [library, setLibrary] = useState(null)
  const [guardiansToggles, setGuardiansToggles] = useState(null)
  const [handToggles, setHandToggles] = useState(null)

  function handleClickReset() {
    setGuardians(null)
    setHand(null)
    setLibrary(null)
    setGuardiansToggles(null)
    setHandToggles(null)
    dispatch(enumActionSimulator.RESET)
  }

  function handleClickStart() {
    if (sum(deck.values()) < 10) {
      dispatch(enumActionSimulator.CHECK_MAIN_DECK)
      return
    }

    let newLibrary = makeShuffledArray(makeIdArray(deck))
    // ガーディアン4枚
    let newGuardians
    ;[newLibrary, newGuardians] = pickCards(newLibrary, [], 4)
    // 手札6枚
    let newHand
    ;[newLibrary, newHand] = pickCards(newLibrary, [], 6)

    setGuardians(newGuardians)
    setHand(newHand)
    setLibrary(newLibrary)
    setGuardiansToggles([
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
      enumToggle.OPAQUE,
    ])
    setHandToggles([
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
      enumToggle.TRANSPARENT,
    ])
    dispatch(enumActionSimulator.START)
  }

  function handleClickMulligan() {
    let newLibrary = library.concat(hand)
    // 手札6枚引き直し
    let newHand
    ;[newLibrary, newHand] = pickCards(newLibrary, [], 6)

    setHand(newHand)
    setLibrary(newLibrary)
    dispatch(enumActionSimulator.CONTINUE)
  }

  function handleClickDraw() {
    const [newLibrary, newHand] = pickCards(library.slice(), hand, 1)
    setHand(newHand)
    setLibrary(newLibrary)
    setHandToggles(handToggles.concat([enumToggle.TRANSPARENT]))
    dispatch(enumActionSimulator.CONTINUE)
  }

  // Given to children
  function handleGuardiansToggleAt(index) {
    handleToggleAt(setGuardiansToggles, guardiansToggles, index)
  }

  // Given to children
  function handleHandToggleAt(index) {
    handleToggleAt(setHandToggles, handToggles, index)
  }

  function handleToggleAt(setToggles, toggles, index) {
    const newToggle = toggles.slice()
    switch (newToggle[index]) {
      case enumToggle.OPAQUE:
        newToggle[index] = enumToggle.TRANSPARENT
        break
      case enumToggle.TRANSPARENT:
        newToggle[index] = enumToggle.ORANGE
        break
      case enumToggle.ORANGE:
        newToggle[index] = enumToggle.BLUE
        break
      case enumToggle.BLUE:
        newToggle[index] = enumToggle.WHITE
        break
      case enumToggle.WHITE:
        newToggle[index] = enumToggle.GRAY
        break
      case enumToggle.GRAY:
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
  const showDraw =
    !!(library?.length > 0) &&
    (state === enumStateSimulator.STARTING ||
      state === enumStateSimulator.RUNNING)
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
          シミュレーション中にメインデッキが編集されました。リセットしてください。
        </Alert>
      )}
      {showGuardiansAndHands && (
        <>
          <ContainerSection
            title="ガーディアン"
            cards={guardians}
            toggles={guardiansToggles}
            handleToggleAt={handleGuardiansToggleAt}
          />
          <ContainerSection
            title="手札"
            cards={hand}
            toggles={handToggles}
            handleToggleAt={handleHandToggleAt}
            showDraw={showDraw}
            handleClickDraw={handleClickDraw}
          />
        </>
      )}
    </>
  )
}

function ContainerSection({
  title,
  cards,
  toggles,
  handleToggleAt,
  showDraw,
  handleClickDraw,
}) {
  return (
    <>
      <h3 className="m-2">{title}</h3>
      <div className="container-card-line-up ms-2">
        {cards.map((element, index) => {
          const key = `${element}-${index}`
          const card = dataCards.get(element)
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
        {showDraw && (
          <div className="container-card card-medium">
            <Button
              className="btn-draw"
              variant="outline-secondary"
              onClick={handleClickDraw}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

function ImageCardWithToggle({ imageUrl, alt, toggle, handleToggleAt, index }) {
  const buttonClass = classNames({
    'btn-toggled': true,
    'btn-toggled-opaque': toggle === enumToggle.OPAQUE,
    'btn-toggled-transparent': toggle === enumToggle.TRANSPARENT,
    'btn-toggled-orange': toggle === enumToggle.ORANGE,
    'btn-toggled-blue': toggle === enumToggle.BLUE,
    'btn-toggled-white': toggle === enumToggle.WHITE,
    'btn-toggled-gray': toggle === enumToggle.GRAY,
  })

  return (
    <ImageCard imageUrl={imageUrl} alt={alt}>
      <Button className={buttonClass} onClick={() => handleToggleAt(index)} />
    </ImageCard>
  )
}

export default TabPaneSimulator
