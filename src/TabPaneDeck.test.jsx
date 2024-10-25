import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { dataCardsArrayForDeck, dataCardsMap } from './dataCards';

test('初期状態はすべて非表示', () => {
  render(<App />);

  // レシピペインはゼロオリジンで位置1にある。
  const tabPaneDeck = screen.getAllByRole('tabpanel')[1];

  const imageList = tabPaneDeck.querySelectorAll('img');

  // メインとサイドをあわせて2倍の img タグがある。
  expect(imageList.length).toBe(dataCardsArrayForDeck.length * 2);

  imageList.forEach((e) => {
    expect(e).not.toBeVisible();
  });
});

test('レシピペイン内でのカード枚数の増減', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const tabPaneDeck = screen.getAllByRole('tabpanel')[1];

  const card = dataCardsMap.get('R-1');
  const imageList = tabPaneDeck.querySelectorAll(`img[src="${card.imageUrl}"]`);
  expect(imageList.length).toBe(2);

  const imageMain = imageList[0];
  const imageSide = imageList[1];
  const containerNumCopiesMain = imageMain.parentElement.querySelector('.container-num-copies');
  const containerNumCopiesSide = imageSide.parentElement.querySelector('.container-num-copies');
  const buttonMinusMain = imageMain.parentElement.querySelector('.btn-pop');
  const buttonPlusMain = imageMain.parentElement.querySelector('.btn-push');
  const buttonDrop = imageMain.parentElement.querySelector('.btn-move');
  const buttonMinusSide = imageSide.parentElement.querySelector('.btn-pop');
  const buttonPlusSide = imageSide.parentElement.querySelector('.btn-push');
  const buttonRaise = imageSide.parentElement.querySelector('.btn-move');

  expect(imageMain).not.toBeVisible();
  expect(imageSide).not.toBeVisible();

  // 初期状態を与えるために、カードペインのメインとサイドのプラスボタンを1回ずつクリックする。
  await user.click(tabPaneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)'));
  await user.click(tabPaneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)'));

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('1');
  expect(containerNumCopiesSide.textContent).toBe('1');

  await user.click(buttonPlusMain);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('2');
  expect(containerNumCopiesSide.textContent).toBe('1');

  await user.click(buttonPlusSide);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('2');
  expect(containerNumCopiesSide.textContent).toBe('2');

  await user.click(buttonDrop);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('1');
  expect(containerNumCopiesSide.textContent).toBe('3');

  await user.click(buttonRaise);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('2');
  expect(containerNumCopiesSide.textContent).toBe('2');

  await user.click(buttonMinusSide);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('2');
  expect(containerNumCopiesSide.textContent).toBe('1');

  await user.click(buttonMinusMain);

  expect(imageMain).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('1');
  expect(containerNumCopiesSide.textContent).toBe('1');

  await user.click(buttonMinusSide);

  expect(imageMain).toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('1');
  expect(containerNumCopiesSide.textContent).toBe('0');

  await user.click(buttonMinusMain);

  expect(imageMain).not.toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(containerNumCopiesMain.textContent).toBe('0');
  expect(containerNumCopiesSide.textContent).toBe('0');
}, 10000); // 10s
