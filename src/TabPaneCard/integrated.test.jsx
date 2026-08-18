// SPDX-License-Identifier: MIT

import { afterEach, expect, test, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useDeck from '../hooks/useDeck'
import TabPaneCard from '.'

function getCollapsedButton(getByRole, name) {
  return getByRole('button', {
    name,
    expanded: false,
  })
}

function getExpandedButton(getByRole, name) {
  return getByRole('button', {
    name,
    expanded: true,
  })
}

function getCheckboxInItem(getByRole, itemName, checkboxName) {
  return within(getByRole('listitem', { name: itemName })).getByRole(
    'checkbox',
    {
      name: checkboxName,
    },
  )
}

function getAllCheckboxInItem(getByRole, itemName) {
  return within(getByRole('listitem', { name: itemName })).getAllByRole(
    'checkbox',
  )
}

function getRadioInItem(getByRole, itemName, radioName) {
  return within(getByRole('listitem', { name: itemName })).getByRole('radio', {
    name: radioName,
  })
}

function getAllRadioInItem(getByRole, itemName) {
  return within(getByRole('listitem', { name: itemName })).getAllByRole('radio')
}

function getSliderInItem(getByRole, itemName) {
  return within(getByRole('listitem', { name: itemName })).getByRole('slider')
}

function defaultRender() {
  const { result } = renderHook(() => useDeck())
  const zoomIn = vi.fn()
  const interruptSimulator = vi.fn()
  const {
    rerender,
    getByPlaceholderText,
    getByRole,
    getAllByRole,
    queryByRole,
  } = render(
    <TabPaneCard
      deckMain={result.current[0]}
      deckSide={result.current[1]}
      dispatchDeck={result.current[2]}
      zoomIn={zoomIn}
      interruptSimulator={interruptSimulator}
    />,
  )
  const defaultRerender = () => {
    rerender(
      <TabPaneCard
        deckMain={result.current[0]}
        deckSide={result.current[1]}
        dispatchDeck={result.current[2]}
        zoomIn={zoomIn}
        interruptSimulator={interruptSimulator}
      />,
    )
  }
  return {
    defaultRerender,
    getByPlaceholderText,
    getByRole,
    getAllByRole,
    queryByRole,
  }
}

afterEach(cleanup)

test('フィルタの初期状態', async () => {
  const { defaultRerender, getByPlaceholderText, getAllByRole, getByRole } =
    defaultRender()

  // アコーディオンすべてを開く
  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()
  // エキスパンションを開く
  await userEvent.click(getCollapsedButton(getByRole, /エキスパンション/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /エキスパンション/)).toBeVisible()
  // レアリティを開く
  await userEvent.click(getCollapsedButton(getByRole, /レアリティ/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レアリティ/)).toBeVisible()
  // 色は既に開いている
  expect(getExpandedButton(getByRole, /色/)).toBeVisible()
  // 種類とパワーは既に開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()
  // レベルを開く
  await userEvent.click(getCollapsedButton(getByRole, /レベル/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レベル/)).toBeVisible()
  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()
  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()
  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  // 画面上部のコンポーネント
  expect(
    getByPlaceholderText('カード名、テキスト、イラストレータで検索'),
  ).toBeVisible()
  expect(
    getByPlaceholderText('カード名、テキスト、イラストレータで検索'),
  ).toHaveValue('')
  expect(getByRole('button', { name: 'クリア' })).toBeVisible()
  // prettier-ignore
  expect(getByRole('checkbox', { name: '特性と遺業能力も検索する' })).toBeVisible()
  // prettier-ignore
  expect(getByRole('checkbox', { name: '特性と遺業能力も検索する' })).toBeChecked()
  // prettier-ignore
  expect(getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' })).toBeVisible()
  // prettier-ignore
  expect(getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' })).not.toBeChecked()
  // 「条件で絞り込む」の中にあるボタン
  // prettier-ignore
  expect(getByRole('button', { name: '条件すべてをリセットする' })).toBeVisible()
  // フィルタの種類数
  expect(getAllByRole('listitem').length).toBe(8)

  // エキスパンション
  expect(getAllCheckboxInItem(getByRole, 'エキスパンション').length).toBe(12)
  // prettier-ignore
  expect(getCheckboxInItem(getByRole, 'エキスパンション', 'すべて')).toBeVisible()
  // prettier-ignore
  expect(getCheckboxInItem(getByRole, 'エキスパンション', 'すべて')).toBeChecked()
  expect(getByRole('checkbox', { name: '伝説の武将' })).toBeVisible()
  expect(getByRole('checkbox', { name: '伝説の武将' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '美と知の革命' })).toBeVisible()
  expect(getByRole('checkbox', { name: '美と知の革命' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '日本の大天才' })).toBeVisible()
  expect(getByRole('checkbox', { name: '日本の大天才' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第１弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第１弾ブースター' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '三国の英傑' })).toBeVisible()
  expect(getByRole('checkbox', { name: '三国の英傑' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第２弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第２弾ブースター' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '発展する医学' })).toBeVisible()
  expect(getByRole('checkbox', { name: '発展する医学' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第３弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第３弾ブースター' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第４弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第４弾ブースター' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第５弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第５弾ブースター' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '第６弾ブースター' })).toBeVisible()
  expect(getByRole('checkbox', { name: '第６弾ブースター' })).not.toBeChecked()

  // レアリティ
  expect(getAllCheckboxInItem(getByRole, 'レアリティ').length).toBe(5)
  expect(getCheckboxInItem(getByRole, 'レアリティ', 'すべて')).toBeVisible()
  expect(getCheckboxInItem(getByRole, 'レアリティ', 'すべて')).toBeChecked()
  expect(getByRole('checkbox', { name: 'N' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'N' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'R' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'R' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'SR' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'SR' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'PSR' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'PSR' })).not.toBeChecked()

  // 色
  expect(getAllCheckboxInItem(getByRole, '色').length).toBe(8)
  expect(getCheckboxInItem(getByRole, '色', 'すべて')).toBeVisible()
  expect(getCheckboxInItem(getByRole, '色', 'すべて')).toBeChecked()
  expect(getByRole('checkbox', { name: '赤' })).toBeVisible()
  expect(getByRole('checkbox', { name: '赤' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '青' })).toBeVisible()
  expect(getByRole('checkbox', { name: '青' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '緑' })).toBeVisible()
  expect(getByRole('checkbox', { name: '緑' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '黄' })).toBeVisible()
  expect(getByRole('checkbox', { name: '黄' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '紫' })).toBeVisible()
  expect(getByRole('checkbox', { name: '紫' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '多色' })).toBeVisible()
  expect(getByRole('checkbox', { name: '多色' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '無色' })).toBeVisible()
  expect(getByRole('checkbox', { name: '無色' })).not.toBeChecked()

  // 種類とパワー
  // アクセシビリティ確認のためにすべてテストする
  expect(getAllCheckboxInItem(getByRole, '種類とパワー').length).toBe(5)
  expect(getCheckboxInItem(getByRole, '種類とパワー', 'すべて')).toBeVisible()
  expect(getCheckboxInItem(getByRole, '種類とパワー', 'すべて')).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getSliderInItem(getByRole, '種類とパワー')).toBeVisible()
  expect(getSliderInItem(getByRole, '種類とパワー')).toBeDisabled()
  expect(getSliderInItem(getByRole, '種類とパワー')).toHaveValue('0')
  expect(getAllRadioInItem(getByRole, '種類とパワー').length).toBe(3)
  expect(getRadioInItem(getByRole, '種類とパワー', '以上')).toBeVisible()
  expect(getRadioInItem(getByRole, '種類とパワー', '以上')).toBeDisabled()
  expect(getRadioInItem(getByRole, '種類とパワー', '以上')).toBeChecked()
  expect(getRadioInItem(getByRole, '種類とパワー', '以下')).toBeVisible()
  expect(getRadioInItem(getByRole, '種類とパワー', '以下')).toBeDisabled()
  expect(getRadioInItem(getByRole, '種類とパワー', '以下')).not.toBeChecked()
  expect(getRadioInItem(getByRole, '種類とパワー', '等しい')).toBeVisible()
  expect(getRadioInItem(getByRole, '種類とパワー', '等しい')).toBeDisabled()
  expect(getRadioInItem(getByRole, '種類とパワー', '等しい')).not.toBeChecked()

  // レベル
  // アクセシビリティ確認のためにすべてテストする
  expect(getAllRadioInItem(getByRole, 'レベル').length).toBe(3)
  expect(getSliderInItem(getByRole, 'レベル')).toBeVisible()
  expect(getSliderInItem(getByRole, 'レベル')).toHaveValue('0')
  expect(getRadioInItem(getByRole, 'レベル', '以上')).toBeVisible()
  expect(getRadioInItem(getByRole, 'レベル', '以上')).toBeChecked()
  expect(getRadioInItem(getByRole, 'レベル', '以下')).toBeVisible()
  expect(getRadioInItem(getByRole, 'レベル', '以下')).not.toBeChecked()
  expect(getRadioInItem(getByRole, 'レベル', '等しい')).toBeVisible()
  expect(getRadioInItem(getByRole, 'レベル', '等しい')).not.toBeChecked()

  // 特性
  expect(getAllCheckboxInItem(getByRole, '特性').length).toBe(7)
  expect(getCheckboxInItem(getByRole, '特性', '指定なし')).toBeVisible()
  expect(getCheckboxInItem(getByRole, '特性', '指定なし')).toBeChecked()
  expect(getByRole('checkbox', { name: '剣術' })).toBeVisible()
  expect(getByRole('checkbox', { name: '剣術' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '美術' })).toBeVisible()
  expect(getByRole('checkbox', { name: '美術' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '音楽' })).toBeVisible()
  expect(getByRole('checkbox', { name: '音楽' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '思想' })).toBeVisible()
  expect(getByRole('checkbox', { name: '思想' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '医術' })).toBeVisible()
  expect(getByRole('checkbox', { name: '医術' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '志願' })).toBeVisible()
  expect(getByRole('checkbox', { name: '志願' })).not.toBeChecked()

  // 能力語
  expect(getAllCheckboxInItem(getByRole, '能力語').length).toBe(8)
  expect(getCheckboxInItem(getByRole, '能力語', '指定なし')).toBeVisible()
  expect(getCheckboxInItem(getByRole, '能力語', '指定なし')).toBeChecked()
  expect(getByRole('checkbox', { name: '航海' })).toBeVisible()
  expect(getByRole('checkbox', { name: '航海' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '執筆' })).toBeVisible()
  expect(getByRole('checkbox', { name: '執筆' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '決起' })).toBeVisible()
  expect(getByRole('checkbox', { name: '決起' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '徴募' })).toBeVisible()
  expect(getByRole('checkbox', { name: '徴募' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '魔導' })).toBeVisible()
  expect(getByRole('checkbox', { name: '魔導' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '勝鬨' })).toBeVisible()
  expect(getByRole('checkbox', { name: '勝鬨' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '躍進' })).toBeVisible()
  expect(getByRole('checkbox', { name: '躍進' })).not.toBeChecked()

  // 遺業能力
  expect(getAllCheckboxInItem(getByRole, '遺業能力').length).toBe(12)
  expect(getCheckboxInItem(getByRole, '遺業能力', '指定なし')).toBeVisible()
  expect(getCheckboxInItem(getByRole, '遺業能力', '指定なし')).toBeChecked()
  expect(getByRole('checkbox', { name: '遺業能力なし' })).toBeVisible()
  expect(getByRole('checkbox', { name: '遺業能力なし' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '遺業能力あり' })).toBeVisible()
  expect(getByRole('checkbox', { name: '遺業能力あり' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '魔力化' })).toBeVisible()
  expect(getByRole('checkbox', { name: '魔力化' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '冥府発動' })).toBeVisible()
  expect(getByRole('checkbox', { name: '冥府発動' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '復元' })).toBeVisible()
  expect(getByRole('checkbox', { name: '復元' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '反魂' })).toBeVisible()
  expect(getByRole('checkbox', { name: '反魂' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '木霊' })).toBeVisible()
  expect(getByRole('checkbox', { name: '木霊' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '喪神' })).toBeVisible()
  expect(getByRole('checkbox', { name: '喪神' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '1ドローする' })).toBeVisible()
  expect(getByRole('checkbox', { name: '1ドローする' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '手札に戻す' })).toBeVisible()
  expect(getByRole('checkbox', { name: '手札に戻す' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: '山札の上か下に戻す' })).toBeVisible()
  expect(
    getByRole('checkbox', { name: '山札の上か下に戻す' }),
  ).not.toBeChecked()
}, 180000)

test('フィルタの全リセット', async () => {
  const { defaultRerender, getByRole } = defaultRender()

  // アコーディオンすべてを開く
  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()
  // エキスパンションを開く
  await userEvent.click(getCollapsedButton(getByRole, /エキスパンション/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /エキスパンション/)).toBeVisible()
  // レアリティを開く
  await userEvent.click(getCollapsedButton(getByRole, /レアリティ/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レアリティ/)).toBeVisible()
  // 色は既に開いている
  expect(getExpandedButton(getByRole, /色/)).toBeVisible()
  // 種類とパワーは既に開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()
  // レベルを開く
  await userEvent.click(getCollapsedButton(getByRole, /レベル/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レベル/)).toBeVisible()
  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()
  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()
  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  // 各フィルタを適当に選択する
  // エキスパンション
  await userEvent.click(getByRole('checkbox', { name: '第４弾ブースター' }))
  expect(getByRole('checkbox', { name: '第４弾ブースター' })).toBeChecked()
  // レアリティ
  await userEvent.click(getByRole('checkbox', { name: 'N' }))
  expect(getByRole('checkbox', { name: 'N' })).toBeChecked()
  // 色
  await userEvent.click(getByRole('checkbox', { name: '紫' }))
  expect(getByRole('checkbox', { name: '紫' })).toBeChecked()
  // 種類とパワー
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, '種類とパワー'), { target: { value: '3000'}})
  expect(getSliderInItem(getByRole, '種類とパワー')).toHaveValue('3000')
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以下'))
  expect(getRadioInItem(getByRole, '種類とパワー', '以下')).toBeChecked()
  // レベル
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, 'レベル'), { target: { value: '2' }})
  expect(getSliderInItem(getByRole, 'レベル')).toHaveValue('2')
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '等しい'))
  expect(getRadioInItem(getByRole, 'レベル', '等しい')).toBeChecked()
  // 特性
  await userEvent.click(getByRole('checkbox', { name: '医術' }))
  expect(getByRole('checkbox', { name: '医術' })).toBeChecked()
  // 能力語
  await userEvent.click(getByRole('checkbox', { name: '航海' }))
  expect(getByRole('checkbox', { name: '航海' })).toBeChecked()
  // 遺業能力
  await userEvent.click(getByRole('checkbox', { name: '反魂' }))
  expect(getByRole('checkbox', { name: '反魂' })).toBeChecked()

  // 「条件すべてをリセットする」と初期状態に戻る
  // prettier-ignore
  await userEvent.click(getByRole('button', { name: '条件すべてをリセットする' }))
  expect(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  ).toBeChecked()
  expect(getCheckboxInItem(getByRole, 'レアリティ', 'すべて')).toBeChecked()
  expect(getCheckboxInItem(getByRole, '色', 'すべて')).toBeChecked()
  expect(getCheckboxInItem(getByRole, '種類とパワー', 'すべて')).toBeChecked()
  expect(getSliderInItem(getByRole, '種類とパワー')).toHaveValue('0')
  expect(getRadioInItem(getByRole, '種類とパワー', '以上')).toBeChecked()
  expect(getSliderInItem(getByRole, 'レベル')).toHaveValue('0')
  expect(getRadioInItem(getByRole, 'レベル', '以上')).toBeChecked()
  expect(getCheckboxInItem(getByRole, '特性', '指定なし')).toBeChecked()
  expect(getCheckboxInItem(getByRole, '能力語', '指定なし')).toBeChecked()
  expect(getCheckboxInItem(getByRole, '遺業能力', '指定なし')).toBeChecked()
})

test('エキスパンションによるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // エキスパンションを開く
  await userEvent.click(getCollapsedButton(getByRole, /エキスパンション/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /エキスパンション/)).toBeVisible()

  expect(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  ).toBeChecked()
  expect(getByRole('row', { name: 'R-1' })).toBeVisible()
  expect(getByRole('row', { name: 'B-1' })).toBeVisible()
  expect(getByRole('row', { name: 'G-1' })).toBeVisible()
  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(getByRole('row', { name: 'Y-1' })).toBeVisible()
  expect(getByRole('row', { name: '2-1' })).toBeVisible()
  expect(getByRole('row', { name: 'P-1' })).toBeVisible()
  expect(getByRole('row', { name: '3-1' })).toBeVisible()
  expect(getByRole('row', { name: '4-1' })).toBeVisible()

  await userEvent.click(getByRole('checkbox', { name: '伝説の武将' }))
  defaultRerender()
  expect(getByRole('row', { name: 'R-1' })).toBeVisible()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '美と知の革命' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(getByRole('row', { name: 'B-1' })).toBeVisible()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '日本の大天才' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(getByRole('row', { name: 'G-1' })).toBeVisible()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '第１弾ブースター' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '三国の英傑' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(getByRole('row', { name: 'Y-1' })).toBeVisible()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '第２弾ブースター' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(getByRole('row', { name: '2-1' })).toBeVisible()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '発展する医学' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(getByRole('row', { name: 'P-1' })).toBeVisible()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '第３弾ブースター' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(getByRole('row', { name: '3-1' })).toBeVisible()
  expect(queryByRole('row', { name: '4-1' })).toBeNull()

  await userEvent.click(
    getCheckboxInItem(getByRole, 'エキスパンション', 'すべて'),
  )
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '第４弾ブースター' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'R-1' })).toBeNull()
  expect(queryByRole('row', { name: 'B-1' })).toBeNull()
  expect(queryByRole('row', { name: 'G-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull()
  expect(queryByRole('row', { name: '2-1' })).toBeNull()
  expect(queryByRole('row', { name: 'P-1' })).toBeNull()
  expect(queryByRole('row', { name: '3-1' })).toBeNull()
  expect(getByRole('row', { name: '4-1' })).toBeVisible()
})

test('レアリティによるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // レアリティを開く
  await userEvent.click(getCollapsedButton(getByRole, /レアリティ/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レアリティ/)).toBeVisible()

  expect(getCheckboxInItem(getByRole, 'レアリティ', 'すべて')).toBeChecked()
  expect(getByRole('row', { name: '1-1' })).toBeVisible() // 織田信長 (SR)
  expect(getByRole('row', { name: '1-15' })).toBeVisible() // 中臣鎌足 (R)
  expect(getByRole('row', { name: '1-17' })).toBeVisible() // 藤原道長 (N)
  expect(getByRole('row', { name: '3-81' })).toBeVisible() // 土方歳三 (PSR)

  await userEvent.click(getByRole('checkbox', { name: 'N' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-15' })).toBeNull()
  expect(getByRole('row', { name: '1-17' })).toBeVisible()
  expect(queryByRole('row', { name: '3-81' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, 'レアリティ', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'R' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(getByRole('row', { name: '1-15' })).toBeVisible()
  expect(queryByRole('row', { name: '1-17' })).toBeNull()
  expect(queryByRole('row', { name: '3-81' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, 'レアリティ', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'SR' }))
  defaultRerender()
  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(queryByRole('row', { name: '1-15' })).toBeNull()
  expect(queryByRole('row', { name: '1-17' })).toBeNull()
  expect(queryByRole('row', { name: '3-81' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, 'レアリティ', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'PSR' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(queryByRole('row', { name: '1-15' })).toBeNull()
  expect(queryByRole('row', { name: '1-17' })).toBeNull()
  expect(getByRole('row', { name: '3-81' })).toBeVisible()
})

test('色によるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 色は最初から開いている
  expect(getExpandedButton(getByRole, /色/)).toBeVisible()

  expect(getByRole('row', { name: '3-15' })).toBeVisible() // 淀殿 (赤)
  expect(getByRole('row', { name: '3-19' })).toBeVisible() // 伊達政宗 (青)
  expect(getByRole('row', { name: '3-27' })).toBeVisible() // 小野小町 (緑)
  expect(getByRole('row', { name: '3-35' })).toBeVisible() // 徳川吉宗 (黄)
  expect(getByRole('row', { name: '3-45' })).toBeVisible() // 坂本龍馬 (紫)
  expect(getByRole('row', { name: '2-78' })).toBeVisible() // RYマーブルオーブ (赤黄)
  expect(getByRole('row', { name: '2-79' })).toBeVisible() // RYマーブルオーブ (青黄)
  expect(getByRole('row', { name: '2-80' })).toBeVisible() // RYマーブルオーブ (緑黄)
  expect(getByRole('row', { name: '3-80' })).toBeVisible() // オブシディアン (無色)

  await userEvent.click(getByRole('checkbox', { name: '赤' }))
  defaultRerender()
  expect(getByRole('row', { name: '3-15' })).toBeVisible()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(getByRole('row', { name: '2-78' })).toBeVisible()
  expect(queryByRole('row', { name: '2-79' })).toBeNull()
  expect(queryByRole('row', { name: '2-80' })).toBeNull()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '青' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(getByRole('row', { name: '3-19' })).toBeVisible()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(queryByRole('row', { name: '2-78' })).toBeNull()
  expect(getByRole('row', { name: '2-79' })).toBeVisible()
  expect(queryByRole('row', { name: '2-80' })).toBeNull()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '緑' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(getByRole('row', { name: '3-27' })).toBeVisible()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(queryByRole('row', { name: '2-78' })).toBeNull()
  expect(queryByRole('row', { name: '2-79' })).toBeNull()
  expect(getByRole('row', { name: '2-80' })).toBeVisible()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '黄' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(getByRole('row', { name: '3-35' })).toBeVisible()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(getByRole('row', { name: '2-78' })).toBeVisible()
  expect(getByRole('row', { name: '2-79' })).toBeVisible()
  expect(getByRole('row', { name: '2-80' })).toBeVisible()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '紫' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(getByRole('row', { name: '3-45' })).toBeVisible()
  expect(queryByRole('row', { name: '2-78' })).toBeNull()
  expect(queryByRole('row', { name: '2-79' })).toBeNull()
  expect(queryByRole('row', { name: '2-80' })).toBeNull()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '多色' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(getByRole('row', { name: '2-78' })).toBeVisible()
  expect(getByRole('row', { name: '2-79' })).toBeVisible()
  expect(getByRole('row', { name: '2-80' })).toBeVisible()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '無色' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(queryByRole('row', { name: '3-35' })).toBeNull()
  expect(queryByRole('row', { name: '3-45' })).toBeNull()
  expect(queryByRole('row', { name: '2-78' })).toBeNull()
  expect(queryByRole('row', { name: '2-79' })).toBeNull()
  expect(queryByRole('row', { name: '2-80' })).toBeNull()
  expect(getByRole('row', { name: '3-80' })).toBeVisible()

  // 複数選択
  await userEvent.click(getCheckboxInItem(getByRole, '色', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '黄' }))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: '紫' }))
  defaultRerender()
  expect(queryByRole('row', { name: '3-15' })).toBeNull()
  expect(queryByRole('row', { name: '3-19' })).toBeNull()
  expect(queryByRole('row', { name: '3-27' })).toBeNull()
  expect(getByRole('row', { name: '3-35' })).toBeVisible()
  expect(getByRole('row', { name: '3-45' })).toBeVisible()
  expect(getByRole('row', { name: '2-78' })).toBeVisible()
  expect(getByRole('row', { name: '2-79' })).toBeVisible()
  expect(getByRole('row', { name: '2-80' })).toBeVisible()
  expect(queryByRole('row', { name: '3-80' })).toBeNull()
}, 180000)

test('種類によるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 種類とパワーは最初から開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()

  expect(getByRole('row', { name: 'B-2' })).toBeVisible() // ヴァスコ・ダ・ガマ
  expect(getByRole('row', { name: 'B-9' })).toBeVisible() // モナ・リザ
  expect(getByRole('row', { name: 'B-11' })).toBeVisible() // フリート
  expect(getByRole('row', { name: 'B-13' })).toBeVisible() // ブルーストーン

  await userEvent.click(getCheckboxInItem(getByRole, '種類とパワー', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()
  expect(getByRole('row', { name: 'B-2' })).toBeVisible()
  expect(queryByRole('row', { name: 'B-9' })).toBeNull()
  expect(queryByRole('row', { name: 'B-11' })).toBeNull()
  expect(queryByRole('row', { name: 'B-13' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '種類とパワー', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'B-2' })).toBeNull()
  expect(getByRole('row', { name: 'B-9' })).toBeVisible()
  expect(queryByRole('row', { name: 'B-11' })).toBeNull()
  expect(queryByRole('row', { name: 'B-13' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '種類とパワー', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'B-2' })).toBeNull()
  expect(queryByRole('row', { name: 'B-9' })).toBeNull()
  expect(getByRole('row', { name: 'B-11' })).toBeVisible()
  expect(queryByRole('row', { name: 'B-13' })).toBeNull()

  await userEvent.click(getCheckboxInItem(getByRole, '種類とパワー', 'すべて'))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()
  expect(queryByRole('row', { name: 'B-2' })).toBeNull()
  expect(queryByRole('row', { name: 'B-9' })).toBeNull()
  expect(queryByRole('row', { name: 'B-11' })).toBeNull()
  expect(getByRole('row', { name: 'B-13' })).toBeVisible()
})

test('イジンのパワーによるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 種類とパワーは最初から開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()

  // 0以上
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible() // フローレンス・ナイチンゲール (0)
  expect(getByRole('row', { name: 'G-2' })).toBeVisible() // 卑弥呼 (500)
  expect(getByRole('row', { name: '1-18' })).toBeVisible() // 源頼朝 (5000)
  expect(getByRole('row', { name: '2-8' })).toBeVisible() // 豊臣秀吉 (10000)

  // 0以下
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 0に等しい
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '等しい'))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 500以上
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以上'))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, '種類とパワー'), { target: { value: '500' } })
  defaultRerender()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(getByRole('row', { name: 'G-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-18' })).toBeVisible()
  expect(getByRole('row', { name: '2-8' })).toBeVisible()

  // 500以下
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible()
  expect(getByRole('row', { name: 'G-2' })).toBeVisible()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 500に等しい
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '等しい'))
  defaultRerender()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(getByRole('row', { name: 'G-2' })).toBeVisible()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 5000以上
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以上'))
  defaultRerender()
  fireEvent.change(getSliderInItem(getByRole, '種類とパワー'), {
    target: { value: '5000' },
  })
  defaultRerender()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(getByRole('row', { name: '1-18' })).toBeVisible()
  expect(getByRole('row', { name: '2-8' })).toBeVisible()

  // 5000以下
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible()
  expect(getByRole('row', { name: 'G-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-18' })).toBeVisible()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 5000に等しい
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '等しい'))
  defaultRerender()
  expect(getSliderInItem(getByRole, '種類とパワー')).toHaveValue('5000')
  expect(getRadioInItem(getByRole, '種類とパワー', '等しい')).toBeChecked()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(getByRole('row', { name: '1-18' })).toBeVisible()
  expect(queryByRole('row', { name: '2-8' })).toBeNull()

  // 10000以上
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以上'))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, '種類とパワー'), { target: { value: '10000' } })
  defaultRerender()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(getByRole('row', { name: '2-8' })).toBeVisible()

  // 10000以下
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '4-37' })).toBeVisible()
  expect(getByRole('row', { name: 'G-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-18' })).toBeVisible()
  expect(getByRole('row', { name: '2-8' })).toBeVisible()

  // 10000に等しい
  await userEvent.click(getRadioInItem(getByRole, '種類とパワー', '等しい'))
  defaultRerender()
  expect(queryByRole('row', { name: '4-37' })).toBeNull()
  expect(queryByRole('row', { name: 'G-2' })).toBeNull()
  expect(queryByRole('row', { name: '1-18' })).toBeNull()
  expect(getByRole('row', { name: '2-8' })).toBeVisible()
})

test('レベルによるフィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // レアリティを開く
  await userEvent.click(getCollapsedButton(getByRole, /レベル/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レベル/)).toBeVisible()

  // 0以上
  expect(getByRole('row', { name: '3-77' })).toBeVisible() // 遁甲盤 (レベル0)
  expect(getByRole('row', { name: '2-10' })).toBeVisible() // 栄西 (レベル1)
  expect(getByRole('row', { name: '2-14' })).toBeVisible() // 北条時政 (レベル5)
  expect(getByRole('row', { name: '2-12' })).toBeVisible() // 足利義昭 (レベル9)
  expect(getByRole('row', { name: '3-63' })).toBeVisible() // アイオン (レベル10)
  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (レベル17)

  // 0以下
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '3-77' })).toBeVisible()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 0に等しい
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '等しい'))
  defaultRerender()
  expect(getByRole('row', { name: '3-77' })).toBeVisible()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 5以上
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以上'))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, 'レベル'), { target: { value: '5' } })
  defaultRerender()
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(getByRole('row', { name: '2-14' })).toBeVisible()
  expect(getByRole('row', { name: '2-12' })).toBeVisible()
  expect(getByRole('row', { name: '3-63' })).toBeVisible()
  expect(getByRole('row', { name: '4-46' })).toBeVisible()

  // 5以下
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '3-77' })).toBeVisible()
  expect(getByRole('row', { name: '2-10' })).toBeVisible()
  expect(getByRole('row', { name: '2-14' })).toBeVisible()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 5に等しい
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '等しい'))
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(getByRole('row', { name: '2-14' })).toBeVisible()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 10以上
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以上'))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, 'レベル'), { target: { value: '10' } })
  defaultRerender()
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(getByRole('row', { name: '3-63' })).toBeVisible()
  expect(getByRole('row', { name: '4-46' })).toBeVisible()

  // 10以下
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以下'))
  expect(getByRole('row', { name: '3-77' })).toBeVisible()
  expect(getByRole('row', { name: '2-10' })).toBeVisible()
  expect(getByRole('row', { name: '2-14' })).toBeVisible()
  expect(getByRole('row', { name: '2-12' })).toBeVisible()
  expect(getByRole('row', { name: '3-63' })).toBeVisible()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 10に等しい
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '等しい'))
  defaultRerender()
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(getByRole('row', { name: '3-63' })).toBeVisible()
  expect(queryByRole('row', { name: '4-46' })).toBeNull()

  // 17以上
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以上'))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, 'レベル'), { target: { value: '17' } })
  defaultRerender()
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(getByRole('row', { name: '4-46' })).toBeVisible()

  // 17以下
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以下'))
  defaultRerender()
  expect(getByRole('row', { name: '3-77' })).toBeVisible()
  expect(getByRole('row', { name: '2-10' })).toBeVisible()
  expect(getByRole('row', { name: '2-14' })).toBeVisible()
  expect(getByRole('row', { name: '2-12' })).toBeVisible()
  expect(getByRole('row', { name: '3-63' })).toBeVisible()
  expect(getByRole('row', { name: '4-46' })).toBeVisible()

  // 17に等しい
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '等しい'))
  defaultRerender()
  expect(queryByRole('row', { name: '3-77' })).toBeNull()
  expect(queryByRole('row', { name: '2-10' })).toBeNull()
  expect(queryByRole('row', { name: '2-14' })).toBeNull()
  expect(queryByRole('row', { name: '2-12' })).toBeNull()
  expect(queryByRole('row', { name: '3-63' })).toBeNull()
  expect(getByRole('row', { name: '4-46' })).toBeVisible()
})

test('特性によるフィルタ (剣術)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '4-35' })).toBeVisible() // 沖田総司 (剣術・志願イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: '1-1' })).toBeVisible() // 織田信長 (テキストに剣術を持つイジン)
  expect(getByRole('row', { name: 'R-10' })).toBeVisible() // 連なる天守閣 (テキストに剣術を持つハイケイ)
  expect(getByRole('row', { name: 'R-11' })).toBeVisible() // ロイヤリティ (テキストに剣術を持つマホウ)
  expect(getByRole('row', { name: '1-60' })).toBeVisible() // 髭切 (テキストに剣術を持つマリョク)

  await userEvent.click(getByRole('checkbox', { name: '剣術' }))
  defaultRerender()
  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '4-35' })).toBeVisible() // 沖田総司 (剣術・志願イジン)
  expect(queryByRole('row', { name: '1-23' })).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByRole('row', { name: '1-39' })).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByRole('row', { name: '3-21' })).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByRole('row', { name: '3-44' })).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: '1-1' })).toBeNull() // 織田信長 (テキストに剣術を持つイジン)
  expect(queryByRole('row', { name: 'R-10' })).toBeNull() // 連なる天守閣 (テキストに剣術を持つハイケイ)
  expect(queryByRole('row', { name: 'R-11' })).toBeNull() // ロイヤリティ (テキストに剣術を持つマホウ)
  expect(queryByRole('row', { name: '1-60' })).toBeNull() // 髭切 (テキストに剣術を持つマリョク)
})

test('特性によるフィルタ (美術)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-51' })).toBeVisible() // 冨嶽三十六景 (美術ハイケイ)
  expect(getByRole('row', { name: '4-44' })).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: '1-76' })).toBeVisible() // シーボルト (テキストに美術を持つイジン)
  expect(getByRole('row', { name: '1-56' })).toBeVisible() // リバイバル (テキストに美術を持つマホウ)

  await userEvent.click(getByRole('checkbox', { name: '美術' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-10' })).toBeNull() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-51' })).toBeVisible() // 冨嶽三十六景 (美術ハイケイ)
  expect(getByRole('row', { name: '4-44' })).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByRole('row', { name: '1-39' })).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByRole('row', { name: '3-21' })).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByRole('row', { name: '3-44' })).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: '1-76' })).toBeNull() // シーボルト (テキストに美術を持つイジン)
  expect(queryByRole('row', { name: '1-56' })).toBeNull() // リバイバル (テキストに美術を持つマホウ)
})

test('特性によるフィルタ (音楽)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: '4-3' })).toBeVisible() // アンナ・パブロワ (テキストに音楽を含むイジン)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (テキストに音楽を含むハイケイ)

  await userEvent.click(getByRole('checkbox', { name: '音楽' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-10' })).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByRole('row', { name: '1-23' })).toBeNull() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByRole('row', { name: '3-21' })).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByRole('row', { name: '3-44' })).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: '4-3' })).toBeNull() // アンナ・パブロワ (テキストに音楽を含むイジン)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (テキストに音楽を含むハイケイ)
})

test('特性によるフィルタ (思想)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '2-51' })).toBeVisible() // リヴァイアサン (思想ハイケイ)
  expect(getByRole('row', { name: '4-44' })).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // ポンパドゥール夫人 (テキストに思想を持つイジン)
  expect(getByRole('row', { name: '2-55' })).toBeVisible() // 凱旋門 (テキストに思想を含むハイケイ)

  await userEvent.click(getByRole('checkbox', { name: '思想' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-10' })).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByRole('row', { name: '1-23' })).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByRole('row', { name: '1-39' })).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '2-51' })).toBeVisible() // リヴァイアサン (思想ハイケイ)
  expect(getByRole('row', { name: '4-44' })).toBeVisible() // 落日の王宮 (美術・思想ハイケイ)
  expect(queryByRole('row', { name: '3-44' })).toBeNull() // 本居宣長 (医術イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // ポンパドゥール夫人 (テキストに思想を持つイジン)
  expect(queryByRole('row', { name: '2-55' })).toBeNull() // 凱旋門 (テキストに思想を含むハイケイ)
})

test('特性によるフィルタ (医術)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: 'P-5' })).toBeVisible() // 渡辺崋山 (テキストに医術を持つ美術イジン)

  await userEvent.click(getByRole('checkbox', { name: '医術' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-10' })).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByRole('row', { name: '1-23' })).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByRole('row', { name: '1-39' })).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByRole('row', { name: '3-21' })).toBeNull() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(queryByRole('row', { name: '3-43' })).toBeNull() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: 'P-5' })).toBeNull() // 渡辺崋山 (テキストに医術を持つ美術イジン)
})

test('特性によるフィルタ (志願)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 特性を開く
  await userEvent.click(getCollapsedButton(getByRole, /特性/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /特性/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康 (剣術イジン)
  expect(getByRole('row', { name: '1-23' })).toBeVisible() // ドナテッロ (美術イジン)
  expect(getByRole('row', { name: '1-39' })).toBeVisible() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(getByRole('row', { name: '3-21' })).toBeVisible() // 木戸孝允 (思想イジン)
  expect(getByRole('row', { name: '3-44' })).toBeVisible() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(getByRole('row', { name: '4-49' })).toBeVisible() // 蝦夷共和国 (テキストに志願を持つハイケイ)
  expect(getByRole('row', { name: '3-76' })).toBeVisible() // ダンダラ羽織 (テキストに志願を持つマリョク)

  await userEvent.click(getByRole('checkbox', { name: '志願' }))
  defaultRerender()
  expect(queryByRole('row', { name: '1-10' })).toBeNull() // 徳川家康 (剣術イジン)
  expect(queryByRole('row', { name: '1-23' })).toBeNull() // ドナテッロ (美術イジン)
  expect(queryByRole('row', { name: '1-39' })).toBeNull() // ヨハン・ゼバスティアン・バッハ (音楽イジン)
  expect(queryByRole('row', { name: '3-21' })).toBeNull() // 木戸孝允 (思想イジン)
  expect(queryByRole('row', { name: '3-44' })).toBeNull() // 本居宣長 (医術イジン)
  expect(getByRole('row', { name: '3-43' })).toBeVisible() // 芹沢鴨 (志願イジン)
  expect(queryByRole('row', { name: '4-49' })).toBeNull() // 蝦夷共和国 (テキストに志願を持つハイケイ)
  expect(queryByRole('row', { name: '3-76' })).toBeNull() // ダンダラ羽織 (テキストに志願を持つマリョク)
})

test('能力語によるフィルタ (航海)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()

  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (魔導マホウ)
  expect(getByRole('row', { name: '3-3' })).toBeVisible() // エンリケ航海王子 (テキストに航海を持つイジン)
  expect(getByRole('row', { name: '2-52' })).toBeVisible() // ガレオン船 (テキストに航海を持つハイケイ)
  expect(getByRole('row', { name: 'B-11' })).toBeVisible() // フリート (テキストに航海を持つマホウ)
  expect(getByRole('row', { name: '1-64' })).toBeVisible() // 羅針盤 (テキストに航海を持つマリョク)

  await userEvent.click(getByRole('checkbox', { name: '航海' }))
  defaultRerender()
  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(queryByRole('row', { name: '2-39' })).toBeNull() // 陳寿 (執筆イジン)
  expect(queryByRole('row', { name: '2-9' })).toBeNull() // 石田三成 (決起イジン)
  expect(queryByRole('row', { name: '2-20' })).toBeNull() // 洪秀全 (徴募イジン)
  expect(queryByRole('row', { name: '2-57' })).toBeNull() // スペクター (魔導マホウ)
  expect(queryByRole('row', { name: '3-3' })).toBeNull() // エンリケ航海王子 (テキストに航海を持つイジン)
  expect(queryByRole('row', { name: '2-52' })).toBeNull() // ガレオン船 (テキストに航海を持つハイケイ)
  expect(queryByRole('row', { name: 'B-11' })).toBeNull() // フリート (テキストに航海を持つマホウ)
  expect(queryByRole('row', { name: '1-64' })).toBeNull() // 羅針盤 (テキストに航海を持つマリョク)
})

test('能力語によるフィルタ (執筆)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()

  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '3-56' })).toBeVisible() // 志士の藩校 (執筆ハイケイ)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (魔導マホウ)
  expect(getByRole('row', { name: '1-25' })).toBeVisible() // 始皇帝 (テキストに執筆を持つイジン)
  expect(getByRole('row', { name: '1-68' })).toBeVisible() // 万葉集 (テキストに執筆を持つマリョク)

  await userEvent.click(getByRole('checkbox', { name: '執筆' }))
  defaultRerender()
  expect(queryByRole('row', { name: '2-22' })).toBeNull() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '3-56' })).toBeVisible() // 志士の藩校 (執筆ハイケイ)
  expect(queryByRole('row', { name: '2-9' })).toBeNull() // 石田三成 (決起イジン)
  expect(queryByRole('row', { name: '2-20' })).toBeNull() // 洪秀全 (徴募イジン)
  expect(queryByRole('row', { name: '2-57' })).toBeNull() // スペクター (魔導マホウ)
  expect(queryByRole('row', { name: '1-25' })).toBeNull() // 始皇帝 (テキストに執筆を持つイジン)
  expect(queryByRole('row', { name: '1-68' })).toBeNull() // 万葉集 (テキストに執筆を持つマリョク)
})

test('能力語によるフィルタ (決起)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()

  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-49' })).toBeVisible() // 籠城戦 (決起ハイケイ)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (魔導マホウ)
  expect(getByRole('row', { name: '3-4' })).toBeVisible() // 吉田松陰 (テキストに決起を持つイジン)

  await userEvent.click(getByRole('checkbox', { name: '決起' }))
  defaultRerender()
  expect(queryByRole('row', { name: '2-22' })).toBeNull() // 日蓮 (航海イジン)
  expect(queryByRole('row', { name: '2-39' })).toBeNull() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-49' })).toBeVisible() // 籠城戦 (決起ハイケイ)
  expect(queryByRole('row', { name: '2-20' })).toBeNull() // 洪秀全 (徴募イジン)
  expect(queryByRole('row', { name: '2-57' })).toBeNull() // スペクター (魔導マホウ)
  expect(queryByRole('row', { name: '3-4' })).toBeNull() // 吉田松陰 (テキストに決起を持つイジン)
})

test('能力語によるフィルタ (徴募)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()

  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (魔導マホウ)
  expect(getByRole('row', { name: '2-55' })).toBeVisible() // 凱旋門 (テキストに徴募を持つハイケイ)

  await userEvent.click(getByRole('checkbox', { name: '徴募' }))
  defaultRerender()
  expect(queryByRole('row', { name: '2-22' })).toBeNull() // 日蓮 (航海イジン)
  expect(queryByRole('row', { name: '2-39' })).toBeNull() // 陳寿 (執筆イジン)
  expect(queryByRole('row', { name: '2-9' })).toBeNull() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(queryByRole('row', { name: '2-57' })).toBeNull() // スペクター (魔導マホウ)
  expect(queryByRole('row', { name: '2-55' })).toBeNull() // 凱旋門 (テキストに徴募を持つハイケイ)
})

test('能力語によるフィルタ (魔導)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 能力語を開く
  await userEvent.click(getCollapsedButton(getByRole, /能力語/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /能力語/)).toBeVisible()

  expect(getByRole('row', { name: '2-22' })).toBeVisible() // 日蓮 (航海イジン)
  expect(getByRole('row', { name: '2-39' })).toBeVisible() // 陳寿 (執筆イジン)
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成 (決起イジン)
  expect(getByRole('row', { name: '2-20' })).toBeVisible() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (赤の黄魔導マホウ)
  expect(getByRole('row', { name: '2-69' })).toBeVisible() // スカーレット (黄の赤魔導マホウ)
  expect(getByRole('row', { name: '2-70' })).toBeVisible() // ピーコック (黄の青魔導マホウ)
  expect(getByRole('row', { name: '2-71' })).toBeVisible() // シャトルーズ (黄の緑魔導マホウ)
  expect(getByRole('row', { name: '4-61' })).toBeVisible() // ソリッドビジョンα (無色の赤魔導マホウ)
  expect(getByRole('row', { name: '4-62' })).toBeVisible() // ソリッドビジョンδ (無色の青魔導マホウ)
  expect(getByRole('row', { name: '4-63' })).toBeVisible() // ソリッドビジョンΩ (無色の緑魔導マホウ)
  expect(getByRole('row', { name: '4-64' })).toBeVisible() // ソリッドビジョンβ (無色の黄魔導マホウ)
  expect(getByRole('row', { name: '4-65' })).toBeVisible() // ソリッドビジョンγ (無色の紫魔導マホウ)
  expect(getByRole('row', { name: '4-8' })).toBeVisible() // アルキメデス (テキストに魔導を持つイジン)

  await userEvent.click(getByRole('checkbox', { name: '魔導' }))
  defaultRerender()
  expect(queryByRole('row', { name: '2-22' })).toBeNull() // 日蓮 (航海イジン)
  expect(queryByRole('row', { name: '2-39' })).toBeNull() // 陳寿 (執筆イジン)
  expect(queryByRole('row', { name: '2-9' })).toBeNull() // 石田三成 (決起イジン)
  expect(queryByRole('row', { name: '2-20' })).toBeNull() // 洪秀全 (徴募イジン)
  expect(getByRole('row', { name: '2-57' })).toBeVisible() // スペクター (赤の黄魔導マホウ)
  expect(getByRole('row', { name: '2-69' })).toBeVisible() // スカーレット (黄の赤魔導マホウ)
  expect(getByRole('row', { name: '2-70' })).toBeVisible() // ピーコック (黄の青魔導マホウ)
  expect(getByRole('row', { name: '2-71' })).toBeVisible() // シャトルーズ (黄の緑魔導マホウ)
  expect(getByRole('row', { name: '4-61' })).toBeVisible() // ソリッドビジョンα (無色の赤魔導マホウ)
  expect(getByRole('row', { name: '4-62' })).toBeVisible() // ソリッドビジョンδ (無色の青魔導マホウ)
  expect(getByRole('row', { name: '4-63' })).toBeVisible() // ソリッドビジョンΩ (無色の緑魔導マホウ)
  expect(getByRole('row', { name: '4-64' })).toBeVisible() // ソリッドビジョンβ (無色の黄魔導マホウ)
  expect(getByRole('row', { name: '4-65' })).toBeVisible() // ソリッドビジョンγ (無色の紫魔導マホウ)
  expect(queryByRole('row', { name: '4-8' })).toBeNull() // アルキメデス (テキストに魔導を持つイジン)
})

test('遺業能力によるフィルタ (冥府発動)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)
  expect(getByRole('row', { name: '2-33' })).toBeVisible() // 張角 (テキストに冥府発動を持つイジン)
  expect(getByRole('row', { name: '3-59' })).toBeVisible() // 森閑たる離宮 (テキストに冥府発動を持つハイケイ)
  expect(getByRole('row', { name: '3-61' })).toBeVisible() // サンダーボルト (テキストに冥府発動を持つマホウ)

  await userEvent.click(getByRole('checkbox', { name: '冥府発動' }))
  defaultRerender()

  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByRole('row', { name: '2-33' })).toBeNull() // 張角 (テキストに冥府発動を持つイジン)
  expect(queryByRole('row', { name: '3-59' })).toBeNull() // 森閑たる離宮 (テキストに冥府発動を持つハイケイ)
  expect(queryByRole('row', { name: '3-61' })).toBeNull() // サンダーボルト (テキストに冥府発動を持つマホウ)
})

test('遺業能力によるフィルタ (反魂)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)
  expect(getByRole('row', { name: '2-37' })).toBeVisible() // 姜維 (テキストに反魂を持つイジン)
  expect(getByRole('row', { name: '2-49' })).toBeVisible() // 籠城戦 (テキストに反魂を持つハイケイ)

  await userEvent.click(getByRole('checkbox', { name: '反魂' }))
  defaultRerender()

  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
  expect(queryByRole('row', { name: '2-37' })).toBeNull() // 姜維 (テキストに反魂を持つイジン)
  expect(queryByRole('row', { name: '2-49' })).toBeNull() // 籠城戦 (テキストに反魂を持つハイケイ)
})

test('遺業能力によるフィルタ (魔力化)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '魔力化' }))
  defaultRerender()
  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (復元)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '復元' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (木霊)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '木霊' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (喪神)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '喪神' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (1ドローする)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '1ドローする' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (手札に戻す)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '手札に戻す' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(queryByRole('row', { name: '4-48' })).toBeNull() // 遠征軍 (山札の上か下に戻す)
})

test('遺業能力によるフィルタ (山札の上か下に戻す)', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 遺業能力を開く
  await userEvent.click(getCollapsedButton(getByRole, /遺業能力/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /遺業能力/)).toBeVisible()

  expect(getByRole('row', { name: '4-46' })).toBeVisible() // 大日本沿海輿地全図 (魔力化)
  expect(getByRole('row', { name: '4-58' })).toBeVisible() // ルーナ (冥府発動)
  expect(getByRole('row', { name: '4-78' })).toBeVisible() // ホプロン (復元)
  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね (反魂)
  expect(getByRole('row', { name: '4-18' })).toBeVisible() // ポンパドゥール夫人 (木霊)
  expect(getByRole('row', { name: '4-47' })).toBeVisible() // マザーグース (喪神)
  expect(getByRole('row', { name: '4-11' })).toBeVisible() // 島津斉彬 (1ドローする)
  expect(getByRole('row', { name: '4-43' })).toBeVisible() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)

  await userEvent.click(getByRole('checkbox', { name: '山札の上か下に戻す' }))
  defaultRerender()
  expect(queryByRole('row', { name: '4-46' })).toBeNull() // 大日本沿海輿地全図 (魔力化)
  expect(queryByRole('row', { name: '4-58' })).toBeNull() // ルーナ (冥府発動)
  expect(queryByRole('row', { name: '4-78' })).toBeNull() // ホプロン (復元)
  expect(queryByRole('row', { name: '4-15' })).toBeNull() // ねね (反魂)
  expect(queryByRole('row', { name: '4-18' })).toBeNull() // ポンパドゥール夫人 (木霊)
  expect(queryByRole('row', { name: '4-47' })).toBeNull() // マザーグース (喪神)
  expect(queryByRole('row', { name: '4-11' })).toBeNull() // 島津斉彬 (1ドローする)
  expect(queryByRole('row', { name: '4-43' })).toBeNull() // 火と氷の大地 (手札に戻す)
  expect(getByRole('row', { name: '4-48' })).toBeVisible() // 遠征軍 (山札の上か下に戻す)
})

test('色と種類とレベルによる複合フィルタ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 色は既に開いている
  expect(getExpandedButton(getByRole, /色/)).toBeVisible()

  // 種類 (とパワー) は既に開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()

  // レベルを開く
  await userEvent.click(getCollapsedButton(getByRole, /レベル/))
  defaultRerender()
  expect(getExpandedButton(getByRole, /レベル/)).toBeVisible()

  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成
  expect(getByRole('row', { name: '2-13' })).toBeVisible() // 毛利輝元 (レベル6)
  expect(getByRole('row', { name: '3-52' })).toBeVisible() // 天下分け目の主戦場	(ハイケイ)
  expect(getByRole('row', { name: 'R-11' })).toBeVisible() // ロイヤリティ (マホウ)
  expect(getByRole('row', { name: '1-61' })).toBeVisible() // レッドオーブ (マリョク)
  expect(getByRole('row', { name: '1-75' })).toBeVisible() // 衛青 (赤でない)

  // レベル5以下の赤のイジンを探す
  await userEvent.click(getByRole('checkbox', { name: '赤' }))
  defaultRerender()
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()
  // prettier-ignore
  fireEvent.change(getSliderInItem(getByRole, 'レベル'), { target: { value: '5' } })
  defaultRerender()
  await userEvent.click(getRadioInItem(getByRole, 'レベル', '以下'))
  defaultRerender()

  expect(getByRole('row', { name: '4-15' })).toBeVisible() // ねね
  expect(getByRole('row', { name: '2-9' })).toBeVisible() // 石田三成
  expect(queryByRole('row', { name: '2-13' })).toBeNull() // 毛利輝元 (レベル6)
  expect(queryByRole('row', { name: '3-52' })).toBeNull() // 天下分け目の主戦場	(ハイケイ)
  expect(queryByRole('row', { name: 'R-11' })).toBeNull() // ロイヤリティ (マホウ)
  expect(queryByRole('row', { name: '1-61' })).toBeNull() // レッドオーブ (マリョク)
  expect(queryByRole('row', { name: '1-75' })).toBeNull() // 衛青 (赤でない)
})

test('キーワードによるフィルタ', async () => {
  const { defaultRerender, getByPlaceholderText, getByRole, queryByRole } =
    defaultRender()

  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク
  expect(getByRole('row', { name: '1-55' })).toBeVisible() // ストーム
  expect(getByRole('row', { name: '2-26' })).toBeVisible() // ハリエット・ビーチャー・ストウ

  // ひらがなで検索するとカード名の読み仮名でヒットする
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), 'すとーん')
  defaultRerender()
  expect(queryByRole('row', { name: '2-7' })).toBeNull() // 日野富子
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク
  expect(queryByRole('row', { name: '1-55' })).toBeNull() // ストーム
  expect(queryByRole('row', { name: '2-26' })).toBeNull() // ハリエット・ビーチャー・ストウ

  await userEvent.click(getByRole('button', { name: 'クリア' }))
  defaultRerender()

  // ひらがな以外で検索するとカード名またはルールテキストで文字通りにヒットする
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), 'ストーン')
  defaultRerender()
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク
  expect(queryByRole('row', { name: '1-55' })).toBeNull() // ストーム
  expect(queryByRole('row', { name: '2-26' })).toBeNull() // ハリエット・ビーチャー・ストウ

  await userEvent.click(getByRole('button', { name: 'クリア' }))
  defaultRerender()

  // 部分文字列でも同様
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), 'ストー')
  defaultRerender()
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク
  expect(getByRole('row', { name: '1-55' })).toBeVisible() // ストーム
  expect(queryByRole('row', { name: '2-26' })).toBeNull() // ハリエット・ビーチャー・ストウ
})

test('複合キーワードによるフィルタ', async () => {
  const { defaultRerender, getByPlaceholderText, getByRole, queryByRole } =
    defaultRender()

  expect(getByRole('row', { name: '2-46' })).toBeVisible() // 孫夫人
  expect(getByRole('row', { name: '2-54' })).toBeVisible() // 蒸気機関車
  expect(getByRole('row', { name: '3-76' })).toBeVisible() // ダンダラ羽織
  expect(getByRole('row', { name: 'R-2' })).toBeVisible() // 源義経
  expect(getByRole('row', { name: '3-62' })).toBeVisible() // パイロオーラ

  // 複合キーワードはAND検索になる
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), '即応 装備')
  defaultRerender()
  expect(getByRole('row', { name: '2-46' })).toBeVisible() // 孫夫人
  expect(getByRole('row', { name: '2-54' })).toBeVisible() // 蒸気機関車
  expect(getByRole('row', { name: '3-76' })).toBeVisible() // ダンダラ羽織
  expect(queryByRole('row', { name: 'R-2' })).toBeNull() // 源義経
  expect(queryByRole('row', { name: '3-62' })).toBeNull() // パイロオーラ
})

test('特性と遺業能力を含めるか否か', async () => {
  const { defaultRerender, getByPlaceholderText, getByRole, queryByRole } =
    defaultRender()

  expect(getByRole('row', { name: '2-37' })).toBeVisible() // 姜維
  expect(getByRole('row', { name: 'Y-1' })).toBeVisible() // 諸葛亮
  expect(getByRole('row', { name: 'Y-9' })).toBeVisible() // 英傑集う大河

  // 含めて検索する
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), '反魂')
  defaultRerender()
  expect(getByRole('row', { name: '2-37' })).toBeVisible() // 姜維
  expect(getByRole('row', { name: 'Y-1' })).toBeVisible() // 諸葛亮
  expect(queryByRole('row', { name: 'Y-9' })).toBeNull() // 英傑集う大河

  // 含めないで検索する
  // prettier-ignore
  await userEvent.click(getByRole('checkbox', { name: '特性と遺業能力も検索する' }))
  defaultRerender()
  expect(getByRole('row', { name: '2-37' })).toBeVisible() // 姜維
  expect(queryByRole('row', { name: 'Y-1' })).toBeNull() // 諸葛亮
  expect(queryByRole('row', { name: 'Y-9' })).toBeNull() // 英傑集う大河
})

test('キーワードと色と種類の複合によるフィルタ', async () => {
  const { defaultRerender, getByPlaceholderText, getByRole, queryByRole } =
    defaultRender()

  // 「条件で絞り込む」を開く
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, '条件で絞り込む')).toBeVisible()

  // 色は既に開いている
  expect(getExpandedButton(getByRole, /色/)).toBeVisible()

  // 種類 (とパワー) は既に開いている
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康
  expect(getByRole('row', { name: '1-75' })).toBeVisible() // 衛青
  expect(getByRole('row', { name: '1-45' })).toBeVisible() // 行基
  expect(getByRole('row', { name: '2-36' })).toBeVisible() // 足利義政
  expect(getByRole('row', { name: '3-9' })).toBeVisible() // 土方歳三
  expect(getByRole('row', { name: '2-50' })).toBeVisible() // 安宅船
  expect(getByRole('row', { name: '2-59' })).toBeVisible() // サモン
  expect(getByRole('row', { name: '4-67' })).toBeVisible() // レッドサークル

  // 赤のイジンで「イジン召喚権」を持つものを探す
  await userEvent.click(getByRole('checkbox', { name: '赤' }))
  defaultRerender()
  // イジンボタンを押す
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()
  // prettier-ignore
  await userEvent.type(getByPlaceholderText('カード名、テキスト、イラストレータで検索'), 'イジン召喚権')
  defaultRerender()

  expect(getByRole('row', { name: '1-10' })).toBeVisible() // 徳川家康
  expect(queryByRole('row', { name: '1-75' })).toBeNull() // 衛青
  expect(queryByRole('row', { name: '1-45' })).toBeNull() // 行基
  expect(queryByRole('row', { name: '2-36' })).toBeNull() // 足利義政
  expect(queryByRole('row', { name: '3-9' })).toBeNull() // 土方歳三
  expect(queryByRole('row', { name: '2-50' })).toBeNull() // 安宅船
  expect(queryByRole('row', { name: '2-59' })).toBeNull() // サモン
  expect(queryByRole('row', { name: '4-67' })).toBeNull() // レッドサークル
})

test('お気に入りカードのみ選ぶ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()
  // prettier-ignore
  expect(getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' })).not.toBeChecked()

  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(getByRole('row', { name: '1-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-3' })).toBeVisible()

  // 1-1 をお気に入りに登録する
  await userEvent.click(
    within(
      within(getByRole('row', { name: '1-1' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  expect(
    within(
      within(getByRole('row', { name: '1-1' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '⭐' }),
  ).toBeVisible()

  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(getByRole('row', { name: '1-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-3' })).toBeVisible()

  // 1-2 をお気に入りに登録する
  await userEvent.click(
    within(
      within(getByRole('row', { name: '1-2' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  expect(
    within(
      within(getByRole('row', { name: '1-2' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '⭐' }),
  ).toBeVisible()

  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(getByRole('row', { name: '1-2' })).toBeVisible()
  expect(getByRole('row', { name: '1-3' })).toBeVisible()

  // お気に入りのみ表示する
  await userEvent.click(
    getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' }),
  )
  defaultRerender()
  expect(
    getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' }),
  ).toBeChecked()

  expect(getByRole('row', { name: '1-1' })).toBeVisible()
  expect(getByRole('row', { name: '1-2' })).toBeVisible()
  expect(queryByRole('row', { name: '1-3' })).toBeNull()

  // この状態で 1-1 をお気に入りから外すと表示も消える
  await userEvent.click(
    within(
      within(getByRole('row', { name: '1-1' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '⭐' }),
  )
  defaultRerender()

  expect(queryByRole('row', { name: '1-1' })).toBeNull()
  expect(getByRole('row', { name: '1-2' })).toBeVisible()
  expect(queryByRole('row', { name: '1-3' })).toBeNull()
})

test('お気に入りとフィルタの組合せ', async () => {
  const { defaultRerender, getByRole, queryByRole } = defaultRender()
  // prettier-ignore
  expect(getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' })).not.toBeChecked()

  expect(getByRole('row', { name: '1-1' })).toBeVisible() // 織田信長 (赤イジン)
  expect(getByRole('row', { name: '2-53' })).toBeVisible() // 武者の蔵 (緑ハイケイ)
  expect(getByRole('row', { name: '3-63' })).toBeVisible() // アイオン (青マホウ)
  expect(getByRole('row', { name: '4-72' })).toBeVisible() // ラ・コロール (黄マリョク)
  expect(getByRole('row', { name: '4-74' })).toBeVisible() // ディ・クローネ (紫マリョク)
  expect(getByRole('row', { name: '4-80' })).toBeVisible() // カルドロン (無力マリョク)

  // 4-80 を除く以上のカードすべてをお気に入りに入れる
  await userEvent.click(
    within(
      within(getByRole('row', { name: '1-1' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '2-53' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '3-63' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '4-72' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '4-74' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()

  expect(getByRole('row', { name: '1-1' })).toBeVisible() // 織田信長 (赤イジン)
  expect(getByRole('row', { name: '2-53' })).toBeVisible() // 武者の蔵 (緑ハイケイ)
  expect(getByRole('row', { name: '3-63' })).toBeVisible() // アイオン (青マホウ)
  expect(getByRole('row', { name: '4-72' })).toBeVisible() // ラ・コロール (黄マリョク)
  expect(getByRole('row', { name: '4-74' })).toBeVisible() // ディ・クローネ (紫マリョク)
  expect(getByRole('row', { name: '4-80' })).toBeVisible() // カルドロン (無力マリョク)

  // お気に入りのみ表示する
  await userEvent.click(
    getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' }),
  )
  defaultRerender()

  expect(getByRole('row', { name: '1-1' })).toBeVisible() // 織田信長 (赤イジン)
  expect(getByRole('row', { name: '2-53' })).toBeVisible() // 武者の蔵 (緑ハイケイ)
  expect(getByRole('row', { name: '3-63' })).toBeVisible() // アイオン (青マホウ)
  expect(getByRole('row', { name: '4-72' })).toBeVisible() // ラ・コロール (黄マリョク)
  expect(getByRole('row', { name: '4-74' })).toBeVisible() // ディ・クローネ (紫マリョク)
  expect(queryByRole('row', { name: '4-80' })).toBeNull() // カルドロン (無力マリョク)

  // さらにマリョクでフィルタする
  await userEvent.click(getCollapsedButton(getByRole, '条件で絞り込む'))
  defaultRerender()
  expect(getExpandedButton(getByRole, /種類とパワー/)).toBeVisible()
  await userEvent.click(getExpandedButton(getByRole, /種類とパワー/))
  defaultRerender()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeVisible()
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  expect(queryByRole('row', { name: '1-1' })).toBeNull() // 織田信長 (赤イジン)
  expect(queryByRole('row', { name: '2-53' })).toBeNull() // 武者の蔵 (緑ハイケイ)
  expect(queryByRole('row', { name: '3-63' })).toBeNull() // アイオン (青マホウ)
  expect(getByRole('row', { name: '4-72' })).toBeVisible() // ラ・コロール (黄マリョク)
  expect(getByRole('row', { name: '4-74' })).toBeVisible() // ディ・クローネ (紫マリョク)
  expect(queryByRole('row', { name: '4-80' })).toBeNull() // カルドロン (無力マリョク)

  // 4-74 をお気に入りから外す
  await userEvent.click(
    within(
      within(getByRole('row', { name: '4-74' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '⭐' }),
  )
  defaultRerender()

  expect(queryByRole('row', { name: '1-1' })).toBeNull() // 織田信長 (赤イジン)
  expect(queryByRole('row', { name: '2-53' })).toBeNull() // 武者の蔵 (緑ハイケイ)
  expect(queryByRole('row', { name: '3-63' })).toBeNull() // アイオン (青マホウ)
  expect(getByRole('row', { name: '4-72' })).toBeVisible() // ラ・コロール (黄マリョク)
  expect(queryByRole('row', { name: '4-74' })).toBeNull() // ディ・クローネ (紫マリョク)
  expect(queryByRole('row', { name: '4-80' })).toBeNull() // カルドロン (無力マリョク)
})

test('お気に入りとキーワードの組合せ', async () => {
  const { defaultRerender, getByPlaceholderText, getByRole, queryByRole } =
    defaultRender()
  // prettier-ignore
  expect(getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' })).not.toBeChecked()

  expect(getByRole('row', { name: '1-55' })).toBeVisible() // ストーム
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '2-75' })).toBeVisible() // RYマーブルストーン
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク

  // 3-79 を除く以上のカードすべてをお気に入りに入れる
  await userEvent.click(
    within(
      within(getByRole('row', { name: '1-55' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '2-7' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()
  await userEvent.click(
    within(
      within(getByRole('row', { name: '2-75' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '☆' }),
  )
  defaultRerender()

  expect(getByRole('row', { name: '1-55' })).toBeVisible() // ストーム
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '2-75' })).toBeVisible() // RYマーブルストーン
  expect(getByRole('row', { name: '3-79' })).toBeVisible() // ストーンマスク

  // お気に入りのみ表示する
  await userEvent.click(
    getByRole('checkbox', { name: 'お気に入りカード⭐のみ検索する' }),
  )
  defaultRerender()

  expect(getByRole('row', { name: '1-55' })).toBeVisible() // ストーム
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '2-75' })).toBeVisible() // RYマーブルストーン
  expect(queryByRole('row', { name: '3-79' })).toBeNull() // ストーンマスク

  // さらにキーワードで絞り込む
  await userEvent.type(
    getByPlaceholderText('カード名、テキスト、イラストレータで検索'),
    'ストーン',
  )
  defaultRerender()

  expect(queryByRole('row', { name: '1-55' })).toBeNull() // ストーム
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(getByRole('row', { name: '2-75' })).toBeVisible() // RYマーブルストーン
  expect(queryByRole('row', { name: '3-79' })).toBeNull() // ストーンマスク

  // 2-75 をお気に入りから外す
  await userEvent.click(
    within(
      within(getByRole('row', { name: '2-75' })).getAllByRole('cell')[1],
    ).getByRole('button', { name: '⭐' }),
  )
  defaultRerender()

  expect(queryByRole('row', { name: '1-55' })).toBeNull() // ストーム
  expect(getByRole('row', { name: '2-7' })).toBeVisible() // 日野富子
  expect(queryByRole('row', { name: '2-75' })).toBeNull() // RYマーブルストーン
  expect(queryByRole('row', { name: '3-79' })).toBeNull() // ストーンマスク
})
