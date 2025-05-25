// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TabPaneCard from '.'

function getSliderInItem(getByRole, itemName) {
  return within(getByRole('listitem', { name: itemName })).getByRole('slider')
}

function getRadioInItem(getByRole, itemName, radioName) {
  return within(getByRole('listitem', { name: itemName })).getByRole('radio', {
    name: radioName,
  })
}

function getColumnMain(getByRole, id) {
  return within(getByRole('row', { name: id })).getAllByRole('cell')[2]
}

function getColumnSide(getByRole, id) {
  return within(getByRole('row', { name: id })).getAllByRole('cell')[3]
}

function defaultRender(deckMain, deckSide) {
  const dispatchDeck = {
    decrementMain: vi.fn(),
    incrementMain: vi.fn(),
    decrementSide: vi.fn(),
    incrementSide: vi.fn(),
  }
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const { getByRole } = render(
    <TabPaneCard
      deckMain={deckMain}
      deckSide={deckSide}
      dispatchDeck={dispatchDeck}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />
  )
  return {
    dispatchDeck,
    zoomIn,
    interruptSimulator,
    getByRole,
  }
}

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
  const { rerender, getByPlaceholderText, getByRole } = render(
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
      name: /エキスパンション/,
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: /レアリティ/,
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: /色/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonColorAll = getRadioInItem(getByRole, '色', 'すべて')
  expect(buttonColorAll).toBeVisible()
  expect(buttonColorAll).toBeChecked()

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
      name: /種類とパワー/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonTypeAll = getRadioInItem(getByRole, '種類とパワー', 'すべて')
  expect(buttonTypeAll).toBeVisible()
  expect(buttonTypeAll).toBeChecked()

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

  const sliderPower = getSliderInItem(getByRole, '種類とパワー')
  expect(sliderPower).toBeVisible()
  expect(sliderPower).not.toBeEnabled()
  const buttonPowerGE = getRadioInItem(getByRole, '種類とパワー', '以上')
  expect(buttonPowerGE).toBeVisible()
  expect(buttonPowerGE).not.toBeEnabled()
  const buttonPowerLE = getRadioInItem(getByRole, '種類とパワー', '以下')
  expect(buttonPowerLE).toBeVisible()
  expect(buttonPowerLE).not.toBeEnabled()
  const buttonPowerEQ = getRadioInItem(getByRole, '種類とパワー', '等しい')
  expect(buttonPowerEQ).toBeVisible()
  expect(buttonPowerEQ).not.toBeEnabled()

  expect(
    getByRole('button', {
      name: /レベル/,
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: /特性/,
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: /能力語/,
      expanded: false,
    })
  ).toBeVisible()

  expect(
    getByRole('button', {
      name: /遺業能力/,
      expanded: false,
    })
  ).toBeVisible()

  // エキスパンションを開く
  await userEvent.click(
    getByRole('button', {
      name: /エキスパンション/,
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
      name: /エキスパンション/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonExpansionAll = getRadioInItem(getByRole, '色', 'すべて')
  expect(buttonExpansionAll).toBeVisible()
  expect(buttonExpansionAll).toBeChecked()

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
      name: /レアリティ/,
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
      name: /レアリティ/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonRarityAll = getRadioInItem(
    getByRole,
    'エキスパンション',
    'すべて'
  )
  expect(buttonRarityAll).toBeVisible()
  expect(buttonRarityAll).toBeChecked()

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
      name: /レベル/,
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
      name: /レベル/,
      expanded: true,
    })
  ).toBeVisible()

  const sliderLevel = getSliderInItem(getByRole, 'レベル')
  expect(sliderLevel).toBeVisible()
  expect(sliderLevel).toHaveValue('0')
  const buttonLevelGE = getRadioInItem(getByRole, 'レベル', '以上')
  expect(buttonLevelGE).toBeVisible()
  expect(buttonLevelGE).toBeChecked()
  const buttonLevelLE = getRadioInItem(getByRole, 'レベル', '以下')
  expect(buttonLevelLE).toBeVisible()
  expect(buttonLevelLE).not.toBeChecked()
  const buttonLevelEQ = getRadioInItem(getByRole, 'レベル', '等しい')
  expect(buttonLevelEQ).toBeVisible()
  expect(buttonLevelEQ).not.toBeChecked()

  // 特性を開く
  await userEvent.click(
    getByRole('button', {
      name: /特性/,
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
      name: /特性/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonTraitUnspecified = getRadioInItem(getByRole, '特性', '指定なし')
  expect(buttonTraitUnspecified).toBeVisible()
  expect(buttonTraitUnspecified).toBeChecked()

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
      name: /能力語/,
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
      name: /能力語/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonTermUnspecified = getRadioInItem(getByRole, '能力語', '指定なし')
  expect(buttonTermUnspecified).toBeVisible()
  expect(buttonTermUnspecified).toBeChecked()

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
      name: /遺業能力/,
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
      name: /遺業能力/,
      expanded: true,
    })
  ).toBeVisible()

  const buttonLegacyUnspecified = getRadioInItem(
    getByRole,
    '遺業能力',
    '指定なし'
  )
  expect(buttonLegacyUnspecified).toBeVisible()
  expect(buttonLegacyUnspecified).toBeChecked()

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

test.each(['R-1', 'R-2'])(
  'メインデッキのカウンターを0から1に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map(), new Map())

    const main = within(getColumnMain(getByRole, id))
    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(0)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    const side = within(getColumnSide(getByRole, id))
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(0)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // メインデッキのプラスボタンを押す
    await userEvent.click(main.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementMain.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementMain.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
    expect(interruptSimulator.mock.lastCall.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'メインデッキのカウンターを1から2に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // メインデッキのプラスボタンを押す
    await userEvent.click(main.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementMain.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementMain.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
    expect(interruptSimulator.mock.lastCall.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'メインデッキのカウンターを1から0に減らす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // メインデッキのマイナスボタンを押す
    await userEvent.click(main.getByRole('button', { name: '-' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.decrementMain.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.decrementMain.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(1) // 呼ばれた
    expect(interruptSimulator.mock.lastCall.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを0から1に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map(), new Map())

    const main = within(getColumnMain(getByRole, id))
    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(0)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    const side = within(getColumnSide(getByRole, id))
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeDisabled() // 無効
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(0)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのプラスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementSide.mock.lastCall[0]).toBe(id)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを1から2に増やす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのプラスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '+' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.incrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.incrementSide.mock.lastCall[0]).toBe(id)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])(
  'サイドデッキのカウンターを1から0に減らす (%s)',
  async (id) => {
    const { dispatchDeck, zoomIn, interruptSimulator, getByRole } =
      defaultRender(new Map([[id, 1]]), new Map([[id, 1]]))
    const main = within(getColumnMain(getByRole, id))
    const side = within(getColumnSide(getByRole, id))

    expect(main.getByRole('button', { name: '-' })).toBeVisible()
    expect(main.getByRole('button', { name: '-' })).toBeEnabled()
    expect(main.getByRole('spinbutton')).toBeVisible()
    expect(main.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(main.getByRole('spinbutton')).toHaveValue(1)
    expect(main.getByRole('button', { name: '+' })).toBeVisible()
    expect(main.getByRole('button', { name: '+' })).toBeEnabled()
    expect(side.getByRole('button', { name: '-' })).toBeVisible()
    expect(side.getByRole('button', { name: '-' })).toBeEnabled()
    expect(side.getByRole('spinbutton')).toBeVisible()
    expect(side.getByRole('spinbutton')).toHaveAttribute('readonly')
    expect(side.getByRole('spinbutton')).toHaveValue(1)
    expect(side.getByRole('button', { name: '+' })).toBeVisible()
    expect(side.getByRole('button', { name: '+' })).toBeEnabled()

    // サイドデッキのマイナスボタンを押す
    await userEvent.click(side.getByRole('button', { name: '-' }))

    expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
    expect(dispatchDeck.decrementSide.mock.calls.length).toBe(1) // 呼ばれた
    expect(dispatchDeck.decrementSide.mock.lastCall.length).toBe(1)
    expect(dispatchDeck.decrementSide.mock.lastCall[0]).toBe(id)
    expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
    expect(zoomIn.mock.calls.length).toBe(0)
    expect(interruptSimulator.mock.calls.length).toBe(0)
  }
)

test.each(['R-1', 'R-2'])('虫眼鏡ボタンの操作 (%s)', async (id) => {
  const { dispatchDeck, zoomIn, interruptSimulator, getByRole } = defaultRender(
    new Map(),
    new Map()
  )

  expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(0)
  expect(interruptSimulator.mock.calls.length).toBe(0)

  // 虫眼鏡ボタンを押す
  // prettier-ignore
  await userEvent.click(within(getByRole('row', { name: id })).getByRole('button', { name: '🔎' }))
  expect(dispatchDeck.decrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementMain.mock.calls.length).toBe(0)
  expect(dispatchDeck.decrementSide.mock.calls.length).toBe(0)
  expect(dispatchDeck.incrementSide.mock.calls.length).toBe(0)
  expect(zoomIn.mock.calls.length).toBe(1) // 呼ばれた
  expect(zoomIn.mock.lastCall.length).toBe(1)
  expect(zoomIn.mock.lastCall[0]).toBe(id)
  expect(interruptSimulator.mock.calls.length).toBe(0)
})
