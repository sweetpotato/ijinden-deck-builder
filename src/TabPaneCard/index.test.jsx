// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TabPaneCard from '.'

afterEach(cleanup)

test('初期状態', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const handleSetDeckMain = vi.fn()
  const handleSetDeckSide = vi.fn()
  const handleSetIdZoom = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByPlaceholderText, getByRole, getByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(handleSetDeckMain.mock.calls.length).toBe(0)
  expect(handleSetDeckSide.mock.calls.length).toBe(0)
  expect(handleSetIdZoom.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  const textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toBeVisible()
  expect(textboxSearch).toHaveValue('')

  const checkboxIncludesTnL = getByRole('checkbox', {
    name: '特性と遺業能力も検索する',
  })
  expect(checkboxIncludesTnL).toBeVisible()
  expect(checkboxIncludesTnL).toBeChecked()

  const buttonFilterTop = getByRole('button', {
    name: '条件で絞り込む',
    expanded: false, // 初期状態では閉じている
  })
  expect(buttonFilterTop).toBeVisible()

  // TBD カードリストの初期状態のテスト

  // 条件で絞り込むボタンを押す
  await userEvent.click(buttonFilterTop)

  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  let buttonExpansion = getByRole('button', {
    name: '➕ エキスパンション ― すべて',
    expanded: false,
  })
  expect(buttonExpansion).toBeVisible()

  const buttonRarity = getByRole('button', {
    name: '➕ レアリティ ― すべて',
    expanded: false,
  })
  expect(buttonRarity).toBeVisible()

  const buttonColor = getByRole('button', {
    name: '➖ 色',
    expanded: true,
  })
  expect(buttonColor).toBeVisible()

  const spanColorAll = getByTestId('button-color-all')
  expect(spanColorAll).toBeVisible()
  const buttonColorAll = spanColorAll.querySelector('input[type="radio"]')
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked()
  const labelColorAll = spanColorAll.querySelector('label')
  expect(labelColorAll).toBeVisible()
  expect(labelColorAll.textContent).toBe('すべて')

  const buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  const buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  const buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  const buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  const buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  const buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  const buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  const buttonType = getByRole('button', {
    name: '➖ 種類',
    expanded: true,
  })
  expect(buttonType).toBeVisible()

  const spanTypeAll = getByTestId('button-color-all')
  expect(spanTypeAll).toBeVisible()
  const buttonTypeAll = spanTypeAll.querySelector('input[type="radio"]')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).toBeChecked()
  const labelTypeAll = spanTypeAll.querySelector('label')
  expect(labelTypeAll).toBeVisible()
  expect(labelTypeAll.textContent).toBe('すべて')

  const buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).not.toBeChecked()
  const buttonTypeHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonTypeHaikei).toBeVisible()
  expect(buttonTypeHaikei).not.toBeChecked()
  const buttonTypeMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonTypeMahou).toBeVisible()
  expect(buttonTypeMahou).not.toBeChecked()
  const buttonTypeMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonTypeMaryoku).toBeVisible()
  expect(buttonTypeMaryoku).not.toBeChecked()

  const buttonLevel = getByRole('button', {
    name: '➕ レベル ― 0以上',
    expanded: false,
  })
  expect(buttonLevel).toBeVisible()

  const buttonTrait = getByRole('button', {
    name: '➕ 特性 ― 指定なし',
    expanded: false,
  })
  expect(buttonTrait).toBeVisible()

  const buttonTerm = getByRole('button', {
    name: '➕ 能力語 ― 指定なし',
    expanded: false,
  })
  expect(buttonTerm).toBeVisible()

  const buttonLegacy = getByRole('button', {
    name: '➕ 遺業能力 ― 指定なし',
    expanded: false,
  })
  expect(buttonLegacy).toBeVisible()

  // エキスパンションを開く
  await userEvent.click(buttonExpansion)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  buttonExpansion = getByRole('button', {
    name: '➖ エキスパンション',
    expanded: true,
  })
  expect(buttonExpansion).toBeVisible()

  const spanExpansionAll = getByTestId('button-expansion-all')
  expect(spanExpansionAll).toBeVisible()
  const buttonExpansionAll = spanTypeAll.querySelector('input[type="radio"]')
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).toBeChecked()
  const labelExpansionAll = spanTypeAll.querySelector('label')
  expect(labelExpansionAll).toBeVisible()
  expect(labelExpansionAll.textContent).toBe('すべて')

  const buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  const buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  const buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  const buttonExpansionFirst = getByRole('radio', { name: '第１弾ブースター' })
  expect(buttonExpansionFirst).toBeVisible()
  expect(buttonExpansionFirst).not.toBeChecked()
  const buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  const buttonExpansionSecond = getByRole('radio', { name: '第２弾ブースター' })
  expect(buttonExpansionSecond).toBeVisible()
  expect(buttonExpansionSecond).not.toBeChecked()
  const buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()
  const buttonExpansionThird = getByRole('radio', { name: '第３弾ブースター' })
  expect(buttonExpansionThird).toBeVisible()
  expect(buttonExpansionThird).not.toBeChecked()
  const buttonExpansionFourth = getByRole('radio', { name: '第４弾ブースター' })
  expect(buttonExpansionFourth).toBeVisible()
  expect(buttonExpansionFourth).not.toBeChecked()

  // レアリティを開く
  await userEvent.click(buttonRarity)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const spanRarityAll = getByTestId('button-expansion-all')
  expect(spanRarityAll).toBeVisible()
  const buttonRarityAll = spanTypeAll.querySelector('input[type="radio"]')
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).toBeChecked()
  const labelRarityAll = spanTypeAll.querySelector('label')
  expect(labelRarityAll).toBeVisible()
  expect(labelRarityAll.textContent).toBe('すべて')

  const buttonRarityN = getByRole('radio', { name: 'Nのみ' })
  expect(buttonRarityN).toBeVisible()
  expect(buttonRarityN).not.toBeChecked()
  const buttonRarityNandR = getByRole('radio', { name: 'NとR' })
  expect(buttonRarityNandR).toBeVisible()
  expect(buttonRarityNandR).not.toBeChecked()
  const buttonRarityR = getByRole('radio', { name: 'Rのみ' })
  expect(buttonRarityR).toBeVisible()
  expect(buttonRarityR).not.toBeChecked()
  const buttonRarityRandSR = getByRole('radio', { name: 'RとSR' })
  expect(buttonRarityRandSR).toBeVisible()
  expect(buttonRarityRandSR).not.toBeChecked()
  const buttonRaritySR = getByRole('radio', { name: 'SRのみ' })
  expect(buttonRaritySR).toBeVisible()
  expect(buttonRaritySR).not.toBeChecked()

  // レベルを開く
  await userEvent.click(buttonLevel)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const buttonLevelGE = getByRole('radio', { name: '以上' })
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()
  const buttonLevelLE = getByRole('radio', { name: '以下' })
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  const buttonLevelEQ = getByRole('radio', { name: '等しい' })
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()

  // 特性を開く
  await userEvent.click(buttonTrait)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const spanTraitUnspecified = getByTestId('button-trait-unspecified')
  expect(spanTraitUnspecified).toBeVisible()
  const buttonTraitUnspecified = spanTraitUnspecified.querySelector(
    'input[type="radio"]'
  )
  expect(buttonTraitUnspecified).toBeVisible()
  expect(buttonTraitUnspecified).toBeChecked()
  const labelTraitUnspecified = spanTraitUnspecified.querySelector('label')
  expect(labelTraitUnspecified).toBeVisible()
  expect(labelTraitUnspecified.textContent).toBe('指定なし')

  const buttonTraitSwordplay = getByRole('radio', { name: '剣術' })
  expect(buttonTraitSwordplay).toBeVisible()
  expect(buttonTraitSwordplay).not.toBeChecked()
  const buttonTraitArt = getByRole('radio', { name: '美術' })
  expect(buttonTraitArt).toBeVisible()
  expect(buttonTraitArt).not.toBeChecked()
  const buttonTraitMusic = getByRole('radio', { name: '音楽' })
  expect(buttonTraitMusic).toBeVisible()
  expect(buttonTraitMusic).not.toBeChecked()
  const buttonTraitThought = getByRole('radio', { name: '思想' })
  expect(buttonTraitThought).toBeVisible()
  expect(buttonTraitThought).not.toBeChecked()
  const buttonTraitMedicine = getByRole('radio', { name: '医術' })
  expect(buttonTraitMedicine).toBeVisible()
  expect(buttonTraitMedicine).not.toBeChecked()
  const buttonTraitVolunteer = getByRole('radio', { name: '志願' })
  expect(buttonTraitVolunteer).toBeVisible()
  expect(buttonTraitVolunteer).not.toBeChecked()

  // 能力語を開く
  await userEvent.click(buttonTerm)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const spanTermUnspecified = getByTestId('button-term-unspecified')
  expect(spanTermUnspecified).toBeVisible()
  const buttonTermUnspecified = spanTermUnspecified.querySelector(
    'input[type="radio"]'
  )
  expect(buttonTermUnspecified).toBeVisible()
  expect(buttonTermUnspecified).toBeChecked()
  const labelTermUnspecified = spanTermUnspecified.querySelector('label')
  expect(labelTermUnspecified).toBeVisible()
  expect(labelTermUnspecified.textContent).toBe('指定なし')

  const buttonTermSailing = getByRole('radio', { name: '航海' })
  expect(buttonTermSailing).toBeVisible()
  expect(buttonTermSailing).not.toBeChecked()
  const buttonTermWriting = getByRole('radio', { name: '執筆' })
  expect(buttonTermWriting).toBeVisible()
  expect(buttonTermWriting).not.toBeChecked()
  const buttonTermRising = getByRole('radio', { name: '決起' })
  expect(buttonTermRising).toBeVisible()
  expect(buttonTermRising).not.toBeChecked()
  const buttonTermRecruitment = getByRole('radio', { name: '徴募' })
  expect(buttonTermRecruitment).toBeVisible()
  expect(buttonTermRecruitment).not.toBeChecked()
  const buttonTermChromagic = getByRole('radio', { name: '魔導' })
  expect(buttonTermChromagic).toBeVisible()
  expect(buttonTermChromagic).not.toBeChecked()

  // 遺業能力を開く
  await userEvent.click(buttonLegacy)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  const spanLegacyUnspecified = getByTestId('button-legacy-unspecified')
  expect(spanLegacyUnspecified).toBeVisible()
  const buttonLegacyUnspecified = spanLegacyUnspecified.querySelector(
    'input[type="radio"]'
  )
  expect(buttonLegacyUnspecified).toBeVisible()
  expect(buttonLegacyUnspecified).toBeChecked()
  const labelLegacyUnspecified = spanLegacyUnspecified.querySelector('label')
  expect(labelLegacyUnspecified).toBeVisible()
  expect(labelLegacyUnspecified.textContent).toBe('指定なし')

  const buttonLegacyMaryokuka = getByRole('radio', { name: '魔力化' })
  expect(buttonLegacyMaryokuka).toBeVisible()
  expect(buttonLegacyMaryokuka).not.toBeChecked()
  const buttonLegacyNether = getByRole('radio', { name: '冥府発動' })
  expect(buttonLegacyNether).toBeVisible()
  expect(buttonLegacyNether).not.toBeChecked()
  const buttonLegacyRestoration = getByRole('radio', { name: '復元' })
  expect(buttonLegacyRestoration).toBeVisible()
  expect(buttonLegacyRestoration).not.toBeChecked()
  const buttonLegacyResurrection = getByRole('radio', { name: '反魂' })
  expect(buttonLegacyResurrection).toBeVisible()
  expect(buttonLegacyResurrection).not.toBeChecked()
  const buttonLegacyEcho = getByRole('radio', { name: '木霊' })
  expect(buttonLegacyEcho).toBeVisible()
  expect(buttonLegacyEcho).not.toBeChecked()
  const buttonLegacyFaint = getByRole('radio', { name: '喪神' })
  expect(buttonLegacyFaint).toBeVisible()
  expect(buttonLegacyFaint).not.toBeChecked()
  const buttonLegacyDraw1 = getByRole('radio', { name: '1ドローする' })
  expect(buttonLegacyDraw1).toBeVisible()
  expect(buttonLegacyDraw1).not.toBeChecked()
  const buttonLegacyBackToHand = getByRole('radio', { name: '手札に戻す' })
  expect(buttonLegacyBackToHand).toBeVisible()
  expect(buttonLegacyBackToHand).not.toBeChecked()
  const buttonLegacyBackToStock = getByRole('radio', {
    name: '山札の上か下に戻す',
  })
  expect(buttonLegacyBackToStock).toBeVisible()
  expect(buttonLegacyBackToStock).not.toBeChecked()
})

test('エキスパンションによるフィルタ', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const handleSetDeckMain = vi.fn()
  const handleSetDeckSide = vi.fn()
  const handleSetIdZoom = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(handleSetDeckMain.mock.calls.length).toBe(0)
  expect(handleSetDeckSide.mock.calls.length).toBe(0)
  expect(handleSetIdZoom.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 条件で絞り込むアコーディオンを開く
  const buttonFilterTop = getByRole('button', {
    name: '条件で絞り込む',
    expanded: false,
  })
  expect(buttonFilterTop).toBeVisible()
  await userEvent.click(buttonFilterTop)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  // エキスパンションアコーディオンアイテムを開く
  const buttonExpansion = getByRole('button', {
    name: '➕ エキスパンション ― すべて',
    expanded: false,
  })
  expect(buttonExpansion).toBeVisible()
  await userEvent.click(buttonExpansion)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-R-1')).toBeVisible()
  expect(getByTestId('table-row-B-1')).toBeVisible()
  expect(getByTestId('table-row-G-1')).toBeVisible()
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-Y-1')).toBeVisible()
  expect(getByTestId('table-row-2-1')).toBeVisible()
  expect(getByTestId('table-row-P-1')).toBeVisible()
  expect(getByTestId('table-row-3-1')).toBeVisible()
  expect(getByTestId('table-row-4-01')).toBeVisible()

  // 伝説の武将ボタンを押す
  const buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  await userEvent.click(buttonExpansionRed)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-R-1')).toBeVisible()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 美と知の革命ボタンを押す
  const buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  await userEvent.click(buttonExpansionBlue)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(getByTestId('table-row-B-1')).toBeVisible()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 日本の大天才ボタンを押す
  const buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  await userEvent.click(buttonExpansionGreen)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(getByTestId('table-row-G-1')).toBeVisible()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 第１弾ブースターボタンを押す
  const buttonExpansionFirst = getByRole('radio', { name: '第１弾ブースター' })
  expect(buttonExpansionFirst).toBeVisible()
  expect(buttonExpansionFirst).not.toBeChecked()
  await userEvent.click(buttonExpansionFirst)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 三国の英傑ボタンを押す
  const buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  await userEvent.click(buttonExpansionYellow)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(getByTestId('table-row-Y-1')).toBeVisible()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 第２弾ブースターボタンを押す
  const buttonExpansionSecond = getByRole('radio', { name: '第２弾ブースター' })
  expect(buttonExpansionSecond).toBeVisible()
  expect(buttonExpansionSecond).not.toBeChecked()
  await userEvent.click(buttonExpansionSecond)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(getByTestId('table-row-2-1')).toBeVisible()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 発展する医学ボタンを押す
  const buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()
  await userEvent.click(buttonExpansionPurple)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(getByTestId('table-row-P-1')).toBeVisible()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 第３弾ブースターボタンを押す
  const buttonExpansionThird = getByRole('radio', { name: '第３弾ブースター' })
  expect(buttonExpansionThird).toBeVisible()
  expect(buttonExpansionThird).not.toBeChecked()
  await userEvent.click(buttonExpansionThird)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(getByTestId('table-row-3-1')).toBeVisible()
  expect(queryByTestId('table-row-4-01')).toBeNull()

  // 第４弾ブースターボタンを押す
  const buttonExpansionFourth = getByRole('radio', { name: '第４弾ブースター' })
  expect(buttonExpansionFourth).toBeVisible()
  expect(buttonExpansionFourth).not.toBeChecked()
  await userEvent.click(buttonExpansionFourth)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(getByTestId('table-row-4-01')).toBeVisible()

  // 条件すべてをリセットするボタンを押す
  const buttonResetAll = getByRole('button', {
    name: '条件すべてをリセットする',
  })
  expect(buttonResetAll).toBeVisible()
  expect(buttonResetAll).not.toBeChecked()
  await userEvent.click(buttonResetAll)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  const buttonExpansionAll = getByTestId('button-expansion-all').querySelector(
    'input[type="radio"]'
  )
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).toBeChecked()
  expect(getByTestId('table-row-R-1')).toBeVisible()
  expect(getByTestId('table-row-B-1')).toBeVisible()
  expect(getByTestId('table-row-G-1')).toBeVisible()
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-Y-1')).toBeVisible()
  expect(getByTestId('table-row-2-1')).toBeVisible()
  expect(getByTestId('table-row-P-1')).toBeVisible()
  expect(getByTestId('table-row-3-1')).toBeVisible()
  expect(getByTestId('table-row-4-01')).toBeVisible()
})

test('レアリティによるフィルタ', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const handleSetDeckMain = vi.fn()
  const handleSetDeckSide = vi.fn()
  const handleSetIdZoom = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(handleSetDeckMain.mock.calls.length).toBe(0)
  expect(handleSetDeckSide.mock.calls.length).toBe(0)
  expect(handleSetIdZoom.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 条件で絞り込むアコーディオンを開く
  const buttonFilterTop = getByRole('button', {
    name: '条件で絞り込む',
    expanded: false,
  })
  expect(buttonFilterTop).toBeVisible()
  await userEvent.click(buttonFilterTop)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  // レアリティアコーディオンアイテムを開く
  const buttonRarity = getByRole('button', {
    name: '➕ レアリティ ― すべて',
    expanded: false,
  })
  expect(buttonRarity).toBeVisible()
  await userEvent.click(buttonRarity)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-1-1')).toBeVisible() // 織田信長 (SR)
  expect(getByTestId('table-row-1-15')).toBeVisible() // 中臣鎌足 (R)
  expect(getByTestId('table-row-1-17')).toBeVisible() // 藤原道長 (N)

  // Nのみボタンを押す
  const buttonRarityN = getByRole('radio', { name: 'Nのみ' })
  await userEvent.click(buttonRarityN)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-1-15')).toBeNull()
  expect(getByTestId('table-row-1-17')).toBeVisible()

  // NとRボタンを押す
  const buttonRarityNandR = getByRole('radio', { name: 'NとR' })
  await userEvent.click(buttonRarityNandR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(getByTestId('table-row-1-17')).toBeVisible()

  // Rのみボタンを押す
  const buttonRarityR = getByRole('radio', { name: 'Rのみ' })
  await userEvent.click(buttonRarityR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // RとSRボタンを押す
  const buttonRarityRandSR = getByRole('radio', { name: 'RとSR' })
  await userEvent.click(buttonRarityRandSR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // SRのみボタンを押す
  const buttonRaritySR = getByRole('radio', { name: 'SRのみ' })
  await userEvent.click(buttonRaritySR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(queryByTestId('table-row-1-15')).toBeNull()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // 条件すべてをリセットするボタンを押す
  const buttonResetAll = getByRole('button', {
    name: '条件すべてをリセットする',
  })
  expect(buttonResetAll).toBeVisible()
  expect(buttonResetAll).not.toBeChecked()
  await userEvent.click(buttonResetAll)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  const buttonRarityAll = getByTestId('button-rarity-all').querySelector(
    'input[type="radio"]'
  )
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).toBeChecked()

  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(getByTestId('table-row-1-17')).toBeVisible()
})

test('色によるフィルタ', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const handleSetDeckMain = vi.fn()
  const handleSetDeckSide = vi.fn()
  const handleSetIdZoom = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(handleSetDeckMain.mock.calls.length).toBe(0)
  expect(handleSetDeckSide.mock.calls.length).toBe(0)
  expect(handleSetIdZoom.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 条件で絞り込むアコーディオンを開く
  const buttonFilterTop = getByRole('button', {
    name: '条件で絞り込む',
    expanded: false,
  })
  expect(buttonFilterTop).toBeVisible()
  await userEvent.click(buttonFilterTop)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )

  // 色アコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 色',
      expanded: true,
    })
  ).toBeVisible()

  expect(getByTestId('table-row-2-78')).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(getByTestId('table-row-2-79')).toBeVisible() // RYマーブルオーブ (青黄)
  expect(getByTestId('table-row-2-80')).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(getByTestId('table-row-3-15')).toBeVisible() // 淀殿 (赤)
  expect(getByTestId('table-row-3-19')).toBeVisible() // 伊達政宗 (青)
  expect(getByTestId('table-row-3-27')).toBeVisible() // 小野小町 (緑)
  expect(getByTestId('table-row-3-35')).toBeVisible() // 徳川吉宗 (黄)
  expect(getByTestId('table-row-3-45')).toBeVisible() // 坂本龍馬 (紫)
  expect(getByTestId('table-row-3-80')).toBeVisible() // オブシディアン (無色)

  // 赤ボタンを押す
  const buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  await userEvent.click(buttonColorRed)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-2-78')).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(queryByTestId('table-row-2-79')).toBeNull() // RYマーブルオーブ (青黄)
  expect(queryByTestId('table-row-2-80')).toBeNull() // RYマーブルオーブ (緑黄)
  expect(getByTestId('table-row-3-15')).toBeVisible() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 青ボタンを押す
  const buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  await userEvent.click(buttonColorBlue)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-2-78')).toBeNull() // RYマーブルオーブ (赤黄)
  expect(getByTestId('table-row-2-79')).toBeVisible() // RYマーブルオーブ (青黄)
  expect(queryByTestId('table-row-2-80')).toBeNull() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(getByTestId('table-row-3-19')).toBeVisible() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 緑ボタンを押す
  const buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  await userEvent.click(buttonColorGreen)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-2-78')).toBeNull() // RYマーブルオーブ (赤黄)
  expect(queryByTestId('table-row-2-79')).toBeNull() // RYマーブルオーブ (青黄)
  expect(getByTestId('table-row-2-80')).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(getByTestId('table-row-3-27')).toBeVisible() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 黄ボタンを押す
  const buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  await userEvent.click(buttonColorYellow)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-2-78')).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(getByTestId('table-row-2-79')).toBeVisible() // RYマーブルオーブ (青黄)
  expect(getByTestId('table-row-2-80')).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(getByTestId('table-row-3-35')).toBeVisible() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 紫ボタンを押す
  const buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  await userEvent.click(buttonColorPurple)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-2-78')).toBeNull() // RYマーブルオーブ (赤黄)
  expect(queryByTestId('table-row-2-79')).toBeNull() // RYマーブルオーブ (青黄)
  expect(queryByTestId('table-row-2-80')).toBeNull() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(getByTestId('table-row-3-45')).toBeVisible() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 多色ボタンを押す
  const buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  await userEvent.click(buttonColorMulticolor)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('table-row-2-78')).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(getByTestId('table-row-2-79')).toBeVisible() // RYマーブルオーブ (青黄)
  expect(getByTestId('table-row-2-80')).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(queryByTestId('table-row-3-80')).toBeNull() // オブシディアン (無色)

  // 無色ボタンを押す
  const buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()
  await userEvent.click(buttonColorColorless)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(queryByTestId('table-row-2-78')).toBeNull() // RYマーブルオーブ (赤黄)
  expect(queryByTestId('table-row-2-79')).toBeNull() // RYマーブルオーブ (青黄)
  expect(queryByTestId('table-row-2-80')).toBeNull() // RYマーブルオーブ (緑黄)
  expect(queryByTestId('table-row-3-15')).toBeNull() // 淀殿 (赤)
  expect(queryByTestId('table-row-3-19')).toBeNull() // 伊達政宗 (青)
  expect(queryByTestId('table-row-3-27')).toBeNull() // 小野小町 (緑)
  expect(queryByTestId('table-row-3-35')).toBeNull() // 徳川吉宗 (黄)
  expect(queryByTestId('table-row-3-45')).toBeNull() // 坂本龍馬 (紫)
  expect(getByTestId('table-row-3-80')).toBeVisible() // オブシディアン (無色)

  // 条件すべてをリセットするボタンを押す
  const buttonResetAll = getByRole('button', {
    name: '条件すべてをリセットする',
  })
  expect(buttonResetAll).toBeVisible()
  expect(buttonResetAll).not.toBeChecked()
  await userEvent.click(buttonResetAll)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      handleSetDeckMain={handleSetDeckMain}
      handleSetDeckSide={handleSetDeckSide}
      handleSetIdZoom={handleSetIdZoom}
      interruptSimulator={interruptSimulator}
    />
  )
  const buttonColorAll = getByTestId('button-color-all').querySelector(
    'input[type="radio"]'
  )
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked()

  expect(getByTestId('table-row-2-78')).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(getByTestId('table-row-2-79')).toBeVisible() // RYマーブルオーブ (青黄)
  expect(getByTestId('table-row-2-80')).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(getByTestId('table-row-3-15')).toBeVisible() // 淀殿 (赤)
  expect(getByTestId('table-row-3-19')).toBeVisible() // 伊達政宗 (青)
  expect(getByTestId('table-row-3-27')).toBeVisible() // 小野小町 (緑)
  expect(getByTestId('table-row-3-35')).toBeVisible() // 徳川吉宗 (黄)
  expect(getByTestId('table-row-3-45')).toBeVisible() // 坂本龍馬 (紫)
  expect(getByTestId('table-row-3-80')).toBeVisible() // オブシディアン (無色)
})
