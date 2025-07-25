import { useId } from 'react'

import { dataCardsMap } from '../../commons/dataCards'
import { sum } from '../../commons/utils'

function ContainerDeckValidator({ deckMain, deckSide }) {
  const id002 = useId()
  const idRecommended = useId()
  const idUnrestricted = useId()

  return (
    <div className="m-2">
      <ul style={{ padding: 0, listStyle: 'none' }}>
        <li>
          <span role="status" aria-labelledby={id002}>
            {isDeckValidCommunity002(deckMain, deckSide) ? '✅' : '❌'}
          </span>
          <span id={id002}>いわゆる002</span> (メディチ0・リユニオン0)
        </li>
        <li>
          <span role="status" aria-labelledby={idRecommended}>
            {isDeckValidRecommended(deckMain, deckSide) ? '✅' : '❌'}
          </span>
          <span id={idRecommended}>推奨レギュレーション</span>{' '}
          (メディチ2・リユニオン2)
        </li>
        <li>
          <span role="status" aria-labelledby={idUnrestricted}>
            {isDeckValidUnrestricted(deckMain, deckSide) ? '✅' : '❌'}
          </span>
          <span id={idUnrestricted}>封印なし</span> (メディチ4・リユニオン4)
        </li>
      </ul>
    </div>
  )
}

// いわゆる002
function isDeckValidCommunity002(deckMain, deckSide) {
  return (
    isDeckValidBase(deckMain, deckSide) &&
    hasMediciLe(0, deckMain, deckSide) &&
    hasReunionLe(0, deckMain, deckSide)
  )
}

// 推奨レギュレーション
function isDeckValidRecommended(deckMain, deckSide) {
  return (
    isDeckValidBase(deckMain, deckSide) &&
    hasMediciLe(2, deckMain, deckSide) &&
    hasReunionLe(2, deckMain, deckSide)
  )
}

// 封印なし
function isDeckValidUnrestricted(deckMain, deckSide) {
  return isDeckValidBase(deckMain, deckSide)
}

function isDeckValidBase(deckMain, deckSide) {
  if (sumDeck(deckSide) == 0) {
    // サイドデッキがない場合、BO1のデッキと見なす
    return hasMainGe40(deckMain) && hasCopiesLe4(deckMain)
  } else {
    // サイドデッキがある場合、BO3のデッキと見なす
    return (
      hasMainGe40(deckMain) &&
      hasSideLe10(deckSide) &&
      hasMainSideBetween40and60(deckMain, deckSide) &&
      hasCopiesLe4(deckMain, deckSide)
    )
  }
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

function hasMediciLe(numCopies, deckMain, deckSide) {
  return hasNumCopiesNameOfIdLe('4-36', numCopies, deckMain, deckSide)
}

function hasReunionLe(numCopies, deckMain, deckSide) {
  return hasNumCopiesNameOfIdLe('4-59', numCopies, deckMain, deckSide)
}

function hasNumCopiesNameOfIdLe(id, numCopies, deckMain, deckSide) {
  const numCopiesMain = numCopiesNameOfId(id, deckMain)
  const numCopiesSide = numCopiesNameOfId(id, deckSide)
  return numCopiesMain + numCopiesSide <= numCopies
}

function numCopiesNameOfId(id, deck) {
  // ID を元に引いたカード名で判断する
  const nameOfId = dataCardsMap.get(id).name
  return [...deck.entries()]
    .map(([id, numCopies]) => [dataCardsMap.get(id).name, numCopies])
    .filter(([name]) => name === nameOfId)
    .map(([, numCopies]) => numCopies)
    .reduce((a, b) => a + b, 0)
}

export default ContainerDeckValidator
