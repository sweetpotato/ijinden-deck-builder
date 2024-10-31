import "fake-indexeddb/auto";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import db from "./db";

test('レシピが空だと保存できない', async () => {
  await db.decks.clear();

  render(<App />);

  const user = userEvent.setup();

  // モーダルはまだない
  expect(screen.queryByRole('dialog')).toBeNull();

  const tabDeck = screen.getAllByRole('tab')[1];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  // 保存ボタンをクリック
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const buttonSave = paneDeck.querySelector('div:nth-child(2) button');
  expect(buttonSave.textContent).toBe('マイデッキに保存');
  await user.click(buttonSave);

  // 現在のレシピが空のため保存されない
  await waitFor(async () => expect(await db.decks.toArray()).toStrictEqual([]));

  // モーダルが表示される
  const modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('現在のレシピが空のため保存できません。');

  // OK ボタンを押す
  const buttonOk = modal.querySelector('.modal-footer button');
  expect(buttonOk.textContent).toBe('OK');
  await user.click(buttonOk);
  // モーダルがひっこむ
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('レシピに1枚でもあるなら保存できる', async () => {
  // 次のエラーを回避するためのコード
  // ReferenceError: structuredClone is not defined
  if(!global.structuredClone) {
    global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
  }

  await db.decks.clear();

  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
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
  expect(buttonSave.textContent).toBe('マイデッキに保存');
  await user.click(buttonSave);

  // マイデッキペインに移動した
  // 保存されたデッキの表示の確認
  await waitFor(() => expect(paneSave).toHaveClass('active')); // waitFor で包まないと不安定
  expect(paneSave).toBeVisible();
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(1));

  // 保存されたデータの検証
  let decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(1);
  expect(decksSaved[0].main.length).toBe(1);
  expect(decksSaved[0].main[0][0]).toBe('R-1');
  expect(decksSaved[0].main[0][1]).toBe(1);
  expect(decksSaved[0].side.length).toBe(0);

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

  // マイデッキペインに移動した
  // 保存されたデッキの表示の確認
  await waitFor(() => expect(paneSave).toHaveClass('active')); // waitFor で包まないと不安定
  expect(paneSave).toBeVisible();
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(2));
  // 新しく保存されたデッキはリストの末尾に追加される
  decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0].main.length).toBe(1);
  expect(decksSaved[0].main[0][0]).toBe('R-1');
  expect(decksSaved[0].main[0][1]).toBe(1);
  expect(decksSaved[0].side.length).toBe(0);
  expect(decksSaved[1].main.length).toBe(0);
  expect(decksSaved[1].side.length).toBe(1);
  expect(decksSaved[1].side[0][0]).toBe('R-2');
  expect(decksSaved[1].side[0][1]).toBe(1);
}, 10000);

test('保存済みデッキの表示と削除', async () => {
  // 次のエラーを回避するためのコード
  // ReferenceError: structuredClone is not defined
  if(!global.structuredClone) {
    global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
  }

  let decksSaved = [
    { timestamp: new Date(), main: [['R-1', 1]], side: [] },
    { timestamp: new Date(), main: [['R-2', 2]], side: [['R-3', 3]] },
    { timestamp: new Date(), main: [], side: [['R-4', 4]] },
  ];

  await db.decks.clear();
  await db.decks.bulkAdd(decksSaved);

  render(<App />);

  const user = userEvent.setup();

  const tabSave = screen.getAllByRole('tab')[2];
  const paneSave = screen.getAllByRole('tabpanel')[2];

  // 初期状態では保存済みデッキが表示される
  await user.click(tabSave);
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(3));

  // 3つあるデッキのうち2つ目を削除する
  const buttonDelete = paneSave.querySelector('.accordion-item:nth-child(2) .container-button button:nth-child(2)');
  expect(buttonDelete.textContent).toBe('削除');
  await user.click(buttonDelete);

  // 保存済みデッキの表示が減る
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(2));
  // 保存されたデータの検証
  decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0].main.length).toBe(1);
  expect(decksSaved[0].main[0][0]).toBe('R-1');
  expect(decksSaved[0].main[0][1]).toBe(1);
  expect(decksSaved[0].side.length).toBe(0);
  expect(decksSaved[1].main.length).toBe(0);
  expect(decksSaved[1].side.length).toBe(1);
  expect(decksSaved[1].side[0][0]).toBe('R-4');
  expect(decksSaved[1].side[0][1]).toBe(4);

  // 保存済みレシピをすべて削除ボタンを押す
  const buttonClear = paneSave.querySelector('div:nth-child(4) button');
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
  decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(2);
  expect(decksSaved[0].main.length).toBe(1);
  expect(decksSaved[0].main[0][0]).toBe('R-1');
  expect(decksSaved[0].main[0][1]).toBe(1);
  expect(decksSaved[0].side.length).toBe(0);
  expect(decksSaved[1].main.length).toBe(0);
  expect(decksSaved[1].side.length).toBe(1);
  expect(decksSaved[1].side[0][0]).toBe('R-4');
  expect(decksSaved[1].side[0][1]).toBe(4);

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
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull()); // waitFor で包まないと不安定

  // 保存済みデッキの表示がなくなる
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(0));
  // 保存されたデータの検証
  decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(0);
});

test('localStorage に保存されているデータの移行', async () => {
  // 次のエラーを回避するためのコード
  // ReferenceError: structuredClone is not defined
  if(!global.structuredClone) {
    global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
  }

  let stringidiedDecksSaved = JSON.stringify([
    [1, { timestamp: new Date(), main: [['R-1', 1]], side: [] }],
    [2, { timestamp: new Date(), main: [['R-2', 2]], side: [['R-3', 3]] }],
    [3, { timestamp: new Date(), main: [], side: [['R-4', 4]] }],
  ]);

  const storage = new Map();
  storage.set('ijinden-deck-builder', stringidiedDecksSaved);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn((k, v) => storage.set(k, v)));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn((k) => storage.has(k) ? storage.get(k) : null));

  await db.decks.clear();

  render(<App />);

  await waitFor(() => expect(window.localStorage.getItem).toHaveBeenCalledTimes(1), {
    timeout: 2000,
  });
  await waitFor(() => expect(window.localStorage.setItem).toHaveBeenCalledTimes(1), {
    timeout: 2000,
  });
  await waitFor(() => expect(storage.size).toBe(1), {
    timeout: 2000,
  });
  await waitFor(() => expect(storage.has('ijinden-deck-builder')).toBe(true), {
    timeout: 2000,
  });
  await waitFor(() => expect(storage.get('ijinden-deck-builder')).toBe('[]'), {
    timeout: 2000,
  });

  const user = userEvent.setup();

  const tabSave = screen.getAllByRole('tab')[2];
  const paneSave = screen.getAllByRole('tabpanel')[2];

  // 初期状態では保存済みデッキが表示される
  await user.click(tabSave);
  await waitFor(() => expect(paneSave).toHaveClass('active'));
  expect(paneSave).toBeVisible();
  await waitFor(() => expect(paneSave.querySelectorAll('.accordion-item').length).toBe(3));

  // 保存されたデータの検証
  const decksSaved = await db.decks.orderBy(':id').toArray();
  expect(decksSaved.length).toBe(3);
  expect(decksSaved[0].main.length).toBe(1);
  expect(decksSaved[0].main[0][0]).toBe('R-1');
  expect(decksSaved[0].main[0][1]).toBe(1);
  expect(decksSaved[0].side.length).toBe(0);
  expect(decksSaved[1].main.length).toBe(1);
  expect(decksSaved[1].main[0][0]).toBe('R-2');
  expect(decksSaved[1].main[0][1]).toBe(2);
  expect(decksSaved[1].side.length).toBe(1);
  expect(decksSaved[1].side[0][0]).toBe('R-3');
  expect(decksSaved[1].side[0][1]).toBe(3);
  expect(decksSaved[2].main.length).toBe(0);
  expect(decksSaved[2].side.length).toBe(1);
  expect(decksSaved[2].side[0][0]).toBe('R-4');
  expect(decksSaved[2].side[0][1]).toBe(4);
});
