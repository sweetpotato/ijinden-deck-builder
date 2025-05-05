// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { useContext, useDeferredValue, useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  Button,
  FormCheck,
  FormControl,
  Table,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'
import FormRange from 'react-bootstrap/esm/FormRange'

import { dataCardsArrayForTable as dataCards } from '../commons/dataCards'
import AccordionItemRadioFilter from './AccordionItemRadioFilter'
import InputGroupCounter from './InputGroupCounter'

import './index.css'

const dataExpansions = [
  { value: 0, label: 'すべて' },
  { value: 10, label: '伝説の武将' },
  { value: 11, label: '知と美の革命' },
  { value: 12, label: '日本の大天才' },
  { value: 15, label: '第１弾ブースター' },
  { value: 20, label: '三国の英傑' },
  { value: 25, label: '第２弾ブースター' },
  { value: 30, label: '発展する医療' },
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
  { value: 1, label: '赤' },
  { value: 2, label: '青' },
  { value: 4, label: '緑' },
  { value: 8, label: '黄' },
  { value: 16, label: '紫' },
  { value: 32, label: '多色' },
  { value: 64, label: '無色' },
]

const COLOR_RED = 1
const COLOR_YELLOW = 8
const COLOR_COLORLESS = 64
const dataColorsToCss = [
  { color: COLOR_RED, css: 'bg-ijinden-red' },
  { color: 2, css: 'bg-ijinden-blue' },
  { color: 4, css: 'bg-ijinden-green' },
  { color: COLOR_YELLOW, css: 'bg-ijinden-yellow' },
  { color: 16, css: 'bg-ijinden-purple' },
  { color: 41, css: 'bg-ijinden-red-yellow' },
  { color: 42, css: 'bg-ijinden-blue-yellow' },
  { color: 44, css: 'bg-ijinden-green-yellow' },
  { color: COLOR_COLORLESS, css: 'bg-ijinden-colorless' },
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
const LEVEL_COMPARATOR_GE = 'ge'
const LEVEL_COMPARATOR_LE = 'le'
const LEVEL_COMPARATOR_EQ = 'eq'
const dataLevelComparators = [
  { value: LEVEL_COMPARATOR_GE, label: '以上' },
  { value: LEVEL_COMPARATOR_LE, label: '以下' },
  { value: LEVEL_COMPARATOR_EQ, label: '等しい' },
]

const TERM_CHROMAGIC = 16
const dataTerms = [
  { value: 0, label: '指定なし' },
  { value: 1, label: '航海' },
  { value: 2, label: '執筆' },
  { value: 4, label: '決起' },
  { value: 8, label: '徴募' },
  { value: TERM_CHROMAGIC, label: '魔導' },
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

const CHROMAGIC_RED = 32
const CHROMAGIC_BLUE = 64
const CHROMAGIC_GREEN = 128
const CHROMAGIC_YELLOW = 256
const CHROMAGIC_PURPLE = 512
// すべての実在する色と魔導の組み合わせ
const dataChromagicsToCss = [
  // 赤の黄魔導 (例：スペクター)
  {
    color: COLOR_RED,
    chromagic: CHROMAGIC_YELLOW,
    css: 'bg-chromagic-red-yellow',
  },
  // 黄の赤魔導 (例：スカーレット)
  {
    color: COLOR_YELLOW,
    chromagic: CHROMAGIC_RED,
    css: 'bg-chromagic-yellow-red',
  },
  // 黄の青魔導 (例：ピーコック)
  {
    color: COLOR_YELLOW,
    chromagic: CHROMAGIC_BLUE,
    css: 'bg-chromagic-yellow-blue',
  },
  // 黄の緑魔導 (例：シャトルーズ)
  {
    color: COLOR_YELLOW,
    chromagic: CHROMAGIC_GREEN,
    css: 'bg-chromagic-yellow-green',
  },
  // 無色の魔導 (例：ソリッドビジョンサイクル)
  {
    color: COLOR_COLORLESS,
    chromagic: CHROMAGIC_RED,
    css: 'bg-chromagic-colorless-red',
  },
  {
    color: COLOR_COLORLESS,
    chromagic: CHROMAGIC_BLUE,
    css: 'bg-chromagic-colorless-blue',
  },
  {
    color: COLOR_COLORLESS,
    chromagic: CHROMAGIC_GREEN,
    css: 'bg-chromagic-colorless-green',
  },
  {
    color: COLOR_COLORLESS,
    chromagic: CHROMAGIC_YELLOW,
    css: 'bg-chromagic-colorless-yellow',
  },
  {
    color: COLOR_COLORLESS,
    chromagic: CHROMAGIC_PURPLE,
    css: 'bg-chromagic-colorless-purple',
  },
]

function TabPaneCard({
  handleSetIdZoom,
  deckMain,
  handleSetDeckMain,
  deckSide,
  handleSetDeckSide,
  interruptSimulator,
}) {
  const [expansion, setExpansion] = useState(0)
  const [rarity, setRarity] = useState(0)
  const [color, setColor] = useState(0)
  const [type, setType] = useState(0)
  const [levelValue, setLevelValue] = useState(LEVEL_VALUE_MIN)
  const [levelComparator, setLevelComparator] = useState(LEVEL_COMPARATOR_GE)
  const [term, setTerm] = useState(0)
  const [trait, setTrait] = useState(0)
  const [legacy, setLegacy] = useState(0)
  const [keywords, setKeywords] = useState([])
  const [includesTraitAndLegacy, setIncludesTraitAndLegacy] = useState(true)
  const deferredKeywords = useDeferredValue(keywords)

  function handleClickResetConditions() {
    setExpansion(0)
    setRarity(0)
    setColor(0)
    setType(0)
    setLevelValue(LEVEL_VALUE_MIN)
    setLevelComparator(LEVEL_COMPARATOR_GE)
    setTerm(0)
    setTrait(0)
    setLegacy(0)
  }

  function handleChangeExpansion(e) {
    setExpansion(Number(e.currentTarget.value))
  }

  function handleChangeRarity(e) {
    setRarity(Number(e.currentTarget.value))
  }

  function handleChangeColor(e) {
    setColor(Number(e.currentTarget.value))
  }

  function handleChangeType(e) {
    setType(Number(e.currentTarget.value))
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

  function handleChangeTerm(e) {
    setTerm(Number(e.currentTarget.value))
  }

  function handleChangeTrait(e) {
    setTrait(Number(e.currentTarget.value))
  }

  function handleChangeLegacy(e) {
    setLegacy(Number(e.currentTarget.value))
  }

  function handleChangeKeywords(e) {
    setKeywords(
      e.currentTarget.value
        .trim()
        .split(/\s+/)
        .filter((e) => e.length > 0)
    )
  }

  function handleChangeIncludesTraitAndLegacy(e) {
    setIncludesTraitAndLegacy(e.currentTarget.checked)
  }

  return (
    <>
      <div className="m-2">
        <FormControl
          placeholder="カード名やルールテキストを入力して検索"
          onChange={handleChangeKeywords}
        />
      </div>
      <div className="m-2">
        <FormCheck
          id="includes-trait-and-legacy"
          type="checkbox"
          label="特性と遺業能力も検索する"
          defaultChecked={true}
          onChange={handleChangeIncludesTraitAndLegacy}
        />
      </div>
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
              <AccordionItemRadioFilter
                eventKey="0"
                title="エキスパンション"
                name="expansion"
                state={expansion}
                handleChange={handleChangeExpansion}
                data={dataExpansions}
              />
              <AccordionItemRadioFilter
                eventKey="1"
                title="レアリティ"
                name="rarity"
                state={rarity}
                handleChange={handleChangeRarity}
                data={dataRarities}
              />
              <AccordionItemRadioFilter
                eventKey="2"
                title="色"
                name="color"
                state={color}
                handleChange={handleChangeColor}
                data={dataColors}
              />
              <AccordionItemRadioFilter
                eventKey="3"
                title="種類"
                name="type"
                state={type}
                handleChange={handleChangeType}
                data={dataTypes}
              />
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
              <AccordionItemRadioFilter
                eventKey="5"
                title="特性"
                name="trait"
                state={trait}
                handleChange={handleChangeTrait}
                data={dataTraits}
              />
              <AccordionItemRadioFilter
                eventKey="6"
                title="能力語"
                name="term"
                state={term}
                handleChange={handleChangeTerm}
                data={dataTerms}
              />
              <AccordionItemRadioFilter
                eventKey="7"
                title="遺業能力"
                name="legacy"
                state={legacy}
                handleChange={handleChangeLegacy}
                data={dataLegacies}
              />
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
          {dataCards.map((element) => (
            <TableRowCard
              {...element}
              key={element.id}
              selectedExpansion={expansion}
              selectedRarity={rarity}
              selectedColor={color}
              selectedType={type}
              selectedLevelValue={levelValue}
              selectedLevelComparator={levelComparator}
              selectedTerm={term}
              selectedTrait={trait}
              selectedLegacy={legacy}
              keywords={deferredKeywords}
              includesTraitAndLegacy={includesTraitAndLegacy}
              handleSetIdZoom={handleSetIdZoom}
              deckMain={deckMain}
              handleSetDeckMain={handleSetDeckMain}
              deckSide={deckSide}
              handleSetDeckSide={handleSetDeckSide}
              interruptSimulator={interruptSimulator}
            />
          ))}
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
    stateComparator === LEVEL_COMPARATOR_GE
      ? `${stateValue}以上`
      : stateComparator === LEVEL_COMPARATOR_LE
      ? `${stateValue}以下`
      : `${stateValue}に等しい`
  const enphasized = stateValue !== 0 || stateComparator != LEVEL_COMPARATOR_GE

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

function TableRowCard({
  id,
  name,
  kana,
  expansion,
  rarity,
  color,
  type,
  level,
  term,
  trait,
  legacy,
  traitText,
  ruleText,
  legacyText,
  selectedExpansion,
  selectedRarity,
  selectedType,
  selectedColor,
  selectedLevelValue,
  selectedLevelComparator,
  selectedTerm,
  selectedTrait,
  selectedLegacy,
  keywords,
  includesTraitAndLegacy,
  handleSetIdZoom,
  deckMain,
  handleSetDeckMain,
  deckSide,
  handleSetDeckSide,
  interruptSimulator,
}) {
  const levelMatched =
    selectedLevelComparator === LEVEL_COMPARATOR_GE
      ? level >= selectedLevelValue
      : selectedLevelComparator === LEVEL_COMPARATOR_LE
      ? level <= selectedLevelValue
      : level === selectedLevelValue
  let allText = name + '§' + kana
  allText += includesTraitAndLegacy && traitText ? '§' + traitText : ''
  allText += '§' + ruleText
  allText += includesTraitAndLegacy && legacyText ? '§' + legacyText : ''
  const show =
    (selectedExpansion === 0 || expansion === selectedExpansion) &&
    (selectedRarity === 0 || (rarity & selectedRarity) === rarity) &&
    (selectedColor === 0 || (color & selectedColor) === selectedColor) &&
    (selectedType === 0 || type === selectedType) &&
    levelMatched &&
    (selectedTerm === 0 || (term & selectedTerm) === selectedTerm) &&
    (selectedTrait === 0 || (trait & selectedTrait) === selectedTrait) &&
    (selectedLegacy === 0 || legacy === selectedLegacy) &&
    keywords.every((e) => allText.includes(e))

  let colorClass
  if ((term & TERM_CHROMAGIC) === TERM_CHROMAGIC) {
    colorClass = classNames(
      dataChromagicsToCss.map(
        (e) =>
          e.color === color && (term & ~TERM_CHROMAGIC) === e.chromagic && e.css
      )
    )
  } else {
    colorClass = classNames(
      dataColorsToCss.map((e) => e.color === color && e.css)
    )
  }

  return (
    show && (
      <tr>
        <td className={colorClass}>{id}</td>
        <td>
          <Button
            variant="secondary-outline"
            size="sm"
            className="btn-zoom-in-table"
            onClick={() => handleSetIdZoom(id)}
          >
            🔎
          </Button>
          {name}
        </td>
        <td>
          <InputGroupCounter
            id={id}
            deck={deckMain}
            handleSetDeck={handleSetDeckMain}
            interruptSimulator={interruptSimulator}
          />
        </td>
        <td>
          <InputGroupCounter
            id={id}
            deck={deckSide}
            handleSetDeck={handleSetDeckSide}
          />
        </td>
      </tr>
    )
  )
}

export default TabPaneCard
