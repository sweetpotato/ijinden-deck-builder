// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'react-bootstrap';

import ImageCard from './ImageCard';
import { dataCardsArrayForDeck as dataCardsArray, dataCardsMap } from '../commons/dataCards';
import db from '../commons/db';
import enumTabPane from '../commons/enumTabPane';
import { handleClickDecrement, handleClickIncrement } from '../commons/handleClick';
import { enumActionSimulator } from '../hooks/reducerSimulator';
import { sum } from '../commons/utils';

function TabPaneDeck({
  deckTitle, handleSetDeckTitle, deckMain, handleSetDeckMain, deckSide, handleSetDeckSide,
  handleSetActiveDeckSaved, handleSetActiveTab, dispatchSimulator,
}) {
  const [idZoom, setIdZoom] = useState(null);
  const [showModalEmpty, setShowModalEmpty] = useState(false);

  function handleChangeDeckTitle(event) {
    handleSetDeckTitle(event.target.value);
  }

  function handleSetIdZoom(newIdZoom) {
    setIdZoom(newIdZoom);
  }

  function handleClearIdZoom() {
    setIdZoom(null);
  }

  async function handleClickSave() {
    if (deckMain.size === 0 && deckSide.size === 0) {
      setShowModalEmpty(true);
      return;
    }

    // 現在のデッキをオブジェクト化する
    const timestamp = new Date();
    const objectMain = [...deckMain.entries()];
    const objectSide = [...deckSide.entries()];
    const objectDeck = { timestamp, title: deckTitle, main: objectMain, side: objectSide };
    // IndexedDB に保存する
    const idDeck = await db.decks.add(objectDeck);
    // マイデッキペインに移動する
    handleSetActiveDeckSaved(idDeck);
    handleSetActiveTab(enumTabPane.SAVE_AND_LOAD);
  }

  function handleClickClear() {
    handleSetDeckTitle('');
    handleSetDeckMain(new Map());
    handleSetDeckSide(new Map());
    dispatchSimulator(enumActionSimulator.INTERRUPT);
  }

  function handleClickConfirmEmpty() {
    setShowModalEmpty(false);
  }

  const numCardsMain = sum(deckMain.values());
  const numCardsSide = sum(deckSide.values());

  const titleMain = `メインデッキ (${numCardsMain}枚)`;
  const titleSide = `サイドデッキ (${numCardsSide}枚)`;

  return (
    <>
      <h2 className="m-2">デッキレシピ</h2>
      <div className="container-button mx-2 my-2">
        <Button variant="outline-success" onClick={handleClickSave}>マイデッキに保存</Button>
        <Button variant="outline-danger" onClick={handleClickClear}>レシピをクリア</Button>
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
          <Button variant="outline-secondary" onClick={handleClickConfirmEmpty}>OK</Button>
        </ModalFooter>
      </Modal>
      <h3 className="m-2">{titleMain}</h3>
      <div className="container-card-line-up ms-2">
        {
          /* eslint-disable react/jsx-props-no-spreading */
          dataCardsArray.map((element) => (
            <ContainerDeckCard
              {...element}
              key={element.id}
              deckThis={deckMain}
              handleSetDeckThis={handleSetDeckMain}
              deckThat={deckSide}
              handleSetDeckThat={handleSetDeckSide}
              handleSetIdZoom={handleSetIdZoom}
              dispatchSimulator={dispatchSimulator}
            />
          ))
          /* eslint-enable react/jsx-props-no-spreading */
        }
      </div>
      <h3 className="m-2">{titleSide}</h3>
      <div className="container-card-line-up ms-2">
        {
          /* eslint-disable react/jsx-props-no-spreading */
          dataCardsArray.map((element) => (
            <ContainerDeckCard
              {...element}
              key={element.id}
              deckThis={deckSide}
              handleSetDeckThis={handleSetDeckSide}
              deckThat={deckMain}
              handleSetDeckThat={handleSetDeckMain}
              handleSetIdZoom={handleSetIdZoom}
              dispatchSimulator={dispatchSimulator}
              isSide
            />
          ))
          /* eslint-enable react/jsx-props-no-spreading */
        }
      </div>
      {
        idZoom !== null
          && (
            <Modal show onHide={handleClearIdZoom}>
              <ModalHeader closeButton>
                <ModalTitle>{dataCardsMap.get(idZoom).name}</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <img
                  src={dataCardsMap.get(idZoom).imageUrl}
                  alt={dataCardsMap.get(idZoom).name}
                  style={{ width: '100%', height: 'auto' }}
                />
              </ModalBody>
            </Modal>
          )
      }
    </>
  );
}

function ContainerDeckCard({
  id, imageUrl, name,
  deckThis, handleSetDeckThis, deckThat, handleSetDeckThat,
  handleSetIdZoom, dispatchSimulator, isSide = false,
}) {
  function handleClickMinus() {
    handleClickDecrement(id, deckThis, handleSetDeckThis);
    if (!isSide) {
      dispatchSimulator(enumActionSimulator.INTERRUPT);
    }
  }

  function handleClickPlus() {
    handleClickIncrement(id, deckThis, handleSetDeckThis);
    if (!isSide) {
      dispatchSimulator(enumActionSimulator.INTERRUPT);
    }
  }

  function handleClickMove() {
    handleClickDecrement(id, deckThis, handleSetDeckThis);
    handleClickIncrement(id, deckThat, handleSetDeckThat);
    dispatchSimulator(enumActionSimulator.INTERRUPT);
  }

  function handleClickZoom() {
    handleSetIdZoom(id);
  }

  const numCopies = deckThis.has(id) ? deckThis.get(id) : 0;
  const moveText = isSide ? '^' : 'v';
  return numCopies > 0
    && (
      <ImageCard imageUrl={imageUrl} alt={name} numCopies={numCopies}>
        <Button variant="primary" size="sm" className="btn-pop" onClick={handleClickMinus}>-</Button>
        <Button variant="primary" size="sm" className="btn-push" onClick={handleClickPlus}>+</Button>
        <Button variant="primary" size="sm" className="btn-move" onClick={handleClickMove}>{moveText}</Button>
        <Button variant="primary" size="sm" className="btn-zoom" onClick={handleClickZoom}>🔍</Button>
      </ImageCard>
    );
}

export default TabPaneDeck;
