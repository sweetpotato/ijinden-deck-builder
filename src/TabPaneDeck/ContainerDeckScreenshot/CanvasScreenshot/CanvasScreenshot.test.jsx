// SPDX-License-Identifier: MIT

import { useRef } from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'

import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants'
import { getCanvasSpec } from './utils'
import CanvasScreenshot from './CanvasScreenshot'

function getRef(result) {
  return result.current[0]
}

afterEach(cleanup)

test.each([
  [0, 0, 0],
  [1, 0, IMAGE_HEIGHT],
  [2, 0, IMAGE_HEIGHT],
  [3, 0, IMAGE_HEIGHT],
  [4, 0, IMAGE_HEIGHT],
  [0, 1, IMAGE_HEIGHT],
  [0, 2, IMAGE_HEIGHT],
  [0, 3, IMAGE_HEIGHT],
  [0, 4, IMAGE_HEIGHT],
  [1, 1, IMAGE_HEIGHT * 2],
  [2, 1, IMAGE_HEIGHT * 2],
  [3, 1, IMAGE_HEIGHT * 2],
  [4, 1, IMAGE_HEIGHT * 2],
  [1, 2, IMAGE_HEIGHT * 2],
  [1, 3, IMAGE_HEIGHT * 2],
  [1, 4, IMAGE_HEIGHT * 2],
  [4, 3, IMAGE_HEIGHT * 2],
  [3, 4, IMAGE_HEIGHT * 2],
  [4, 4, IMAGE_HEIGHT * 2],
])(
  '最低幅と高さ (メイン%d枚、サイド%d枚)',
  (numEntriesMain, numEntriesSide, minHeight) => {
    const { result } = renderHook(() => useRef(null))
    const deckMain = new Map(
      [...Array(numEntriesMain)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )
    expect(deckMain.size).toEqual(numEntriesMain)
    const deckSide = new Map(
      [...Array(numEntriesSide)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )
    expect(deckSide.size).toEqual(numEntriesSide)
    const spec = getCanvasSpec(deckMain.size, deckSide.size)

    const { container } = render(
      <CanvasScreenshot
        refCanvas={getRef(result)}
        deckMain={deckMain}
        deckSide={deckSide}
        spec={spec}
      />,
    )

    expect(container.getElementsByTagName('canvas').length).toEqual(1)
    const canvas = container.getElementsByTagName('canvas')[0]
    expect(canvas).not.toBeVisible()
    expect(canvas).toHaveAttribute('width')
    const width = parseInt(canvas.getAttribute('width'))
    expect(width).toBeGreaterThanOrEqual(IMAGE_WIDTH * 3)
    expect(canvas).toHaveAttribute('height')
    const height = parseInt(canvas.getAttribute('height'))
    expect(height).toBeGreaterThanOrEqual(minHeight)
  },
)
