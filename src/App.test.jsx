import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { dataCardsMap } from './dataCards';

test("タブをクリックするとペインが表示される", async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabs = screen.getAllByRole('tab');
  const tabpanels = screen.getAllByRole('tabpanel');

  // タブの数は5個
  expect(tabs.length).toBe(5);
  expect(tabpanels.length).toBe(5);

  // 初期タブは0番
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[0]);
  expect(tabs[0]).toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  // 次のアサーションは成功するが、ほぼ意味がない。
  expect(tabpanels[0]).toBeVisible();
  // なぜなら、次のアサーションも成功してしまうからだ。
  expect(tabpanels[1]).toBeVisible();
  expect(tabpanels[2]).toBeVisible();
  expect(tabpanels[3]).toBeVisible();
  expect(tabpanels[4]).toBeVisible();
  // Bootstrap を使用しているおかげか、可視性はスタイルで直接的にではなく、
  // CSS の active クラスで間接的に制御されているようだ。
  // したがって、toBeVisible のアサーションは上のものにとどめ、以降は行わない。

  // click の戻り値は Promise でなく void なので await は不要。以下同様。
  await user.click(tabs[1]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[1]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[2]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[2]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[3]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[3]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[4]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[4]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).toHaveClass('active');
});

test('カードペインからレシピペインへの作用', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const tabPaneDeck = screen.getAllByRole('tabpanel')[1];

  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();

  const cardInTable = tabPaneCard.querySelector('table tr[data-id="R-1"]');
  const buttonMinusMain = cardInTable.querySelector('td:nth-child(3) button:nth-child(1)');
  const inputMain = cardInTable.querySelector('td:nth-child(3) input');
  const buttonPlusMain = cardInTable.querySelector('td:nth-child(3) button:nth-child(3)');
  const buttonMinusSide = cardInTable.querySelector('td:nth-child(4) button:nth-child(1)');
  const inputSide = cardInTable.querySelector('td:nth-child(4) input');
  const buttonPlusSide = cardInTable.querySelector('td:nth-child(4) button:nth-child(3)');

  expect(buttonMinusMain.textContent).toBe('-');
  expect(inputMain.value).toBe('0');
  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonMinusSide.textContent).toBe('-');
  expect(inputSide.value).toBe('0');
  expect(buttonPlusSide.textContent).toBe('+');

  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();

  const cardInDeckMain = tabPaneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const cardInDeckSide = tabPaneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  const numCopiesMain = cardInDeckMain.parentElement.querySelector('.container-num-copies');
  const numCopiesSide = cardInDeckSide.parentElement.querySelector('.container-num-copies');

  expect(cardInDeckMain).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();
  expect(cardInDeckSide).not.toBeVisible();
  expect(numCopiesSide).not.toBeVisible();

  // カードペインでメインのプラスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonPlusMain);

  // レシピペインのメインデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');

  // カードペインでサイドのプラスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonPlusSide);

  // レシピペインのメインデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckSide).toBeVisible();
  expect(numCopiesSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  // カードペインでメインのプラスボタンを再度クリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonPlusMain);

  // レシピペインのメインデッキで当該カードの枚数が増える
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('2');

  // カードペインでサイドのプラスボタンを再度クリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonPlusSide);

  // レシピペインのメインデッキで当該カードの枚数が増える
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckSide).toBeVisible();
  expect(cardInDeckSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('2');

  // カードペインでメインのマイナスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonMinusMain);

  // レシピペインのメインデッキで当該カードの枚数が減る
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();  
  expect(cardInDeckMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');

  // カードペインでサイドのマイナスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonMinusSide);

  // レシピペインのサイドデッキで当該カードの枚数が減る
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckSide).toBeVisible();
  expect(cardInDeckSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  // カードペインでメインのマイナスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonMinusMain);

  // レシピペインのメインデッキで当該カードが非表示になる
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckMain).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();

  // カードペインでサイドのマイナスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonMinusSide);

  // レシピペインのサイドデッキで当該カードが非表示になる
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckSide).not.toBeVisible();
  expect(cardInDeckSide).not.toBeVisible();
}, 15000); // 15s

test('レシピペインからカードペインへの作用', async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabCard = screen.getAllByRole('tab')[0];
  const tabDeck = screen.getAllByRole('tab')[1];
  const tabPaneCard = screen.getAllByRole('tabpanel')[0];
  const tabPaneDeck = screen.getAllByRole('tabpanel')[1];

  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();

  const cardInTable = tabPaneCard.querySelector('table tr[data-id="R-1"]');
  let buttonPlusMain = cardInTable.querySelector('td:nth-child(3) button:nth-child(3)');
  let buttonPlusSide = cardInTable.querySelector('td:nth-child(4) button:nth-child(3)');
  const inputMain = cardInTable.querySelector('td:nth-child(3) input');
  const inputSide = cardInTable.querySelector('td:nth-child(4) input');

  expect(buttonPlusMain.textContent).toBe('+');
  expect(buttonPlusSide.textContent).toBe('+');
  expect(inputMain.value).toBe('0');
  expect(inputSide.value).toBe('0');

  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();

  const cardInDeckMain = tabPaneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const cardInDeckSide = tabPaneDeck.querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[1];
  const numCopiesMain = cardInDeckMain.parentElement.querySelector('.container-num-copies');
  const numCopiesSide = cardInDeckSide.parentElement.querySelector('.container-num-copies');

  expect(cardInDeckMain).not.toBeVisible();
  expect(numCopiesMain).not.toBeVisible();
  expect(cardInDeckSide).not.toBeVisible();
  expect(numCopiesSide).not.toBeVisible();

  // カードペインでメインとサイドのプラスボタンをクリックする
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  await user.click(buttonPlusMain);
  await user.click(buttonPlusSide);

  // レシピペインのメインデッキとサイドデッキに当該カードが表示される
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  expect(cardInDeckMain).toBeVisible();
  expect(numCopiesMain).toBeVisible();
  expect(numCopiesMain.textContent).toBe('1');
  expect(cardInDeckSide).toBeVisible();
  expect(numCopiesSide).toBeVisible();
  expect(numCopiesSide.textContent).toBe('1');

  buttonPlusMain = cardInDeckMain.parentElement.querySelector('.btn-push');
  buttonPlusSide = cardInDeckSide.parentElement.querySelector('.btn-push');
  const buttonMinusMain = cardInDeckMain.parentElement.querySelector('.btn-pop');
  const buttonMinusSide = cardInDeckSide.parentElement.querySelector('.btn-pop');
  const buttonDrop = cardInDeckMain.parentElement.querySelector('.btn-move');
  const buttonRaise = cardInDeckSide.parentElement.querySelector('.btn-move');

  // 既にレシピペインにいる
  // レシピペインのメインデッキのプラスボタンをクリックする
  await user.click(buttonPlusMain);

  // カードペインのメインで当該カードの枚数が増える
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputMain.value).toBe('2');

  // レシピペインのサイドデッキのプラスボタンをクリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonPlusSide);

  // カードペインのサイドで当該カードの枚数が増える
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputSide.value).toBe('2');

  // レシピペインのメインデッキの「v」ボタンをクリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonDrop);

  // カードペインのメインとサイドで当該カードの枚数が変わる
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputMain.value).toBe('1');
  expect(inputSide.value).toBe('3');

  // レシピペインのサイドデッキの「^」ボタンをクリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonRaise);

  // カードペインのメインとサイドで当該カードの枚数が変わる
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputMain.value).toBe('2');
  expect(inputSide.value).toBe('2');

  // レシピペインのメインデッキのマイナスボタンをクリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonMinusMain);

  // カードペインのメインで当該カードの枚数が減る
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputMain.value).toBe('1');

  // レシピペインのサイドデッキのマイナスボタンをクリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonMinusSide);

  // カードペインのサイドで当該カードの枚数が減る
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputSide.value).toBe('1');

  // レシピペインのメインデッキのマイナスボタンを再度クリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonMinusMain);
  
  // カードペインのメインで当該カードの枚数がさらに減る
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputMain.value).toBe('0');

  // レシピペインのサイドデッキのマイナスボタンを再度クリックする
  await user.click(tabDeck);
  expect(tabPaneDeck).toHaveClass('active');
  expect(tabPaneDeck).toBeVisible();
  await user.click(buttonMinusSide);
  
  // カードペインのサイドで当該カードの枚数がさらに減る
  await user.click(tabCard);
  expect(tabPaneCard).toHaveClass('active');
  expect(tabPaneCard).toBeVisible();
  expect(inputSide.value).toBe('0');
}, 15000); // 15s

test('保存したデッキを読み込んでレシピペインに表示する', async () => {
  const user = userEvent.setup();

  const stringifiedDecksSaved = JSON.stringify(
    [
      [
        1,
        {
          timestamp: new Date(),
          main: [['R-1', 3]],
          side: [['R-2', 4]],
        }
      ],
    ]
  );

  const storage = new Map();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn(() => stringifiedDecksSaved));

  render(<App />);

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);

  const tabs = screen.getAllByRole('tab');
  expect(tabs.length).toBe(5);
  const tabpanels = screen.getAllByRole('tabpanel');
  expect(tabpanels.length).toBe(5);

  // レシピタブをクリックする
  await user.click(tabs[1]);
  expect(tabs[1]).toHaveClass('active');

  // 初期状態で画像は非表示
  const imageAlphaMain = tabpanels[1].querySelectorAll(`img[src="${dataCardsMap.get('R-1').imageUrl}"]`)[0];
  const imageBravoSide = tabpanels[1].querySelectorAll(`img[src="${dataCardsMap.get('R-2').imageUrl}"]`)[1];
  expect(imageAlphaMain).not.toBeVisible();
  expect(imageBravoSide).not.toBeVisible();

  // マイデッキタブをクリックする
  await user.click(tabs[2]);
  expect(tabs[2]).toHaveClass('active');

  // 読込みボタンをクリックする
  const accordionItem = tabpanels[2].querySelector('.accordion-item');
  const buttonLoad = accordionItem.querySelector('.container-button button:nth-child(1)');
  expect(buttonLoad.textContent).toBe('現在のレシピを破棄して読込み');
  await user.click(buttonLoad);

  // レシピタブに遷移した
  expect(tabs[1]).toHaveClass('active');

  // 読み込まれたデッキのカードが表示された
  expect(imageAlphaMain).toBeVisible();
  expect(imageBravoSide).toBeVisible();
  const containerNumCopiesAlphaMain = imageAlphaMain.parentElement.querySelector('.container-num-copies');
  const containerNumCopiesBravoSide = imageBravoSide.parentElement.querySelector('.container-num-copies');
  expect(containerNumCopiesAlphaMain.textContent).toBe('3');
  expect(containerNumCopiesBravoSide.textContent).toBe('4');
});
