import { render } from "@testing-library/react";

import App from "./App";
import { dataCardsArrayForTable } from "./dataCards";
import userEvent from "@testing-library/user-event";

test('カード枚数の初期値はすべて0', () => {
  const { container } = render(<App />);

  // カード枚数のテキストボックスを得る。
  const inputListNumber = container.querySelectorAll('table input[type="number"]');
  // メインとサイドをあわせて2倍のテキストボックスがある。
  expect(inputListNumber.length).toBe(dataCardsArrayForTable.length * 2);
  // 初期値が0であることのアサーション。
  inputListNumber.forEach((e) => {
    // DOM から得られる値は文字列であることに注意せよ。
    expect(e.value).toBe('0');
  });

  // マイナスボタンを得る。
  const buttonListMinus = container.querySelectorAll('table .input-group button:nth-child(1)');
  // メインとサイドをあわせて2倍のマイナスボタンがある。
  expect(buttonListMinus.length).toBe(dataCardsArrayForTable.length * 2);
  // マイナスボタンが無効であることのアサーション。
  buttonListMinus.forEach((e) => {
    expect(e.textContent).toBe('-');
    expect(e).toBeDisabled();
  });
});

test('カード枚数の増減', async () => {
  const user = userEvent.setup();

  const { container } = render(<App />);

  const cardAlpha = container.querySelector('table tr[data-id="R-1"]');
  const buttonMinusMainAlpha = cardAlpha.querySelector('td:nth-child(3) button:nth-child(1)');
  const inputMainAlpha = cardAlpha.querySelector('td:nth-child(3) input');
  const buttonPlusMainAlpha = cardAlpha.querySelector('td:nth-child(3) button:nth-child(3)');
  const buttonMinusSideAlpha = cardAlpha.querySelector('td:nth-child(4) button:nth-child(1)');
  const inputSideAlpha = cardAlpha.querySelector('td:nth-child(4) input');
  const buttonPlusSideAlpha = cardAlpha.querySelector('td:nth-child(4) button:nth-child(3)');

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
});
