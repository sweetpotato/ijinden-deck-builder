// SPDX-License-Identifier: MIT

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import ContainerDeckExport from './ContainerDeckExport'

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
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue('メインデッキ\t0\n\nサイドデッキ\t0')
})

test('メインデッキ4枚', async () => {
  const deckMain = new Map([['R-1', 4]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t4\n上杉謙信\t4\n\nサイドデッキ\t0'
  )
})

test('サイドデッキ4枚', async () => {
  const deckMain = new Map()
  const deckSide = new Map([['R-1', 4]])
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t4\n上杉謙信\t4'
  )
})

test('メインデッキ5枚', async () => {
  const deckMain = new Map([['R-1', 5]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t5\n上杉謙信\t5\n\nサイドデッキ\t0'
  )
})

test('サイドデッキ5枚', async () => {
  const deckMain = new Map()
  const deckSide = new Map([['R-1', 5]])
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t5\n上杉謙信\t5'
  )
})

test('メインデッキ64枚', async () => {
  const deckMain = new Map([['R-1', 64]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t64\n上杉謙信\t64\n\nサイドデッキ\t0'
  )
})

test('サイドデッキ64枚', async () => {
  const deckMain = new Map()
  const deckSide = new Map([['R-1', 64]])
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t64\n上杉謙信\t64'
  )
})

test('メインデッキ65枚', async () => {
  const deckMain = new Map([['R-1', 65]])
  const deckSide = new Map()
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t65\n上杉謙信\t65\n\nサイドデッキ\t0'
  )
})

test('サイドデッキ65枚', async () => {
  const deckMain = new Map()
  const deckSide = new Map([['R-1', 65]])
  const { getByRole } = render(
    <ContainerDeckExport deckMain={deckMain} deckSide={deckSide} />
  )
  expect(navigator.clipboard.writeText.mock.calls.length).toBe(0)

  const buttonExport = getByRole('button')
  expect(buttonExport).toBeVisible()
  const textarea = getByRole('textbox')
  expect(textarea).toBeVisible()
  expect(textarea).toHaveValue(
    'メインデッキ\t0\n\nサイドデッキ\t65\n上杉謙信\t65'
  )
})
