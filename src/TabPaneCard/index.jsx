// SPDX-License-Identifier: MIT

import { useId } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Table,
} from 'react-bootstrap'

import { dataCardsArrayForTable as dataCards } from '../commons/dataCards'
import enumColor from './enumColor'
import enumComparator from './enumComparator'
import enumSortBy from './enumSortBy'
import enumTerm from './enumTerm'
import enumType from './enumType'
import useAccordionItemGenericFilter from './AccordionItemGenericFilter'
import useAccordionItemLevelFilter from './AccordionItemLevelFilter'
import useAccordionItemSortBy from './AccordionItemSortBy'
import useAccordionItemTypeFilter from './AccordionItemTypeFilter'
import useContainerTextSearch from './ContainerTextSearch'
import TableRowCard from './TableRowCard'

import './index.css'

const dataExpansions = [
  { value: 0, label: 'すべて' },
  { value: 10, label: '伝説の武将' },
  { value: 11, label: '美と知の革命' },
  { value: 12, label: '日本の大天才' },
  { value: 15, label: '第１弾ブースター' },
  { value: 20, label: '三国の英傑' },
  { value: 25, label: '第２弾ブースター' },
  { value: 30, label: '発展する医学' },
  { value: 35, label: '第３弾ブースター' },
  { value: 45, label: '第４弾ブースター' },
  { value: 55, label: '第５弾ブースター' },
]

const dataRarities = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'Nのみ' },
  { value: 3, label: 'NとR' },
  { value: 2, label: 'Rのみ' },
  { value: 6, label: 'RとSR' },
  { value: 4, label: 'SRのみ' },
]

const dataColors = [
  { value: 0, label: 'すべて' },
  { value: enumColor.RED, label: '赤' },
  { value: enumColor.BLUE, label: '青' },
  { value: enumColor.GREEN, label: '緑' },
  { value: enumColor.YELLOW, label: '黄' },
  { value: enumColor.PURPLE, label: '紫' },
  { value: enumColor.MULTICOLOR, label: '多色' },
  { value: enumColor.COLORLESS, label: '無色' },
]

const dataTerms = [
  { value: 0, label: '指定なし' },
  { value: enumTerm.SAILING, label: '航海' },
  { value: enumTerm.WRITING, label: '執筆' },
  { value: enumTerm.RISING, label: '決起' },
  { value: enumTerm.RECRUITMENT, label: '徴募' },
  { value: enumTerm.CHROMAGIC, label: '魔導' },
  { value: enumTerm.BATTLE_CRY, label: '勝鬨' },
]

const dataTraits = [
  { value: 0, label: '指定なし' },
  { value: 1, label: '剣術' },
  { value: 2, label: '美術' },
  { value: 4, label: '音楽' },
  { value: 8, label: '思想' },
  { value: 16, label: '医術' },
  { value: 32, label: '志願' },
]

// 表示順を整えるため、値の昇順にしていない
const dataLegacies = [
  { value: 0, label: '指定なし' },
  { value: 1, label: '遺業能力なし' },
  { value: 2, label: '遺業能力あり' },
  { value: 6, label: '魔力化' },
  { value: 10, label: '冥府発動' },
  { value: 18, label: '復元' },
  { value: 130, label: '反魂' },
  { value: 514, label: '木霊' },
  { value: 1026, label: '喪神' },
  { value: 34, label: '1ドローする' },
  { value: 66, label: '手札に戻す' },
  { value: 258, label: '山札の上か下に戻す' },
]

function TabPaneCard({
  deckMain,
  deckSide,
  dispatchDeck,
  zoomIn,
  interruptSimulator,
}) {
  const idTitle = useId()
  const [expansion, resetExpansion, renderExpansion] =
    useAccordionItemGenericFilter('エキスパンション', dataExpansions)
  const [rarity, resetRarity, renderRarity] = useAccordionItemGenericFilter(
    'レアリティ',
    dataRarities,
  )
  const [color, resetColor, renderColor] = useAccordionItemGenericFilter(
    '色',
    dataColors,
  )
  const [type, power, powerComparator, resetType, renderType] =
    useAccordionItemTypeFilter()
  const [level, levelComparator, resetLevel, renderLevel] =
    useAccordionItemLevelFilter()
  const [trait, resetTrait, renderTrait] = useAccordionItemGenericFilter(
    '特性',
    dataTraits,
  )
  const [term, resetTerm, renderTerm] = useAccordionItemGenericFilter(
    '能力語',
    dataTerms,
  )
  const [legacy, resetLegacy, renderLegacy] = useAccordionItemGenericFilter(
    '遺業能力',
    dataLegacies,
  )
  const [deferredKeywords, includesTraitAndLegacy, renderTextSearch] =
    useContainerTextSearch()
  const [sortBy, renderSortBy] = useAccordionItemSortBy()

  function handleClickResetConditions() {
    resetExpansion()
    resetRarity()
    resetColor()
    resetType()
    resetLevel()
    resetTrait()
    resetTerm()
    resetLegacy()
  }

  function filterCard(card) {
    const powerMatched =
      powerComparator === enumComparator.GE
        ? card.power >= power
        : powerComparator === enumComparator.LE
          ? card.power <= power
          : card.power === power
    const levelMatched =
      levelComparator === enumComparator.GE
        ? card.level >= level
        : levelComparator === enumComparator.LE
          ? card.level <= level
          : card.level === level
    // Should use name, not displayName
    let allText = card.name + '§' + card.kana
    allText +=
      includesTraitAndLegacy && card.traitText ? '§' + card.traitText : ''
    allText += '§' + card.ruleText
    allText +=
      includesTraitAndLegacy && card.legacyText ? '§' + card.legacyText : ''
    allText += '§' + card.illustration.toLowerCase()
    return (
      (expansion === 0 || card.expansion === expansion) &&
      (rarity === 0 || (card.rarity & rarity) === card.rarity) &&
      (color === 0 || (card.color & color) === color) &&
      (type === 0 || card.type === type) &&
      (card.type !== enumType.IJIN || powerMatched) &&
      levelMatched &&
      (term === 0 || (card.term & term) === term) &&
      (trait === 0 || (card.trait & trait) === trait) &&
      (legacy === 0 || (card.legacy & legacy) === legacy) &&
      deferredKeywords.every((e) => allText.includes(e.toLowerCase()))
    )
  }

  function makeSortedDataCards() {
    switch (sortBy) {
      case enumSortBy.COLOR_TYPE: {
        return dataCards.toSorted((a, b) => {
          if (a.color === b.color && a.type === b.type) {
            return a.orderTable - b.orderTable
          } else if (a.color === b.color) {
            return a.type - b.type
          } else {
            return a.color - b.color
          }
        })
      }
      case enumSortBy.TYPE_COLOR: {
        return dataCards.toSorted((a, b) => {
          if (a.type === b.type && a.color === b.color) {
            return a.orderTable - b.orderTable
          } else if (a.type === b.type) {
            return a.color - b.color
          } else {
            return a.type - b.type
          }
        })
      }
      case enumSortBy.POWER_COLOR_TYPE: {
        return dataCards.toSorted((a, b) => {
          if (a.power === null || b.power === null) {
            // パワーを持たないカードは後ろへ送る
            if (a.power !== null && b.power === null) {
              return -1
            } else if (a.power === null && b.power !== null) {
              return 1
            } else if (a.color === b.color && a.type === b.type) {
              return a.orderTable - b.orderTable
            } else if (a.color === b.color) {
              return a.type - b.type
            } else {
              return a.color === b.color
            }
          } else if (
            a.power === b.power &&
            a.color === b.color &&
            a.type === b.type
          ) {
            return a.orderTable - b.orderTable
          } else if (a.power === b.power && a.color === b.color) {
            return a.type - b.type
          } else if (a.power === b.power) {
            return a.color - b.color
          } else {
            return a.power - b.power
          }
        })
      }
      case enumSortBy.LEVEL_COLOR_TYPE: {
        return dataCards.toSorted((a, b) => {
          if (a.level === b.level && a.color === b.color && a.type === b.type) {
            return a.orderTable - b.orderTable
          } else if (a.level === b.level && a.color === b.color) {
            return a.type - b.type
          } else if (a.level === b.level) {
            return a.color - b.color
          } else {
            return a.level - b.level
          }
        })
      }
      case enumSortBy.LEVEL_TYPE_COLOR: {
        return dataCards.toSorted((a, b) => {
          if (a.level === b.level && a.type === b.type && a.color === b.color) {
            return a.orderTable - b.orderTable
          } else if (a.level === b.level && a.type === b.type) {
            return a.color - b.color
          } else if (a.level === b.level) {
            return a.type - b.type
          } else {
            return a.level - b.level
          }
        })
      }
      default: {
        return dataCards
      }
    }
  }

  return (
    <>
      {renderTextSearch()}
      <Accordion alwaysOpen>
        <AccordionItem eventKey="0">
          <AccordionHeader id={idTitle} as="h2" className="header-filter">
            条件で絞り込む
          </AccordionHeader>
          <AccordionBody>
            <div className="my-2 container-button">
              <Button
                variant="outline-danger"
                onClick={handleClickResetConditions}
              >
                条件すべてをリセットする
              </Button>
            </div>
            <Accordion
              role="list"
              aria-labelledby={idTitle}
              className="list-filter"
              alwaysOpen
              defaultActiveKey={['2', '3']}
            >
              {renderExpansion('0')}
              {renderRarity('1')}
              {renderColor('2')}
              {renderType('3')}
              {renderLevel('4')}
              {renderTrait('5')}
              {renderTerm('6')}
              {renderLegacy('7')}
            </Accordion>
          </AccordionBody>
        </AccordionItem>
        {renderSortBy('1')}
      </Accordion>
      <Table hover variant="light">
        <thead className="sticky-top">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">カード名</th>
            <th scope="col">メイン</th>
            <th scope="col">サイド</th>
          </tr>
        </thead>
        <tbody>
          {makeSortedDataCards().map((element) => {
            return (
              filterCard(element) && (
                <TableRowCard
                  key={element.id}
                  id={element.id}
                  displayName={element.displayName}
                  color={element.color}
                  term={element.term}
                  counterMain={
                    deckMain.has(element.id) ? deckMain.get(element.id) : 0
                  }
                  counterSide={
                    deckSide.has(element.id) ? deckSide.get(element.id) : 0
                  }
                  dispatchDeck={dispatchDeck}
                  zoomIn={zoomIn}
                  interruptSimulator={interruptSimulator}
                />
              )
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default TabPaneCard
