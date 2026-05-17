// SPDX-License-Identifier: MIT

import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva'
import { usePixzleImage } from '@pixzle/react'

import { dataCardsMap } from '../../../commons/dataCards'
import { sum } from '../../../commons/utils'
import {
  GUTTER,
  HEADING_FONT_SIZE,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  REGULAR_FONT_SIZE,
  STROKE_WIDTH,
} from './constants'
import {
  getHeightCanvas,
  getHeightPart,
  getImageX,
  getImageY,
  getWidthCanvas,
} from './utils'

const BLOCK_SIZE = 22
const SEED = 'qnoaMuW16MLQ'
const IMAGE_INFO = { w: IMAGE_WIDTH, h: IMAGE_HEIGHT }

function CanvasScreenshot({ refCanvas, deckMain, deckSide, spec }) {
  const widthCanvas = getWidthCanvas(spec.numColumns)
  const heightCanvas = getHeightCanvas(spec.numRowsMain, spec.numRowsSide)
  const heightMain = getHeightPart(spec.numRowsMain)

  return (
    <Stage
      style={{ display: 'none' }}
      ref={refCanvas}
      width={widthCanvas}
      height={heightCanvas}
    >
      <Layer>
        <Rect width={widthCanvas} height={heightCanvas} fill="white" />
        <GroupPart
          title="メインデッキ"
          deck={deckMain}
          numColumns={spec.numColumns}
          x={GUTTER}
          y={GUTTER}
        />
        {deckSide.size > 0 && (
          <GroupPart
            title="サイドデッキ"
            deck={deckSide}
            numColumns={spec.numColumns}
            x={GUTTER}
            y={GUTTER + heightMain + GUTTER}
          />
        )}
      </Layer>
    </Stage>
  )
}

function GroupPart({ title, deck, numColumns, ...rest }) {
  const deckInternal = [...deck.entries()]
    .map(([id, numCopies]) => {
      return {
        numCopies,
        thumbUrl: dataCardsMap.get(id).thumbUrl,
        orderDeck: dataCardsMap.get(id).orderDeck,
      }
    })
    .sort((a, b) => a.orderDeck - b.orderDeck)
  const total = sum(deck.values())
  const heading = `${title} (${total}枚)`

  return (
    <Group {...rest}>
      <Text text={heading} fontSize={HEADING_FONT_SIZE} />
      <Group y={HEADING_FONT_SIZE + GUTTER}>
        {deckInternal.map((e, i) => {
          const digits = Math.ceil(Math.log10(e.numCopies + 1))
          return (
            <Group
              key={e.thumbUrl}
              x={getImageX(numColumns, i)}
              y={getImageY(numColumns, i)}
            >
              <PixzleURLImage
                src={e.thumbUrl}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
              />
              <Rect
                x={Math.round(STROKE_WIDTH / 2)}
                y={
                  IMAGE_HEIGHT -
                  REGULAR_FONT_SIZE -
                  GUTTER -
                  Math.round(STROKE_WIDTH / 2)
                }
                width={Math.ceil((digits * REGULAR_FONT_SIZE) / 1.75) + GUTTER}
                height={REGULAR_FONT_SIZE + GUTTER}
                stroke="black"
                strokeWidth={STROKE_WIDTH}
                fill="white"
              />
              <Text
                x={STROKE_WIDTH + GUTTER / 2}
                y={IMAGE_HEIGHT - REGULAR_FONT_SIZE - GUTTER / 2 - STROKE_WIDTH}
                fontSize={REGULAR_FONT_SIZE}
                text={String(e.numCopies)}
                fill="black"
              />
            </Group>
          )
        })}
      </Group>
    </Group>
  )
}

function PixzleURLImage({ src, ...rest }) {
  const { bitmap } = usePixzleImage({
    blockSize: BLOCK_SIZE,
    seed: SEED,
    // imageInfo は毎回オブジェクトが再生成される rvalue であってはならない。
    // さもなくば src のダウンロードが無限に繰り返される。
    imageInfo: IMAGE_INFO,
    image: src,
  })
  return <Image image={bitmap} {...rest} />
}

export default CanvasScreenshot
