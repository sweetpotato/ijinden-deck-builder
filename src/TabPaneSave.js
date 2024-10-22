import { useState } from 'react';
import {
  Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'react-bootstrap';

import { dataCardsArrayForDeck } from './dataCards';
import enumTabPane from './enumTabPane';
import useLocalStorage from './useLocalStorage';
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
  deckMain, setDeckMain, deckSide, setDeckSide, setActiveTab, dispatchSimulator,
}) {
  const [decksSaved, setDecksSaved] = useLocalStorage();
  const [showModalEmpty, setShowModalEmpty] = useState(false);
  const [showModalClear, setShowModalClear] = useState(false);

  function handleClickSave() {
    if (deckMain.size === 0 && deckSide.size === 0) {
      setShowModalEmpty(true);
      return;
    }

    // 現在のデッキをオブジェクト化する。
    const idDeck = decksSaved.length > 0 ? decksSaved[decksSaved.length - 1][0] + 1 : 1;
    const timestamp = (new Date()).toJSON();
    const objectMain = [...deckMain.entries()];
    const objectSide = [...deckSide.entries()];
    const objectDeck = [idDeck, { timestamp, main: objectMain, side: objectSide }];
    // 最新のデッキとして、リストの末尾に保存する。
    const newDecksSaved = [...decksSaved, objectDeck];
    setDecksSaved(newDecksSaved);
  }

  function handleClickConfirmEmpty() {
    setShowModalEmpty(false);
  }

  function handleClickClear() {
    setShowModalClear(true);
  }

  function handleClickCancelClear() {
    setShowModalClear(false);
  }

  function handleClickConfirmClear() {
    setDecksSaved([]);
    setShowModalClear(false);
  }

  return (
    <>
      <h2 className="m-2">セーブ</h2>
      <div className="m-2">
        <Button variant="outline-success" onClick={handleClickSave}>現在のレシピを保存</Button>
      </div>
      <Modal show={showModalEmpty}>
        <ModalHeader>マイデッキ</ModalHeader>
        <ModalBody>現在のレシピが空のため保存できません。</ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleClickConfirmEmpty}>OK</Button>
        </ModalFooter>
      </Modal>

      <h2 className="m-2">ロード</h2>
      <Accordion>
        {
          [...decksSaved].reverse().map((aDeckSaved, index) => {
            const idDeck = aDeckSaved[0];
            const timestamp = DTF.format(new Date(aDeckSaved[1].timestamp));
            const header = `#${idDeck} (${timestamp})`;
            return (
              <AccordionItem key={idDeck} eventKey={idDeck}>
                <AccordionHeader>{header}</AccordionHeader>
                <AccordionBody>
                  <ContainerDeckSaved
                    idDeck={idDeck}
                    aDeckSaved={aDeckSaved[1]}
                    decksSaved={decksSaved}
                    setDecksSaved={setDecksSaved}
                    setDeckMain={setDeckMain}
                    setDeckSide={setDeckSide}
                    setActiveTab={setActiveTab}
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
          <ModalHeader>マイデッキ</ModalHeader>
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
  idDeck, aDeckSaved,
  decksSaved, setDecksSaved,
  setDeckMain, setDeckSide,
  setActiveTab,
  dispatchSimulator,
}) {
  function handleClickLoad() {
    setDeckMain(new Map(aDeckSaved.main));
    setDeckSide(new Map(aDeckSaved.side));
    dispatchSimulator(enumActionSimulator.INTERRUPT);
    setActiveTab(enumTabPane.DECK);
  }

  function handleClickDelete() {
    const newDecksSaved = new Map(decksSaved);
    newDecksSaved.delete(idDeck);
    setDecksSaved([...newDecksSaved.entries()]);
  }

  return (
    <>
      <div className="container-button mb-2">
        <Button variant="outline-success" onClick={handleClickLoad}>現在のレシピを破棄して読込み</Button>
        <Button variant="outline-danger" onClick={handleClickDelete}>削除</Button>
      </div>
      <ContainerDeckSavedPart title="メインデッキ" deckSaved={new Map(aDeckSaved.main)} />
      <ContainerDeckSavedPart title="サイドデッキ" deckSaved={new Map(aDeckSaved.side)} />
    </>
  );
}

function ContainerDeckSavedPart({ title, deckSaved }) {
  return (
    <>
      <h3 className="mb-1">{title} ({sum(deckSaved.values())}枚)</h3>
      <div className="overflow-auto mb-1" style={{ minHeight: 60 }}>
        {
          dataCardsArrayForDeck.map((card) => (
            deckSaved.has(card.id)
                && <div key={card.id} className="float-start position-relative me-1 mb-1">
                  <img className="d-block" width="40" height="56" src={card.imageUrl} alt={card.name} />
                  <div
                    className="position-absolute start-0 bottom-0 px-1"
                    style={{ backgroundColor: 'white', border: '1px solid black' }}
                  >
                    {deckSaved.get(card.id)}
                  </div>
                </div>
          ))
        }
      </div>
    </>
  );
}

export default TabPaneSave;
