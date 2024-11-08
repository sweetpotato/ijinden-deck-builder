// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import {
  Button, FormControl, InputGroup, Table, ToggleButton,
} from 'react-bootstrap';

import { dataCardsArrayForTable as dataCards } from '../commons/dataCards';
import { handleClickDecrement, handleClickIncrement } from '../commons/handleClick';
import { enumActionSimulator } from '../hooks/reducerSimulator';

const dataExpansions = [
  { value: 0, label: 'すべて' },
  { value: 10, label: '伝説の武将' },
  { value: 11, label: '知と美の革命' },
  { value: 12, label: '日本の大天才' },
  { value: 15, label: '第１弾ブースター' },
  { value: 20, label: '三国の英傑' },
  { value: 25, label: '第２弾ブースター' },
  { value: 30, label: '発展する医療' },
  { value: 35, label: '第３弾ブースター' },
];

const dataColors = [
  { value: 0, label: 'すべて' },
  { value: 1, label: '赤' },
  { value: 2, label: '青' },
  { value: 4, label: '緑' },
  { value: 8, label: '黄' },
  { value: 16, label: '紫' },
  { value: 32, label: '多色' },
  { value: 64, label: '無色' },
];

const dataTypes = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'イジン' },
  { value: 2, label: 'ハイケイ' },
  { value: 3, label: 'マホウ' },
  { value: 4, label: 'マリョク' },
];

const dataTerms = [
  { value: 0, label: '指定なし' },
  { value: 1, label: '航海' },
  { value: 2, label: '執筆' },
  { value: 3, label: '決起' },
  { value: 4, label: '徴募' },
];

function TabPaneCard({
  deckMain, handleSetDeckMain, deckSide, handleSetDeckSide,
  dispatchSimulator,
}) {
  const [expansion, setExpansion] = useState(0);
  const [color, setColor] = useState(0);
  const [type, setType] = useState(0);
  const [term, setTerm] = useState(0);

  function handleChangeExpansion(e) {
    setExpansion(Number(e.currentTarget.value));
  }

  function handleChangeColor(e) {
    setColor(Number(e.currentTarget.value));
  }

  function handleChangeType(e) {
    setType(Number(e.currentTarget.value));
  }

  function handleChangeTerm(e) {
    setTerm(Number(e.currentTarget.value));
  }

  return (
    <>
      <ContainerFilter
        title="エキスパンション"
        name="expansion"
        state={expansion}
        handleChange={handleChangeExpansion}
        data={dataExpansions}
      />
      <ContainerFilter
        title="色"
        name="color"
        state={color}
        handleChange={handleChangeColor}
        data={dataColors}
      />
      <ContainerFilter
        title="種類"
        name="type"
        state={type}
        handleChange={handleChangeType}
        data={dataTypes}
      />
      <ContainerFilter
        title="能力語"
        name="term"
        state={term}
        handleChange={handleChangeTerm}
        data={dataTerms}
      />
      <Table hover variant="light">
        <thead className="sticky-top">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">カード名</th>
            <th scope="col">メイン</th>
            <th scope="col">サイド</th>
          </tr>
        </thead>
        <tbody>
          {
            /* eslint-disable react/jsx-props-no-spreading */
            dataCards.map((element) => (
              <TableRowCard
                {...element}
                key={element.id}
                selectedExpansion={expansion}
                selectedColor={color}
                selectedType={type}
                selectedTerm={term}
                deckMain={deckMain}
                handleSetDeckMain={handleSetDeckMain}
                deckSide={deckSide}
                handleSetDeckSide={handleSetDeckSide}
                dispatchSimulator={dispatchSimulator}
              />
            ))
            /* eslint-enable react/jsx-props-no-spreading */
          }
        </tbody>
      </Table>
    </>
  );
}

function ContainerFilter({
  title, name, state, handleChange, data,
}) {
  return (
    <fieldset className="container-button m-2">
      <legend className="h3">
        {title}
      </legend>
      {
        data.map((element) => {
          const id = `${name}-${element.value}`;
          return (
            <ToggleButton
              key={id}
              type="radio"
              variant="outline-primary"
              id={id}
              name={name}
              value={element.value}
              onChange={handleChange}
              checked={state === element.value}
            >
              {element.label}
            </ToggleButton>
          );
        })
      }
    </fieldset>
  );
}

function TableRowCard({
  id, name, expansion, color, type, term,
  selectedExpansion, selectedType, selectedColor, selectedTerm,
  deckMain, handleSetDeckMain, deckSide, handleSetDeckSide,
  dispatchSimulator,
}) {
  /* eslint-disable no-bitwise */
  const show = (selectedExpansion === 0 || expansion === selectedExpansion)
      && (selectedColor === 0 || (color & selectedColor) === selectedColor)
      && (selectedType === 0 || type === selectedType)
      && (selectedTerm === 0 || term === selectedTerm);
  let colorClass;
  if (color === 41) {
    colorClass = 'bg-ijinden-red-yellow';
  } else if (color === 42) {
    colorClass = 'bg-ijinden-blue-yellow';
  } else if (color === 44) {
    colorClass = 'bg-ijinden-green-yellow';
  } else if (color === 1) {
    colorClass = 'bg-ijinden-red';
  } else if (color === 2) {
    colorClass = 'bg-ijinden-blue';
  } else if (color === 4) {
    colorClass = 'bg-ijinden-green';
  } else if (color === 8) {
    colorClass = 'bg-ijinden-yellow';
  } else if (color === 16) {
    colorClass = 'bg-ijinden-purple';
  } else {
    colorClass = 'bg-ijinden-colorless';
  }
  /* eslint-enable no-bitwise */
  return (
    <tr
      data-id={id}
      data-expansion={expansion}
      data-color={color}
      data-type={type}
      data-term={term}
      style={{ display: (show ? 'table-row' : 'none') }}
    >
      <td className={colorClass}>{id}</td>
      <td>{name}</td>
      <td>
        <FormControlCounter
          id={id}
          deck={deckMain}
          handleSetDeck={handleSetDeckMain}
          dispatchSimulator={dispatchSimulator}
        />
      </td>
      <td>
        <FormControlCounter id={id} deck={deckSide} handleSetDeck={handleSetDeckSide} />
      </td>
    </tr>
  );
}

function FormControlCounter({
  id, deck, handleSetDeck, dispatchSimulator = undefined,
}) {
  function handleClickMinus() {
    handleClickDecrement(id, deck, handleSetDeck);
    if (dispatchSimulator !== undefined) {
      dispatchSimulator(enumActionSimulator.INTERRUPT);
    }
  }

  function handleClickPlus() {
    handleClickIncrement(id, deck, handleSetDeck);
    if (dispatchSimulator !== undefined) {
      dispatchSimulator(enumActionSimulator.INTERRUPT);
    }
  }

  const name = (dispatchSimulator !== undefined ? 'main-' : 'side-') + id;
  const counter = deck.has(id) ? deck.get(id) : 0;
  return (
    <InputGroup>
      <Button
        variant="outline-secondary"
        onClick={handleClickMinus}
        disabled={counter <= 0}
      >
        -
      </Button>
      <FormControl type="number" readOnly name={name} value={counter} />
      <Button variant="outline-secondary" onClick={handleClickPlus}>+</Button>
    </InputGroup>
  );
}

export default TabPaneCard;
