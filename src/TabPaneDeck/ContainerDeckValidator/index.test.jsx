import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import ContainerDeckValidator from '.'

function defaultRender(deckMain, deckSide) {
  const props = render(
    <ContainerDeckValidator deckMain={deckMain} deckSide={deckSide} />,
  )
  const getStatusWithName = (name) => props.getByRole('status', { name })
  return {
    ...props,
    getStatusWithName,
  }
}

afterEach(cleanup)

test.each([
  ['空のデッキ', [], []],
  [
    'メイン39枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 3],
    ],
    [],
  ],
  [
    'メイン39枚サイド1枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 3],
    ],
    [['B-1', 1]],
  ],
  [
    'メイン40枚サイド11枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
    ],
    [
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 3],
    ],
  ],
  [
    'メイン51枚サイド10枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 3],
    ],
    [
      ['B-4', 4],
      ['B-5', 4],
      ['B-6', 2],
    ],
  ],
  [
    'メイン60枚サイド1枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 4],
      ['B-4', 4],
      ['B-5', 4],
    ],
    [['B-6', 1]],
  ],
  [
    'メインサイドあわせて4枚超過',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 2],
      ['R-11', 2],
    ],
    [
      ['R-10', 2],
      ['R-11', 3], // 超過
    ],
  ],
  [
    '色違いヒエロスガモスメインサイドあわせて4枚超過',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['2nd2-60', 4], // 赤緑
    ],
    [
      ['2nd2-61', 1], // 赤黄
    ],
  ],
])('デッキ枚数でNG (%s)', (_, entriesMain, entriesSide) => {
  const deckMain = new Map(entriesMain)
  const deckSide = new Map(entriesSide)
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('❌')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('❌')
  expect(getStatusWithName('封印なし')).toHaveTextContent('❌')
})

test.each([
  ['土方歳三 (SR/PSR)', '3-9', '3-81'],
  ['カール大帝 (SR/PSR)', '4-10', '4-81'],
  ['武田信玄 (SR/PSR)', '2nd1-1', '2nd1-110'],
  ['ヴィクトリア女王 (SR/PSR)', '2nd1-2', '2nd1-111'],
  ['ロイヤリティ (新旧)', 'R-11', '2nd1-78'],
  ['地上の紫微垣 (新旧)', 'Y-10', '2nd1-72'],
  ['レッドオーブ (新旧)', '1-61', '2nd1-96'],
  ['ブルーオーブ (新旧)', '1-65', '2nd1-97'],
  ['グリーンオーブ (新旧)', '1-69', '2nd1-98'],
  ['イエローオーブ (新旧)', '2-74', '2nd1-99'],
  ['パープルオーブ (新旧)', 'P-15', '2nd1-100'],
  ['玄奘 (SR/PSR)', '2nd2-4', '2nd2-74'],
  ['ジャンヌ・ダルク (新旧)', '1-22', '2nd2-7'],
  ['安倍晴明 (SR/PSR)', '2nd2-10', '2nd2-75'],
  ['ヒエロスガモス (色違い)', '2nd2-60', '2nd2-61'],
])('同じ名前で異なるIDのカードが4枚超過でNG (%s)', (_, id1, id2) => {
  const deckMain = new Map([
    ['R-1', 4],
    ['R-2', 4],
    ['R-3', 4],
    ['R-4', 4],
    ['R-5', 4],
    ['R-6', 4],
    ['R-7', 4],
    ['R-8', 4],
    ['R-9', 3], // 合計で40枚になるように調整
    [id1, 2],
    [id2, 3],
  ])
  const deckSide = new Map([])
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('❌')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('❌')
  expect(getStatusWithName('封印なし')).toHaveTextContent('❌')
})

test.each([
  [
    'メイン40枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
    ],
    [],
  ],
  [
    'メイン41枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 1],
    ],
    [],
  ],
  [
    'メイン60枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 4],
      ['B-4', 4],
      ['B-5', 4],
    ],
    [],
  ],
  [
    'メイン61枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 4],
      ['B-4', 4],
      ['B-5', 4],
      ['B-6', 1],
    ],
    [],
  ],
  [
    'メイン40枚サイド1枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
    ],
    [['B-1', 1]],
  ],
  [
    'メイン40枚サイド10枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
    ],
    [
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 2],
    ],
  ],
  [
    'メイン50枚サイド10枚',
    [
      ['R-1', 4],
      ['R-2', 4],
      ['R-3', 4],
      ['R-4', 4],
      ['R-5', 4],
      ['R-6', 4],
      ['R-7', 4],
      ['R-8', 4],
      ['R-9', 4],
      ['R-10', 4],
      ['B-1', 4],
      ['B-2', 4],
      ['B-3', 2],
    ],
    [
      ['B-4', 4],
      ['B-5', 4],
      ['B-6', 2],
    ],
  ],
  ['スターターのレッドストーン40枚', [['R-13', 40]], []],
  ['スターターのブルーストーン40枚', [['B-13', 40]], []],
  ['スターターのグリーンストーン40枚', [['G-13', 40]], []],
  ['スターターのイエローストーン40枚', [['Y-13', 40]], []],
  ['スターターのパープルストーン40枚', [['P-16', 40]], []],
  ['第5弾のレッドストーン40枚', [['2nd1-91', 40]], []],
  ['第5弾のブルーストーン40枚', [['2nd1-92', 40]], []],
  ['第5弾のグリーンストーン40枚', [['2nd1-93', 40]], []],
  ['第5弾のイエローストーン40枚', [['2nd1-94', 40]], []],
  ['第5弾のパープルストーン40枚', [['2nd1-95', 40]], []],
])('すべてのレギュレーションでOK (%s)', (_, entriesMain, entriesSide) => {
  const deckMain = new Map(entriesMain)
  const deckSide = new Map(entriesSide)
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('✅')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('✅')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('✅')
  expect(getStatusWithName('封印なし')).toHaveTextContent('✅')
})

test('封印なしのみOK (メインにメディチ・リユニオン4枚ずつ)', () => {
  const deckMain = new Map([
    ['R-1', 4],
    ['R-2', 4],
    ['R-3', 4],
    ['R-4', 4],
    ['R-5', 4],
    ['R-6', 4],
    ['R-7', 4],
    ['R-8', 4],
    ['4-36', 4], // メディチ
    ['4-59', 4], // リユニオン
  ])
  const deckSide = new Map()
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('❌')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('❌')
  expect(getStatusWithName('封印なし')).toHaveTextContent('✅')
})

test('封印なしのみOK (メイン・サイド合計でメディチ・リユニオン4枚ずつ)', () => {
  const deckMain = new Map([
    ['R-1', 4],
    ['R-2', 4],
    ['R-3', 4],
    ['R-4', 4],
    ['R-5', 4],
    ['R-6', 4],
    ['R-7', 4],
    ['R-8', 4],
    ['R-9', 4],
    ['4-36', 2], // メディチ
    ['4-59', 2], // リユニオン
  ])
  const deckSide = new Map([
    ['4-36', 2], // メディチ
    ['4-59', 2], // リユニオン
  ])
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('❌')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('❌')
  expect(getStatusWithName('封印なし')).toHaveTextContent('✅')
})

test('推奨レギュレーション以下でのみOK (メディチ・リユニオン2枚ずつ)', () => {
  const deckMain = new Map([
    ['R-1', 4],
    ['R-2', 4],
    ['R-3', 4],
    ['R-4', 4],
    ['R-5', 4],
    ['R-6', 4],
    ['R-7', 4],
    ['R-8', 4],
    ['R-9', 4],
    ['4-36', 2], // メディチ
    ['4-59', 2], // リユニオン
  ])
  const deckSide = new Map()
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('❌')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('✅')
  expect(getStatusWithName('封印なし')).toHaveTextContent('✅')
})

test('002以下でOK (千利休入り)', () => {
  const deckMain = new Map([
    ['R-1', 4],
    ['R-2', 4],
    ['R-3', 4],
    ['R-4', 4],
    ['R-5', 4],
    ['R-6', 4],
    ['R-7', 4],
    ['R-8', 4],
    ['R-9', 4],
    ['R-10', 3],
    ['1-33', 1], // 千利休
  ])
  const deckSide = new Map()
  const { getStatusWithName } = defaultRender(deckMain, deckSide)

  expect(getStatusWithName('最強ダイバー決定戦2026')).toHaveTextContent('❌')
  expect(getStatusWithName('いわゆる002')).toHaveTextContent('✅')
  expect(getStatusWithName('推奨レギュレーション')).toHaveTextContent('✅')
  expect(getStatusWithName('封印なし')).toHaveTextContent('✅')
})

test('メインデッキの平均レベル', () => {
  const deckMain = new Map([
    ['R-1', 2], // 上杉謙信 (レベル6)
    ['R-2', 2], // 源義経 (レベル1)
    ['R-3', 2], // 武田勝頼 (レベル2)
    ['R-4', 2], // ヴラド・ツェペシュ (レベル3)
    ['R-5', 2], // 坂上田村麻呂 (レベル4)
    ['R-6', 2], // 楠木正成 (レベル5)
    ['R-7', 2], // ジェームズ・バトラー・ヒコック (レベル5)
    ['R-8', 2], // アレクサンドロス大王 (レベル6)
    ['R-9', 2], // 神剣眠る氏社 (レベル2)
    ['R-10', 2], // 連なる天守閣 (レベル3)
    ['R-11', 2], // ロイヤリティ (レベル3)
    ['R-12', 2], // デスペラード (レベル3)
    ['R-13', 16], // レッドストーン (レベル1)
  ])
  const deckSide = new Map([
    ['1-7', 2], // 内容は適当、以下同様
    ['1-8', 2],
    ['1-9', 2],
    ['1-10', 2],
    ['1-11', 2],
  ])
  const { getStatusWithName } = defaultRender(deckMain, deckSide)
  expect(getStatusWithName('メインデッキの平均レベル')).toHaveTextContent(
    '2.55',
  )
})
