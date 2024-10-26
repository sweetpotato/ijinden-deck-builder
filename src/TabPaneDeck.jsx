import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import ImageCard from './ImageCard';
import { dataCardsArrayForDeck as dataCardsArray, dataCardsMap } from './dataCards';
import { enumActionSimulator } from './reducerSimulator';
import { handleClickDecrement, handleClickIncrement } from './handleClick';
import { sum } from './utils';

function TabPaneDeck({
  deckMain, handleSetDeckMain, deckSide, handleSetDeckSide,
  dispatchSimulator,
}) {
  const [idZoom, setIdZoom] = useState(null);

  function handleSetIdZoom(newIdZoom) {
    setIdZoom(newIdZoom);
  }

  function handleClearIdZoom() {
    setIdZoom(null);
  }

  // Do not use reduce; it is not supported on Safari on iOS
  const numCardsMain = sum(deckMain.values());
  const numCardsSide = sum(deckSide.values());

  const titleMain = `メインデッキ (${numCardsMain}枚)`;
  const titleSide = `サイドデッキ (${numCardsSide}枚)`;

  return (
    <>
      <h2 className="m-2">{titleMain}</h2>
      <div className="container-card-line-up container-deck ms-2">
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
      <h2 className="m-2">{titleSide}</h2>
      <div className="container-card-line-up container-deck ms-2">
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

  function renderZoom(props) {
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <Tooltip {...props}>
        <Button
          variant="outline-secondary"
          size="sm"
          style={{ border: 'none', background: 'transparent' }}
          onClick={handleClickZoom}
        >
          🔍
        </Button>
      </Tooltip>
    );
    /* eslint-enable react/jsx-props-no-spreading */
  }

  const numCopies = deckThis.has(id) ? deckThis.get(id) : 0;
  const show = numCopies > 0;
  const moveText = isSide ? '^' : 'v';
  return (
    <OverlayTrigger placement="bottom" delay={{ show: 0, hide: 500 }} overlay={renderZoom}>
      <div className="container-card" style={{ display: (show ? 'block' : 'none') }}>
        <ImageCard imageUrl={imageUrl} alt={name} />
        <div className="container-num-copies">{numCopies}</div>
        <Button variant="secondary" size="sm" className="btn-pop" onClick={handleClickMinus}>-</Button>
        <Button variant="secondary" size="sm" className="btn-push" onClick={handleClickPlus}>+</Button>
        <Button variant="secondary" size="sm" className="btn-move" onClick={handleClickMove}>{moveText}</Button>
      </div>
    </OverlayTrigger>
  );
}

export default TabPaneDeck;
