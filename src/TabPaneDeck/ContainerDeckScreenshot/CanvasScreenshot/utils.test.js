// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup } from '@testing-library/react'

import { getCanvasSpec, isCanvasEnabled } from './utils'

afterEach(cleanup)

test.each([
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
  //
  // ↑ここまでは passed が必須
  // (コードを変えてもテストを変えないこと)
  //
  // ↓ここからは passed が任意
  // (コードを変えたらテストを変えてもいい)
  //
  [60, 15],
  [61, 0],
  [90, 0],
])(
  'キャンバス有効 (メイン%d枚、サイド%d枚)',
  (numEntriesMain, numEntriesSide) => {
    const spec = getCanvasSpec(numEntriesMain, numEntriesSide)
    expect(isCanvasEnabled(spec)).toBeTruthy()
  },
)

test.each([
  //
  // ↓ここからは passed が任意
  // (コードを変えたらテストを変えてもいい)
  //
  [60, 16],
  [61, 1],
  [91, 0],
])(
  'キャンバス無効 (メイン%d枚、サイド%d枚)',
  (numEntriesMain, numEntriesSide) => {
    const spec = getCanvasSpec(numEntriesMain, numEntriesSide)
    expect(isCanvasEnabled(spec)).toBeFalsy()
  },
)
