import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
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
} from 'react-bootstrap';

import { dataCardsArrayForDeck } from './dataCards';
import db from './db';
import enumTabPane from './enumTabPane';
import { enumActionSimulator } from './reducerSimulator';
import { sum } from './utils';

// YYYY/mm/dd HH:MM:SS
const DTF = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function TabPaneSave({
  handleSetDeckMain, handleSetDeckSide,
  activeDeckSaved, handleSetActiveDeckSaved,
  handleSetActiveTab, dispatchSimulator,
}) {
  const [showModalClear, setShowModalClear] = useState(false);
  const decksSaved = useLiveQuery(async () => {
    const results = await db.decks.orderBy(':id').reverse().toArray();
    return results;
  });

  function handleSelectAccordion(eventKey, _event) {
    handleSetActiveDeckSaved(eventKey);
  }

  function handleClickClear() {
    setShowModalClear(true);
  }

  function handleClickCancelClear() {
    setShowModalClear(false);
  }

  async function handleClickConfirmClear() {
    await db.decks.clear();
    setShowModalClear(false);
  }

  return (
    <>
      <h2 className="m-2">ロード</h2>
      <Accordion activeKey={activeDeckSaved} onSelect={handleSelectAccordion}>
        {
          decksSaved?.map((aDeckSaved) => {
            const timestamp = DTF.format(new Date(aDeckSaved.timestamp));
            const header = `#${aDeckSaved.id} (${timestamp})`;
            return (
              <AccordionItem key={aDeckSaved.id} eventKey={aDeckSaved.id}>
                <AccordionHeader>{header}</AccordionHeader>
                <AccordionBody>
                  <ContainerDeckSaved
                    aDeckSaved={aDeckSaved}
                    handleSetDeckMain={handleSetDeckMain}
                    handleSetDeckSide={handleSetDeckSide}
                    handleSetActiveTab={handleSetActiveTab}
                    dispatchSimulator={dispatchSimulator}
                  />
                </AccordionBody>
              </AccordionItem>
            );
          })
        }
        <h2 className="m-2">クリア</h2>
        <div className="m-2">
          <Button variant="outline-danger" onClick={handleClickClear}>保存済みレシピをすべて削除</Button>
        </div>
        <Modal show={showModalClear}>
          <ModalHeader>
            <ModalTitle>マイデッキ</ModalTitle>
          </ModalHeader>
          <ModalBody>保存済みレシピをすべて削除します。よろしいですか？</ModalBody>
          <ModalFooter>
            <Button variant="outline-secondary" onClick={handleClickCancelClear}>キャンセル</Button>
            <Button variant="outline-danger" onClick={handleClickConfirmClear}>削除する</Button>
          </ModalFooter>
        </Modal>
      </Accordion>
    </>
  );
}

function ContainerDeckSaved({
  aDeckSaved,
  handleSetDeckMain, handleSetDeckSide,
  handleSetActiveTab,
  dispatchSimulator,
}) {
  function handleClickLoad() {
    handleSetDeckMain(new Map(aDeckSaved.main));
    handleSetDeckSide(new Map(aDeckSaved.side));
    dispatchSimulator(enumActionSimulator.INTERRUPT);
    handleSetActiveTab(enumTabPane.DECK);
  }

  async function handleClickDelete() {
    await db.decks.delete(aDeckSaved.id);
  }

  return (
    <>
      <div className="container-button mb-2">
        <Button variant="outline-success" onClick={handleClickLoad}>読込み</Button>
        <Button variant="outline-danger" onClick={handleClickDelete}>削除</Button>
      </div>
      <ContainerDeckSavedPart title="メインデッキ" deckSaved={new Map(aDeckSaved.main)} />
      <ContainerDeckSavedPart title="サイドデッキ" deckSaved={new Map(aDeckSaved.side)} />
    </>
  );
}

function ContainerDeckSavedPart({ title, deckSaved }) {
  const titleFull = `${title} (${sum(deckSaved.values())}枚)`;

  return (
    <>
      <h3 className="mb-1">{titleFull}</h3>
      <div className="overflow-auto mb-1" style={{ minHeight: 60 }}>
        {
          dataCardsArrayForDeck.map((card) => (
            deckSaved.has(card.id)
                && (
                  <div key={card.id} className="float-start position-relative me-1 mb-1">
                    <img className="d-block" width="40" height="56" src={card.imageUrl} alt={card.name} />
                    <div
                      className="position-absolute start-0 bottom-0 px-1"
                      style={{ backgroundColor: 'white', border: '1px solid black' }}
                    >
                      {deckSaved.get(card.id)}
                    </div>
                  </div>
                )
          ))
        }
      </div>
    </>
  );
}

export default TabPaneSave;
