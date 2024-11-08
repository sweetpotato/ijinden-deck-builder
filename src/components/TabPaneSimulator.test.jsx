// SPDX-License-Identifier: MIT

import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test('メインデッキが9枚以下だとスタートできない', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabSimulator = screen.getAllByRole('tab')[3];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneSimulator = screen.getAllByRole('tabpanel')[3];

  // 適当なカードのメインとサイドのプラスボタンを得る
  const buttonPlusMain = paneCard.querySelector('td:nth-child(3) button:nth-child(3)');
  const buttonPlusSide = paneCard.querySelector('td:nth-child(4) button:nth-child(3)');

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();

  const buttonReset = paneSimulator.querySelector('.container-button button:nth-child(1)');
  const buttonStart = paneSimulator.querySelector('.container-button button:nth-child(2)');
  const buttonMulligan = paneSimulator.querySelector('.container-button button:nth-child(3)');
  const buttonKeep = paneSimulator.querySelector('.container-button button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // メインのプラスボタンを9回押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  await user.click(buttonPlusMain);
  
  // サイドのプラスボタンを10回押す
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

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // スタートボタンを押す
  await user.click(buttonStart);

  // 開始できず、アラートが表示される
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  let alert = paneSimulator.querySelector('.alert-warning');
  expect(alert.textContent).toBe('メインデッキの枚数が少なすぎます。10枚以上にしてください。');
  expect(alert).toBeVisible();

  // リセットボタンを押す
  await user.click(buttonReset);

  // アラートが消える
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);
}, 30000);

test('メインデッキが10枚以上でスタートできる', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabSimulator = screen.getAllByRole('tab')[3];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneSimulator = screen.getAllByRole('tabpanel')[3];

  // 適当なカードのメインのプラスボタンを得る
  const buttonPlusMain = paneCard.querySelector('td:nth-child(3) button:nth-child(3)');

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();

  const buttonReset = paneSimulator.querySelector('.container-button button:nth-child(1)');
  const buttonStart = paneSimulator.querySelector('.container-button button:nth-child(2)');
  const buttonMulligan = paneSimulator.querySelector('.container-button button:nth-child(3)');
  const buttonKeep = paneSimulator.querySelector('.container-button button:nth-child(4)');

  expect(buttonReset.textContent).toBe('リセット');
  expect(buttonStart.textContent).toBe('スタート');
  expect(buttonMulligan.textContent).toBe('マリガン');
  expect(buttonKeep.textContent).toBe('キープ');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // メインのプラスボタンを10回押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
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
  
  // 1a. スタートボタンを押す
  await user.click(buttonStart);

  // 1b. シミュレータが開始される
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 1c. リセットボタンを押す
  await user.click(buttonReset);

  // 1d. 初期状態に戻る
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 2a. スタートボタンを押す
  await user.click(buttonStart);

  // 2b. シミュレータが開始される
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 2c. マリガンボタンを押す
  await user.click(buttonMulligan);

  // 2d. シミュレータが終了する
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 2e. リセットボタンを押す
  await user.click(buttonReset);

  // 2f. 初期状態に戻る
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 3a. スタートボタンを押す
  await user.click(buttonStart);

  // 3b. シミュレータが開始される
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 3c. キープボタンを押す
  await user.click(buttonKeep);

  // 3d. シミュレータが終了する
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);

  // 3e. リセットボタンを押す
  await user.click(buttonReset);

  // 3f. 初期状態に戻る
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(paneSimulator.querySelectorAll('.alert-warning').length).toBe(0);
}, 15000);
