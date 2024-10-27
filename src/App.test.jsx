import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { dataCardsMap } from './dataCards';

test("タブをクリックするとペインが表示される", async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabs = screen.getAllByRole('tab');
  const panes = screen.getAllByRole('tabpanel');

  // タブの数は5個
  expect(tabs.length).toBe(5);
  expect(panes.length).toBe(5);

  // 初期タブは0番
  expect(screen.queryByRole('tab', { selected: true })).toBe(tabs[0]);
  expect(tabs[0]).toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  // 次のアサーションは成功するが、ほぼ意味がない。
  expect(panes[0]).toBeVisible();
  // なぜなら、次のアサーションも成功してしまうからだ。
  expect(panes[1]).toBeVisible();
  expect(panes[2]).toBeVisible();
  expect(panes[3]).toBeVisible();
  expect(panes[4]).toBeVisible();
  // Bootstrap を使用しているおかげか、可視性はスタイルで直接的にではなく、
  // CSS の active クラスで間接的に制御されているようだ。
  // したがって、toBeVisible のアサーションは上のものにとどめ、以降は行わない。

  await user.click(tabs[1]);
  expect(screen.queryByRole('tab', { selected: true })).toBe(tabs[1]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[2]);
  expect(screen.queryByRole('tab', { selected: true })).toBe(tabs[2]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[3]);
  expect(screen.queryByRole('tab', { selected: true })).toBe(tabs[3]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[4]);
  expect(screen.queryByRole('tab', { selected: true })).toBe(tabs[4]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).toHaveClass('active');
}, 10000);

test('カードペインからレシピペインへの作用', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();

  const buttonMinusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(1)');
  const inputMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) input');
  const buttonPlusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  const buttonMinusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(1)');
  const inputSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) input');
  const buttonPlusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)');

  expect(buttonMinusMain.textContent).toBe('-');
  expect(inputMain.value).toBe('0');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(inputSide.value).toBe('0');
  expect(buttonPlusSide.textContent).toBe('+');

  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();

  const imageMain = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageSide = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  const numCopiesMain = imageMain.parentElement.querySelector('.container-num-copies');
  const numCopiesSide = imageSide.parentElement.querySelector('.container-num-copies');

  expect(imageMain).not.toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();
  expect(numCopiesSide).not.toBeVisible();

  // 1a. カードペインでメインのプラスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusMain);

  // 1b. レシピペインのメインデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');

  // 2a. カードペインでサイドのプラスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusSide);

  // 2b. レシピペインのメインデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  // 3a. カードペインでメインのプラスボタンを再度押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusMain);

  // 3b. レシピペインのメインデッキで当該カードの枚数が増える
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');

  // 4a. カードペインでサイドのプラスボタンを再度押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusSide);

  // 4b. レシピペインのメインデッキで当該カードの枚数が増える
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('2');

  // 5a. カードペインでメインのマイナスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonMinusMain);

  // 5b. レシピペインのメインデッキで当該カードの枚数が減る
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();  
  expect(imageMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');

  // 6a. カードペインでサイドのマイナスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonMinusSide);

  // 6b. レシピペインのサイドデッキで当該カードの枚数が減る
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(imageSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  // 7a. カードペインでメインのマイナスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonMinusMain);

  // 7b. レシピペインのメインデッキで当該カードが非表示になる
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageMain).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();

  // 8a. カードペインでサイドのマイナスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonMinusSide);

  // 8b. レシピペインのサイドデッキで当該カードが非表示になる
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(imageSide).not.toBeVisible();
}, 15000);

test('レシピペインからカードペインへの作用', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneDeck = screen.getAllByRole('tabpanel')[1];

  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();

  let buttonPlusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  let buttonPlusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)');
  const inputMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) input');
  const inputSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) input');

  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonPlusSide.textContent).toBe('+');
  expect(inputMain.value).toBe('0');
  expect(inputSide.value).toBe('0');

  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();

  const imageMain = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageSide = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  const numCopiesMain = imageMain.parentElement.querySelector('.container-num-copies');
  const numCopiesSide = imageSide.parentElement.querySelector('.container-num-copies');

  expect(imageMain).not.toBeVisible();
  expect(imageSide).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();
  expect(numCopiesSide).not.toBeVisible();

  // 初期状態として、カードペインでメインとサイドのプラスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusMain);
  await user.click(buttonPlusSide);

  // レシピペインのメインデッキとサイドデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');
  expect(imageSide).toBeVisible();
  expect(numCopiesSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  buttonPlusMain = imageMain.parentElement.querySelector('.btn-push');
  buttonPlusSide = imageSide.parentElement.querySelector('.btn-push');
  const buttonMinusMain = imageMain.parentElement.querySelector('.btn-pop');
  const buttonMinusSide = imageSide.parentElement.querySelector('.btn-pop');
  const buttonDrop = imageMain.parentElement.querySelector('.btn-move');
  const buttonRaise = imageSide.parentElement.querySelector('.btn-move');

  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonPlusSide.textContent).toBe('+');
  expect(buttonMinusMain.textContent).toBe('-');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(buttonDrop.textContent).toBe('v');
  expect(buttonRaise.textContent).toBe('^');

  // 既にレシピペインにいる
  // 1a. レシピペインのメインデッキのプラスボタンを押す
  await user.click(buttonPlusMain);

  // 1b. カードペインのメインで当該カードの枚数が増える
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('2');

  // 2a. レシピペインのサイドデッキのプラスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonPlusSide);

  // 2b. カードペインのサイドで当該カードの枚数が増える
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputSide.value).toBe('2');

  // 3a. レシピペインのメインデッキの「v」ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonDrop);

  // 3b. カードペインのメインとサイドで当該カードの枚数が変わる
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('1');
  expect(inputSide.value).toBe('3');

  // 4a. レシピペインのサイドデッキの「^」ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonRaise);

  // 4b. カードペインのメインとサイドで当該カードの枚数が変わる
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('2');
  expect(inputSide.value).toBe('2');

  // 5a. レシピペインのメインデッキのマイナスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonMinusMain);

  // 5b. カードペインのメインで当該カードの枚数が減る
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('1');
  expect(inputSide.value).toBe('2');

  // 6a. レシピペインのサイドデッキのマイナスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonMinusSide);

  // 6b. カードペインのサイドで当該カードの枚数が減る
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('1');
  expect(inputSide.value).toBe('1');

  // 7a. レシピペインのレシピをクリアボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const buttonClear = paneDeck.querySelector('.container-button button:nth-child(1)');
  expect(buttonClear.textContent).toBe('レシピをクリア');
  await user.click(buttonClear);
  
  // 7b. カードペインで当該カードの枚数がゼロになる
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  expect(inputMain.value).toBe('0');
  expect(inputSide.value).toBe('0');
}, 15000);

test('保存したデッキを読み込んでレシピペインに表示する', async () => {
  const stringifiedDecksSaved = JSON.stringify([[
    1, { timestamp: new Date(), main: [['R-1', 3]], side: [['R-2', 4]] }
  ]]);

  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => stringifiedDecksSaved));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  const user = userEvent.setup();

  const tabDeck = screen.getAllByRole('tab')[1];
  const tabSave = screen.getAllByRole('tab')[2];
  const paneDeck = screen.getAllByRole('tabpanel')[1];
  const paneSave = screen.getAllByRole('tabpanel')[2];

  // レシピタブをクリックする
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();

  // 初期状態でカードは非表示
  const imageAlphaMain = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageBravoSide = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-2').imageUrl}"]`)[1];
  const numCopiesAlphaMain = imageAlphaMain.parentElement.querySelector('.container-num-copies');
  const numCopiesBravoSide = imageBravoSide.parentElement.querySelector('.container-num-copies');
  expect(imageAlphaMain).not.toBeVisible();
  expect(imageBravoSide).not.toBeVisible();
  expect(numCopiesAlphaMain).not.toBeVisible();
  expect(numCopiesBravoSide).not.toBeVisible();

  // マイデッキタブをクリックしてアコーディオンを開き、読込みボタンを押す
  await user.click(tabSave);
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  await user.click(paneSave.querySelector('.accordion-item .accordion-header button'));
  const buttonLoad = paneSave.querySelector('.accordion-item .container-button button:nth-child(1)');
  expect(buttonLoad.textContent).toBe('読込み');
  await user.click(buttonLoad);

  // レシピタブに遷移し、読み込まれたデッキのカードが表示された
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  expect(imageAlphaMain).toBeVisible();
  expect(imageBravoSide).toBeVisible();
  expect(numCopiesAlphaMain.textContent).toBe('3');
  expect(numCopiesBravoSide.textContent).toBe('4');

  jest.restoreAllMocks();
});

test('シミュレータがカードペインの操作でアボートする', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabSimulator = screen.getAllByRole('tab')[3];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneSimulator = screen.getAllByRole('tabpanel')[3];

  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();

  let buttonMinusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(1)');
  let buttonPlusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  let buttonMinusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(1)');
  let buttonPlusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)');
  expect(buttonMinusMain.textContent).toBe('-');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(buttonPlusSide.textContent).toBe('+');

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();

  const buttonReset = paneSimulator.querySelector('.container-button button:nth-child(1)');
  const buttonStart = paneSimulator.querySelector('.container-button button:nth-child(2)');
  const buttonMulligan = paneSimulator.querySelector('.container-button button:nth-child(3)');
  const buttonKeep = paneSimulator.querySelector('.container-button button:nth-child(4)');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 初期状態として、メインデッキにカードを10枚適当に加える
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

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 既にシミュタブにいる
  // 1a. スタートボタンを押す
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 1b. カードペインでメインデッキのプラスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonPlusMain);

  //1c. 手札シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  let alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 2a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 2b. カードペインでメインデッキのマイナスボタンを押す
  await user.click(tabCard);
  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();
  await user.click(buttonMinusMain);

  // 2c. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 3a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 3b. カードペインでサイドデッキのプラスボタンを押す
  await user.click(tabCard);
  expect(tabCard).toHaveClass('active');
  expect(tabCard).toBeVisible();
  await user.click(buttonPlusSide);

  // 3c. シミュレータはアボートしない
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();
  
  // 4a. カードペインでサイドデッキのマイナスボタンを押す
  await user.click(tabCard);
  expect(tabCard).toHaveClass('active');
  expect(tabCard).toBeVisible();
  await user.click(buttonMinusSide);

  // 4b. やはりシミュレータはアボートしない
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();
}, 15000);

test('シミュレータがレシピペインの操作でアボートする', async () => {
  render(<App />);

  const user = userEvent.setup();

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const tabSimulator = screen.getAllByRole('tab')[3];
  const paneCard = screen.getAllByRole('tabpanel')[0];
  const paneDeck = screen.getAllByRole('tabpanel')[1];
  const paneSimulator = screen.getAllByRole('tabpanel')[3];

  expect(paneCard).toHaveClass('active');
  expect(paneCard).toBeVisible();

  let buttonPlusMain = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(3) button:nth-child(3)');
  let buttonPlusSide = paneCard.querySelector('tr[data-id="R-1"] td:nth-child(4) button:nth-child(3)');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonPlusSide.textContent).toBe('+');

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();

  const buttonReset = paneSimulator.querySelector('.container-button button:nth-child(1)');
  const buttonStart = paneSimulator.querySelector('.container-button button:nth-child(2)');
  const buttonMulligan = paneSimulator.querySelector('.container-button button:nth-child(3)');
  const buttonKeep = paneSimulator.querySelector('.container-button button:nth-child(4)');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 初期状態として、メインデッキにカードを10枚適当に加える
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
  // サイドデッキにもカードを1枚適当に加える
  await user.click(buttonPlusSide);

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const imageMain = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageSide = paneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  buttonPlusMain = imageMain.parentElement.querySelector('.btn-push');
  buttonPlusSide = imageSide.parentElement.querySelector('.btn-push');
  const buttonMinusMain = imageMain.parentElement.querySelector('.btn-pop');
  const buttonMinusSide = imageSide.parentElement.querySelector('.btn-pop');
  const buttonDrop = imageMain.parentElement.querySelector('.btn-move');
  const buttonRaise = imageSide.parentElement.querySelector('.btn-move');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonPlusSide.textContent).toBe('+');
  expect(buttonMinusMain.textContent).toBe('-');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(buttonDrop.textContent).toBe('v');
  expect(buttonRaise.textContent).toBe('^');

  // 1a. スタートボタンを押す
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 1b. レシピペインでメインデッキのプラスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonPlusMain);

  // 1c. 手札シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  let alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 2a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 2b. レシピペインでメインデッキの「v」ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonDrop);

  // 2c. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 3a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 3b. レシピペインでサイドデッキの「^」ボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonRaise);

  // 3c. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 4a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 4b. レシピペインでメインデッキのマイナスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonMinusMain);

  // 4c. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  // 5a. リセットボタン、スタートボタンと押す
  await user.click(buttonReset);
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();
  
  // 5b. レシピペインでサイドデッキのプラスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonPlusSide);

  // 5c. シミュレータはアボートしない
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();
    
  // 6a. レシピペインでサイドデッキのマイナスボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  await user.click(buttonMinusSide);
  
  // 6b. やはりシミュレータはアボートしない
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 7a. レシピペインでレシピをクリアボタンを押す
  await user.click(tabDeck);
  expect(paneDeck).toHaveClass('active');
  expect(paneDeck).toBeVisible();
  const buttonClear = paneDeck.querySelector('.container-button button:nth-child(1)');
  expect(buttonClear.textContent).toBe('レシピをクリア');
  await user.click(buttonClear);

  // 7b. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');
}, 30000);

test('シミュレータがマイデッキペインの操作でアボートする', async () => {
  const stringifiedDecksSaved = JSON.stringify([[
    1, { timestamp: new Date(), main: [['R-1', 10]], side: [] }
  ]]);

  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => stringifiedDecksSaved));

  render(<App />);

  const user = userEvent.setup();

  const tabSave = screen.getAllByRole('tab')[2];
  const tabSimulator = screen.getAllByRole('tab')[3];
  const paneSave = screen.getAllByRole('tabpanel')[2];
  const paneSimulator = screen.getAllByRole('tabpanel')[3];

  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();

  const buttonReset = paneSimulator.querySelector('.container-button button:nth-child(1)');
  const buttonStart = paneSimulator.querySelector('.container-button button:nth-child(2)');
  const buttonMulligan = paneSimulator.querySelector('.container-button button:nth-child(3)');
  const buttonKeep = paneSimulator.querySelector('.container-button button:nth-child(4)');

  expect(buttonReset).toBeDisabled();
  expect(buttonStart).toBeEnabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 1. メインデッキにカードが10枚入った保存済みデッキを読み込む
  await user.click(tabSave);
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  const buttonLoad = paneSave.querySelector('.accordion-item .container-button button:nth-child(1)');
  expect(buttonLoad.textContent).toBe('読込み');
  await user.click(buttonLoad);

  // 2a. スタートボタンを押す
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  await user.click(buttonStart);
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeEnabled();
  expect(buttonKeep).toBeEnabled();
  expect(screen.queryByRole('alert')).toBeNull();

  // 2b. マイデッキペインで読込みボタンを押す
  await user.click(tabSave);
  expect(paneSave).toHaveClass('active');
  expect(paneSave).toBeVisible();
  await user.click(buttonLoad);

  // 2c. シミュレータがアボートする
  await user.click(tabSimulator);
  expect(paneSimulator).toHaveClass('active');
  expect(paneSimulator).toBeVisible();
  expect(buttonReset).toBeEnabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonMulligan).toBeDisabled();
  expect(buttonKeep).toBeDisabled();
  alert = screen.getByRole('alert');
  expect(alert).toBeVisible();
  expect(alert.textContent).toBe('⚠️ シミュレーション中にメインデッキが編集されました。リセットしてください。');

  jest.restoreAllMocks();
});
