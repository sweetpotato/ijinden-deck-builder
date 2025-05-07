// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { Button } from 'react-bootstrap'

import enumColor from './enumColor'
import enumTerm from './enumTerm'
import InputGroupCounter from './InputGroupCounter'

const dataColorsToCss = [
  { color: enumColor.RED, css: 'bg-ijinden-red' },
  { color: enumColor.BLUE, css: 'bg-ijinden-blue' },
  { color: enumColor.GREEN, css: 'bg-ijinden-green' },
  { color: enumColor.YELLOW, css: 'bg-ijinden-yellow' },
  { color: enumColor.PURPLE, css: 'bg-ijinden-purple' },
  { color: enumColor.RED_YELLOW, css: 'bg-ijinden-red-yellow' },
  { color: enumColor.BLUE_YELLOW, css: 'bg-ijinden-blue-yellow' },
  { color: enumColor.GREEN_YELLOW, css: 'bg-ijinden-green-yellow' },
  { color: enumColor.COLORLESS, css: 'bg-ijinden-colorless' },
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
    color: enumColor.RED,
    chromagic: CHROMAGIC_YELLOW,
    css: 'bg-chromagic-red-yellow',
  },
  // 黄の赤魔導 (例：スカーレット)
  {
    color: enumColor.YELLOW,
    chromagic: CHROMAGIC_RED,
    css: 'bg-chromagic-yellow-red',
  },
  // 黄の青魔導 (例：ピーコック)
  {
    color: enumColor.YELLOW,
    chromagic: CHROMAGIC_BLUE,
    css: 'bg-chromagic-yellow-blue',
  },
  // 黄の緑魔導 (例：シャトルーズ)
  {
    color: enumColor.YELLOW,
    chromagic: CHROMAGIC_GREEN,
    css: 'bg-chromagic-yellow-green',
  },
  // 無色の魔導 (例：ソリッドビジョンサイクル)
  {
    color: enumColor.COLORLESS,
    chromagic: CHROMAGIC_RED,
    css: 'bg-chromagic-colorless-red',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: CHROMAGIC_BLUE,
    css: 'bg-chromagic-colorless-blue',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: CHROMAGIC_GREEN,
    css: 'bg-chromagic-colorless-green',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: CHROMAGIC_YELLOW,
    css: 'bg-chromagic-colorless-yellow',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: CHROMAGIC_PURPLE,
    css: 'bg-chromagic-colorless-purple',
  },
]

function TableRowCard({
  id,
  name,
  color,
  term,
  handleSetIdZoom,
  deckMain,
  handleSetDeckMain,
  deckSide,
  handleSetDeckSide,
  interruptSimulator,
}) {
  let colorClass
  if ((term & enumTerm.CHROMAGIC) === enumTerm.CHROMAGIC) {
    colorClass = classNames(
      dataChromagicsToCss.map(
        (e) =>
          e.color === color &&
          (term & ~enumTerm.CHROMAGIC) === e.chromagic &&
          e.css
      )
    )
  } else {
    colorClass = classNames(
      dataColorsToCss.map((e) => e.color === color && e.css)
    )
  }

  return (
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
}

export default TableRowCard
