import { useId } from 'react'

import { dataCardsMap } from '../../commons/dataCards'
import { sum } from '../../commons/utils'

function ContainerDeckValidator({ deckMain, deckSide }) {
  const validBo1 = isDeckValidBo1(deckMain)
  const validBo3 = isDeckValidBo3(deckMain, deckSide)
  const idBo1 = useId()
  const idBo3 = useId()

  return (
    <ul className="m-2" style={{ padding: 0, listStyle: 'none' }}>
      <li>
        <span role="status" aria-labelledby={idBo1}>
          {validBo1 ? '✅' : '❌'}
        </span>
        <span id={idBo1}>BO1</span> (メインデッキのみで判定)
      </li>
      <li>
        <span role="status" aria-labelledby={idBo3}>
          {validBo3 ? '✅' : '❌'}
        </span>
        <span id={idBo3}>BO3</span>
      </li>
    </ul>
  )
}

function isDeckValidBo1(deckMain) {
  return hasCopiesLe4(deckMain) && hasMainGe40(deckMain)
}

function isDeckValidBo3(deckMain, deckSide) {
  return (
    hasCopiesLe4(deckMain, deckSide) &&
    hasMainGe40(deckMain) &&
    hasMainSideBetween40and60(deckMain, deckSide) &&
    hasSideLe10(deckSide)
  )
}

function hasMainGe40(deckMain) {
  return sumDeck(deckMain) >= 40
}

function hasMainSideBetween40and60(deckMain, deckSide) {
  const count = sumDeck(deckMain) + sumDeck(deckSide)
  return count >= 40 && count <= 60
}

function hasSideLe10(deckSide) {
  return sumDeck(deckSide) <= 10
}

function sumDeck(deck) {
  return sum(deck.values())
}

function hasCopiesLe4(deckMain, deckSide = new Map()) {
  const merged = new Map()
  for (const deck of [deckMain, deckSide]) {
    for (const [id, numCopies] of deck.entries()) {
      const card = dataCardsMap.get(id)
      // デッキに何枚でも入れられるカードは無視する
      if (card.anyNumCopies) {
        continue
      }
      // ID ではなくカード名で判断する
      if (merged.has(card.name)) {
        merged.set(card.name, merged.get(card.name) + numCopies)
      } else {
        merged.set(card.name, numCopies)
      }
    }
  }
  return [...merged.values()].every((numCopies) => numCopies <= 4)
}

export default ContainerDeckValidator
