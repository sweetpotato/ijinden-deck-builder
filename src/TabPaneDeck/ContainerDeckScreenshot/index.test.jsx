// SPDX-License-Identifier: MIT

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'

import ContainerDeckScreenshot from '.'
import userEvent from '@testing-library/user-event'

beforeEach(vi.restoreAllMocks)
afterEach(cleanup)

test.each([
  // See also ./CanvasScreenshot/utils.test.js
  [20, 0], // ヒストリカル
  [40, 0], // BO1 (最小)
  [40, 10], // BO3 (最小)
  [41, 0], // BO3
  [49, 1], // BO3
  [50, 0], // BO3
  [50, 10], // BO3 (最小)
  [56, 4], // 統領戦
  [59, 1], // BO3
  [60, 0], // BO3 (最大)
  [60, 15],
  [61, 0],
  [90, 0],
])(
  'ダウンロードボタン有効 (メイン%d枚、サイド%d枚)',
  async (numEntriesMain, numEntriesSide) => {
    const deckMain = new Map(
      [...Array(numEntriesMain)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )
    expect(deckMain.size).toEqual(numEntriesMain)
    const deckSide = new Map(
      [...Array(numEntriesSide)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )
    expect(deckSide.size).toEqual(numEntriesSide)

    const { getByRole } = render(
      <ContainerDeckScreenshot deckMain={deckMain} deckSide={deckSide} />,
    )

    const buttonDownload = getByRole('button', {
      text: 'レシピ画像をダウンロードβ',
    })
    expect(buttonDownload).toBeEnabled()

    // ここからダウンロードボタンをクリックするテスト
    const documentCreateElement = document.createElement
    const clickAnchor = vi.fn()
    const spyCreateElement = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag) => {
        if (tag === 'a') {
          const a = documentCreateElement.call(document, tag)
          // To avoid "Not implemented: navigation to another Document"
          a.click = clickAnchor
          return a
        } else {
          // document.createElement(tag) can be called with tag != 'a'
          // by Konva
          return documentCreateElement.call(document, tag)
        }
      })
    const spyAppendChild = vi.spyOn(document.body, 'appendChild')
    const spyRemoveChild = vi.spyOn(document.body, 'removeChild')

    await userEvent.click(buttonDownload)

    expect(spyCreateElement).toHaveBeenCalledWith('a')
    expect(spyAppendChild).toHaveBeenCalledTimes(1)
    expect(clickAnchor).toHaveBeenCalledTimes(1)
    expect(spyRemoveChild).toHaveBeenCalledTimes(1)

    expect(spyAppendChild.mock.lastCall).toHaveLength(1)
    const anchor = spyAppendChild.mock.lastCall[0]
    expect(anchor).toHaveProperty('download')
    expect(anchor.download).toMatch(
      /^ijinden-deck-builder-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}.png$/,
    )
    expect(anchor).toHaveProperty('href')
    expect(anchor.href).toMatch(/^data:image\/png;base64,/)
  },
)

test.each([
  // See also ./CanvasScreenshot/utils.test.js
  [60, 16],
  [61, 1],
  [91, 0],
])(
  'ダウンロードボタン無効 (メイン%d枚、サイド%d枚)',
  (numEntriesMain, numEntriesSide) => {
    const deckMain = new Map(
      [...Array(numEntriesMain)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )
    const deckSide = new Map(
      [...Array(numEntriesSide)].map((_, i) => [`2nd1-${i + 1}`, 1]),
    )

    const { getByRole } = render(
      <ContainerDeckScreenshot deckMain={deckMain} deckSide={deckSide} />,
    )

    const buttonDownload = getByRole('button', {
      text: 'レシピ画像をダウンロード',
    })
    expect(buttonDownload).not.toBeEnabled()
  },
)
