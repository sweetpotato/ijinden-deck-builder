// SPDX-License-Identifier: MIT

import { act } from 'react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { cleanup, render, renderHook, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useTabPaneSimulator from '.'

function getAllItems(getByRole, section) {
  return within(getByRole('list', { name: section })).getAllByRole('listitem')
}

function getItemImg(item) {
  return within(item).getByRole('img')
}

function getItemButton(item) {
  return within(item).getByRole('button')
}

function getAllButtons(getByRole, section) {
  return within(getByRole('list', { name: section })).getAllByRole('button')
}

function getInterruptFn(result) {
  return result.current[0]
}

function getRenderFn(result) {
  return result.current[1]
}

function defaultRender(deck) {
  const { result } = renderHook(() => useTabPaneSimulator())
  const { rerender, getByRole, queryByRole, getByText, queryByText } = render(
    <>{getRenderFn(result)(deck)}</>
  )
  const defaultRerender = (deck) => rerender(<>{getRenderFn(result)(deck)}</>)
  return {
    result,
    defaultRerender,
    getByRole,
    queryByRole,
    getByText,
    queryByText,
  }
}

afterEach(cleanup)

test('デッキ9枚でスタート、リセット', async () => {
  const deck = new Map([['R-1', 9]])
  const { defaultRerender, getByRole, queryByRole } = defaultRender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()

  // スタートボタンを押す
  await userEvent.click(getByRole('button', { name: 'スタート' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
  expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  // prettier-ignore
  expect(getByRole('alert')).toHaveTextContent('メインデッキの枚数が少なすぎます。10枚以上にしてください。')

  // リセットボタンを押す
  await userEvent.click(getByRole('button', { name: 'リセット' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()
})

test('デッキ10枚でスタート、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { defaultRerender, getByRole, queryByRole } = defaultRender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()

  // スタートボタンを押す
  await userEvent.click(getByRole('button', { name: 'スタート' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
  expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeEnabled()
  expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
  expect(getByRole('region', { name: '手札' })).toBeVisible()
  expect(queryByRole('alert')).toBeNull()

  // ガーディアン4枚で不可視
  expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
  const guardians = getAllItems(getByRole, 'ガーディアン')
  expect(guardians.length).toBe(4)
  expect(getItemImg(guardians[0])).toBeVisible()
  expect(getItemImg(guardians[1])).toBeVisible()
  expect(getItemImg(guardians[2])).toBeVisible()
  expect(getItemImg(guardians[3])).toBeVisible()
  expect(getItemButton(guardians[0])).toHaveClass('btn-toggled-opaque')
  expect(getItemButton(guardians[1])).toHaveClass('btn-toggled-opaque')
  expect(getItemButton(guardians[2])).toHaveClass('btn-toggled-opaque')
  expect(getItemButton(guardians[3])).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(getByRole('region', { name: '手札' })).toBeVisible()
  const hand = getAllItems(getByRole, '手札')
  expect(hand.length).toBe(6)
  expect(getItemImg(hand[0])).toBeVisible()
  expect(getItemImg(hand[1])).toBeVisible()
  expect(getItemImg(hand[2])).toBeVisible()
  expect(getItemImg(hand[3])).toBeVisible()
  expect(getItemImg(hand[4])).toBeVisible()
  expect(getItemImg(hand[5])).toBeVisible()
  expect(getItemButton(hand[0])).toHaveClass('btn-toggled-transparent')
  expect(getItemButton(hand[1])).toHaveClass('btn-toggled-transparent')
  expect(getItemButton(hand[2])).toHaveClass('btn-toggled-transparent')
  expect(getItemButton(hand[3])).toHaveClass('btn-toggled-transparent')
  expect(getItemButton(hand[4])).toHaveClass('btn-toggled-transparent')
  expect(getItemButton(hand[5])).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(getByRole('button', { name: 'リセット' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()
})

describe('デッキ10枚でスタート', () => {
  let deck, result, defaultRerender, getByRole, queryByRole
  let guardians, hand
  beforeEach(async () => {
    deck = new Map([['R-1', 10]])
    ;({ result, defaultRerender, getByRole, queryByRole } = defaultRender(deck))

    expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
    expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
    expect(queryByRole('region', { name: '手札' })).toBeNull()
    expect(queryByRole('alert')).toBeNull()

    // スタートボタンを押す
    await userEvent.click(getByRole('button', { name: 'スタート' }))
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeEnabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('マリガン', async () => {
    // マリガンボタンを押す
    await userEvent.click(getByRole('button', { name: 'マリガン' }))
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('マリガン、手札をタップ', async () => {
    // マリガンボタンを押す
    await userEvent.click(getByRole('button', { name: 'マリガン' }))
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('手札をタップ', async () => {
    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('ガーディアンをタップ', async () => {
    // ガーディアンのカードをタップする
    await userEvent.click(guardians[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-transparent') // 色味が変わった
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('手札をタップ、手札をタップ', async () => {
    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-blue') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('手札をタップ、ガーディアンをタップ', async () => {
    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // ガーディアンのカードをタップする
    await userEvent.click(guardians[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-transparent') // 色味が変わった
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('ガーディアンをタップ、ガーディアンをタップ', async () => {
    // ガーディアンのカードをタップする
    await userEvent.click(guardians[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-transparent') // 色味が変わった
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // ガーディアンのカードをタップする
    await userEvent.click(guardians[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')
  })

  test('デッキを9枚に変更、10枚目をタップ', async () => {
    // デッキを9枚に変更する
    deck = new Map([['R-1', 9]])
    await act(() => getInterruptFn(result)())
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // デッキを編集してもシミュレータのデッキは変わらない
    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // 手札の6枚目をタップしても例外は発生しない
    await userEvent.click(hand[5])

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-red') // 色味が変わった
  })

  test('マリガン、デッキを9枚に変更、10枚目をタップ', async () => {
    // マリガンボタンを押す
    await userEvent.click(getByRole('button', { name: 'マリガン' }))
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // デッキを9枚に変更する
    deck = new Map([['R-1', 9]])
    await act(() => getInterruptFn(result)())
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // デッキを編集してもシミュレータのデッキは変わらない
    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // 手札の6枚目をタップしても例外は発生しない
    await userEvent.click(hand[5])

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-transparent')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-red') // 色味が変わった
  })

  test('手札をタップ、デッキを9枚に変更、10枚目をタップ', async () => {
    // 手札のカードをタップする
    await userEvent.click(hand[0])
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    expect(queryByRole('alert')).toBeNull()

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red') // 色味が変わった
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // デッキを9枚に変更する
    deck = new Map([['R-1', 9]])
    await act(() => getInterruptFn(result)())
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // デッキを編集してもシミュレータのデッキは変わらない
    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-transparent')

    // 手札の6枚目をタップしても例外は発生しない
    await userEvent.click(hand[5])

    expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
    expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
    expect(getByRole('region', { name: '手札' })).toBeVisible()
    // prettier-ignore
    expect(getByRole('alert')).toHaveTextContent('シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。')

    // ガーディアン4枚で不可視
    guardians = getAllButtons(getByRole, 'ガーディアン')
    expect(guardians.length).toBe(4)
    expect(guardians[0]).toHaveClass('btn-toggled-opaque')
    expect(guardians[1]).toHaveClass('btn-toggled-opaque')
    expect(guardians[2]).toHaveClass('btn-toggled-opaque')
    expect(guardians[3]).toHaveClass('btn-toggled-opaque')
    // 手札6枚で可視
    hand = getAllButtons(getByRole, '手札')
    expect(hand.length).toBe(6)
    expect(hand[0]).toHaveClass('btn-toggled-red')
    expect(hand[1]).toHaveClass('btn-toggled-transparent')
    expect(hand[2]).toHaveClass('btn-toggled-transparent')
    expect(hand[3]).toHaveClass('btn-toggled-transparent')
    expect(hand[4]).toHaveClass('btn-toggled-transparent')
    expect(hand[5]).toHaveClass('btn-toggled-red') // 色味が変わった
  })

  afterEach(async () => {
    // リセットボタンを押す
    await userEvent.click(getByRole('button', { name: 'リセット' }))
    defaultRerender(deck)

    expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
    expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
    expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
    expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
    expect(queryByRole('region', { name: '手札' })).toBeNull()
    expect(queryByRole('alert')).toBeNull()
  })
})

test('デッキ40枚でスタート、山札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 40]])
  const { defaultRerender, getByRole, queryByRole } = defaultRender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()

  // スタートボタンを押す
  await userEvent.click(getByRole('button', { name: 'スタート' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
  expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeEnabled()
  expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
  expect(getByRole('region', { name: '手札' })).toBeVisible()
  expect(queryByRole('alert')).toBeNull()

  // ガーディアン4枚で不可視
  let guardians = getAllButtons(getByRole, 'ガーディアン')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 初期手札6枚で可視
  let hand = getAllButtons(getByRole, '手札')
  expect(hand.length).toBe(36)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')
  expect(hand[6]).toHaveClass('btn-toggled-opaque')
  expect(hand[7]).toHaveClass('btn-toggled-opaque')
  expect(hand[8]).toHaveClass('btn-toggled-opaque')
  expect(hand[9]).toHaveClass('btn-toggled-opaque')
  expect(hand[10]).toHaveClass('btn-toggled-opaque')
  expect(hand[11]).toHaveClass('btn-toggled-opaque')
  expect(hand[12]).toHaveClass('btn-toggled-opaque')
  expect(hand[13]).toHaveClass('btn-toggled-opaque')
  expect(hand[14]).toHaveClass('btn-toggled-opaque')
  expect(hand[15]).toHaveClass('btn-toggled-opaque')
  expect(hand[16]).toHaveClass('btn-toggled-opaque')
  expect(hand[17]).toHaveClass('btn-toggled-opaque')
  expect(hand[18]).toHaveClass('btn-toggled-opaque')
  expect(hand[19]).toHaveClass('btn-toggled-opaque')
  expect(hand[20]).toHaveClass('btn-toggled-opaque')
  expect(hand[21]).toHaveClass('btn-toggled-opaque')
  expect(hand[22]).toHaveClass('btn-toggled-opaque')
  expect(hand[23]).toHaveClass('btn-toggled-opaque')
  expect(hand[24]).toHaveClass('btn-toggled-opaque')
  expect(hand[25]).toHaveClass('btn-toggled-opaque')
  expect(hand[26]).toHaveClass('btn-toggled-opaque')
  expect(hand[27]).toHaveClass('btn-toggled-opaque')
  expect(hand[28]).toHaveClass('btn-toggled-opaque')
  expect(hand[29]).toHaveClass('btn-toggled-opaque')
  expect(hand[30]).toHaveClass('btn-toggled-opaque')
  expect(hand[31]).toHaveClass('btn-toggled-opaque')
  expect(hand[32]).toHaveClass('btn-toggled-opaque')
  expect(hand[33]).toHaveClass('btn-toggled-opaque')
  expect(hand[34]).toHaveClass('btn-toggled-opaque')
  expect(hand[35]).toHaveClass('btn-toggled-opaque')

  // 山札のカードをタップする
  await userEvent.click(hand[6])
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeEnabled()
  expect(getByRole('button', { name: 'スタート' })).toBeDisabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(getByRole('region', { name: 'ガーディアン' })).toBeVisible()
  expect(getByRole('region', { name: '手札' })).toBeVisible()
  expect(queryByRole('alert')).toBeNull()

  // ガーディアン4枚で不可視
  guardians = getAllButtons(getByRole, 'ガーディアン')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  hand = getAllButtons(getByRole, '手札')
  expect(hand.length).toBe(36)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')
  expect(hand[6]).toHaveClass('btn-toggled-transparent') // 色味が変わった
  expect(hand[7]).toHaveClass('btn-toggled-opaque')
  expect(hand[8]).toHaveClass('btn-toggled-opaque')
  expect(hand[9]).toHaveClass('btn-toggled-opaque')
  expect(hand[10]).toHaveClass('btn-toggled-opaque')
  expect(hand[11]).toHaveClass('btn-toggled-opaque')
  expect(hand[12]).toHaveClass('btn-toggled-opaque')
  expect(hand[13]).toHaveClass('btn-toggled-opaque')
  expect(hand[14]).toHaveClass('btn-toggled-opaque')
  expect(hand[15]).toHaveClass('btn-toggled-opaque')
  expect(hand[16]).toHaveClass('btn-toggled-opaque')
  expect(hand[17]).toHaveClass('btn-toggled-opaque')
  expect(hand[18]).toHaveClass('btn-toggled-opaque')
  expect(hand[19]).toHaveClass('btn-toggled-opaque')
  expect(hand[20]).toHaveClass('btn-toggled-opaque')
  expect(hand[21]).toHaveClass('btn-toggled-opaque')
  expect(hand[22]).toHaveClass('btn-toggled-opaque')
  expect(hand[23]).toHaveClass('btn-toggled-opaque')
  expect(hand[24]).toHaveClass('btn-toggled-opaque')
  expect(hand[25]).toHaveClass('btn-toggled-opaque')
  expect(hand[26]).toHaveClass('btn-toggled-opaque')
  expect(hand[27]).toHaveClass('btn-toggled-opaque')
  expect(hand[28]).toHaveClass('btn-toggled-opaque')
  expect(hand[29]).toHaveClass('btn-toggled-opaque')
  expect(hand[30]).toHaveClass('btn-toggled-opaque')
  expect(hand[31]).toHaveClass('btn-toggled-opaque')
  expect(hand[32]).toHaveClass('btn-toggled-opaque')
  expect(hand[33]).toHaveClass('btn-toggled-opaque')
  expect(hand[34]).toHaveClass('btn-toggled-opaque')
  expect(hand[35]).toHaveClass('btn-toggled-opaque')

  // リセットボタンを押す
  await userEvent.click(getByRole('button', { name: 'リセット' }))
  defaultRerender(deck)

  expect(getByRole('button', { name: 'リセット' })).toBeDisabled()
  expect(getByRole('button', { name: 'スタート' })).toBeEnabled()
  expect(getByRole('button', { name: 'マリガン' })).toBeDisabled()
  expect(queryByRole('region', { name: 'ガーディアン' })).toBeNull()
  expect(queryByRole('region', { name: '手札' })).toBeNull()
  expect(queryByRole('alert')).toBeNull()
})
