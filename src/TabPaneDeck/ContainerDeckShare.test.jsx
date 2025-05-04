// SPDX-License-Identifier: MIT

import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import ContainerDeckShare from './ContainerDeckShare'
import userEvent from '@testing-library/user-event'

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  })
})

afterEach(cleanup)

test('デッキ0枚', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue('/ijinden-deck-builder/#/deck/BAA')

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/BAA'
  )
})

test('デッキ4枚', async () => {
  const deckMain = new Map([['R-1', 4]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue('/ijinden-deck-builder/#/deck/BBwAA')

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/BBwAA'
  )
})

test('デッキ5枚', async () => {
  const deckMain = new Map([['R-1', 5]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue('/ijinden-deck-builder/#/deck/CBAEAAA')

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/CBAEAAA'
  )
})

test('デッキ64枚', async () => {
  const deckMain = new Map([['R-1', 64]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue('/ijinden-deck-builder/#/deck/CBA_AAA')

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/CBA_AAA'
  )
})

test('デッキ65枚', async () => {
  const deckMain = new Map([['R-1', 65]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  // 共有リンクをコピーボタンは無効
  expect(buttonShare).toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue('(共有できる条件を満たしていません)')
})

test('伝説の武将デッキ', async () => {
  const deckMain = new Map([
    ['R-1', 2],
    ['R-2', 2],
    ['R-3', 2],
    ['R-4', 2],
    ['R-5', 2],
    ['R-6', 2],
    ['R-7', 2],
    ['R-8', 2],
    ['R-9', 2],
    ['R-10', 2],
    ['R-11', 2],
    ['R-12', 2],
    ['R-13', 16],
  ])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue(
    '/ijinden-deck-builder/#/deck/CBABCABDABEABFABGABHABIABJABKABLABMABNAPAAA'
  )

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/CBABCABDABEABFABGABHABIABJABKABLABMABNAPAAA'
  )
})

test('イジンデンフェス優勝デッキ', async () => {
  const deckMain = new Map([
    ['1-21', 4], // 鑑真
    ['1-26', 4], // メアリー1世
    ['1-48', 4], // 円形闘技場
    ['1-55', 4], // ストーム
    ['1-65', 2], // ブルーオーブ
    ['2-2', 3], // ピョートル大帝
    ['2-17', 3], // ジャン＝ジャック・ルソー
    ['2-32', 4], // 曹操
    ['2-79', 4], // BYマーブルオーブ
    ['3-22', 4], // 高杉晋作
    ['3-72', 4], // 怖れの種
  ])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue(
    '/ijinden-deck-builder/#/deck/B8wBxXxexoRGiVikyTz6zs0AA'
  )

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/B8wBxXxexoRGiVikyTz6zs0AA'
  )
})

test('RSコロッセオ優勝デッキ', async () => {
  const deckMain = new Map([
    ['R-11', 4], // ロイヤリティ
    ['1-17', 2], // 藤原道長
    ['2-1', 2], // 天草四郎
    ['2-9', 4], // 石田三成
    ['2-59', 2], // サモン
    ['2-68', 2], // メロウ
    ['2-78', 1], // RYマーブルオーブ
    ['P-11', 4], // スピリットアウェイ
    ['P-15', 1], // パープルオーブ
    ['3-9', 1], // 土方歳三
    ['3-69', 2], // コーザリティ
    ['3-71', 4], // 喜びの種
    ['3-75', 4], // 悲しみの種
    ['4-68', 1], // 遁甲式水鏡
    ['4-72', 2], // ラ・コロール
    ['4-80', 4], // カルドロン
  ])
  const deckSide = new Map([
    ['1-17', 1], // 藤原道長
    ['2-78', 1], // RYマーブルオーブ
    ['3-47', 4], // 徳川慶喜
    ['3-74', 1], // 苦しみの種
    ['4-68', 1], // 遁甲式水鏡
    ['4-74', 2], // ディ・クローネ
  ])
  const { getByRole } = render(
    <ContainerDeckShare deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonShare = getByRole('button')
  expect(buttonShare).toBeVisible()
  expect(buttonShare).not.toBeDisabled()
  const textbox = getByRole('textbox')
  expect(textbox).toBeVisible()
  expect(textbox).toHaveAttribute('readonly')
  expect(textbox).toHaveValue(
    '/ijinden-deck-builder/#/deck/BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V'
  )

  // 共有リンクをコピーボタンを押す
  await userEvent.click(buttonShare)

  expect(navigator.clipboard.writeText.mock.calls.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall.length).toBe(1)
  expect(navigator.clipboard.writeText.mock.lastCall[0]).toBe(
    '/ijinden-deck-builder/#/deck/BLw4QFSNy_SITSDfzjDtDpUr0v05F9VF2AA4ASDT0uE5F_V'
  )
})
