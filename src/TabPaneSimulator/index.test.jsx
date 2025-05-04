import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'

import useTabPaneSimulator from '.'
import userEvent from '@testing-library/user-event'
import { act } from 'react'

afterEach(cleanup)

test('デッキ9枚でのレンダリングでスタート、リセット', async () => {
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

test('デッキ10枚でのレンダリングでスタート、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、マリガン、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、マリガン、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、手札をタップ、手札をタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、手札をタップ、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、ガーディアンをタップ、ガーディアンをタップ、リセット', async () => {
  const deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、デッキを9枚に変更、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、マリガン、デッキを9枚に変更、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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

test('デッキ10枚でのレンダリングでスタート、手札をタップ、デッキを9枚に変更、リセット', async () => {
  let deck = new Map([['R-1', 10]])
  const { result } = renderHook(() => useTabPaneSimulator())
  let renderTabPaneSimulator = result.current[1]
  const { container, rerender, getByRole, getByText, queryByText } = render(
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
