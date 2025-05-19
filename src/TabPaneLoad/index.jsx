// SPDX-License-Identifier: MIT

import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Spinner,
} from 'react-bootstrap'

import { dataCardsArrayForDeck } from '../commons/dataCards'
import { dbClearDecks, dbDeleteDeck, dbQueryDecks } from '../commons/db'
import { sum } from '../commons/utils'
import ImageCard from '../components/ImageCard'

// YYYY/mm/dd HH:MM:SS
const DTF = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function TabPaneLoad({
  handleSetDeckTitle,
  activeDeckSaved,
  dispatchSetFromEntries,
  moveToDeck,
  expandAccordion,
  interruptSimulator,
}) {
  const [showModalClear, setShowModalClear] = useState(false)
  const decks = useLiveQuery(async () => await dbQueryDecks())

  function handleClickClear() {
    setShowModalClear(true)
  }

  function handleClickCancelClear() {
    setShowModalClear(false)
  }

  async function handleClickConfirmClear() {
    await dbClearDecks()
    setShowModalClear(false)
  }

  return (
    <>
      <h2 className="m-2">ロード</h2>
      {decks ? (
        <Accordion activeKey={activeDeckSaved} onSelect={expandAccordion}>
          {decks.map((deck) => {
            return (
              <AccordionItemDeckSaved
                key={deck.id}
                deck={deck}
                handleSetDeckTitle={handleSetDeckTitle}
                dispatchSetFromEntries={dispatchSetFromEntries}
                moveToDeck={moveToDeck}
                interruptSimulator={interruptSimulator}
              />
            )
          })}
        </Accordion>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </Spinner>
      )}
      <h2 className="m-2">クリア</h2>
      <div className="m-2">
        <Button variant="outline-danger" onClick={handleClickClear}>
          保存済みレシピをすべて削除
        </Button>
      </div>
      <Modal show={showModalClear}>
        <ModalHeader>
          <ModalTitle>マイデッキ</ModalTitle>
        </ModalHeader>
        <ModalBody>
          保存済みレシピをすべて削除します。よろしいですか？
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleClickCancelClear}>
            キャンセル
          </Button>
          <Button variant="outline-danger" onClick={handleClickConfirmClear}>
            削除する
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function AccordionItemDeckSaved({
  deck,
  handleSetDeckTitle,
  dispatchSetFromEntries,
  moveToDeck,
  interruptSimulator,
}) {
  const timestamp = DTF.format(new Date(deck.timestamp))
  const numCardsMain = sum(deck.main.map(([, n]) => n))
  const numCardsSide = sum(deck.side.map(([, n]) => n))
  const deckTitle = deck.title || '' // There may not be a title
  const subNumCardsMain =
    numCardsSide !== 0 ? `メイン${numCardsMain}枚` : `${numCardsMain}枚`
  const subNumCardsSide = numCardsSide !== 0 ? `/サイド${numCardsSide}枚` : ''
  const header = `#${deck.id} ${deckTitle} [${subNumCardsMain}${subNumCardsSide}] (${timestamp})`

  function handleClickLoad() {
    handleSetDeckTitle(deck.title || '') // There may not be a title
    dispatchSetFromEntries(deck.main, deck.side)
    interruptSimulator()
    moveToDeck()
  }

  async function handleClickDelete() {
    await dbDeleteDeck(deck.id)
  }

  return (
    <AccordionItem eventKey={deck.id}>
      <AccordionHeader>{header}</AccordionHeader>
      <AccordionBody>
        <div className="container-button mb-2">
          <Button variant="outline-success" onClick={handleClickLoad}>
            読込み
          </Button>
          <Button variant="outline-danger" onClick={handleClickDelete}>
            削除
          </Button>
        </div>
        <ContainerDeckSavedPart
          title="メインデッキ"
          deck={new Map(deck.main)}
        />
        <ContainerDeckSavedPart
          title="サイドデッキ"
          deck={new Map(deck.side)}
        />
      </AccordionBody>
    </AccordionItem>
  )
}

function ContainerDeckSavedPart({ title, deck }) {
  const titleFull = `${title} (${sum(deck.values())}枚)`

  return (
    <>
      <h3 className="mb-1">{titleFull}</h3>
      <div className="overflow-auto mb-1" style={{ minHeight: 60 }}>
        {dataCardsArrayForDeck.map(
          (card) =>
            deck.has(card.id) && (
              <ImageCard
                key={card.id}
                imageUrl={card.imageUrl}
                alt={card.name}
                numCopies={deck.get(card.id)}
                loading="lazy"
                small
              />
            )
        )}
      </div>
    </>
  )
}

export default TabPaneLoad
