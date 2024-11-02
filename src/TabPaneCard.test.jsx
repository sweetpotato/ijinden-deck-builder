// SPDX-License-Identifier: MIT

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { dataCardsArrayForTable } from "./dataCards";

test('カードペインの初期値はカード枚数がすべて0でマイナスボタンは無効', () => {
  render(<App />);

  const paneCard = screen.getAllByRole('tabpanel')[0];

  // メインとサイドをあわせて2倍のテキストボックスがある
  const listInputNumber = paneCard.querySelectorAll('table input[type="number"]');
  expect(listInputNumber.length).toBe(dataCardsArrayForTable.length * 2);

  listInputNumber.forEach((e) => {
    expect(e.value).toBe('0');
  });

  // メインとサイドをあわせて2倍のマイナスボタンがある
  const listButtonMinus = paneCard.querySelectorAll('table .input-group button:nth-child(1)');
  expect(listButtonMinus.length).toBe(dataCardsArrayForTable.length * 2);

  listButtonMinus.forEach((e) => {
    expect(e.textContent).toBe('-');
    expect(e).toBeDisabled();
  });
});

test('カードペイン内でのカード枚数の増減', async () => {
  render(<App />);

  const user = userEvent.setup();

  const paneCard = screen.getAllByRole('tabpanel')[0];

  const buttonMinusMainAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(1)');
  const inputMainAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) input');
  const buttonPlusMainAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  const buttonMinusSideAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(1)');
  const inputSideAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) input');
  const buttonPlusSideAlpha = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)');

  expect(buttonMinusMainAlpha).toBeDisabled();
  expect(buttonMinusSideAlpha).toBeDisabled();
  expect(inputMainAlpha.value).toBe('0');
  expect(inputSideAlpha.value).toBe('0');

  await user.click(buttonPlusMainAlpha);

  expect(buttonMinusMainAlpha).toBeEnabled();
  expect(buttonMinusSideAlpha).toBeDisabled();
  expect(inputMainAlpha.value).toBe('1');
  expect(inputSideAlpha.value).toBe('0');

  await user.click(buttonPlusMainAlpha);

  expect(buttonMinusMainAlpha).toBeEnabled();
  expect(buttonMinusSideAlpha).toBeDisabled();
  expect(inputMainAlpha.value).toBe('2');
  expect(inputSideAlpha.value).toBe('0');

  await user.click(buttonPlusSideAlpha);

  expect(buttonMinusMainAlpha).toBeEnabled();
  expect(buttonMinusSideAlpha).toBeEnabled();
  expect(inputMainAlpha.value).toBe('2');
  expect(inputSideAlpha.value).toBe('1');

  await user.click(buttonPlusSideAlpha);

  expect(buttonMinusMainAlpha).toBeEnabled();
  expect(buttonMinusSideAlpha).toBeEnabled();
  expect(inputMainAlpha.value).toBe('2');
  expect(inputSideAlpha.value).toBe('2');

  await user.click(buttonMinusMainAlpha);

  expect(buttonMinusMainAlpha).toBeEnabled();
  expect(buttonMinusSideAlpha).toBeEnabled();
  expect(inputMainAlpha.value).toBe('1');
  expect(inputSideAlpha.value).toBe('2');

  await user.click(buttonMinusMainAlpha);

  expect(buttonMinusMainAlpha).toBeDisabled();
  expect(buttonMinusSideAlpha).toBeEnabled();
  expect(inputMainAlpha.value).toBe('0');
  expect(inputSideAlpha.value).toBe('2');

  await user.click(buttonMinusSideAlpha);

  expect(buttonMinusMainAlpha).toBeDisabled();
  expect(buttonMinusSideAlpha).toBeEnabled();
  expect(inputMainAlpha.value).toBe('0');
  expect(inputSideAlpha.value).toBe('1');

  await user.click(buttonMinusSideAlpha);

  expect(buttonMinusMainAlpha).toBeDisabled();
  expect(buttonMinusSideAlpha).toBeDisabled();
  expect(inputMainAlpha.value).toBe('0');
  expect(inputSideAlpha.value).toBe('0');
}, 10000);
