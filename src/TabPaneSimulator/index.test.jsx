// SPDX-License-Identifier: MIT

import { act } from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useTabPaneSimulator from '.'

afterEach(cleanup)

test('デッキ9枚でスタート、リセット', async () => {
  const deck = new Map([['R-1', 9]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    getByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeVisible()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  const groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  const guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  const groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  const hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、マリガン、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // マリガンボタンを押す
  await userEvent.click(buttonMulligan)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、マリガン、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // マリガンボタンを押す
  await userEvent.click(buttonMulligan)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // ガーディアンのカードをタップする
  await userEvent.click(guardians[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、手札をタップ、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-blue')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、手札をタップ、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // ガーディアンのカードをタップする
  await userEvent.click(guardians[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、ガーディアンをタップ、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // ガーディアンのカードをタップする
  await userEvent.click(guardians[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // ガーディアンのカードをタップする
  await userEvent.click(guardians[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-red')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、デッキを9枚に変更、10枚目をタップ、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const interruptSimulator = result.current[0]
  act(() => interruptSimulator())
  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札の6枚目をタップしても例外は発生しない
  await userEvent.click(hand[5])

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  // タップしたカードの色味が変わる
  expect(hand[5]).toHaveClass('btn-toggled-red')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、マリガン、デッキを9枚に変更、10枚目をタップ、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // マリガンボタンを押す
  await userEvent.click(buttonMulligan)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const interruptSimulator = result.current[0]
  act(() => interruptSimulator())
  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札の6枚目をタップしても例外は発生しない
  await userEvent.click(hand[5])

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  // タップしたカードの色味が変わる
  expect(hand[5]).toHaveClass('btn-toggled-red')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、手札をタップ、デッキを9枚に変更、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')

  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // 手札のカードをタップする
  await userEvent.click(hand[0])

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  // タップしたカードの色味が変わる
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const interruptSimulator = result.current[0]
  act(() => interruptSimulator())
  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-red')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ10枚でスタート、マリガン、デッキを9枚に変更、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // マリガンボタンを押す
  await userEvent.click(buttonMulligan)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const interruptSimulator = result.current[0]
  act(() => interruptSimulator())
  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    getByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeVisible()

  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})

test('デッキ40枚でスタート、山札をタップ、リセット', async () => {
  let deck = new Map([['R-1', 40]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{renderTabPaneSimulator(deck)}</>
  )

  let buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  let buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  let buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  expect(buttonMulligan).not.toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  let groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  let guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 初期手札6枚で可視
  let groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  let hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(36)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')
  // 山札30枚で不可視
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

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  expect(buttonReset).not.toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  // スタートボタンは無効
  expect(buttonStart).toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(getByText('ガーディアン')).toBeVisible()
  expect(getByText('手札')).toBeVisible()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()

  // ガーディアン4枚で不可視
  groupGuardians = getByRole('group', { name: 'ガーディアン' })
  expect(groupGuardians).toBeVisible()
  guardians = groupGuardians.querySelectorAll('button')
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  groupHand = getByRole('group', { name: '手札' })
  expect(groupHand).toBeVisible()
  hand = groupHand.querySelectorAll('button')
  expect(hand.length).toBe(36)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')
  // 山札30枚で不可視
  // タップしたカードの色味が変わる
  expect(hand[6]).toHaveClass('btn-toggled-transparent')
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
  await userEvent.click(buttonReset)

  renderTabPaneSimulator = result.current[1]
  rerender(<>{renderTabPaneSimulator(deck)}</>)

  buttonReset = getByRole('button', { name: 'リセット' })
  expect(buttonReset).toBeVisible()
  // リセットボタンは無効
  expect(buttonReset).toHaveAttribute('disabled')
  buttonStart = getByRole('button', { name: 'スタート' })
  expect(buttonStart).toBeVisible()
  expect(buttonStart).not.toHaveAttribute('disabled')
  buttonMulligan = getByRole('button', { name: 'マリガン' })
  expect(buttonMulligan).toBeVisible()
  // マリガンボタンは無効
  expect(buttonMulligan).toHaveAttribute('disabled')

  expect(queryByText('ガーディアン')).toBeNull()
  expect(queryByText('手札')).toBeNull()
  expect(
    queryByText('メインデッキの枚数が少なすぎます。10枚以上にしてください。')
  ).toBeNull()
  expect(
    queryByText(
      'シミュレーション中にメインデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。'
    )
  ).toBeNull()
})
