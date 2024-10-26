import { Button } from 'react-bootstrap';

import ImageCard from './ImageCard';
import { dataCardsArrayForDeck as dataCards } from './dataCards';
import { enumActionSimulator } from './reducerSimulator';
import { handleClickDecrement, handleClickIncrement } from './handleClick';
import { sum } from './utils';

function TabPaneDeck({
  deckMain, handleSetDeckMain, deckSide, handleSetDeckSide,
  dispatchSimulator,
}) {
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
          dataCards.map((element) => (
            <ContainerDeckCard
              {...element}
              key={element.id}
              deckThis={deckMain}
              handleSetDeckThis={handleSetDeckMain}
              deckThat={deckSide}
              handleSetDeckThat={handleSetDeckSide}
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
          dataCards.map((element) => (
            <ContainerDeckCard
              {...element}
              key={element.id}
              deckThis={deckSide}
              handleSetDeckThis={handleSetDeckSide}
              deckThat={deckMain}
              handleSetDeckThat={handleSetDeckMain}
              dispatchSimulator={dispatchSimulator}
              isSide
            />
          ))
          /* eslint-enable react/jsx-props-no-spreading */
        }
      </div>
    </>
  );
}

function ContainerDeckCard({
  id, imageUrl, name,
  deckThis, handleSetDeckThis, deckThat, handleSetDeckThat,
  dispatchSimulator, isSide = false,
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

  const numCopies = deckThis.has(id) ? deckThis.get(id) : 0;
  const show = numCopies > 0;
  const moveText = isSide ? '^' : 'v';
  return (
    <div className="container-card" style={{ display: (show ? 'block' : 'none') }}>
      <ImageCard imageUrl={imageUrl} alt={name} />
      <div className="container-num-copies">{numCopies}</div>
      <Button variant="secondary" size="sm" className="btn-pop" onClick={handleClickMinus}>-</Button>
      <Button variant="secondary" size="sm" className="btn-push" onClick={handleClickPlus}>+</Button>
      <Button variant="secondary" size="sm" className="btn-move" onClick={handleClickMove}>{moveText}</Button>
    </div>
  );
}

export default TabPaneDeck;
