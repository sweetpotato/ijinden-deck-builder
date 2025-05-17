// SPDX-License-Identifier: MIT

import { useState } from 'react'
import {
  Alert,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'react-bootstrap'

import { dataCardsArrayForDeck as dataCardsArray } from '../commons/dataCards'
import { dbAddDeck } from '../commons/db'
import enumTabPane from '../commons/enumTabPane'
import { sum } from '../commons/utils'
import ImageCard from '../components/ImageCard'
import ContainerDeckShare from './ContainerDeckShare'
import ContainerDeckExport from './ContainerDeckExport'

import './index.css'

function TabPaneDeck({
  code,
  showCodeError,
  handleSetShowCodeError,
  handleSetIdZoom,
  deckTitle,
  handleSetDeckTitle,
  deckMain,
  deckSide,
  dispatchDeck,
  handleSetActiveDeckSaved,
  handleSetActiveTab,
  interruptSimulator,
}) {
  const [showModalEmpty, setShowModalEmpty] = useState(false)

  function handleChangeDeckTitle(event) {
    handleSetDeckTitle(event.target.value)
  }

  async function handleClickSave() {
    if (deckMain.size === 0 && deckSide.size === 0) {
      setShowModalEmpty(true)
      return
    }

    // 現在のデッキをオブジェクト化する
    const timestamp = new Date()
    const objectMain = [...deckMain.entries()]
    const objectSide = [...deckSide.entries()]
    const objectDeck = {
      timestamp,
      title: deckTitle,
      main: objectMain,
      side: objectSide,
    }
    // IndexedDB に保存する
    const idDeck = await dbAddDeck(objectDeck)
    // マイデッキペインに移動する
    handleSetActiveDeckSaved(idDeck)
    handleSetActiveTab(enumTabPane.SAVE_AND_LOAD)
  }

  function handleClickClear() {
    handleSetDeckTitle('')
    dispatchDeck.clear()
    interruptSimulator()
  }

  function handleClickConfirmEmpty() {
    setShowModalEmpty(false)
  }

  return (
    <>
      <h2 className="m-2">デッキレシピ</h2>
      {code && showCodeError && (
        <div className="m-2">
          <Alert
            dismissible
            variant="danger"
            onClose={() => handleSetShowCodeError(false)}
          >
            デッキコードが正しくありません: {code}
          </Alert>
        </div>
      )}
      <div className="container-button mx-2 my-2">
        <Button variant="outline-success" onClick={handleClickSave}>
          マイデッキに保存
        </Button>
        <Button variant="outline-danger" onClick={handleClickClear}>
          レシピをクリア
        </Button>
      </div>
      <div className="mx-2 mt-2 mb-3">
        <FormControl
          type="text"
          placeholder="デッキ名を入力 (任意)"
          value={deckTitle}
          onChange={handleChangeDeckTitle}
        />
      </div>
      <Modal show={showModalEmpty}>
        <ModalHeader>
          <ModalTitle>マイデッキ</ModalTitle>
        </ModalHeader>
        <ModalBody>現在のレシピが空のため保存できません。</ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleClickConfirmEmpty}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
      <ContainerDeckPart
        title="メインデッキ"
        deckThis={deckMain}
        dispatchDecrement={dispatchDeck.decrementMain}
        dispatchIncrement={dispatchDeck.incrementMain}
        dispatchMoveOut={dispatchDeck.moveOutMain}
        handleSetIdZoom={handleSetIdZoom}
        interruptSimulator={interruptSimulator}
      />
      <ContainerDeckPart
        title="サイドデッキ"
        deckThis={deckSide}
        dispatchDecrement={dispatchDeck.decrementSide}
        dispatchIncrement={dispatchDeck.incrementSide}
        dispatchMoveOut={dispatchDeck.moveOutSide}
        handleSetIdZoom={handleSetIdZoom}
        interruptSimulator={interruptSimulator}
        isSide
      />
      <h2 className="m-2">レシピを共有</h2>
      <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
      <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
    </>
  )
}

function ContainerDeckPart({
  title,
  deckThis,
  dispatchDecrement,
  dispatchIncrement,
  dispatchMoveOut,
  handleSetIdZoom,
  interruptSimulator,
  isSide = false,
}) {
  const numCards = sum(deckThis.values())

  return (
    <>
      <h3 className="m-2">{`${title} (${numCards}枚)`}</h3>
      <div className="container-card-line-up ms-2">
        {dataCardsArray.map((element) => (
          <ContainerDeckCard
            {...element}
            key={element.id}
            deckThis={deckThis}
            dispatchDecrement={dispatchDecrement}
            dispatchIncrement={dispatchIncrement}
            dispatchMoveOut={dispatchMoveOut}
            handleSetIdZoom={handleSetIdZoom}
            interruptSimulator={interruptSimulator}
            isSide={isSide}
          />
        ))}
      </div>
    </>
  )
}

function ContainerDeckCard({
  id,
  imageUrl,
  name,
  deckThis,
  dispatchDecrement,
  dispatchIncrement,
  dispatchMoveOut,
  handleSetIdZoom,
  interruptSimulator,
  isSide = false,
}) {
  function handleClickMinus() {
    dispatchDecrement(id)
    if (!isSide) {
      interruptSimulator()
    }
  }

  function handleClickPlus() {
    dispatchIncrement(id)
    if (!isSide) {
      interruptSimulator()
    }
  }

  function handleClickMove() {
    dispatchMoveOut(id)
    interruptSimulator()
  }

  function handleClickZoom() {
    handleSetIdZoom(id)
  }

  const numCopies = deckThis.has(id) ? deckThis.get(id) : 0
  const moveText = isSide ? '^' : 'v'
  return (
    numCopies > 0 && (
      <ImageCard imageUrl={imageUrl} alt={name} numCopies={numCopies}>
        <Button
          variant="primary"
          size="sm"
          className="btn-pop"
          onClick={handleClickMinus}
        >
          -
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="btn-push"
          onClick={handleClickPlus}
        >
          +
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="btn-move"
          onClick={handleClickMove}
        >
          {moveText}
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="btn-zoom"
          onClick={handleClickZoom}
        >
          🔍
        </Button>
      </ImageCard>
    )
  )
}

export default TabPaneDeck
