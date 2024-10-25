import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test('メインデッキが9枚以下だとスタートできない', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const buttonPlusMain = tabPaneCard.querySelector('td:nth-child(3) button:nth-child(3)');
  const buttonPlusSide = tabPaneCard.querySelector('td:nth-child(4) button:nth-child(3)');

  const tabPaneSimulator = screen.getAllByRole('tabpanel')[3];
  const containerButton = tabPaneSimulator.querySelector('.container-button');
  const buttonReset = containerButton.querySelector('button:nth-child(1)');
  const buttonStart = containerButton.querySelector('button:nth-child(2)');
  const buttonMulligan = containerButton.querySelector('button:nth-child(3)');
  const buttonKeep = containerButton.querySelector('button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();

  let alert = screen.queryByRole('alert');
  expect(alert).toBeNull();

  // メインのプラスボタンを9回クリック
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  
  // サイドのプラスボタンを10回クリック
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);
  await user.click(buttonPlusSide);

  await user.click(buttonStart);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  
  alert = screen.getByRole('alert');
  expect(alert.textContent).toBe('⚠️ メインデッキの枚数が少なすぎます。10枚以上にしてください。');
  expect(alert).toBeVisible();

  await user.click(buttonReset);

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();

  alert = screen.queryByRole('alert');
  expect(alert).toBeNull();
}, 10000); // 10s

test('メインデッキが10枚以上でスタート、リセット', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const buttonPlusMain = tabPaneCard.querySelector('td:nth-child(3) button:nth-child(3)');

  const tabPaneSimulator = screen.getAllByRole('tabpanel')[3];
  const containerButton = tabPaneSimulator.querySelector('.container-button');
  const buttonReset = containerButton.querySelector('button:nth-child(1)');
  const buttonStart = containerButton.querySelector('button:nth-child(2)');
  const buttonMulligan = containerButton.querySelector('button:nth-child(3)');
  const buttonKeep = containerButton.querySelector('button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // メインのプラスボタンを10回クリック
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  
  await user.click(buttonStart);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(buttonReset);

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();
}, 10000);

test('メインデッキが10枚以上でスタート、マリガン、リセット', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const buttonPlusMain = tabPaneCard.querySelector('td:nth-child(3) button:nth-child(3)');

  const tabPaneSimulator = screen.getAllByRole('tabpanel')[3];
  const containerButton = tabPaneSimulator.querySelector('.container-button');
  const buttonReset = containerButton.querySelector('button:nth-child(1)');
  const buttonStart = containerButton.querySelector('button:nth-child(2)');
  const buttonMulligan = containerButton.querySelector('button:nth-child(3)');
  const buttonKeep = containerButton.querySelector('button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // メインのプラスボタンを10回クリック
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  
  await user.click(buttonStart);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(buttonMulligan);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(buttonReset);

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();
}, 10000); // 10s

test('メインデッキが10枚以上でスタート、キープ、リセット', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const buttonPlusMain = tabPaneCard.querySelector('td:nth-child(3) button:nth-child(3)');

  const tabPaneSimulator = screen.getAllByRole('tabpanel')[3];
  const containerButton = tabPaneSimulator.querySelector('.container-button');
  const buttonReset = containerButton.querySelector('button:nth-child(1)');
  const buttonStart = containerButton.querySelector('button:nth-child(2)');
  const buttonMulligan = containerButton.querySelector('button:nth-child(3)');
  const buttonKeep = containerButton.querySelector('button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // メインのプラスボタンを10回クリック
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  
  await user.click(buttonStart);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(buttonKeep);

  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(buttonReset);

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();
}, 10000); // 10s
