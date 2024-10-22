import cards from './cards.json'

export const dataCardsArrayForTable = [...cards].sort((a, b) => a.orderTable - b.orderTable);
export const dataCardsArrayForDeck = [...cards].sort((a, b) => a.orderDeck - b.orderDeck);
export const dataCardsMap = new Map(cards.map((element) => [element.id, element]));
