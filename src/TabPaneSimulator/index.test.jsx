import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook, screen } from '@testing-library/react'

import useTabPaneSimulator, { enumActionSimulator } from '.'
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  const guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  const hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-transparent')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  // タップしたカードの色味が変わる
  expect(guardians[0]).toHaveClass('btn-toggled-red')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const dispatchSimulator = result.current[0]
  act(() => dispatchSimulator(enumActionSimulator.INTERRUPT))
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(5)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(5) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(7)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(7) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
  expect(hand.length).toBe(6)
  expect(hand[0]).toHaveClass('btn-toggled-transparent')
  expect(hand[1]).toHaveClass('btn-toggled-transparent')
  expect(hand[2]).toHaveClass('btn-toggled-transparent')
  expect(hand[3]).toHaveClass('btn-toggled-transparent')
  expect(hand[4]).toHaveClass('btn-toggled-transparent')
  expect(hand[5]).toHaveClass('btn-toggled-transparent')

  // デッキを9枚に変更する
  deck = new Map([['R-1', 9]])
  const dispatchSimulator = result.current[0]
  act(() => dispatchSimulator(enumActionSimulator.INTERRUPT))
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(5)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(5) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(7)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(7) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  let guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  let hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(4)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(4) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(6)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(6) > div > button'
  )
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
  const dispatchSimulator = result.current[0]
  act(() => dispatchSimulator(enumActionSimulator.INTERRUPT))
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

  // TODO CSSのクラスで指定するのはイケてない。data-testid など他の方法を使うべき。
  // デッキを編集してもシミュレータのデッキは変わらない
  // ガーディアン4枚で不可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(5)')
  ).toBeVisible()
  guardians = container.querySelectorAll(
    '.container-card-line-up:nth-child(5) > div > button'
  )
  expect(guardians.length).toBe(4)
  expect(guardians[0]).toHaveClass('btn-toggled-opaque')
  expect(guardians[1]).toHaveClass('btn-toggled-opaque')
  expect(guardians[2]).toHaveClass('btn-toggled-opaque')
  expect(guardians[3]).toHaveClass('btn-toggled-opaque')
  // 手札6枚で可視
  expect(
    container.querySelector('.container-card-line-up:nth-child(7)')
  ).toBeVisible()
  hand = container.querySelectorAll(
    '.container-card-line-up:nth-child(7) > div > button'
  )
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
