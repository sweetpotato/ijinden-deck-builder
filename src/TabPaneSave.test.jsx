import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test('レシピが空だと保存できない', async () => {
  // localStorage を模倣
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => "[]"));

  render(<App />);

  const user = userEvent.setup();

  // useState の初期値をセットするコールバックから1回呼ばれる
  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  // useEffect のセットアップコードから1回呼ばれる
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  // モーダルはまだない
  expect(screen.queryByRole('dialog')).toBeNull();

  const tabDeck = screen.getAllByRole('tab')[1];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  // 保存ボタンをクリック
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const buttonSave = paneDeck.querySelector('div:nth-child(2) button');
  expect(buttonSave.textContent).toBe('マイデッキβに保存');
  await user.click(buttonSave);

  // 現在のレシピが空のため保存されない (呼出し回数が増えない)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  // モーダルが表示される
  const modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('現在のレシピが空のため保存できません。');

  // OK ボタンを押す
  const buttonOk = modal.querySelector('.modal-footer button');
  expect(buttonOk.textContent).toBe('OK');
  await user.click(buttonOk);
  // モーダルがひっこむ
  expect(screen.queryByRole('dialog')).toBeNull();

  jest.restoreAllMocks();
});

test('レシピに1枚でもあるなら保存できる', async () => {
  const storage = new Map();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn((k, v) => storage.set(k, v)));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => "[]"));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const tabSave = screen.getAllByRole('tab')[2];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneDeck = screen.getAllByRole('tabpanel')[1];
  const paneSave = screen.getAllByRole('tabpanel')[2];

  // カードペインの適当なカードのメインプラスボタンを押す
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  const buttonPlusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  expect(buttonPlusMain.textContent).toBe('+');
  const inputMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) input');
  expect(inputMain.value).toBe('0');
  await user.click(buttonPlusMain);
  expect(inputMain.value).toBe('1');

  // 保存ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const buttonSave = paneDeck.querySelector('div:nth-child(2) button');
  expect(buttonSave.textContent).toBe('マイデッキβに保存');
  await user.click(buttonSave);

  // 保存される (呼出し回数が1増える)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
  // マイデッキペインに移動した
  // 保存されたデッキの表示の確認
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  expect(paneSave.querySelectorAll('.accordion-item').length).toBe(1);

  // 保存されたデータの検証
  let stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  let decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(1);
  expect(decksSaved[0][0]).toBe(1);
  expect(decksSaved[0][1].main.length).toBe(1);
  expect(decksSaved[0][1].main[0][0]).toBe('R-1');
  expect(decksSaved[0][1].main[0][1]).toBe(1);
  expect(decksSaved[0][1].side.length).toBe(0);

  // メインデッキに増やしたカードを元に戻して0枚にする
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  const buttonMinusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(1)');
  expect(buttonMinusMain.textContent).toBe('-');
  await user.click(buttonMinusMain);
  expect(inputMain.value).toBe('0');

  // カードペインの適当なカードのサイドプラスボタンを押す
  const buttonPlusSide = paneCard.querySelector('tr[data-id="R-2"] td:nth-child(4) button:nth-child(3)');
  expect(buttonPlusSide.textContent).toBe('+');
  const inputSide = paneCard.querySelector('tr[data-id="R-2"] td:nth-child(4) input');
  expect(inputSide.value).toBe('0');
  await user.click(buttonPlusSide);
  expect(inputSide.value).toBe('1');

  // 保存ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonSave);

  // 保存される (呼出し回数がさらに1増える)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);
  // マイデッキペインに移動した
  // 保存されたデッキの表示の確認
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  expect(paneSave.querySelectorAll('.accordion-item').length).toBe(2);
  // 新しく保存されたデッキはリストの末尾に追加される
  stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0][0]).toBe(1);
  expect(decksSaved[0][1].main.length).toBe(1);
  expect(decksSaved[0][1].main[0][0]).toBe('R-1');
  expect(decksSaved[0][1].main[0][1]).toBe(1);
  expect(decksSaved[0][1].side.length).toBe(0);
  expect(decksSaved[1][0]).toBe(2);
  expect(decksSaved[1][1].main.length).toBe(0);
  expect(decksSaved[1][1].side.length).toBe(1);
  expect(decksSaved[1][1].side[0][0]).toBe('R-2');
  expect(decksSaved[1][1].side[0][1]).toBe(1);

  jest.restoreAllMocks();
});

test('保存済みデッキの表示と削除', async () => {
  const stringifiedDecksSaved = JSON.stringify([
    [1, { timestamp: new Date(), main: [['R-1', 1]], side: [] }],
    [2, { timestamp: new Date(), main: [['R-2', 2]], side: [['R-3', 3]] }],
    [3, { timestamp: new Date(), main: [], side: [['R-4', 4]] }],
  ]);

  const storage = new Map();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn((k, v) => storage.set(k, v)));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => stringifiedDecksSaved));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  const user = userEvent.setup();

  const tabSave = screen.getAllByRole('tab')[2];
  const paneSave = screen.getAllByRole('tabpanel')[2];

  // 初期状態では保存済みデッキが表示される
  await user.click(tabSave);
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  let accordionItems = paneSave.querySelectorAll('.accordion-item');
  expect(accordionItems.length).toBe(3);

  // 3つあるデッキのうち2つ目を削除する
  const buttonDelete = accordionItems[1].querySelector('.container-button button:nth-child(2)');
  expect(buttonDelete.textContent).toBe('削除');
  await user.click(buttonDelete);

  // 保存済みデッキの表示が減る
  accordionItems = paneSave.querySelectorAll('.accordion-item');
  expect(accordionItems.length).toBe(2);
  // 保存されたデータの検証
  let stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  let decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0][0]).toBe(1);
  expect(decksSaved[0][1].main.length).toBe(1);
  expect(decksSaved[0][1].main[0][0]).toBe('R-1');
  expect(decksSaved[0][1].main[0][1]).toBe(1);
  expect(decksSaved[0][1].side.length).toBe(0);
  expect(decksSaved[1][0]).toBe(3);
  expect(decksSaved[1][1].main.length).toBe(0);
  expect(decksSaved[1][1].side.length).toBe(1);
  expect(decksSaved[1][1].side[0][0]).toBe('R-4');
  expect(decksSaved[1][1].side[0][1]).toBe(4);

  // 保存済みレシピをすべて削除ボタンを押す
  const buttonClear = paneSave.querySelector('.accordion div:nth-child(4) button');
  expect(buttonClear.textContent).toBe('保存済みレシピをすべて削除');
  await user.click(buttonClear);

  // モーダルが表示される
  let modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('保存済みレシピをすべて削除します。よろしいですか？');

  // キャンセルボタンを押す
  const buttonCancel = modal.querySelector('.modal-footer button:nth-child(1)');
  expect(buttonCancel.textContent).toBe('キャンセル');
  await user.click(buttonCancel);

  // モーダルがひっこむ
  expect(screen.queryByRole('dialog')).toBeNull();

  // デッキはクリアされていない
  stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0][0]).toBe(1);
  expect(decksSaved[0][1].main.length).toBe(1);
  expect(decksSaved[0][1].main[0][0]).toBe('R-1');
  expect(decksSaved[0][1].main[0][1]).toBe(1);
  expect(decksSaved[0][1].side.length).toBe(0);
  expect(decksSaved[1][0]).toBe(3);
  expect(decksSaved[1][1].main.length).toBe(0);
  expect(decksSaved[1][1].side.length).toBe(1);
  expect(decksSaved[1][1].side[0][0]).toBe('R-4');
  expect(decksSaved[1][1].side[0][1]).toBe(4);

  // 保存済みレシピをすべて削除ボタンを再度押す
  await user.click(buttonClear);

  // モーダルが再度表示される
  modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('保存済みレシピをすべて削除します。よろしいですか？');

  // 削除するボタンを押す
  const buttonConfirmDelete = modal.querySelector('.modal-footer button:nth-child(2)');
  expect(buttonConfirmDelete.textContent).toBe('削除する');
  await user.click(buttonConfirmDelete);

  // モーダルがひっこむ
  expect(screen.queryByRole('dialog')).toBeNull();

  // 保存済みデッキの表示がなくなる
  expect(paneSave.querySelectorAll('.accordion-item').length).toBe(0);
  // 保存されたデータの検証
  stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(0);

  jest.restoreAllMocks();
});
