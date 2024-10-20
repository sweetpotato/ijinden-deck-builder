import { Button } from "react-bootstrap";

import ImageCard from "./ImageCard";
import { dataCardsArrayForDeck as dataCards } from "./dataCards"
import { handleClickDecrement, handleClickIncrement } from "./handleClick";
import { sum } from './utils'

function TabPaneDeck({
      deckMain, setDeckMain, deckSide, setDeckSide,
      stateSimulator, setStateSimulator }) {
  // Do not use reduce; it is not supported on Safari on iOS
  const numCardsMain = sum(deckMain.values());
  const numCardsSide = sum(deckSide.values());

  return (
    <>
      <h2 className="m-2">メインデッキ ({numCardsMain}枚)</h2>
      <div className="container-card-line-up container-deck m-2">
        {
          dataCards.map((element) => {
            return (
              <ContainerDeckCard {...element} key={element.id}
                  deckThis={deckMain} setDeckThis={setDeckMain}
                  deckThat={deckSide} setDeckThat={setDeckSide}
                  stateSimulator={stateSimulator}
                  setStateSimulator={setStateSimulator} />
            )
          })
        }
      </div>
      <h2 className="mx-2">サイドデッキ ({numCardsSide}枚)</h2>
      <div className="container-card-line-up container-deck m-2">
        {
          dataCards.map((element) => {
            return (
              <ContainerDeckCard
                  {...element} key={element.id}
                  deckThis={deckSide} setDeckThis={setDeckSide}
                  deckThat={deckMain} setDeckThat={setDeckMain}
                  stateSimulator={stateSimulator}
                  setStateSimulator={setStateSimulator}
                  isSide={true} />
            )
          })
        }
      </div>
    </>
  );
}

function ContainerDeckCard({
    id, imageUrl, name,
    deckThis, setDeckThis, deckThat, setDeckThat,
    stateSimulator, setStateSimulator, isSide=false }) {
  function handleClickMinus() {
    handleClickDecrement(id, deckThis, setDeckThis,
        isSide ? undefined : stateSimulator,
        isSide ? undefined : setStateSimulator);
  }

  function handleClickPlus() {
    handleClickIncrement(id, deckThis, setDeckThis,
        isSide ? undefined : stateSimulator,
        isSide ? undefined : setStateSimulator);
  }

  function handleClickMove() {
    handleClickDecrement(id, deckThis, setDeckThis, stateSimulator, setStateSimulator);
    handleClickIncrement(id, deckThat, setDeckThat, stateSimulator, setStateSimulator);
  }

  const numCopies = deckThis.has(id) ? deckThis.get(id) : 0;
  const show = numCopies > 0;
  const moveText = isSide ? "^" : "v";
  return (
    <div className="container-card" style={{ display: (show ? "block" : "none") }}>
      <ImageCard imageUrl={imageUrl} alt={name} />
      <div className="container-num-copies">{numCopies}</div>
      <Button variant="secondary" size="sm" className="btn-pop" onClick={handleClickMinus}>-</Button>
      <Button variant="secondary" size="sm" className="btn-push" onClick={handleClickPlus}>+</Button>
      <Button variant="secondary" size="sm" className="btn-move" onClick={handleClickMove}>{moveText}</Button>
    </div>
  );
}

export default TabPaneDeck;
