// SPDX-License-Identifier: MIT

import {
  GUTTER,
  HEADING_FONT_SIZE,
  IDEAL_ASPECT_RATIO,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  MAX_HEIGHT_CANVAS,
  MAX_WIDTH_CANVAS,
} from './constants'

export function getImageX(numColumns, i) {
  return (IMAGE_WIDTH + GUTTER) * (i % numColumns)
}

export function getImageY(numColumns, i) {
  return (IMAGE_HEIGHT + GUTTER) * Math.floor(i / numColumns)
}

export function getWidthCanvas(numColumns) {
  // 少なくともカード3枚分の幅を持つ
  return GUTTER + (IMAGE_WIDTH + GUTTER) * Math.max(numColumns, 3)
}

export function getHeightPart(numRows) {
  return HEADING_FONT_SIZE + (GUTTER + IMAGE_HEIGHT) * numRows
}

export function getHeightCanvas(numRowsMain, numRowsSide) {
  const heightMain = getHeightPart(numRowsMain)
  const heightSide = getHeightPart(numRowsSide)
  return numRowsSide === 0
    ? GUTTER + heightMain + GUTTER
    : GUTTER + heightMain + GUTTER + heightSide + GUTTER
}

export function getCanvasSpec(numUniqueMain, numUniqueSide) {
  if (numUniqueMain === 0 && numUniqueSide === 0) {
    return {
      numRowsMain: 0,
      numRowsSide: 0,
      numColumns: 0,
    }
  }

  // 候補となる列数すべてを求める。例えば、メインデッキの種類数が13の
  // 場合、これを1行から13行で並べた際に必要な列数を求める：
  //
  //   13  13  13  13  13  13  13  ..  13  13
  //    1   2   3   4   5   6   7  ..  12  13
  //   13   7   5   4   3   3   2  ..   2   1  <= 候補となる列数
  //
  // これをメインデッキとサイドデッキのそれぞれで求め、和集合を作って
  // 最終候補とする。解の列数は必ずこの最終候補の中から選ぶ。
  const candidatesMain = [...Array(numUniqueMain).keys()].map((e) =>
    Math.ceil(numUniqueMain / (e + 1)),
  )
  const candidatesSide = [...Array(numUniqueSide).keys()].map((e) =>
    Math.ceil(numUniqueSide / (e + 1)),
  )
  const candidates = new Set(candidatesMain.concat(candidatesSide))

  return (
    [...candidates.values()]
      .map((numColumns) => {
        const numRowsMain = Math.ceil(numUniqueMain / numColumns)
        const numRowsSide = Math.ceil(numUniqueSide / numColumns)
        const width = getWidthCanvas(numColumns)
        const height = getHeightCanvas(numRowsMain, numRowsSide)
        const aspectRatio = width / height
        // deviation は (0,1] の範囲を取る。
        const deviation =
          aspectRatio < IDEAL_ASPECT_RATIO
            ? aspectRatio / IDEAL_ASPECT_RATIO
            : IDEAL_ASPECT_RATIO / aspectRatio
        return {
          numRowsMain,
          numRowsSide,
          numColumns,
          deviation,
        }
      })
      // 理想の解像度に最も近い候補を選出する。
      .sort((a, b) => a.deviation - b.deviation)
      .pop()
  )
}

export function isCanvasEnabled(spec) {
  const width = getWidthCanvas(spec.numColumns)
  const height = getHeightCanvas(spec.numRowsMain, spec.numRowsSide)
  return width <= MAX_WIDTH_CANVAS && height <= MAX_HEIGHT_CANVAS
}
