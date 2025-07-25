import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import ContainerDeckValidator from '.'

function defaultRender(deckMain, deckSide) {
  const { getByRole } = render(
    <ContainerDeckValidator deckMain={deckMain} deckSide={deckSide} />
  )
  return { getByRole }
}

afterEach(cleanup)

test('空のデッキ', () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メイン39枚', () => {
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
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メイン40枚', () => {
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
    ['R-10', 4],
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン41枚', () => {
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
    ['R-10', 4],
    ['B-1', 1],
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン60枚', () => {
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
    ['R-10', 4],
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 4],
    ['B-4', 4],
    ['B-5', 4],
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン61枚', () => {
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
    ['R-10', 4],
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 4],
    ['B-4', 4],
    ['B-5', 4],
    ['B-6', 1],
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン39枚サイド1枚', () => {
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
  ])
  const deckSide = new Map([['B-1', 1]])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メイン40枚サイド1枚', () => {
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
    ['R-10', 4],
  ])
  const deckSide = new Map([['B-1', 1]])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン40枚サイド10枚', () => {
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
    ['R-10', 4],
  ])
  const deckSide = new Map([
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 2],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン40枚サイド11枚', () => {
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
    ['R-10', 4],
  ])
  const deckSide = new Map([
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 3],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メイン50枚サイド10枚', () => {
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
    ['R-10', 4],
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 2],
  ])
  const deckSide = new Map([
    ['B-4', 4],
    ['B-5', 4],
    ['B-6', 2],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メイン51枚サイド10枚', () => {
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
    ['R-10', 4],
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 3],
  ])
  const deckSide = new Map([
    ['B-4', 4],
    ['B-5', 4],
    ['B-6', 2],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メイン60枚サイド1枚', () => {
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
    ['R-10', 4],
    ['B-1', 4],
    ['B-2', 4],
    ['B-3', 4],
    ['B-4', 4],
    ['B-5', 4],
  ])
  const deckSide = new Map([['B-6', 1]])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('メインサイドあわせて4枚以下', () => {
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
    ['R-10', 2],
    ['R-11', 2],
  ])
  const deckSide = new Map([
    ['R-10', 2],
    ['R-11', 2],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('メインサイドあわせて4枚超過', () => {
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
    ['R-10', 2],
    ['R-11', 2],
  ])
  const deckSide = new Map([
    ['R-10', 2],
    ['R-11', 3],
  ])
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('絵違い土方歳三あわせて4枚以下', () => {
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
    ['3-9', 2], // 土方歳三
    ['3-81', 2], // 土方歳三 (PSR)
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('絵違い土方歳三あわせて4枚超過', () => {
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
    ['3-9', 2], // 土方歳三
    ['3-81', 3], // 土方歳三 (PSR)
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test('絵違いカール大帝あわせて4枚以下', () => {
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
    ['4-10', 2], // カール大帝
    ['4-81', 2], // カール大帝 (PSR)
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('絵違いカール大帝あわせて4枚超過', () => {
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
    ['4-10', 2], // カール大帝
    ['4-81', 3], // カール大帝 (PSR)
  ])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('❌')
})

test.each([
  ['レッドストーン', 'R-13'],
  ['ブルーストーン', 'B-13'],
  ['グリーンストーン', 'G-13'],
  ['イエローストーン', 'Y-13'],
  ['パープルストーン', 'P-16'],
])('ストーン40枚 (%s)', (_, id) => {
  const deckMain = new Map([[id, 40]])
  const deckSide = new Map()
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('✅')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('封印なしでメインにメディチ・リユニオン4枚ずつ', () => {
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
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('封印なしでメイン・サイド合計でメディチ・リユニオン4枚ずつ', () => {
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
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('❌')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})

test('推奨レギュレーションでメディチ・リユニオン2枚ずつ', () => {
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
  const { getByRole } = defaultRender(deckMain, deckSide)
  expect(getByRole('status', { name: 'いわゆる002' })).toHaveTextContent('❌')
  // prettier-ignore
  expect(getByRole('status', { name: '推奨レギュレーション' })).toHaveTextContent('✅')
  expect(getByRole('status', { name: '封印なし' })).toHaveTextContent('✅')
})
