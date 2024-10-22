import { useState } from "react";
import { Alert, Button } from "react-bootstrap";

import ImageCard from "./ImageCard";
import { enumActionSimulator, enumStateSimulator } from "./reducerSimulator";
import { dataCardsMap as dataCards } from "./dataCards";
import { sum } from './utils'

function excludeCards(array, deck) {
  array.forEach((element) => {
    const numCopies = deck.get(element);
    if (numCopies > 1) {
      deck.set(element, numCopies - 1);
    } else {
      deck.delete(element);
    }
  });
  return deck;
}

function makeIdArray(deck) {
  const result = [];
  for (const [id, numCopies] of deck.entries()) {
    for (let i = 0; i < numCopies; ++i) {
      result.push(id);
    }
  }
  return result;
}

function makeRandomIndices(n) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(i);
  }
  // シャッフルする
  for (let i = n - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function setupCards(n, idArray, randomIndices) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(idArray.at(randomIndices.pop()));
  }
  return result;
}

function setupGuardians(idArray, randomIndices) {
  // ガーディアン4枚
  return setupCards(4, idArray, randomIndices);
}

function setupHands(idArray, randomIndices) {
  // 手札6枚
  return setupCards(6, idArray, randomIndices);
}

function setupDraws(idArray, randomIndices) {
  // 残りすべてドロー
  return setupCards(randomIndices.length, idArray, randomIndices);
}

function TabPaneSimulator({ deck, state, dispatch }) {
  const [guardians, setGuardians] = useState(null);
  const [hands, setHands] = useState(null);
  const [draws, setDraws] = useState(null);

  function handleClickReset() {
    setGuardians(null);
    setHands(null);
    setDraws(null);
    dispatch(enumActionSimulator.RESET);
  }

  function handleClickStart() {
    // Do not use reduce; it is not supported on Safari on iOS
    const numCards = sum(deck.values());
    if (numCards < 10) {
      dispatch(enumActionSimulator.CHECK_MAIN_DECK);
      return;
    }
    const idArray = makeIdArray(deck);
    const randomIndices = makeRandomIndices(numCards);

    const newGuardians = setupGuardians(idArray, randomIndices);
    const newHands = setupHands(idArray, randomIndices);

    setGuardians(newGuardians);
    setHands(newHands);
    dispatch(enumActionSimulator.START);
  }

  function handleClickMulligan() {
    const deckRemaining = excludeCards(guardians, new Map(deck));
    const numCards = sum(deckRemaining.values());
    const idArray = makeIdArray(deckRemaining);
    const randomIndices = makeRandomIndices(numCards);

    const newHands = setupHands(idArray, randomIndices);
    const newDraws = setupDraws(idArray, randomIndices);

    setHands(newHands);
    setDraws(newDraws);
    dispatch(enumActionSimulator.CONTINUE);
  }

  function handleClickKeep() {
    const deckRemaining = excludeCards(hands, excludeCards(guardians, new Map(deck)));
    const numCards = sum(deckRemaining.values());
    const idArray = makeIdArray(deckRemaining);
    const randomIndices = makeRandomIndices(numCards);

    const newDraws = setupDraws(idArray, randomIndices);

    setDraws(newDraws);
    dispatch(enumActionSimulator.CONTINUE);
  }

  const enabledStart = state === enumStateSimulator.INITIAL;
  const enabledReset = state !== enumStateSimulator.INITIAL;
  const enabledMulliganOrKeep = state === enumStateSimulator.RUNNING;
  const showGuardiansAndHands =
      state === enumStateSimulator.RUNNING ||
      state === enumStateSimulator.FINISHED ||
      state === enumStateSimulator.ABORTED;
  return (
    <>
      <h2 className="m-2">手札シミュレータβ</h2>
      <div className="container-button mx-2 mt-2 mb-3">
        <Button variant="outline-danger" onClick={handleClickReset}
            disabled={!enabledReset}>リセット</Button>
        <Button variant="outline-success" onClick={handleClickStart}
            disabled={!enabledStart}>スタート</Button>
        <Button variant="outline-secondary" onClick={handleClickMulligan}
            disabled={!enabledMulliganOrKeep}>マリガン</Button>
        <Button variant="outline-secondary" onClick={handleClickKeep}
            disabled={!enabledMulliganOrKeep}>キープ</Button>
      </div>
      {
        state === enumStateSimulator.LESS_THAN_TEN &&
            <Alert variant="warning">&#x26A0;&#xFE0F; メインデッキの枚数が少なすぎます。10枚以上にしてください。</Alert>
      }
      {
        state === enumStateSimulator.ABORTED &&
            <Alert variant="warning">&#x26A0;&#xFE0F; シミュレーション中にメインデッキが編集されました。リセットしてください。</Alert>
      }
      {
        showGuardiansAndHands &&
            <>
              <h3 className="m-2">ガーディアン</h3>
              <div className="container-card-line-up container-guardian ms-2">
                {
                  guardians.map((element, index) => {
                    const card = dataCards.get(element);
                    return (
                      <div key={index} className="container-card">
                        <ImageCard imageUrl={card.imageUrl} alt={card.name} />
                      </div>
                    );
                  })
                }
              </div>
              <h3 className="m-2">手札</h3>
              <div className="container-card-line-up ms-2">
                {
                  hands.map((element, index) => {
                    const card = dataCards.get(element);
                    return (
                      <ImageCard key={index} imageUrl={card.imageUrl} alt={card.name} />
                    );
                  })
                }
              </div>
            </>
      }
      {
        state === enumStateSimulator.FINISHED &&
            <>
              <h3 className="m-2">ドロー</h3>
              <div className="container-card-line-up ms-2">
                {
                  draws.map((element, index) => {
                    const card = dataCards.get(element);
                    return (
                      <ImageCard key={index} imageUrl={card.imageUrl} alt={card.name} />
                    );
                  })
                }
              </div>
            </>
      }
    </>
  )
}

export default TabPaneSimulator;
