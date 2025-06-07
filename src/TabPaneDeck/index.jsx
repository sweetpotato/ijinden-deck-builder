// SPDX-License-Identifier: MIT

import { memo, useId, useState } from 'react'
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

import { dataCardsMap } from '../commons/dataCards'
import { dbAddDeck } from '../commons/db'
import { sum } from '../commons/utils'
import ImageCard from '../components/ImageCard'
import ContainerDeckShare from './ContainerDeckShare'
import ContainerDeckExport from './ContainerDeckExport'
import ContainerDeckImport from './ContainerDeckImport'

import './index.css'

function TabPaneDeck({
  code,
  showCodeError,
  setShowCodeError,
  deckTitle,
  setDeckTitle,
  deckMain,
  deckSide,
  dispatchDeck,
  zoomIn,
  moveToLoad,
  expandAccordion,
  interruptSimulator,
}) {
  const [showModalEmpty, setShowModalEmpty] = useState(false)

  function handleChangeDeckTitle(event) {
    setDeckTitle(event.target.value)
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
    expandAccordion(idDeck)
    moveToLoad()
  }

  function handleClickClear() {
    setDeckTitle('')
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
            onClose={() => setShowCodeError(false)}
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
        deck={deckMain}
        dispatchDecrement={dispatchDeck.decrementMain}
        dispatchIncrement={dispatchDeck.incrementMain}
        dispatchMoveOut={dispatchDeck.moveOutMain}
        zoomIn={zoomIn}
        interruptSimulator={interruptSimulator}
      />
      <ContainerDeckPart
        title="サイドデッキ"
        deck={deckSide}
        dispatchDecrement={dispatchDeck.decrementSide}
        dispatchIncrement={dispatchDeck.incrementSide}
        dispatchMoveOut={dispatchDeck.moveOutSide}
        zoomIn={zoomIn}
        interruptSimulator={interruptSimulator}
        isSide
      />
      <h2 className="m-2">レシピを共有</h2>
      <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
      <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
      <h2 className="m-2">共有リンクでインポート</h2>
      <ContainerDeckImport
        dispatchSetFromEntries={dispatchDeck.setFromEntries}
      />
    </>
  )
}

function ContainerDeckPart({
  title,
  deck,
  dispatchDecrement,
  dispatchIncrement,
  dispatchMoveOut,
  zoomIn,
  interruptSimulator,
  isSide = false,
}) {
  const id = useId()
  const numCards = sum(deck.values())
  const deckInternal = [...deck.entries()]
    .map(([id, numCopies]) => {
      return {
        id,
        numCopies,
        name: dataCardsMap.get(id).name,
        imageUrl: dataCardsMap.get(id).imageUrl,
        orderDeck: dataCardsMap.get(id).orderDeck,
      }
    })
    .sort((a, b) => a.orderDeck - b.orderDeck)

  return (
    <section aria-labelledby={id}>
      <h3 className="m-2">
        <span id={id}>{title}</span> ({numCards}枚)
      </h3>
      <ul aria-labelledby={id} className="list-card card-medium ms-2">
        {deckInternal.map((element) => (
          <ContainerDeckCard
            key={element.id}
            id={element.id}
            imageUrl={element.imageUrl}
            name={element.name}
            numCopies={element.numCopies}
            dispatchDecrement={dispatchDecrement}
            dispatchIncrement={dispatchIncrement}
            dispatchMoveOut={dispatchMoveOut}
            zoomIn={zoomIn}
            interruptSimulator={interruptSimulator}
            isSide={isSide}
          />
        ))}
      </ul>
    </section>
  )
}

const ContainerDeckCard = memo(function ContainerDeckCard({
  id,
  imageUrl,
  name,
  numCopies,
  dispatchDecrement,
  dispatchIncrement,
  dispatchMoveOut,
  zoomIn,
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
    zoomIn(id)
  }

  const moveText = isSide ? '^' : 'v'
  return (
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
})

export default TabPaneDeck
