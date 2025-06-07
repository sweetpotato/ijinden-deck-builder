// SPDX-License-Identifier: MIT

import 'fake-indexeddb/auto'

import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'

import { dbAddDeck, dbClearDecks } from '../commons/db'
import TabPaneLoad from '.'

function defaultRender(activeDeckSaved) {
  const setDeckTitle = vi.fn()
  const dispatchSetFromEntries = vi.fn()
  const moveToDeck = vi.fn()
  const expandAccordion = vi.fn()
  const interruptSimulator = vi.fn()

  const { rerender, getByRole, queryByRole } = render(
    <TabPaneLoad
      setDeckTitle={setDeckTitle}
      activeDeckSaved={activeDeckSaved}
      dispatchSetFromEntries={dispatchSetFromEntries}
      moveToDeck={moveToDeck}
      expandAccordion={expandAccordion}
      interruptSimulator={interruptSimulator}
    />
  )
  const defaultRerender = (activeDeckSaved) =>
    rerender(
      <TabPaneLoad
        setDeckTitle={setDeckTitle}
        activeDeckSaved={activeDeckSaved}
        dispatchSetFromEntries={dispatchSetFromEntries}
        moveToDeck={moveToDeck}
        expandAccordion={expandAccordion}
        interruptSimulator={interruptSimulator}
      />
    )
  return {
    setDeckTitle,
    dispatchSetFromEntries,
    moveToDeck,
    expandAccordion,
    interruptSimulator,
    defaultRerender,
    getByRole,
    queryByRole,
  }
}

beforeEach(dbClearDecks)

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole, queryByRole } = defaultRender(null)

  // 保存済みデッキはない
  expect(queryByRole('listitem')).toBeNull()

  // prettier-ignore
  expect(getByRole('button', { name: '保存済みレシピをすべて削除' })).toBeVisible()
})
