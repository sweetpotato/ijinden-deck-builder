// SPDX-License-Identifier: MIT

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { dataCardsArrayForDeck, dataCardsMap } from './dataCards';

test('レシピペインの初期状態はすべて非表示', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabDeck = screen.getAllByRole('tab')[1];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();

  expect(paneDeck.querySelectorAll('img').length).toBe(0);
});

test('レシピペイン内でのカード枚数の増減', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabDeck = screen.getAllByRole('tab')[1];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  // 初期状態を与えるために、カードペインのメインとサイドのプラスボタンを1回ずつ押す
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)'));
  await user.click(paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)'));

  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const imageMain = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageSide = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  const numCopiesMain = imageMain.parentElement.querySelector('.container-num-copies');
  const numCopiesSide = imageSide.parentElement.querySelector('.container-num-copies');
  const buttonMinusMain = imageMain.parentElement.querySelector('.btn-pop');
  const buttonPlusMain = imageMain.parentElement.querySelector('.btn-push');
  const buttonDrop = imageMain.parentElement.querySelector('.btn-move');
  const buttonMinusSide = imageSide.parentElement.querySelector('.btn-pop');
  const buttonPlusSide = imageSide.parentElement.querySelector('.btn-push');
  const buttonRaise = imageSide.parentElement.querySelector('.btn-move');

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');
  expect(numCopiesSide.textContent).toBe('1');
  expect(buttonMinusMain.textContent).toBe('-');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonDrop.textContent).toBe('v');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(buttonPlusSide.textContent).toBe('+');
  expect(buttonRaise.textContent).toBe('^');

  await user.click(buttonPlusMain);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');
  expect(numCopiesSide.textContent).toBe('1');

  await user.click(buttonPlusSide);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');
  expect(numCopiesSide.textContent).toBe('2');

  await user.click(buttonDrop);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');
  expect(numCopiesSide.textContent).toBe('3');

  await user.click(buttonRaise);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');
  expect(numCopiesSide.textContent).toBe('2');

  await user.click(buttonMinusSide);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');
  expect(numCopiesSide.textContent).toBe('1');

  await user.click(buttonMinusMain);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');
  expect(numCopiesSide.textContent).toBe('1');

  const buttonClear = paneDeck.querySelector('.container-button button:nth-child(2)');
  expect(buttonClear.textContent).toBe('レシピをクリア');
  await user.click(buttonClear);

  expect(imageMain).not.toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();
  expect(numCopiesSide).not.toBeVisible();
}, 10000);
