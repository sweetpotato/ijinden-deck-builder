// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TabPaneCard from '.'

afterEach(cleanup)

test('フィルタの初期状態', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByPlaceholderText, getByRole, getByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
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

  // 条件で絞り込むボタンを押す
  await userEvent.click(buttonFilterTop)

  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  expect(
    getByRole('button', {
      name: '➕ エキスパンション ― すべて',
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: '➕ レアリティ ― すべて',
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: '➖ 色',
      expanded: true,
    })
  ).toBeVisible()

  const spanColorAll = getByTestId('button-color-all')
  expect(spanColorAll).toBeVisible()
  const buttonColorAll = spanColorAll.querySelector('input')
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

  expect(
    getByRole('button', {
      name: '➖ 種類とパワー',
      expanded: true,
    })
  ).toBeVisible()

  const spanTypeAll = getByTestId('button-color-all')
  expect(spanTypeAll).toBeVisible()
  const buttonTypeAll = spanTypeAll.querySelector('input')
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

  const sliderPower = getByTestId('slider-power')
  expect(sliderPower).toBeVisible()
  expect(sliderPower).not.toBeEnabled()
  const buttonPowerGE = getByTestId('button-power-ge').querySelector('input')
  expect(buttonPowerGE).toBeVisible()
  expect(buttonPowerGE).not.toBeEnabled()
  const buttonPowerLE = getByTestId('button-power-le').querySelector('input')
  expect(buttonPowerLE).toBeVisible()
  expect(buttonPowerLE).not.toBeEnabled()
  const buttonPowerEQ = getByTestId('button-power-eq').querySelector('input')
  expect(buttonPowerEQ).toBeVisible()
  expect(buttonPowerEQ).not.toBeEnabled()

  expect(
    getByRole('button', {
      name: '➕ レベル ― 0以上',
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: '➕ 特性 ― 指定なし',
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: '➕ 能力語 ― 指定なし',
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: '➕ 遺業能力 ― 指定なし',
      expanded: false,
    })
  ).toBeVisible()

  // エキスパンションを開く
  await userEvent.click(
    getByRole('button', {
      name: '➕ エキスパンション ― すべて',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ エキスパンション',
      expanded: true,
    })
  ).toBeVisible()

  const spanExpansionAll = getByTestId('button-expansion-all')
  expect(spanExpansionAll).toBeVisible()
  const buttonExpansionAll = spanTypeAll.querySelector('input')
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
  await userEvent.click(
    getByRole('button', {
      name: '➕ レアリティ ― すべて',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ レアリティ',
      expanded: true,
    })
  ).toBeVisible()

  const spanRarityAll = getByTestId('button-expansion-all')
  expect(spanRarityAll).toBeVisible()
  const buttonRarityAll = spanTypeAll.querySelector('input')
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
  await userEvent.click(
    getByRole('button', {
      name: '➕ レベル ― 0以上',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ レベル',
      expanded: true,
    })
  ).toBeVisible()

  const sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('0')
  const buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()
  const buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  const buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()

  // 特性を開く
  await userEvent.click(
    getByRole('button', {
      name: '➕ 特性 ― 指定なし',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 特性',
      expanded: true,
    })
  ).toBeVisible()

  const spanTraitUnspecified = getByTestId('button-trait-unspecified')
  expect(spanTraitUnspecified).toBeVisible()
  const buttonTraitUnspecified = spanTraitUnspecified.querySelector('input')
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
  await userEvent.click(
    getByRole('button', {
      name: '➕ 能力語 ― 指定なし',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 能力語',
      expanded: true,
    })
  ).toBeVisible()

  const spanTermUnspecified = getByTestId('button-term-unspecified')
  expect(spanTermUnspecified).toBeVisible()
  const buttonTermUnspecified = spanTermUnspecified.querySelector('input')
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
  await userEvent.click(
    getByRole('button', {
      name: '➕ 遺業能力 ― 指定なし',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 遺業能力',
      expanded: true,
    })
  ).toBeVisible()

  const spanLegacyUnspecified = getByTestId('button-legacy-unspecified')
  expect(spanLegacyUnspecified).toBeVisible()
  const buttonLegacyUnspecified = spanLegacyUnspecified.querySelector('input')
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

test('プラスマイナスボタンの操作', async () => {
  let deckMain = new Map()
  let deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  let buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).not.toBeEnabled()
  let textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(0)
  let buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  let buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).not.toBeEnabled()
  let textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(0)
  let buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  let buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).not.toBeEnabled()
  let textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(0)
  let buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  let buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).not.toBeEnabled()
  let textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(0)
  let buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-1 メインのプラスボタンを押す
  await userEvent.click(buttonMainPlus1)
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(1) // 実行された
  expect(incrementMain.mock.lastCall.length).toBe(1)
  expect(incrementMain.mock.lastCall[0]).toBe('R-1')
  deckMain = new Map([['R-1', 1]])
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1) // 実行された
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).toBeEnabled() // 有効になった
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(1) // 増えた
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).not.toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(0)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).not.toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(0)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).not.toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(0)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-1 サイドのプラスボタンを押す
  await userEvent.click(buttonSidePlus1)
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(1)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(1) // 実行された
  expect(incrementSide.mock.lastCall.length).toBe(1)
  expect(incrementSide.mock.lastCall[0]).toBe('R-1')
  deckSide = new Map([['R-1', 1]])
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(1)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(1)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).toBeEnabled() // 有効になった
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(1) // 増えた
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).not.toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(0)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).not.toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(0)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-2 メインのプラスボタンを押す
  await userEvent.click(buttonMainPlus2)
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(2) // 実行された
  expect(incrementMain.mock.lastCall.length).toBe(1)
  expect(incrementMain.mock.lastCall[0]).toBe('R-2')
  deckMain = new Map([
    ['R-1', 1],
    ['R-2', 1],
  ])
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(1)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(2) // 実行された
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(1)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(1)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).toBeEnabled() // 有効になった
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(1) // 増えた
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).not.toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(0)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-2 サイドのプラスボタンを押す
  await userEvent.click(buttonSidePlus2)
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(2)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(2) // 実行された
  expect(incrementMain.mock.lastCall.length).toBe(1)
  expect(incrementMain.mock.lastCall[0]).toBe('R-2')
  deckSide = new Map([
    ['R-1', 1],
    ['R-2', 1],
  ])
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(2)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(1)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(1)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(1)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).toBeEnabled() // 有効になった
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(1) // 増えた
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-1 メインのマイナスボタンを押す
  await userEvent.click(buttonMainMinus1)
  expect(decrementMain.mock.calls.length).toBe(1) // 実行された
  expect(decrementMain.mock.lastCall.length).toBe(1)
  expect(decrementMain.mock.lastCall[0]).toBe('R-1')
  deckMain = new Map([['R-2', 1]])
  expect(incrementMain.mock.calls.length).toBe(2)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(2)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(3) // 実行された
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).not.toBeEnabled() // 無効になった
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(0) // 減った
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(1)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(1)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(1)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-1 サイドのマイナスボタンを押す
  await userEvent.click(buttonSideMinus1)
  expect(decrementMain.mock.calls.length).toBe(1)
  expect(incrementMain.mock.calls.length).toBe(2)
  expect(decrementSide.mock.calls.length).toBe(1) // 実行された
  expect(decrementSide.mock.lastCall.length).toBe(1)
  expect(decrementSide.mock.lastCall[0]).toBe('R-1')
  expect(incrementSide.mock.calls.length).toBe(2)
  deckSide = new Map([['R-2', 1]])
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(3)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).not.toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(0)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).not.toBeEnabled() // 無効になった
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(0) // 減った
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(1)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(1)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-2 メインのマイナスボタンを押す
  await userEvent.click(buttonMainMinus2)
  expect(decrementMain.mock.calls.length).toBe(2) // 実行された
  expect(decrementMain.mock.lastCall.length).toBe(1)
  expect(decrementMain.mock.lastCall[0]).toBe('R-2')
  deckMain = new Map()
  expect(incrementMain.mock.calls.length).toBe(2)
  expect(decrementSide.mock.calls.length).toBe(1)
  expect(incrementSide.mock.calls.length).toBe(2)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(4) // 実行された
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).not.toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(0)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).not.toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(0)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).not.toBeEnabled() // 無効になった
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(0) // 減った
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).toBeEnabled()
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(1)
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()

  // R-2 サイドのマイナスボタンを押す
  await userEvent.click(buttonSideMinus2)
  expect(decrementMain.mock.calls.length).toBe(2)
  expect(incrementMain.mock.calls.length).toBe(2)
  expect(decrementSide.mock.calls.length).toBe(2) // 実行された
  expect(decrementMain.mock.lastCall.length).toBe(1)
  expect(decrementMain.mock.lastCall[0]).toBe('R-2')
  deckSide = new Map()
  expect(incrementSide.mock.calls.length).toBe(2)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(4) // 実行された
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonMainMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus1).toBeVisible()
  expect(buttonMainMinus1).not.toBeEnabled()
  textboxMain1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain1).toBeVisible()
  expect(textboxMain1).toHaveAttribute('readonly')
  expect(textboxMain1).toHaveValue(0)
  buttonMainPlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus1).toBeVisible()
  expect(buttonMainPlus1).toBeEnabled()
  buttonSideMinus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus1).toBeVisible()
  expect(buttonSideMinus1).not.toBeEnabled()
  textboxSide1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide1).toBeVisible()
  expect(textboxSide1).toHaveAttribute('readonly')
  expect(textboxSide1).toHaveValue(0)
  buttonSidePlus1 = getByTestId('table-row-R-1').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus1).toBeVisible()
  expect(buttonSidePlus1).toBeEnabled()
  buttonMainMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(1)'
  )
  expect(buttonMainMinus2).toBeVisible()
  expect(buttonMainMinus2).not.toBeEnabled()
  textboxMain2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) input'
  )
  expect(textboxMain2).toBeVisible()
  expect(textboxMain2).toHaveAttribute('readonly')
  expect(textboxMain2).toHaveValue(0)
  buttonMainPlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(3) button:nth-child(3)'
  )
  expect(buttonMainPlus2).toBeVisible()
  expect(buttonMainPlus2).toBeEnabled()
  buttonSideMinus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(1)'
  )
  expect(buttonSideMinus2).toBeVisible()
  expect(buttonSideMinus2).not.toBeEnabled() // 無効になった
  textboxSide2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) input'
  )
  expect(textboxSide2).toBeVisible()
  expect(textboxSide2).toHaveAttribute('readonly')
  expect(textboxSide2).toHaveValue(0) // 減った
  buttonSidePlus2 = getByTestId('table-row-R-2').querySelector(
    'td:nth-child(4) button:nth-child(3)'
  )
  expect(buttonSidePlus2).toBeVisible()
  expect(buttonSidePlus2).toBeEnabled()
})

test('虫眼鏡ボタンの操作', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // R-1 の虫眼鏡ボタンを押す
  await userEvent.click(
    getByTestId('table-row-R-1').querySelector('td:nth-child(2) button')
  )
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe('R-1')
  expect(interruptSimulator.mock.calls.length).toBe(0)

  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // R-2 の虫眼鏡ボタンを押す
  await userEvent.click(
    getByTestId('table-row-R-2').querySelector('td:nth-child(2) button')
  )
  expect(decrementMain.mock.calls.length).toBe(0)
  expect(incrementMain.mock.calls.length).toBe(0)
  expect(decrementSide.mock.calls.length).toBe(0)
  expect(incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(2) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe('R-2')
  expect(interruptSimulator.mock.calls.length).toBe(0)
})

test('エキスパンションによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

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
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ エキスパンション',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態ではすべてボタンが選択されている
  let buttonExpansionAll = getByTestId('button-expansion-all').querySelector(
    'input'
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
  expect(getByTestId('table-row-4-1')).toBeVisible()

  // 伝説の武将ボタンを押す
  let buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).not.toBeChecked()
  await userEvent.click(buttonExpansionRed)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionRed = getByRole('radio', { name: '伝説の武将' })
  expect(buttonExpansionRed).toBeVisible()
  expect(buttonExpansionRed).toBeChecked()

  expect(getByTestId('table-row-R-1')).toBeVisible()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 美と知の革命ボタンを押す
  let buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).not.toBeChecked()
  await userEvent.click(buttonExpansionBlue)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionBlue = getByRole('radio', { name: '美と知の革命' })
  expect(buttonExpansionBlue).toBeVisible()
  expect(buttonExpansionBlue).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(getByTestId('table-row-B-1')).toBeVisible()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 日本の大天才ボタンを押す
  let buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).not.toBeChecked()
  await userEvent.click(buttonExpansionGreen)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionGreen = getByRole('radio', { name: '日本の大天才' })
  expect(buttonExpansionGreen).toBeVisible()
  expect(buttonExpansionGreen).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(getByTestId('table-row-G-1')).toBeVisible()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 第１弾ブースターボタンを押す
  let buttonExpansionFirst = getByRole('radio', { name: '第１弾ブースター' })
  expect(buttonExpansionFirst).toBeVisible()
  expect(buttonExpansionFirst).not.toBeChecked()
  await userEvent.click(buttonExpansionFirst)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionFirst = getByRole('radio', { name: '第１弾ブースター' })
  expect(buttonExpansionFirst).toBeVisible()
  expect(buttonExpansionFirst).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 三国の英傑ボタンを押す
  let buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).not.toBeChecked()
  await userEvent.click(buttonExpansionYellow)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionYellow = getByRole('radio', { name: '三国の英傑' })
  expect(buttonExpansionYellow).toBeVisible()
  expect(buttonExpansionYellow).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(getByTestId('table-row-Y-1')).toBeVisible()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 第２弾ブースターボタンを押す
  let buttonExpansionSecond = getByRole('radio', { name: '第２弾ブースター' })
  expect(buttonExpansionSecond).toBeVisible()
  expect(buttonExpansionSecond).not.toBeChecked()
  await userEvent.click(buttonExpansionSecond)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionSecond = getByRole('radio', { name: '第２弾ブースター' })
  expect(buttonExpansionSecond).toBeVisible()
  expect(buttonExpansionSecond).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(getByTestId('table-row-2-1')).toBeVisible()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 発展する医学ボタンを押す
  let buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).not.toBeChecked()
  await userEvent.click(buttonExpansionPurple)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionPurple = getByRole('radio', { name: '発展する医学' })
  expect(buttonExpansionPurple).toBeVisible()
  expect(buttonExpansionPurple).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(getByTestId('table-row-P-1')).toBeVisible()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 第３弾ブースターボタンを押す
  let buttonExpansionThird = getByRole('radio', { name: '第３弾ブースター' })
  expect(buttonExpansionThird).toBeVisible()
  expect(buttonExpansionThird).not.toBeChecked()
  await userEvent.click(buttonExpansionThird)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionThird = getByRole('radio', { name: '第３弾ブースター' })
  expect(buttonExpansionThird).toBeVisible()
  expect(buttonExpansionThird).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(getByTestId('table-row-3-1')).toBeVisible()
  expect(queryByTestId('table-row-4-1')).toBeNull()

  // 第４弾ブースターボタンを押す
  let buttonExpansionFourth = getByRole('radio', { name: '第４弾ブースター' })
  expect(buttonExpansionFourth).toBeVisible()
  expect(buttonExpansionFourth).not.toBeChecked()
  await userEvent.click(buttonExpansionFourth)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionFourth = getByRole('radio', { name: '第４弾ブースター' })
  expect(buttonExpansionFourth).toBeVisible()
  expect(buttonExpansionFourth).toBeChecked()

  expect(queryByTestId('table-row-R-1')).toBeNull()
  expect(queryByTestId('table-row-B-1')).toBeNull()
  expect(queryByTestId('table-row-G-1')).toBeNull()
  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-Y-1')).toBeNull()
  expect(queryByTestId('table-row-2-1')).toBeNull()
  expect(queryByTestId('table-row-P-1')).toBeNull()
  expect(queryByTestId('table-row-3-1')).toBeNull()
  expect(getByTestId('table-row-4-1')).toBeVisible()

  // 条件すべてをリセットするボタンを押す
  buttonExpansionAll = getByTestId('button-expansion-all').querySelector(
    'input'
  )
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonExpansionAll = getByTestId('button-expansion-all').querySelector(
    'input'
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
  expect(getByTestId('table-row-4-1')).toBeVisible()
})

test('レアリティによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

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
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ レアリティ',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態ではすべてボタンが選択されている
  let buttonRarityAll = getByTestId('button-rarity-all').querySelector('input')
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).toBeChecked()

  expect(getByTestId('table-row-1-1')).toBeVisible() // 織田信長 (SR)
  expect(getByTestId('table-row-1-15')).toBeVisible() // 中臣鎌足 (R)
  expect(getByTestId('table-row-1-17')).toBeVisible() // 藤原道長 (N)

  // Nのみボタンを押す
  let buttonRarityN = getByRole('radio', { name: 'Nのみ' })
  expect(buttonRarityN).toBeVisible()
  expect(buttonRarityN).not.toBeChecked()
  await userEvent.click(buttonRarityN)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRarityN = getByRole('radio', { name: 'Nのみ' })
  expect(buttonRarityN).toBeVisible()
  expect(buttonRarityN).toBeChecked()

  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(queryByTestId('table-row-1-15')).toBeNull()
  expect(getByTestId('table-row-1-17')).toBeVisible()

  // NとRボタンを押す
  let buttonRarityNandR = getByRole('radio', { name: 'NとR' })
  expect(buttonRarityNandR).toBeVisible()
  expect(buttonRarityNandR).not.toBeChecked()
  await userEvent.click(buttonRarityNandR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRarityNandR = getByRole('radio', { name: 'NとR' })
  expect(buttonRarityNandR).toBeVisible()
  expect(buttonRarityNandR).toBeChecked()
  expect(queryByTestId('table-row-1-1')).toBeNull()

  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(getByTestId('table-row-1-17')).toBeVisible()

  // Rのみボタンを押す
  let buttonRarityR = getByRole('radio', { name: 'Rのみ' })
  expect(buttonRarityR).toBeVisible()
  expect(buttonRarityR).not.toBeChecked()
  await userEvent.click(buttonRarityR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRarityR = getByRole('radio', { name: 'Rのみ' })
  expect(buttonRarityR).toBeVisible()
  expect(buttonRarityR).toBeChecked()

  expect(queryByTestId('table-row-1-1')).toBeNull()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // RとSRボタンを押す
  let buttonRarityRandSR = getByRole('radio', { name: 'RとSR' })
  expect(buttonRarityRandSR).toBeVisible()
  expect(buttonRarityRandSR).not.toBeChecked()
  await userEvent.click(buttonRarityRandSR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRarityRandSR = getByRole('radio', { name: 'RとSR' })
  expect(buttonRarityRandSR).toBeVisible()
  expect(buttonRarityRandSR).toBeChecked()

  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // SRのみボタンを押す
  let buttonRaritySR = getByRole('radio', { name: 'SRのみ' })
  expect(buttonRaritySR).toBeVisible()
  expect(buttonRaritySR).not.toBeChecked()
  await userEvent.click(buttonRaritySR)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRaritySR = getByRole('radio', { name: 'SRのみ' })
  expect(buttonRaritySR).toBeVisible()
  expect(buttonRaritySR).toBeChecked()

  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(queryByTestId('table-row-1-15')).toBeNull()
  expect(queryByTestId('table-row-1-17')).toBeNull()

  // 条件すべてをリセットするボタンを押す
  buttonRarityAll = getByTestId('button-rarity-all').querySelector('input')
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonRarityAll = getByTestId('button-rarity-all').querySelector('input')
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).toBeChecked()

  expect(getByTestId('table-row-1-1')).toBeVisible()
  expect(getByTestId('table-row-1-15')).toBeVisible()
  expect(getByTestId('table-row-1-17')).toBeVisible()
})

test('色によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 色アコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 色',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態ではすべてボタンが選択されている
  let buttonColorAll = getByTestId('button-color-all').querySelector('input')
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

  // 赤ボタンを押す
  let buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  await userEvent.click(buttonColorRed)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).toBeChecked()

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
  let buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).not.toBeChecked()
  await userEvent.click(buttonColorBlue)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorBlue = getByRole('radio', { name: '青' })
  expect(buttonColorBlue).toBeVisible()
  expect(buttonColorBlue).toBeChecked()

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
  let buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).not.toBeChecked()
  await userEvent.click(buttonColorGreen)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorGreen = getByRole('radio', { name: '緑' })
  expect(buttonColorGreen).toBeVisible()
  expect(buttonColorGreen).toBeChecked()

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
  let buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).not.toBeChecked()
  await userEvent.click(buttonColorYellow)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorYellow = getByRole('radio', { name: '黄' })
  expect(buttonColorYellow).toBeVisible()
  expect(buttonColorYellow).toBeChecked()

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
  let buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).not.toBeChecked()
  await userEvent.click(buttonColorPurple)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorPurple = getByRole('radio', { name: '紫' })
  expect(buttonColorPurple).toBeVisible()
  expect(buttonColorPurple).toBeChecked()

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
  let buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).not.toBeChecked()
  await userEvent.click(buttonColorMulticolor)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonColorMulticolor).toBeVisible()
  expect(buttonColorMulticolor).toBeChecked()

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
  let buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).not.toBeChecked()
  await userEvent.click(buttonColorColorless)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorColorless).toBeVisible()
  expect(buttonColorColorless).toBeChecked()

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
  buttonColorAll = getByTestId('button-color-all').querySelector('input')
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorAll = getByTestId('button-color-all').querySelector('input')
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

test('種類によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 種類とパワーアコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 種類とパワー',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態ではすべてボタンが選択されている
  let buttonTypeAll = getByTestId('button-type-all').querySelector('input')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).toBeChecked()

  expect(getByTestId('table-row-B-2')).toBeVisible() // ヴァスコ・ダ・ガマ
  expect(getByTestId('table-row-B-9')).toBeVisible() // モナ・リザ
  expect(getByTestId('table-row-B-11')).toBeVisible() // フリート
  expect(getByTestId('table-row-B-13')).toBeVisible() // ブルーストーン

  // イジンボタンを押す
  let buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).not.toBeChecked()
  await userEvent.click(buttonTypeIjin)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).toBeChecked()

  expect(getByTestId('table-row-B-2')).toBeVisible()
  expect(queryByTestId('table-row-B-9')).toBeNull()
  expect(queryByTestId('table-row-B-11')).toBeNull()
  expect(queryByTestId('table-row-B-13')).toBeNull()

  // ハイケイボタンを押す
  let buttonTypeHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonTypeHaikei).toBeVisible()
  expect(buttonTypeHaikei).not.toBeChecked()
  await userEvent.click(buttonTypeHaikei)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonTypeHaikei).toBeVisible()
  expect(buttonTypeHaikei).toBeChecked()

  expect(queryByTestId('table-row-B-2')).toBeNull()
  expect(getByTestId('table-row-B-9')).toBeVisible()
  expect(queryByTestId('table-row-B-11')).toBeNull()
  expect(queryByTestId('table-row-B-13')).toBeNull()

  // マホウボタンを押す
  let buttonTypeMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonTypeMahou).toBeVisible()
  expect(buttonTypeMahou).not.toBeChecked()
  await userEvent.click(buttonTypeMahou)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonTypeMahou).toBeVisible()
  expect(buttonTypeMahou).toBeChecked()

  expect(queryByTestId('table-row-B-2')).toBeNull()
  expect(queryByTestId('table-row-B-9')).toBeNull()
  expect(getByTestId('table-row-B-11')).toBeVisible()
  expect(queryByTestId('table-row-B-13')).toBeNull()

  // マリョクボタンを押す
  let buttonTypeMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonTypeMaryoku).toBeVisible()
  expect(buttonTypeMaryoku).not.toBeChecked()
  await userEvent.click(buttonTypeMaryoku)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonTypeMaryoku).toBeVisible()
  expect(buttonTypeMaryoku).toBeChecked()

  expect(queryByTestId('table-row-B-2')).toBeNull()
  expect(queryByTestId('table-row-B-9')).toBeNull()
  expect(queryByTestId('table-row-B-11')).toBeNull()
  expect(getByTestId('table-row-B-13')).toBeVisible()

  // 条件すべてをリセットするボタンを押す
  buttonTypeAll = getByTestId('button-type-all').querySelector('input')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeAll = getByTestId('button-type-all').querySelector('input')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).toBeChecked()

  expect(getByTestId('table-row-B-2')).toBeVisible()
  expect(getByTestId('table-row-B-9')).toBeVisible()
  expect(getByTestId('table-row-B-11')).toBeVisible()
  expect(getByTestId('table-row-B-13')).toBeVisible()
})

test('イジンのパワーによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 種類とパワーアコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 種類とパワー',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態ではすべてボタンが選択されている
  expect(
    getByTestId('button-type-all').querySelector('input[type="radio"]')
  ).toBeChecked()

  // パワーに関するフォームは無効化されている
  expect(getByTestId('slider-power')).not.toBeEnabled()
  expect(
    getByTestId('button-power-ge').querySelector('input')
  ).not.toBeEnabled()
  expect(
    getByTestId('button-power-le').querySelector('input')
  ).not.toBeEnabled()
  expect(
    getByTestId('button-power-eq').querySelector('input')
  ).not.toBeEnabled()

  // イジンボタンを押す
  let buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).not.toBeChecked()
  await userEvent.click(buttonTypeIjin)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).toBeChecked()

  // パワーに関するフォームが有効化される
  let sliderPower = getByTestId('slider-power')
  expect(sliderPower).toBeEnabled()
  expect(sliderPower).toHaveValue('0')
  let buttonPowerGE = getByTestId('button-power-ge').querySelector('input')
  expect(buttonPowerGE).toBeEnabled()
  expect(buttonPowerGE).toBeChecked() // 以上がチェックされている
  let buttonPowerLE = getByTestId('button-power-le').querySelector('input')
  expect(buttonPowerLE).toBeEnabled()
  expect(buttonPowerLE).not.toBeChecked()
  expect(getByTestId('button-power-eq').querySelector('input')).toBeEnabled()
  let buttonPowerEQ = getByTestId('button-power-eq').querySelector('input')
  expect(buttonPowerEQ).toBeEnabled()
  expect(buttonPowerEQ).not.toBeChecked()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 以下ボタンを押す
  await userEvent.click(getByTestId('button-power-le').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-le').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(queryByTestId('table-row-G-2')).toBeNull() // 卑弥呼 (500)
  expect(queryByTestId('table-row-1-18')).toBeNull() // 源頼朝 (5000)
  expect(queryByTestId('table-row-2-8')).toBeNull() // 豊臣秀吉 (10000)

  // 等しいボタンを押す
  await userEvent.click(getByTestId('button-power-eq').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-eq').querySelector('input')).toBeChecked()

  // 以上ボタンを押して、スライダーを500にする
  await userEvent.click(getByTestId('button-power-ge').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-ge').querySelector('input')).toBeChecked()
  fireEvent.change(getByTestId('slider-power'), { target: { value: '500' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('slider-power')).toHaveValue('500')

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 以下ボタンを押す
  await userEvent.click(getByTestId('button-power-le').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-le').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(queryByTestId('table-row-1-18')).toBeNull() // 源頼朝 (5000)
  expect(queryByTestId('table-row-2-8')).toBeNull() // 豊臣秀吉 (10000)

  // 等しいボタンを押す
  await userEvent.click(getByTestId('button-power-eq').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-eq').querySelector('input')).toBeChecked()

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(queryByTestId('table-row-1-18')).toBeNull() // 源頼朝 (5000)
  expect(queryByTestId('table-row-2-8')).toBeNull() // 豊臣秀吉 (10000)

  // 以上ボタンを押して、スライダーを5000にする
  await userEvent.click(getByTestId('button-power-ge').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-ge').querySelector('input')).toBeChecked()
  fireEvent.change(getByTestId('slider-power'), { target: { value: '5000' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('slider-power')).toHaveValue('5000')

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(queryByTestId('table-row-G-2')).toBeNull() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 以下ボタンを押す
  await userEvent.click(getByTestId('button-power-le').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-le').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(queryByTestId('table-row-2-8')).toBeNull() // 豊臣秀吉 (10000)

  // 等しいボタンを押す
  await userEvent.click(getByTestId('button-power-eq').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-eq').querySelector('input')).toBeChecked()

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(queryByTestId('table-row-G-2')).toBeNull() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(queryByTestId('table-row-2-8')).toBeNull() // 豊臣秀吉 (10000)

  // 以上ボタンを押して、スライダーを10000にする
  await userEvent.click(getByTestId('button-power-ge').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-ge').querySelector('input')).toBeChecked()
  fireEvent.change(getByTestId('slider-power'), { target: { value: '10000' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('slider-power')).toHaveValue('10000')

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(queryByTestId('table-row-G-2')).toBeNull() // 卑弥呼 (500)
  expect(queryByTestId('table-row-1-18')).toBeNull() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 以下ボタンを押す
  await userEvent.click(getByTestId('button-power-le').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-le').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 等しいボタンを押す
  await userEvent.click(getByTestId('button-power-eq').querySelector('input'))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-power-eq').querySelector('input')).toBeChecked()

  expect(queryByTestId('table-row-4-37')).toBeNull() // フローレンス・ナイチンゲール (0)
  expect(queryByTestId('table-row-G-2')).toBeNull() // 卑弥呼 (500)
  expect(queryByTestId('table-row-1-18')).toBeNull() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)

  // 条件すべてをリセットするボタンを押す
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-type-all').querySelector('input')).toBeChecked()
  // パワーに関するフォームは無効化されている
  expect(getByTestId('slider-power')).not.toBeEnabled()
  expect(
    getByTestId('button-power-ge').querySelector('input')
  ).not.toBeEnabled()
  expect(
    getByTestId('button-power-le').querySelector('input')
  ).not.toBeEnabled()
  expect(
    getByTestId('button-power-eq').querySelector('input')
  ).not.toBeEnabled()

  expect(getByTestId('table-row-4-37')).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByTestId('table-row-G-2')).toBeVisible() // 卑弥呼 (500)
  expect(getByTestId('table-row-1-18')).toBeVisible() // 源頼朝 (5000)
  expect(getByTestId('table-row-2-8')).toBeVisible() // 豊臣秀吉 (10000)
})

test('レベルによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // レベルアコーディオンアイテムを開く
  const buttonLevel = getByRole('button', {
    name: '➕ レベル ― 0以上',
    expanded: false,
  })
  expect(buttonLevel).toBeVisible()
  await userEvent.click(buttonLevel)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ レベル',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態では値は0で以上ボタンが選択されている
  let sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('0')
  let buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByTestId('table-row-2-10')).toBeVisible() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(getByTestId('table-row-2-12')).toBeVisible() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 0以下
  let buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  await userEvent.click(buttonLevelLE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 0に等しい
  let buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()
  await userEvent.click(buttonLevelEQ)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 5以上
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('0')
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(sliderLevel, { target: { value: '5' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('5')
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).not.toBeChecked()
  await userEvent.click(buttonLevelGE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(getByTestId('table-row-2-12')).toBeVisible() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 5以下
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  await userEvent.click(buttonLevelLE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByTestId('table-row-2-10')).toBeVisible() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 5に等しい
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()
  await userEvent.click(buttonLevelEQ)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 10以上
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('5')
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(sliderLevel, { target: { value: '10' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('10')
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).not.toBeChecked()
  await userEvent.click(buttonLevelGE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 10以下
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  await userEvent.click(buttonLevelLE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByTestId('table-row-2-10')).toBeVisible() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(getByTestId('table-row-2-12')).toBeVisible() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 10に等しい
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()
  await userEvent.click(buttonLevelEQ)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (レベル17)

  // 17以上
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('10')
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(sliderLevel, { target: { value: '17' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('17')
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).not.toBeChecked()
  await userEvent.click(buttonLevelGE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 17以下
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  await userEvent.click(buttonLevelLE)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelLE = getByTestId('button-level-le').querySelector('input')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByTestId('table-row-2-10')).toBeVisible() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(getByTestId('table-row-2-12')).toBeVisible() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 17に等しい
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()
  await userEvent.click(buttonLevelEQ)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLevelEQ = getByTestId('button-level-eq').querySelector('input')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).toBeChecked()

  expect(queryByTestId('table-row-3-77')).toBeNull() // 遁甲盤 (レベル0)
  expect(queryByTestId('table-row-2-10')).toBeNull() // 栄西 (レベル1)
  expect(queryByTestId('table-row-2-14')).toBeNull() // 北条時政 (レベル5)
  expect(queryByTestId('table-row-2-12')).toBeNull() // 足利義昭 (レベル9)
  expect(queryByTestId('table-row-3-63')).toBeNull() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 条件すべてをリセットするボタンを押す
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('17')
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  sliderLevel = getByTestId('slider-level')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('0')
  buttonLevelGE = getByTestId('button-level-ge').querySelector('input')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()

  expect(getByTestId('table-row-3-77')).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByTestId('table-row-2-10')).toBeVisible() // 栄西 (レベル1)
  expect(getByTestId('table-row-2-14')).toBeVisible() // 北条時政 (レベル5)
  expect(getByTestId('table-row-2-12')).toBeVisible() // 足利義昭 (レベル9)
  expect(getByTestId('table-row-3-63')).toBeVisible() // アイオン (レベル10)
  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (レベル17)
})

test('特性によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 特性アコーディオンアイテムを開く
  const buttonTrait = getByRole('button', {
    name: '➕ 特性 ― 指定なし',
    expanded: false,
  })
  expect(buttonTrait).toBeVisible()
  await userEvent.click(buttonTrait)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 特性',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態では指定なしボタンが選択されている
  let buttonTraitUnspecified = getByTestId(
    'button-trait-unspecified'
  ).querySelector('input')
  expect(buttonTraitUnspecified).toBeVisible()
  expect(buttonTraitUnspecified).toBeChecked()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByTestId('table-row-1-23')).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByTestId('table-row-1-39')).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByTestId('table-row-3-21')).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByTestId('table-row-3-44')).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByTestId('table-row-3-43')).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByTestId('table-row-B-9')).toBeVisible() // モナ・リザ (美術ハイケイ)
  expect(getByTestId('table-row-1-51')).toBeVisible() // 冨嶽三十六景 (美術ハイケイ)
  expect(getByTestId('table-row-3-57')).toBeVisible() // 風神雷神図 (美術ハイケイ)
  expect(getByTestId('table-row-2-51')).toBeVisible() // リヴァイアサン (思想ハイケイ)
  expect(getByTestId('table-row-4-44')).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(getByTestId('table-row-G-3')).toBeVisible() // アテルイ (テキストに剣術を含むイジン)
  expect(getByTestId('table-row-1-56')).toBeVisible() // リバイバル (テキストに美術を含むマホウ)
  expect(getByTestId('table-row-B-11')).toBeVisible() // マザーグース (テキストに音楽を含むハイケイ)
  expect(getByTestId('table-row-2-55')).toBeVisible() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(getByTestId('table-row-P-5')).toBeVisible() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(getByTestId('table-row-3-76')).toBeVisible() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 剣術ボタンを押す
  let buttonTraitSwordplay = getByRole('radio', { name: '剣術' })
  expect(buttonTraitSwordplay).toBeVisible()
  expect(buttonTraitSwordplay).not.toBeChecked()
  await userEvent.click(buttonTraitSwordplay)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitSwordplay = getByRole('radio', { name: '剣術' })
  expect(buttonTraitSwordplay).toBeVisible()
  expect(buttonTraitSwordplay).toBeChecked()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康 (剣術イジン)
  expect(queryByTestId('table-row-1-23')).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByTestId('table-row-1-39')).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByTestId('table-row-3-21')).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByTestId('table-row-3-44')).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByTestId('table-row-3-43')).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByTestId('table-row-B-9')).toBeNull() // モナ・リザ (美術ハイケイ)
  expect(queryByTestId('table-row-1-51')).toBeNull() // 冨嶽三十六景 (美術ハイケイ)
  expect(queryByTestId('table-row-3-57')).toBeNull() // 風神雷神図 (美術ハイケイ)
  expect(queryByTestId('table-row-2-51')).toBeNull() // リヴァイアサン (思想ハイケイ)
  expect(queryByTestId('table-row-4-44')).toBeNull() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(queryByTestId('table-row-P-5')).toBeNull() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 美術ボタンを押す
  let buttonTraitArt = getByRole('radio', { name: '美術' })
  expect(buttonTraitArt).toBeVisible()
  expect(buttonTraitArt).not.toBeChecked()
  await userEvent.click(buttonTraitArt)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitArt = getByRole('radio', { name: '美術' })
  expect(buttonTraitArt).toBeVisible()
  expect(buttonTraitArt).toBeChecked()

  expect(queryByTestId('table-row-1-10')).toBeNull() // 徳川家康 (剣術イジン)
  expect(getByTestId('table-row-1-23')).toBeVisible() // ドナテッロ (美術イジン)
  expect(queryByTestId('table-row-1-39')).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByTestId('table-row-3-21')).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByTestId('table-row-3-44')).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByTestId('table-row-3-43')).toBeNull() // 芹沢鴨 (志願イジン)
  expect(getByTestId('table-row-B-9')).toBeVisible() // モナ・リザ (美術ハイケイ)
  expect(getByTestId('table-row-1-51')).toBeVisible() // 冨嶽三十六景 (美術ハイケイ)
  expect(getByTestId('table-row-3-57')).toBeVisible() // 風神雷神図 (美術ハイケイ)
  expect(queryByTestId('table-row-2-51')).toBeNull() // リヴァイアサン (思想ハイケイ)
  expect(getByTestId('table-row-4-44')).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(getByTestId('table-row-P-5')).toBeVisible() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 音楽ボタンを押す
  let buttonTraitMusic = getByRole('radio', { name: '音楽' })
  expect(buttonTraitMusic).toBeVisible()
  expect(buttonTraitMusic).not.toBeChecked()
  await userEvent.click(buttonTraitMusic)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitMusic = getByRole('radio', { name: '音楽' })
  expect(buttonTraitMusic).toBeVisible()
  expect(buttonTraitMusic).toBeChecked()

  expect(queryByTestId('table-row-1-10')).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByTestId('table-row-1-23')).toBeNull() // ドナテッロ (美術イジン)
  expect(getByTestId('table-row-1-39')).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByTestId('table-row-3-21')).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByTestId('table-row-3-44')).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByTestId('table-row-3-43')).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByTestId('table-row-B-9')).toBeNull() // モナ・リザ (美術ハイケイ)
  expect(queryByTestId('table-row-1-51')).toBeNull() // 冨嶽三十六景 (美術ハイケイ)
  expect(queryByTestId('table-row-3-57')).toBeNull() // 風神雷神図 (美術ハイケイ)
  expect(queryByTestId('table-row-2-51')).toBeNull() // リヴァイアサン (思想ハイケイ)
  expect(queryByTestId('table-row-4-44')).toBeNull() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(queryByTestId('table-row-P-5')).toBeNull() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 思想ボタンを押す
  let buttonTraitThought = getByRole('radio', { name: '思想' })
  expect(buttonTraitThought).toBeVisible()
  expect(buttonTraitThought).not.toBeChecked()
  await userEvent.click(buttonTraitThought)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitThought = getByRole('radio', { name: '思想' })
  expect(buttonTraitThought).toBeVisible()
  expect(buttonTraitThought).toBeChecked()

  expect(queryByTestId('table-row-1-10')).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByTestId('table-row-1-23')).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByTestId('table-row-1-39')).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByTestId('table-row-3-21')).toBeVisible() // 木戸孝允 (思想イジン)
  expect(queryByTestId('table-row-3-44')).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByTestId('table-row-3-43')).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByTestId('table-row-B-9')).toBeNull() // モナ・リザ (美術ハイケイ)
  expect(queryByTestId('table-row-1-51')).toBeNull() // 冨嶽三十六景 (美術ハイケイ)
  expect(queryByTestId('table-row-3-57')).toBeNull() // 風神雷神図 (美術ハイケイ)
  expect(getByTestId('table-row-2-51')).toBeVisible() // リヴァイアサン (思想ハイケイ)
  expect(getByTestId('table-row-4-44')).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(queryByTestId('table-row-P-5')).toBeNull() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 医術ボタンを押す
  let buttonTraitMedicine = getByRole('radio', { name: '医術' })
  expect(buttonTraitMedicine).toBeVisible()
  expect(buttonTraitMedicine).not.toBeChecked()
  await userEvent.click(buttonTraitMedicine)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitMedicine = getByRole('radio', { name: '医術' })
  expect(buttonTraitMedicine).toBeVisible()
  expect(buttonTraitMedicine).toBeChecked()

  expect(queryByTestId('table-row-1-10')).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByTestId('table-row-1-23')).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByTestId('table-row-1-39')).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByTestId('table-row-3-21')).toBeNull() // 木戸孝允 (思想イジン)
  expect(getByTestId('table-row-3-44')).toBeVisible() // 本居宣長 (医術イジン)
  expect(queryByTestId('table-row-3-43')).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByTestId('table-row-B-9')).toBeNull() // モナ・リザ (美術ハイケイ)
  expect(queryByTestId('table-row-1-51')).toBeNull() // 冨嶽三十六景 (美術ハイケイ)
  expect(queryByTestId('table-row-3-57')).toBeNull() // 風神雷神図 (美術ハイケイ)
  expect(queryByTestId('table-row-2-51')).toBeNull() // リヴァイアサン (思想ハイケイ)
  expect(queryByTestId('table-row-4-44')).toBeNull() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(queryByTestId('table-row-P-5')).toBeNull() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 志願ボタンを押す
  let buttonTraitVolunteer = getByRole('radio', { name: '志願' })
  expect(buttonTraitVolunteer).toBeVisible()
  expect(buttonTraitVolunteer).not.toBeChecked()
  await userEvent.click(buttonTraitVolunteer)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitVolunteer = getByRole('radio', { name: '志願' })
  expect(buttonTraitVolunteer).toBeVisible()
  expect(buttonTraitVolunteer).toBeChecked()

  expect(queryByTestId('table-row-1-10')).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByTestId('table-row-1-23')).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByTestId('table-row-1-39')).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByTestId('table-row-3-21')).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByTestId('table-row-3-44')).toBeNull() // 本居宣長 (医術イジン)
  expect(getByTestId('table-row-3-43')).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(queryByTestId('table-row-B-9')).toBeNull() // モナ・リザ (美術ハイケイ)
  expect(queryByTestId('table-row-1-51')).toBeNull() // 冨嶽三十六景 (美術ハイケイ)
  expect(queryByTestId('table-row-3-57')).toBeNull() // 風神雷神図 (美術ハイケイ)
  expect(queryByTestId('table-row-2-51')).toBeNull() // リヴァイアサン (思想ハイケイ)
  expect(queryByTestId('table-row-4-44')).toBeNull() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByTestId('table-row-G-3')).toBeNull() // アテルイ (テキストに剣術を含むイジン)
  expect(queryByTestId('table-row-1-56')).toBeNull() // リバイバル (テキストに美術を含むマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(queryByTestId('table-row-P-5')).toBeNull() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(queryByTestId('table-row-3-76')).toBeNull() // ダンダラ羽織 (テキストに志願を含むマリョク)

  // 条件すべてをリセットするボタンを押す
  buttonTraitUnspecified = getByTestId(
    'button-trait-unspecified'
  ).querySelector('input')
  expect(buttonTraitUnspecified).toBeVisible()
  expect(buttonTraitUnspecified).not.toBeChecked()
  const buttonResetAll = getByRole('button', {
    name: '条件すべてをリセットする',
  })
  expect(buttonResetAll).toBeVisible()
  await userEvent.click(buttonResetAll)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTraitUnspecified = getByTestId(
    'button-trait-unspecified'
  ).querySelector('input')
  expect(buttonTraitUnspecified).toBeVisible()
  expect(buttonTraitUnspecified).toBeChecked()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByTestId('table-row-1-23')).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByTestId('table-row-1-39')).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByTestId('table-row-3-21')).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByTestId('table-row-3-44')).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByTestId('table-row-3-43')).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByTestId('table-row-B-9')).toBeVisible() // モナ・リザ (美術ハイケイ)
  expect(getByTestId('table-row-1-51')).toBeVisible() // 冨嶽三十六景 (美術ハイケイ)
  expect(getByTestId('table-row-3-57')).toBeVisible() // 風神雷神図 (美術ハイケイ)
  expect(getByTestId('table-row-2-51')).toBeVisible() // リヴァイアサン (思想ハイケイ)
  expect(getByTestId('table-row-4-44')).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(getByTestId('table-row-G-3')).toBeVisible() // アテルイ (テキストに剣術を含むイジン)
  expect(getByTestId('table-row-1-56')).toBeVisible() // リバイバル (テキストに美術を含むマホウ)
  expect(getByTestId('table-row-B-11')).toBeVisible() // マザーグース (テキストに音楽を含むハイケイ)
  expect(getByTestId('table-row-2-55')).toBeVisible() // 凱旋門 (テキストに思想を含むハイケイ)
  expect(getByTestId('table-row-P-5')).toBeVisible() // 渡辺崋山 (テキストに医術を含む【美術】イジン)
  expect(getByTestId('table-row-3-76')).toBeVisible() // ダンダラ羽織 (テキストに志願を含むマリョク)
})

test('能力語によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 能力語アコーディオンアイテムを開く
  const buttonTrait = getByRole('button', {
    name: '➕ 能力語 ― 指定なし',
    expanded: false,
  })
  expect(buttonTrait).toBeVisible()
  await userEvent.click(buttonTrait)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 能力語',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態では指定なしボタンが選択されている
  let buttonTermUnspecified = getByTestId(
    'button-term-unspecified'
  ).querySelector('input')
  expect(buttonTermUnspecified).toBeVisible()
  expect(buttonTermUnspecified).toBeChecked()

  expect(getByTestId('table-row-2-22')).toBeVisible() // 日蓮 (航海持ちハイケイ)
  expect(getByTestId('table-row-2-39')).toBeVisible() // 陳寿 (執筆持ちハイケイ)
  expect(getByTestId('table-row-3-56')).toBeVisible() // 志士の藩校 (執筆持ちハイケイ)
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-49')).toBeVisible() // 籠城戦 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-20')).toBeVisible() // 洪秀全 (徴募持ちハイケイ)
  expect(getByTestId('table-row-4-61')).toBeVisible() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(getByTestId('table-row-4-62')).toBeVisible() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(getByTestId('table-row-4-63')).toBeVisible() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(getByTestId('table-row-4-64')).toBeVisible() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(getByTestId('table-row-4-65')).toBeVisible() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(getByTestId('table-row-B-11')).toBeVisible() // フリート (テキストに航海を持つマホウ)
  expect(getByTestId('table-row-1-68')).toBeVisible() // 万葉集 (テキストに執筆を持つマリョク)
  expect(getByTestId('table-row-3-4')).toBeVisible() // 吉田松陰 (テキストに決起を持つイジン)
  expect(getByTestId('table-row-2-55')).toBeVisible() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(getByTestId('table-row-4-8')).toBeVisible() // アルキメデス (テキストに魔導を持つイジン)

  // 航海ボタンを押す
  let buttonTermSailing = getByRole('radio', { name: '航海' })
  expect(buttonTermSailing).toBeVisible()
  expect(buttonTermSailing).not.toBeChecked()
  await userEvent.click(buttonTermSailing)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermSailing = getByRole('radio', { name: '航海' })
  expect(buttonTermSailing).toBeVisible()
  expect(buttonTermSailing).toBeChecked()

  expect(getByTestId('table-row-2-22')).toBeVisible() // 日蓮 (航海持ちハイケイ)
  expect(queryByTestId('table-row-2-39')).toBeNull() // 陳寿 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-3-56')).toBeNull() // 志士の藩校 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-2-9')).toBeNull() // 石田三成 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-49')).toBeNull() // 籠城戦 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-20')).toBeNull() // 洪秀全 (徴募持ちハイケイ)
  expect(queryByTestId('table-row-4-61')).toBeNull() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(queryByTestId('table-row-4-62')).toBeNull() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(queryByTestId('table-row-4-63')).toBeNull() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(queryByTestId('table-row-4-64')).toBeNull() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(queryByTestId('table-row-4-65')).toBeNull() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByTestId('table-row-1-68')).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
  expect(queryByTestId('table-row-3-4')).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(queryByTestId('table-row-4-8')).toBeNull() // アルキメデス (テキストに魔導を持つイジン)

  // 執筆ボタンを押す
  let buttonTermWriting = getByRole('radio', { name: '執筆' })
  expect(buttonTermWriting).toBeVisible()
  expect(buttonTermWriting).not.toBeChecked()
  await userEvent.click(buttonTermWriting)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermWriting = getByRole('radio', { name: '執筆' })
  expect(buttonTermWriting).toBeVisible()
  expect(buttonTermWriting).toBeChecked()

  expect(queryByTestId('table-row-2-22')).toBeNull() // 日蓮 (航海持ちハイケイ)
  expect(getByTestId('table-row-2-39')).toBeVisible() // 陳寿 (執筆持ちハイケイ)
  expect(getByTestId('table-row-3-56')).toBeVisible() // 志士の藩校 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-2-9')).toBeNull() // 石田三成 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-49')).toBeNull() // 籠城戦 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-20')).toBeNull() // 洪秀全 (徴募持ちハイケイ)
  expect(queryByTestId('table-row-4-61')).toBeNull() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(queryByTestId('table-row-4-62')).toBeNull() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(queryByTestId('table-row-4-63')).toBeNull() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(queryByTestId('table-row-4-64')).toBeNull() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(queryByTestId('table-row-4-65')).toBeNull() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByTestId('table-row-1-68')).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
  expect(queryByTestId('table-row-3-4')).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(queryByTestId('table-row-4-8')).toBeNull() // アルキメデス (テキストに魔導を持つイジン)

  // 決起ボタンを押す
  let buttonTermRising = getByRole('radio', { name: '決起' })
  expect(buttonTermRising).toBeVisible()
  expect(buttonTermRising).not.toBeChecked()
  await userEvent.click(buttonTermRising)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermRising = getByRole('radio', { name: '決起' })
  expect(buttonTermRising).toBeVisible()
  expect(buttonTermRising).toBeChecked()

  expect(queryByTestId('table-row-2-22')).toBeNull() // 日蓮 (航海持ちハイケイ)
  expect(queryByTestId('table-row-2-39')).toBeNull() // 陳寿 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-3-56')).toBeNull() // 志士の藩校 (執筆持ちハイケイ)
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-49')).toBeVisible() // 籠城戦 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-20')).toBeNull() // 洪秀全 (徴募持ちハイケイ)
  expect(queryByTestId('table-row-4-61')).toBeNull() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(queryByTestId('table-row-4-62')).toBeNull() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(queryByTestId('table-row-4-63')).toBeNull() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(queryByTestId('table-row-4-64')).toBeNull() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(queryByTestId('table-row-4-65')).toBeNull() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByTestId('table-row-1-68')).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
  expect(queryByTestId('table-row-3-4')).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(queryByTestId('table-row-4-8')).toBeNull() // アルキメデス (テキストに魔導を持つイジン)

  // 徴募ボタンを押す
  let buttonTermRecruitment = getByRole('radio', { name: '徴募' })
  expect(buttonTermRecruitment).toBeVisible()
  expect(buttonTermRecruitment).not.toBeChecked()
  await userEvent.click(buttonTermRecruitment)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermRecruitment = getByRole('radio', { name: '徴募' })
  expect(buttonTermRecruitment).toBeVisible()
  expect(buttonTermRecruitment).toBeChecked()

  expect(queryByTestId('table-row-2-22')).toBeNull() // 日蓮 (航海持ちハイケイ)
  expect(queryByTestId('table-row-2-39')).toBeNull() // 陳寿 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-3-56')).toBeNull() // 志士の藩校 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-2-9')).toBeNull() // 石田三成 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-49')).toBeNull() // 籠城戦 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-20')).toBeVisible() // 洪秀全 (徴募持ちハイケイ)
  expect(queryByTestId('table-row-4-61')).toBeNull() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(queryByTestId('table-row-4-62')).toBeNull() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(queryByTestId('table-row-4-63')).toBeNull() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(queryByTestId('table-row-4-64')).toBeNull() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(queryByTestId('table-row-4-65')).toBeNull() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByTestId('table-row-1-68')).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
  expect(queryByTestId('table-row-3-4')).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(queryByTestId('table-row-4-8')).toBeNull() // アルキメデス (テキストに魔導を持つイジン)

  // 魔導ボタンを押す
  let buttonTermChromagic = getByRole('radio', { name: '魔導' })
  expect(buttonTermChromagic).toBeVisible()
  expect(buttonTermChromagic).not.toBeChecked()
  await userEvent.click(buttonTermChromagic)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermChromagic = getByRole('radio', { name: '魔導' })
  expect(buttonTermChromagic).toBeVisible()
  expect(buttonTermChromagic).toBeChecked()

  expect(queryByTestId('table-row-2-22')).toBeNull() // 日蓮 (航海持ちハイケイ)
  expect(queryByTestId('table-row-2-39')).toBeNull() // 陳寿 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-3-56')).toBeNull() // 志士の藩校 (執筆持ちハイケイ)
  expect(queryByTestId('table-row-2-9')).toBeNull() // 石田三成 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-49')).toBeNull() // 籠城戦 (決起持ちハイケイ)
  expect(queryByTestId('table-row-2-20')).toBeNull() // 洪秀全 (徴募持ちハイケイ)
  expect(getByTestId('table-row-4-61')).toBeVisible() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(getByTestId('table-row-4-62')).toBeVisible() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(getByTestId('table-row-4-63')).toBeVisible() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(getByTestId('table-row-4-64')).toBeVisible() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(getByTestId('table-row-4-65')).toBeVisible() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(queryByTestId('table-row-B-11')).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByTestId('table-row-1-68')).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
  expect(queryByTestId('table-row-3-4')).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
  expect(queryByTestId('table-row-2-55')).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(queryByTestId('table-row-4-8')).toBeNull() // アルキメデス (テキストに魔導を持つイジン)

  // 条件すべてをリセットするボタンを押す
  buttonTermUnspecified = getByTestId('button-term-unspecified').querySelector(
    'input'
  )
  expect(buttonTermUnspecified).toBeVisible()
  expect(buttonTermUnspecified).not.toBeChecked()
  const buttonResetAll = getByRole('button', {
    name: '条件すべてをリセットする',
  })
  expect(buttonResetAll).toBeVisible()
  await userEvent.click(buttonResetAll)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTermUnspecified = getByTestId('button-term-unspecified').querySelector(
    'input'
  )
  expect(buttonTermUnspecified).toBeVisible()
  expect(buttonTermUnspecified).toBeChecked()

  expect(getByTestId('table-row-2-22')).toBeVisible() // 日蓮 (航海持ちハイケイ)
  expect(getByTestId('table-row-2-39')).toBeVisible() // 陳寿 (執筆持ちハイケイ)
  expect(getByTestId('table-row-3-56')).toBeVisible() // 志士の藩校 (執筆持ちハイケイ)
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-49')).toBeVisible() // 籠城戦 (決起持ちハイケイ)
  expect(getByTestId('table-row-2-20')).toBeVisible() // 洪秀全 (徴募持ちハイケイ)
  expect(getByTestId('table-row-4-61')).toBeVisible() // ソリッドビジョンα (赤魔導持ちマホウ)
  expect(getByTestId('table-row-4-62')).toBeVisible() // ソリッドビジョンδ (青魔導持ちマホウ)
  expect(getByTestId('table-row-4-63')).toBeVisible() // ソリッドビジョンΩ (緑魔導持ちマホウ)
  expect(getByTestId('table-row-4-64')).toBeVisible() // ソリッドビジョンβ (黄魔導持ちマホウ)
  expect(getByTestId('table-row-4-65')).toBeVisible() // ソリッドビジョンγ (紫魔導持ちマホウ)
  expect(getByTestId('table-row-B-11')).toBeVisible() // フリート (テキストに航海を持つマホウ)
  expect(getByTestId('table-row-1-68')).toBeVisible() // 万葉集 (テキストに執筆を持つマリョク)
  expect(getByTestId('table-row-3-4')).toBeVisible() // 吉田松陰 (テキストに決起を持つイジン)
  expect(getByTestId('table-row-2-55')).toBeVisible() // 凱旋門 (テキストに徴募を持つハイケイ)
  expect(getByTestId('table-row-4-8')).toBeVisible() // アルキメデス (テキストに魔導を持つイジン)
})

test('遺業能力によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 遺業能力アコーディオンアイテムを開く
  const buttonLegacy = getByRole('button', {
    name: '➕ 遺業能力 ― 指定なし',
    expanded: false,
  })
  expect(buttonLegacy).toBeVisible()
  await userEvent.click(buttonLegacy)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '➖ 遺業能力',
      expanded: true,
    })
  ).toBeVisible()

  // 初期状態では指定なしボタンが選択されている
  let buttonLegacyUnspecified = getByTestId(
    'button-legacy-unspecified'
  ).querySelector('input')
  expect(buttonLegacyUnspecified).toBeVisible()
  expect(buttonLegacyUnspecified).toBeChecked()

  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByTestId('table-row-4-58')).toBeVisible() // ルーナ (冥府発動)
  expect(getByTestId('table-row-4-78')).toBeVisible() // ホプロン (復元)
  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね (反魂)
  expect(getByTestId('table-row-4-18')).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByTestId('table-row-4-47')).toBeVisible() // マザーグース (喪神)
  expect(getByTestId('table-row-4-11')).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByTestId('table-row-4-43')).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByTestId('table-row-4-48')).toBeVisible() // 遠征軍 (山札の上か下に戻す)
  expect(getByTestId('table-row-3-59')).toBeVisible() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 魔力化ボタンを押す
  let buttonLegacyMaryokuka = getByRole('radio', { name: '魔力化' })
  expect(buttonLegacyMaryokuka).toBeVisible()
  expect(buttonLegacyMaryokuka).not.toBeChecked()
  await userEvent.click(buttonLegacyMaryokuka)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyMaryokuka = getByRole('radio', { name: '魔力化' })
  expect(buttonLegacyMaryokuka).toBeVisible()
  expect(buttonLegacyMaryokuka).toBeChecked()

  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 冥府発動ボタンを押す
  let buttonLegacyNether = getByRole('radio', { name: '冥府発動' })
  expect(buttonLegacyNether).toBeVisible()
  expect(buttonLegacyNether).not.toBeChecked()
  await userEvent.click(buttonLegacyNether)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyNether = getByRole('radio', { name: '冥府発動' })
  expect(buttonLegacyNether).toBeVisible()
  expect(buttonLegacyNether).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(getByTestId('table-row-4-58')).toBeVisible() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 復元ボタンを押す
  let buttonLegacyRestoration = getByRole('radio', { name: '復元' })
  expect(buttonLegacyRestoration).toBeVisible()
  expect(buttonLegacyRestoration).not.toBeChecked()
  await userEvent.click(buttonLegacyRestoration)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyRestoration = getByRole('radio', { name: '復元' })
  expect(buttonLegacyRestoration).toBeVisible()
  expect(buttonLegacyRestoration).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(getByTestId('table-row-4-78')).toBeVisible() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 反魂ボタンを押す
  let buttonLegacyResurrection = getByRole('radio', { name: '反魂' })
  expect(buttonLegacyResurrection).toBeVisible()
  expect(buttonLegacyResurrection).not.toBeChecked()
  await userEvent.click(buttonLegacyResurrection)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyResurrection = getByRole('radio', { name: '反魂' })
  expect(buttonLegacyResurrection).toBeVisible()
  expect(buttonLegacyResurrection).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 木霊ボタンを押す
  let buttonLegacyEcho = getByRole('radio', { name: '木霊' })
  expect(buttonLegacyEcho).toBeVisible()
  expect(buttonLegacyEcho).not.toBeChecked()
  await userEvent.click(buttonLegacyEcho)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyEcho = getByRole('radio', { name: '木霊' })
  expect(buttonLegacyEcho).toBeVisible()
  expect(buttonLegacyEcho).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(getByTestId('table-row-4-18')).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 喪神ボタンを押す
  let buttonLegacyFaint = getByRole('radio', { name: '喪神' })
  expect(buttonLegacyFaint).toBeVisible()
  expect(buttonLegacyFaint).not.toBeChecked()
  await userEvent.click(buttonLegacyFaint)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyFaint = getByRole('radio', { name: '喪神' })
  expect(buttonLegacyFaint).toBeVisible()
  expect(buttonLegacyFaint).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(getByTestId('table-row-4-47')).toBeVisible() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 1ドローするボタンを押す
  let buttonLegacyDraw1 = getByRole('radio', { name: '1ドローする' })
  expect(buttonLegacyDraw1).toBeVisible()
  expect(buttonLegacyDraw1).not.toBeChecked()
  await userEvent.click(buttonLegacyDraw1)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyDraw1 = getByRole('radio', { name: '1ドローする' })
  expect(buttonLegacyDraw1).toBeVisible()
  expect(buttonLegacyDraw1).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(getByTestId('table-row-4-11')).toBeVisible() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 手札に戻すボタンを押す
  let buttonBackToHand = getByRole('radio', { name: '手札に戻す' })
  expect(buttonBackToHand).toBeVisible()
  expect(buttonBackToHand).not.toBeChecked()
  await userEvent.click(buttonBackToHand)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonBackToHand = getByRole('radio', { name: '手札に戻す' })
  expect(buttonBackToHand).toBeVisible()
  expect(buttonBackToHand).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(getByTestId('table-row-4-43')).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(queryByTestId('table-row-4-48')).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 山札の上か下に戻すボタンを押す
  let buttonBackToStock = getByRole('radio', { name: '山札の上か下に戻す' })
  expect(buttonBackToStock).toBeVisible()
  expect(buttonBackToStock).not.toBeChecked()
  await userEvent.click(buttonBackToStock)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonBackToStock = getByRole('radio', { name: '山札の上か下に戻す' })
  expect(buttonBackToStock).toBeVisible()
  expect(buttonBackToStock).toBeChecked()

  expect(queryByTestId('table-row-4-46')).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByTestId('table-row-4-58')).toBeNull() // ルーナ (冥府発動)
  expect(queryByTestId('table-row-4-78')).toBeNull() // ホプロン (復元)
  expect(queryByTestId('table-row-4-15')).toBeNull() // ねね (反魂)
  expect(queryByTestId('table-row-4-18')).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByTestId('table-row-4-47')).toBeNull() // マザーグース (喪神)
  expect(queryByTestId('table-row-4-11')).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByTestId('table-row-4-43')).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(getByTestId('table-row-4-48')).toBeVisible() // 遠征軍 (山札の上か下に戻す)
  expect(queryByTestId('table-row-3-59')).toBeNull() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)

  // 条件すべてをリセットするボタンを押す
  buttonLegacyUnspecified = getByTestId(
    'button-legacy-unspecified'
  ).querySelector('input')
  expect(buttonLegacyUnspecified).toBeVisible()
  expect(buttonLegacyUnspecified).not.toBeChecked()
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonLegacyUnspecified = getByTestId(
    'button-legacy-unspecified'
  ).querySelector('input')
  expect(buttonLegacyUnspecified).toBeVisible()
  expect(buttonLegacyUnspecified).toBeChecked()

  expect(getByTestId('table-row-4-46')).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByTestId('table-row-4-58')).toBeVisible() // ルーナ (冥府発動)
  expect(getByTestId('table-row-4-78')).toBeVisible() // ホプロン (復元)
  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね (反魂)
  expect(getByTestId('table-row-4-18')).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByTestId('table-row-4-47')).toBeVisible() // マザーグース (喪神)
  expect(getByTestId('table-row-4-11')).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByTestId('table-row-4-43')).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByTestId('table-row-4-48')).toBeVisible() // 遠征軍 (山札の上か下に戻す)
  expect(getByTestId('table-row-3-59')).toBeVisible() // 森閑たる離宮 (ルールテキストに冥府発動を持つハイケイ)
})

test('色と種類とレベルによる複合フィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { rerender, getByRole, getByTestId, queryByTestId } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  // 条件で絞り込むアコーディオンを開く
  await userEvent.click(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: false,
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('button', {
      name: '条件で絞り込む',
      expanded: true,
    })
  ).toBeVisible()

  // 色アコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 色',
      expanded: true,
    })
  ).toBeVisible()

  // 種類とパワーアコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 種類とパワー',
      expanded: true,
    })
  ).toBeVisible()

  // レベルアコーディオンアイテムを開く
  await userEvent.click(
    getByRole('button', { name: '➕ レベル ― 0以上', expanded: false })
  )
  expect(
    getByRole('button', { name: '➖ レベル', expanded: true })
  ).toBeVisible()

  // 初期状態のチェック
  expect(getByTestId('button-color-all').querySelector('input')).toBeChecked()
  expect(getByTestId('button-type-all').querySelector('input')).toBeChecked()
  expect(getByTestId('slider-level')).toHaveValue('0')
  expect(getByTestId('button-level-ge').querySelector('input')).toBeChecked()

  // レベル5以下の赤のイジンを探す
  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成
  expect(getByTestId('table-row-2-13')).toBeVisible() // 毛利輝元 (レベル6)
  expect(getByTestId('table-row-3-52')).toBeVisible() // 天下分け目の主戦場	(ハイケイ)
  expect(getByTestId('table-row-R-11')).toBeVisible() // ロイヤリティ (マホウ)
  expect(getByTestId('table-row-1-61')).toBeVisible() // レッドオーブ (マリョク)
  expect(getByTestId('table-row-1-75')).toBeVisible() // 衛青 (赤でない)

  await userEvent.click(getByRole('radio', { name: '赤' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  await userEvent.click(getByRole('radio', { name: 'イジン' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  // userEvent は slider に未対応とのこと。
  // See: https://github.com/testing-library/user-event/issues/871
  fireEvent.change(getByTestId('slider-level'), { target: { value: '5' } })
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  await userEvent.click(getByTestId('button-level-le').querySelector('input'))
  expect(getByRole('radio', { name: '赤' })).toBeChecked()
  expect(getByRole('radio', { name: 'イジン' })).toBeChecked()
  expect(getByTestId('slider-level')).toHaveValue('5')
  expect(getByTestId('button-level-le').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成
  expect(queryByTestId('table-row-2-13')).toBeNull() // 毛利輝元 (レベル6)
  expect(queryByTestId('table-row-3-52')).toBeNull() // 天下分け目の主戦場	(ハイケイ)
  expect(queryByTestId('table-row-R-11')).toBeNull() // ロイヤリティ (マホウ)
  expect(queryByTestId('table-row-1-61')).toBeNull() // レッドオーブ (マリョク)
  expect(queryByTestId('table-row-1-75')).toBeNull() // 衛青 (赤でない)

  // 条件すべてをリセットするボタンを押す
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByTestId('button-color-all').querySelector('input')).toBeChecked()
  expect(getByTestId('button-type-all').querySelector('input')).toBeChecked()
  expect(getByTestId('slider-level')).toHaveValue('0')
  expect(getByTestId('button-level-ge').querySelector('input')).toBeChecked()

  expect(getByTestId('table-row-4-15')).toBeVisible() // ねね
  expect(getByTestId('table-row-2-9')).toBeVisible() // 石田三成
  expect(getByTestId('table-row-2-13')).toBeVisible() // 毛利輝元 (レベル6)
  expect(getByTestId('table-row-3-52')).toBeVisible() // 天下分け目の主戦場	(ハイケイ)
  expect(getByTestId('table-row-R-11')).toBeVisible() // ロイヤリティ (マホウ)
  expect(getByTestId('table-row-1-61')).toBeVisible() // レッドオーブ (マリョク)
  expect(getByTestId('table-row-1-75')).toBeVisible() // 衛青 (赤でない)
})

test('キーワードによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getByTestId,
    queryByTestId,
  } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  let textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')

  expect(getByTestId('table-row-2-7')).toBeVisible() // 日野富子
  expect(getByTestId('table-row-3-79')).toBeVisible() // ストーンマスク
  expect(getByTestId('table-row-1-55')).toBeVisible() // ストーム
  expect(getByTestId('table-row-2-26')).toBeVisible() // ハリエット・ビーチャー・ストウ

  await userEvent.type(textboxSearch, 'すとーん')
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('すとーん')

  // ひらがなで検索するとカード名の読み仮名でヒットする
  expect(queryByTestId('table-row-2-7')).toBeNull() // 日野富子
  expect(getByTestId('table-row-3-79')).toBeVisible() // ストーンマスク
  expect(queryByTestId('table-row-1-55')).toBeNull() // ストーム
  expect(queryByTestId('table-row-2-26')).toBeNull() // ハリエット・ビーチャー・ストウ

  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')
  await userEvent.type(textboxSearch, 'ストーン')
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('ストーン')

  // ひらがな以外で検索するとカード名またはルールテキストで文字通りにヒットする
  expect(getByTestId('table-row-2-7')).toBeVisible() // 日野富子
  expect(getByTestId('table-row-3-79')).toBeVisible() // ストーンマスク
  expect(queryByTestId('table-row-1-55')).toBeNull() // ストーム
  expect(queryByTestId('table-row-2-26')).toBeNull() // ハリエット・ビーチャー・ストウ

  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')
  await userEvent.type(textboxSearch, 'ストー')
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('ストー')

  // 部分文字列でも同様
  expect(getByTestId('table-row-2-7')).toBeVisible() // 日野富子
  expect(getByTestId('table-row-3-79')).toBeVisible() // ストーンマスク
  expect(getByTestId('table-row-1-55')).toBeVisible() // ストーム
  expect(queryByTestId('table-row-2-26')).toBeNull() // ハリエット・ビーチャー・ストウ

  // クリアボタンを押す
  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')

  expect(getByTestId('table-row-2-7')).toBeVisible() // 日野富子
  expect(getByTestId('table-row-3-79')).toBeVisible() // ストーンマスク
  expect(getByTestId('table-row-1-55')).toBeVisible() // ストーム
  expect(getByTestId('table-row-2-26')).toBeVisible() // ハリエット・ビーチャー・ストウ
})

test('複合キーワードによるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getByTestId,
    queryByTestId,
  } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  let textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')

  expect(getByTestId('table-row-2-46')).toBeVisible() // 孫夫人
  expect(getByTestId('table-row-2-54')).toBeVisible() // 蒸気機関車
  expect(getByTestId('table-row-3-76')).toBeVisible() // ダンダラ羽織
  expect(getByTestId('table-row-R-2')).toBeVisible() // 源義経
  expect(getByTestId('table-row-3-62')).toBeVisible() // パイロオーラ

  await userEvent.type(textboxSearch, '即応 装備')
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('即応 装備')

  // 複合キーワードはAND検索になる
  expect(getByTestId('table-row-2-46')).toBeVisible() // 孫夫人
  expect(getByTestId('table-row-2-54')).toBeVisible() // 蒸気機関車
  expect(getByTestId('table-row-3-76')).toBeVisible() // ダンダラ羽織
  expect(queryByTestId('table-row-R-2')).toBeNull() // 源義経
  expect(queryByTestId('table-row-3-62')).toBeNull() // パイロオーラ

  // クリアボタンを押す
  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')

  expect(getByTestId('table-row-2-46')).toBeVisible() // 孫夫人
  expect(getByTestId('table-row-2-54')).toBeVisible() // 蒸気機関車
  expect(getByTestId('table-row-3-76')).toBeVisible() // ダンダラ羽織
  expect(getByTestId('table-row-R-2')).toBeVisible() // 源義経
  expect(getByTestId('table-row-3-62')).toBeVisible() // パイロオーラ
})

test('特性と遺業能力を含めるか否か', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getByTestId,
    queryByTestId,
  } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  expect(getByPlaceholderText('カード名やルールテキストで検索')).toHaveValue('')
  expect(
    getByRole('checkbox', {
      name: '特性と遺業能力も検索する',
    })
  ).toBeChecked()

  expect(getByTestId('table-row-2-37')).toBeVisible() // 姜維
  expect(getByTestId('table-row-Y-1')).toBeVisible() // 諸葛亮
  expect(getByTestId('table-row-Y-9')).toBeVisible() // 英傑集う大河

  await userEvent.type(
    getByPlaceholderText('カード名やルールテキストで検索'),
    '反魂'
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByPlaceholderText('カード名やルールテキストで検索')).toHaveValue(
    '反魂'
  )

  expect(getByTestId('table-row-2-37')).toBeVisible() // 姜維
  expect(getByTestId('table-row-Y-1')).toBeVisible() // 諸葛亮
  expect(queryByTestId('table-row-Y-9')).toBeNull() // 英傑集う大河

  await userEvent.click(
    getByRole('checkbox', {
      name: '特性と遺業能力も検索する',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(
    getByRole('checkbox', {
      name: '特性と遺業能力も検索する',
    })
  ).not.toBeChecked()

  expect(getByTestId('table-row-2-37')).toBeVisible() // 姜維
  expect(queryByTestId('table-row-Y-1')).toBeNull() // 諸葛亮
  expect(queryByTestId('table-row-Y-9')).toBeNull() // 英傑集う大河

  // クリアボタンを押す
  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByPlaceholderText('カード名やルールテキストで検索')).toHaveValue('')

  expect(getByTestId('table-row-2-37')).toBeVisible() // 姜維
  expect(getByTestId('table-row-Y-1')).toBeVisible() // 諸葛亮
  expect(getByTestId('table-row-Y-9')).toBeVisible() // 英傑集う大河
})

test('キーワードと色と種類の複合によるフィルタ', async () => {
  const deckMain = new Map()
  const deckSide = new Map()
  const decrementMain = vi.fn()
  const incrementMain = vi.fn()
  const decrementSide = vi.fn()
  const incrementSide = vi.fn()
  const dispatchDeck = {
    decrementMain,
    incrementMain,
    decrementSide,
    incrementSide,
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getByTestId,
    queryByTestId,
  } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  let textboxSearch = getByPlaceholderText('カード名やルールテキストで検索')
  expect(textboxSearch).toHaveValue('')

  // 色アコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 色',
      expanded: true,
    })
  ).toBeVisible()

  // 種類とパワーアコーディオンアイテムは既に開いている
  expect(
    getByRole('button', {
      name: '➖ 種類とパワー',
      expanded: true,
    })
  ).toBeVisible()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康
  expect(getByTestId('table-row-1-75')).toBeVisible() // 衛青
  expect(getByTestId('table-row-1-45')).toBeVisible() // 行基
  expect(getByTestId('table-row-2-36')).toBeVisible() // 足利義政
  expect(getByTestId('table-row-3-9')).toBeVisible() // 土方歳三
  expect(getByTestId('table-row-2-50')).toBeVisible() // 安宅船
  expect(getByTestId('table-row-2-59')).toBeVisible() // サモン
  expect(getByTestId('table-row-4-67')).toBeVisible() // レッドサークル

  await userEvent.type(
    getByPlaceholderText('カード名やルールテキストで検索'),
    'イジン召喚権'
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  expect(getByPlaceholderText('カード名やルールテキストで検索')).toHaveValue(
    'イジン召喚権'
  )

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康
  expect(getByTestId('table-row-1-75')).toBeVisible() // 衛青
  expect(getByTestId('table-row-1-45')).toBeVisible() // 行基
  expect(getByTestId('table-row-2-36')).toBeVisible() // 足利義政
  expect(getByTestId('table-row-3-9')).toBeVisible() // 土方歳三
  expect(getByTestId('table-row-2-50')).toBeVisible() // 安宅船
  expect(getByTestId('table-row-2-59')).toBeVisible() // サモン
  expect(queryByTestId('table-row-4-67')).toBeNull() // レッドサークル

  // 赤ボタンを押す
  let buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).not.toBeChecked()
  await userEvent.click(buttonColorRed)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonColorRed = getByRole('radio', { name: '赤' })
  expect(buttonColorRed).toBeVisible()
  expect(buttonColorRed).toBeChecked()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康
  expect(queryByTestId('table-row-1-75')).toBeNull() // 衛青
  expect(queryByTestId('table-row-1-45')).toBeNull() // 行基
  expect(queryByTestId('table-row-2-36')).toBeNull() // 足利義政
  expect(queryByTestId('table-row-3-9')).toBeNull() // 土方歳三
  expect(getByTestId('table-row-2-50')).toBeVisible() // 安宅船
  expect(getByTestId('table-row-2-59')).toBeVisible() // サモン
  expect(queryByTestId('table-row-4-67')).toBeNull() // レッドサークル

  // イジンボタンを押す
  let buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).not.toBeChecked()
  await userEvent.click(buttonTypeIjin)
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  buttonTypeIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonTypeIjin).toBeVisible()
  expect(buttonTypeIjin).toBeChecked()

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康
  expect(queryByTestId('table-row-1-75')).toBeNull() // 衛青
  expect(queryByTestId('table-row-1-45')).toBeNull() // 行基
  expect(queryByTestId('table-row-2-36')).toBeNull() // 足利義政
  expect(queryByTestId('table-row-3-9')).toBeNull() // 土方歳三
  expect(queryByTestId('table-row-2-50')).toBeNull() // 安宅船
  expect(queryByTestId('table-row-2-59')).toBeNull() // サモン
  expect(queryByTestId('table-row-4-67')).toBeNull() // レッドサークル

  // クリアボタンを押す
  await userEvent.click(getByRole('button', { name: 'クリア' }))
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  // 条件すべてをリセットするボタンを押す
  await userEvent.click(
    getByRole('button', {
      name: '条件すべてをリセットする',
    })
  )
  rerender(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )

  expect(getByTestId('table-row-1-10')).toBeVisible() // 徳川家康
  expect(getByTestId('table-row-1-75')).toBeVisible() // 衛青
  expect(getByTestId('table-row-1-45')).toBeVisible() // 行基
  expect(getByTestId('table-row-2-36')).toBeVisible() // 足利義政
  expect(getByTestId('table-row-3-9')).toBeVisible() // 土方歳三
  expect(getByTestId('table-row-2-50')).toBeVisible() // 安宅船
  expect(getByTestId('table-row-2-59')).toBeVisible() // サモン
  expect(getByTestId('table-row-4-67')).toBeVisible() // レッドサークル
})
