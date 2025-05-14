// SPDX-License-Identifier: MIT

import { useContext, useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  Button,
  Table,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'
import FormRange from 'react-bootstrap/esm/FormRange'

import { dataCardsArrayForTable as dataCards } from '../commons/dataCards'
import enumColor from './enumColor'
import enumComparator from './enumComparator'
import enumTerm from './enumTerm'
import useAccordionItemGenericFilter from './AccordionItemGenericFilter'
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

const dataTypes = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'イジン' },
  { value: 2, label: 'ハイケイ' },
  { value: 3, label: 'マホウ' },
  { value: 4, label: 'マリョク' },
]

const LEVEL_VALUE_MIN = 0
const LEVEL_VALUE_MAX = 17
const dataLevelComparators = [
  { value: enumComparator.GE, label: '以上' },
  { value: enumComparator.LE, label: '以下' },
  { value: enumComparator.EQ, label: '等しい' },
]

const dataTerms = [
  { value: 0, label: '指定なし' },
  { value: enumTerm.SAILING, label: '航海' },
  { value: enumTerm.WRITING, label: '執筆' },
  { value: enumTerm.RISING, label: '決起' },
  { value: enumTerm.RECRUITMENT, label: '徴募' },
  { value: enumTerm.CHROMAGIC, label: '魔導' },
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
  { value: 1, label: '魔力化' },
  { value: 2, label: '冥府発動' },
  { value: 3, label: '復元' },
  { value: 6, label: '反魂' },
  { value: 8, label: '木霊' },
  { value: 9, label: '喪神' },
  { value: 4, label: '1ドローする' },
  { value: 5, label: '手札に戻す' },
  { value: 7, label: '山札の上か下に戻す' },
]

function TabPaneCard({
  handleSetIdZoom,
  deckMain,
  handleSetDeckMain,
  deckSide,
  handleSetDeckSide,
  interruptSimulator,
}) {
  const [expansion, resetExpansion, renderExpansion] =
    useAccordionItemGenericFilter(
      'button-expansion-all',
      'エキスパンション',
      dataExpansions
    )
  const [rarity, resetRarity, renderRarity] = useAccordionItemGenericFilter(
    'button-rarity-all',
    'レアリティ',
    dataRarities
  )
  const [color, resetColor, renderColor] = useAccordionItemGenericFilter(
    'button-color-all',
    '色',
    dataColors
  )
  const [type, resetType, renderType] = useAccordionItemGenericFilter(
    'button-type-all',
    '種類',
    dataTypes
  )
  const [levelValue, setLevelValue] = useState(LEVEL_VALUE_MIN)
  const [levelComparator, setLevelComparator] = useState(enumComparator.GE)
  const [trait, resetTrait, renderTrait] = useAccordionItemGenericFilter(
    'button-trait-unspecified',
    '特性',
    dataTraits
  )
  const [term, resetTerm, renderTerm] = useAccordionItemGenericFilter(
    'button-term-unspecified',
    '能力語',
    dataTerms
  )
  const [legacy, resetLegacy, renderLegacy] = useAccordionItemGenericFilter(
    'button-legacy-unspecified',
    '遺業能力',
    dataLegacies
  )
  const [deferredKeywords, includesTraitAndLegacy, renderTextSearch] =
    useContainerTextSearch()

  function handleClickResetConditions() {
    resetExpansion()
    resetRarity()
    resetColor()
    resetType()
    setLevelValue(LEVEL_VALUE_MIN)
    setLevelComparator(enumComparator.GE)
    resetTrait()
    resetTerm()
    resetLegacy()
  }

  function handleChangeLevelValue(e) {
    const currentValue = Number(e.currentTarget.value)
    // レベル11から16までのカードは存在しないため、
    // その値に設定してもあまり有益ではない。
    // 代わりに、レベル10または17の近い方に四捨五入的に寄せる。
    if (10 <= currentValue && currentValue < LEVEL_VALUE_MAX) {
      setLevelValue(
        currentValue < (10 + LEVEL_VALUE_MAX) / 2 ? 10 : LEVEL_VALUE_MAX
      )
    } else {
      setLevelValue(currentValue)
    }
  }

  function handleChangeLevelComparator(e) {
    setLevelComparator(e.currentTarget.value)
  }

  function filterCard(card) {
    const levelMatched =
      levelComparator === enumComparator.GE
        ? card.level >= levelValue
        : levelComparator === enumComparator.LE
        ? card.level <= levelValue
        : card.level === levelValue
    let allText = card.name + '§' + card.kana
    allText +=
      includesTraitAndLegacy && card.traitText ? '§' + card.traitText : ''
    allText += '§' + card.ruleText
    allText +=
      includesTraitAndLegacy && card.legacyText ? '§' + card.legacyText : ''
    return (
      (expansion === 0 || card.expansion === expansion) &&
      (rarity === 0 || (card.rarity & rarity) === card.rarity) &&
      (color === 0 || (card.color & color) === color) &&
      (type === 0 || card.type === type) &&
      levelMatched &&
      (term === 0 || (card.term & term) === term) &&
      (trait === 0 || (card.trait & trait) === trait) &&
      (legacy === 0 || card.legacy === legacy) &&
      deferredKeywords.every((e) => allText.includes(e))
    )
  }

  return (
    <>
      {renderTextSearch()}
      <Accordion>
        <AccordionItem eventKey="0">
          <AccordionHeader as="h2" className="header-filter">
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
              className="container-filter"
              alwaysOpen
              defaultActiveKey={['2', '3']}
            >
              {renderExpansion('0')}
              {renderRarity('1')}
              {renderColor('2')}
              {renderType('3')}
              <AccordionItemLevelFilter
                eventKey="4"
                title="レベル"
                nameComparator="level-comparator"
                stateValue={levelValue}
                stateComparator={levelComparator}
                handleChangeValue={handleChangeLevelValue}
                handleChangeComparator={handleChangeLevelComparator}
                data={dataLevelComparators}
              />
              {renderTrait('5')}
              {renderTerm('6')}
              {renderLegacy('7')}
            </Accordion>
          </AccordionBody>
        </AccordionItem>
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
          {dataCards.map((element) => {
            return (
              filterCard(element) && (
                <TableRowCard
                  key={element.id}
                  id={element.id}
                  name={element.name}
                  color={element.color}
                  term={element.term}
                  deckMain={deckMain}
                  deckSide={deckSide}
                  handleSetDeckMain={handleSetDeckMain}
                  handleSetDeckSide={handleSetDeckSide}
                  handleSetIdZoom={handleSetIdZoom}
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

function AccordionItemLevelFilter({
  eventKey,
  title,
  nameComparator,
  stateValue,
  stateComparator,
  handleChangeValue,
  handleChangeComparator,
  data,
}) {
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label =
    stateComparator === enumComparator.GE
      ? `${stateValue}以上`
      : stateComparator === enumComparator.LE
      ? `${stateValue}以下`
      : `${stateValue}に等しい`
  const enphasized = stateValue !== 0 || stateComparator != enumComparator.GE

  return (
    <AccordionItem eventKey={eventKey}>
      <AccordionHeader as="h3">
        {expanded ? (
          `➖ ${title}`
        ) : !enphasized ? (
          `➕ ${title} ― ${label}`
        ) : (
          <>
            ➕ {title}
            &nbsp;―&nbsp;
            <b>{label}</b>
          </>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div>
          <div>{stateValue}</div>
          <FormRange
            min={LEVEL_VALUE_MIN}
            max={LEVEL_VALUE_MAX}
            value={stateValue}
            onChange={handleChangeValue}
          />
        </div>
        <div className="container-button">
          {data.map((element) => {
            const id = `${nameComparator}-${element.value}`
            return (
              <ToggleButton
                key={id}
                type="radio"
                variant="outline-primary"
                id={id}
                name={nameComparator}
                value={element.value}
                onChange={handleChangeComparator}
                checked={stateComparator === element.value}
              >
                {element.label}
              </ToggleButton>
            )
          })}
        </div>
      </AccordionBody>
    </AccordionItem>
  )
}

export default TabPaneCard
