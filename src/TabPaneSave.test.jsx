import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test('レシピが空だと保存できない', async () => {
  const user = userEvent.setup();

  // localStorage を模倣
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => "[]"));

  render(<App />);

  // useState の初期値をセットするコールバックから1回呼ばれる
  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  // useEffect のセットアップコードから1回呼ばれる
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  // モーダルはまだない
  expect(screen.queryByRole('dialog')).toBeNull();

  // 保存ボタンをクリック
  const tabPaneSave = screen.getAllByRole('tabpanel')[2];
  const buttonSave = tabPaneSave.querySelector('div:nth-child(2) button');
  expect(buttonSave.textContent).toBe('現在のレシピを保存');
  await user.click(buttonSave);

  // 現在のレシピが空のため保存されない (呼出し回数が増えない)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  // モーダルが表示される
  const modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('現在のレシピが空のため保存できません。');
  const buttonOk = modal.querySelector('.modal-footer button');

  // OK ボタンをクリック
  await user.click(buttonOk);
  // モーダルがひっこむ
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('レシピに1枚でもあるなら保存できる', async () => {
  const user = userEvent.setup();

  const storage = new Map();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn((k, v) => storage.set(k, v)));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => "[]"));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  // カードペインの適当なカードのメインプラスボタンをクリック
  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const tableRowCardAlpha = tabPaneCard.querySelector('tr[data-id="R-1"]');
  const buttonPlusMain = tableRowCardAlpha.querySelector('td:nth-child(3) button:nth-child(3)');
  expect(buttonPlusMain.textContent).toBe('+');
  const inputMain = tableRowCardAlpha.querySelector('td:nth-child(3) input');
  expect(inputMain.value).toBe('0');
  await user.click(buttonPlusMain);
  expect(inputMain.value).toBe('1');

  // 保存ボタンをクリック
  const tabPaneSave = screen.getAllByRole('tabpanel')[2];
  const buttonSave = tabPaneSave.querySelector('div:nth-child(2) button');
  expect(buttonSave.textContent).toBe('現在のレシピを保存');
  await user.click(buttonSave);

  // 保存される (呼出し回数が1増える)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
  // 保存されたデッキの表示の確認
  const accordionItemAlpha = tabPaneSave.querySelectorAll('.accordion-item');
  expect(accordionItemAlpha.length).toBe(1);

  // 保存されたデータの検証
  const stiringifiedDecksSavedAlpha = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSavedAlpha).toBe('string');
  const decksSavedAlpha = JSON.parse(stiringifiedDecksSavedAlpha);
  expect(decksSavedAlpha.length).toBe(1);
  expect(decksSavedAlpha[0][0]).toBe(1);
  expect(decksSavedAlpha[0][1].main.length).toBe(1);
  expect(decksSavedAlpha[0][1].main[0][0]).toBe('R-1');
  expect(decksSavedAlpha[0][1].main[0][1]).toBe(1);
  expect(decksSavedAlpha[0][1].side.length).toBe(0);

  const buttonMinusMain = tableRowCardAlpha.querySelector('td:nth-child(3) button:nth-child(1)');
  expect(buttonMinusMain.textContent).toBe('-');
  await user.click(buttonMinusMain);
  expect(inputMain.value).toBe('0');

  const tableRowCardBravo = tabPaneCard.querySelector('tr[data-id="R-2"]');
  const buttonPlusSide = tableRowCardBravo.querySelector('td:nth-child(4) button:nth-child(3)');
  expect(buttonPlusSide.textContent).toBe('+');
  const inputSide = tableRowCardBravo.querySelector('td:nth-child(4) input');
  expect(inputSide.value).toBe('0');
  await user.click(buttonPlusSide);
  expect(inputSide.value).toBe('1');

  await user.click(buttonSave);

  // 保存される (呼出し回数がさらに1増える)
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);
  // 保存されたデッキの表示の確認
  const accordionItemBravo = tabPaneSave.querySelectorAll('.accordion-item');
  expect(accordionItemBravo.length).toBe(2);
  // 新しく保存されたデッキはリストの末尾に追加される
  const stiringifiedDecksSavedBravo = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSavedBravo).toBe('string');
  const decksSavedBravo = JSON.parse(stiringifiedDecksSavedBravo);
  expect(decksSavedBravo.length).toBe(2);
  expect(decksSavedBravo[0][0]).toBe(1);
  expect(decksSavedBravo[0][1].main.length).toBe(1);
  expect(decksSavedBravo[0][1].main[0][0]).toBe('R-1');
  expect(decksSavedBravo[0][1].main[0][1]).toBe(1);
  expect(decksSavedBravo[0][1].side.length).toBe(0);
  expect(decksSavedBravo[1][0]).toBe(2);
  expect(decksSavedBravo[1][1].main.length).toBe(0);
  expect(decksSavedBravo[1][1].side.length).toBe(1);
  expect(decksSavedBravo[1][1].side[0][0]).toBe('R-2');
  expect(decksSavedBravo[1][1].side[0][1]).toBe(1);
});

test('保存済みデッキの表示と削除', async () => {
  const user = userEvent.setup();

  const stringifiedDecksSaved = JSON.stringify(
    [
      [
        1,
        {
          timestamp: new Date(),
          main: [['R-1', 1]],
          side: [],
        }
      ],
      [
        2,
        {
          timestamp: new Date(),
          main: [['R-2', 2]],
          side: [['R-3', 3]],
        }
      ],
      [
        3,
        {
          timestamp: new Date(),
          main: [],
          side: [['R-4', 4]],
        }
      ],
    ]
  );

  const storage = new Map();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn((k, v) => storage.set(k, v)));
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => stringifiedDecksSaved));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  let accordionItems;
  let stiringifiedDecksSaved;
  let decksSaved;
  let modal;

  const tabPaneSave = screen.getAllByRole('tabpanel')[2];
  accordionItems = tabPaneSave.querySelectorAll('.accordion-item');
  expect(accordionItems.length).toBe(3);

  // 3つあるデッキのうち2つ目を削除する
  const buttonDelete = accordionItems[1].querySelector('.container-button button:nth-child(2)');
  expect(buttonDelete.textContent).toBe('削除');
  await user.click(buttonDelete);

  accordionItems = tabPaneSave.querySelectorAll('.accordion-item');
  expect(accordionItems.length).toBe(2);

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

  const buttonClear = tabPaneSave.querySelector('.accordion div:nth-child(4) button');
  expect(buttonClear.textContent).toBe('保存済みレシピをすべて削除');

  await user.click(buttonClear);

  // モーダルが表示される
  modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('保存済みレシピをすべて削除します。よろしいですか？');
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

  await user.click(buttonClear);

  modal = screen.getByRole('dialog');
  expect(modal.querySelector('.modal-body').textContent).toBe('保存済みレシピをすべて削除します。よろしいですか？');
  const buttonConfirmDelete = modal.querySelector('.modal-footer button:nth-child(2)');
  expect(buttonConfirmDelete.textContent).toBe('削除する');

  await user.click(buttonConfirmDelete);

  expect(screen.queryByRole('dialog')).toBeNull();

  accordionItems = tabPaneSave.querySelectorAll('.accordion-item');
  expect(accordionItems.length).toBe(0);
  stiringifiedDecksSaved = storage.get('ijinden-deck-builder');
  expect(typeof stiringifiedDecksSaved).toBe('string');
  decksSaved = JSON.parse(stiringifiedDecksSaved);
  expect(decksSaved.length).toBe(0);
});
