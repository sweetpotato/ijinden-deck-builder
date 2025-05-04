import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'

import useTabPaneSimulator from '.'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

test('デッキ9枚でのレンダリングでスタート、リセット', async () => {
  const { result } = renderHook(() => useTabPaneSimulator())
  const deck = new Map([['R-1', 9]])
  const { rerender, getByRole, getByText, queryByText } = render(
    <>{result.current.render(deck)}</>
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

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  rerender(<>{result.current.render(deck)}</>)

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

  // リセットボタンを押す
  await userEvent.click(buttonReset)

  rerender(<>{result.current.render(deck)}</>)

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
})

test('デッキ10枚でのレンダリングでスタート、リセット', async () => {
  const { result } = renderHook(() => useTabPaneSimulator())
  const deck = new Map([['R-1', 10]])
  const { container, rerender, getByRole, getByText, queryByText } = render(
    <>{result.current.render(deck)}</>
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

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  rerender(<>{result.current.render(deck)}</>)

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

  rerender(<>{result.current.render(deck)}</>)

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
})

test('デッキ10枚でのレンダリングでスタート、マリガン、リセット', async () => {
  const { result } = renderHook(() => useTabPaneSimulator())
  const deck = new Map([['R-1', 10]])
  const { container, rerender, getByRole, getByText, queryByText } = render(
    <>{result.current.render(deck)}</>
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

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  rerender(<>{result.current.render(deck)}</>)

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

  rerender(<>{result.current.render(deck)}</>)

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

  rerender(<>{result.current.render(deck)}</>)

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
})

test('デッキ10枚でのレンダリングでスタート、カードをタップ、リセット', async () => {
  const { result } = renderHook(() => useTabPaneSimulator())
  const deck = new Map([['R-1', 10]])
  const { container, rerender, getByRole, getByText, queryByText } = render(
    <>{result.current.render(deck)}</>
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

  // スタートボタンを押す
  await userEvent.click(buttonStart)

  rerender(<>{result.current.render(deck)}</>)

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

  rerender(<>{result.current.render(deck)}</>)

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

  rerender(<>{result.current.render(deck)}</>)

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
})
