// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { Button } from 'react-bootstrap'

import enumChromagic from '../enumChromagic'
import enumColor from '../enumColor'
import enumTerm from '../enumTerm'
import InputGroupCounter from './InputGroupCounter'

import './index.css'

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

// すべての実在する色と魔導の組み合わせ
const dataChromagicsToCss = [
  // 赤の黄魔導 (例：スペクター)
  {
    color: enumColor.RED,
    chromagic: enumChromagic.YELLOW,
    css: 'bg-chromagic-red-yellow',
  },
  // 黄の赤魔導 (例：スカーレット)
  {
    color: enumColor.YELLOW,
    chromagic: enumChromagic.RED,
    css: 'bg-chromagic-yellow-red',
  },
  // 黄の青魔導 (例：ピーコック)
  {
    color: enumColor.YELLOW,
    chromagic: enumChromagic.BLUE,
    css: 'bg-chromagic-yellow-blue',
  },
  // 黄の緑魔導 (例：シャトルーズ)
  {
    color: enumColor.YELLOW,
    chromagic: enumChromagic.GREEN,
    css: 'bg-chromagic-yellow-green',
  },
  // 無色の魔導 (例：ソリッドビジョンサイクル)
  {
    color: enumColor.COLORLESS,
    chromagic: enumChromagic.RED,
    css: 'bg-chromagic-colorless-red',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: enumChromagic.BLUE,
    css: 'bg-chromagic-colorless-blue',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: enumChromagic.GREEN,
    css: 'bg-chromagic-colorless-green',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: enumChromagic.YELLOW,
    css: 'bg-chromagic-colorless-yellow',
  },
  {
    color: enumColor.COLORLESS,
    chromagic: enumChromagic.PURPLE,
    css: 'bg-chromagic-colorless-purple',
  },
]

function TableRowCard({
  id,
  name,
  color,
  term,
  counterMain,
  counterSide,
  dispatchDeck,
  handleSetIdZoom,
  interruptSimulator,
}) {
  let classesColor
  if ((term & enumTerm.CHROMAGIC) === enumTerm.CHROMAGIC) {
    classesColor = classNames(
      dataChromagicsToCss.map(
        (e) =>
          e.color === color &&
          (term & ~enumTerm.CHROMAGIC) === e.chromagic &&
          e.css
      )
    )
  } else {
    classesColor = classNames(
      dataColorsToCss.map((e) => e.color === color && e.css)
    )
  }

  return (
    /*
     * プラスボタンやマイナスボタンをセレクタで特定できるように
     * 各行にカードIDを含む data-testid を設定する。
     * 実際のユーザはID列を見て一意に識別できるため、
     * アクセシビリティとしては問題ないはずである。
     */
    <tr data-testid={`table-row-${id}`}>
      <td className={classesColor}>{id}</td>
      <td>
        <Button
          variant="secondary-outline"
          size="sm"
          className="m-0 p-0 border-0"
          onClick={() => handleSetIdZoom(id)}
        >
          🔎
        </Button>
        {name}
      </td>
      <td>
        <InputGroupCounter
          id={id}
          counter={counterMain}
          dispatchDecrement={dispatchDeck.decrementMain}
          dispatchIncrement={dispatchDeck.incrementMain}
          interruptSimulator={interruptSimulator}
        />
      </td>
      <td>
        <InputGroupCounter
          id={id}
          counter={counterSide}
          dispatchDecrement={dispatchDeck.decrementSide}
          dispatchIncrement={dispatchDeck.incrementSide}
        />
      </td>
    </tr>
  )
}

export default TableRowCard
