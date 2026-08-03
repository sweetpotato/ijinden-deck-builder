import { act } from 'react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import enumComparator from '../enumComparator'
import enumType from '../enumType'
import useAccordionItemTypeFilter from '.'

function getType(result) {
  return result.current[0]
}

function getPower(result) {
  return result.current[1]
}

function getComparator(result) {
  return result.current[2]
}

function getResetFn(result) {
  return result.current[3]
}

function getRenderFn(result) {
  return result.current[4]
}

function defaultRender() {
  const { result } = renderHook(() => useAccordionItemTypeFilter())
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>,
  )
  const defaultRerender = () =>
    rerender(<Accordion alwaysOpen>{getRenderFn(result)('0')}</Accordion>)
  return { result, defaultRerender, getByRole }
}

afterEach(cleanup)

test('デフォルトのレンダリング', () => {
  const { getByRole } = defaultRender()

  // 「すべて」「イジン」「ハイケイ」「マホウ」「マリョク」ボタンがある
  expect(getByRole('checkbox', { name: 'すべて' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked() // 選択されている
  expect(getByRole('checkbox', { name: 'イジン' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeVisible()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()

  // スライダーと「以上」「以下」「等しい」ボタンがあって非活性である
  expect(getByRole('slider')).toBeVisible()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeVisible()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked() // 選択されている
  expect(getByRole('radio', { name: '以下' })).toBeVisible()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeVisible()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

// prettier-ignore
test('アクセシビリティ', () => {
  const { getByRole } = defaultRender()

  // リストアイテムとして取得できる
  const item = getByRole('listitem', { name: '種類とパワー' })
  expect(item).toBeVisible()
  // スライダーとボタンが取得できる
  expect(within(item).getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(within(item).getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(within(item).getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(within(item).getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(within(item).getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(within(item).getByRole('slider')).toBeDisabled()
  expect(within(item).getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(within(item).getByRole('radio', { name: '以上' })).toBeChecked()
  expect(within(item).getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(within(item).getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(within(item).getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(within(item).getByRole('radio', { name: '等しい' })).not.toBeChecked()
  // ヘッダ部分はボタンとして取得できる
  // TODO 正規表現でなく部分文字列マッチさせたい
  expect(getByRole('button', { name: /種類とパワー/ })).toBeVisible()
})

test('イジン以外をひとつ選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「すべて」を選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MAHOU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「すべて」を選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「すべて」を選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジン以外を選択して状態をリセットする', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジン以外を再選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MAHOU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マホウを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マリョクを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジン以外を複数選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // さらにマホウを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.HAIKEI | enumType.MAHOU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // さらにマリョクを選択する
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  // prettier-ignore
  expect(getType(result)).toBe(enumType.HAIKEI | enumType.MAHOU | enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MAHOU | enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マホウを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'マホウ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.MARYOKU)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // マリョクを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'マリョク' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「すべて」を再選択する
  await userEvent.click(getByRole('checkbox', { name: 'すべて' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択して状態をリセットする', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // リセットすると「すべて」が選択される
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを再選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを再選択する
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンとその他を複数選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では「すべて」が選択されている
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(getByRole('checkbox', { name: 'ハイケイ' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN | enumType.HAIKEI)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択してスライダーを操作する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態ではスライダーは無効である
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled() // 無効
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択するとスライダーが有効になる
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled() // 有効になった
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // スライダーを500にする
  fireEvent.change(getByRole('slider'), { target: { value: '500' } })
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(500)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('500')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // スライダーを10000にする
  fireEvent.change(getByRole('slider'), { target: { value: '10000' } })
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(10000)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('10000')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // リセットすると無効になって0になる
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})

test('イジンを選択して比較方法ボタンを選択する', async () => {
  const { result, defaultRerender, getByRole } = defaultRender()

  // 初期状態では比較方法ボタンは無効
  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // イジンを選択すると比較方法ボタンが有効になる
  await userEvent.click(getByRole('checkbox', { name: 'イジン' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「以下」を選択する
  await userEvent.click(getByRole('radio', { name: '以下' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.LE)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()

  // 「等しい」を選択する
  await userEvent.click(getByRole('radio', { name: '等しい' }))
  defaultRerender()

  expect(getType(result)).toBe(enumType.IJIN)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.EQ)
  expect(getByRole('checkbox', { name: 'すべて' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeEnabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeEnabled()
  expect(getByRole('radio', { name: '以上' })).not.toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeEnabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeEnabled()
  expect(getByRole('radio', { name: '等しい' })).toBeChecked()

  // リセットすると無効になって「以上」が選択される
  await act(() => getResetFn(result)())
  defaultRerender()

  expect(getType(result)).toBe(0)
  expect(getPower(result)).toBe(0)
  expect(getComparator(result)).toBe(enumComparator.GE)
  expect(getByRole('checkbox', { name: 'すべて' })).toBeChecked()
  expect(getByRole('checkbox', { name: 'イジン' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'ハイケイ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マホウ' })).not.toBeChecked()
  expect(getByRole('checkbox', { name: 'マリョク' })).not.toBeChecked()
  expect(getByRole('slider')).toBeDisabled()
  expect(getByRole('slider')).toHaveValue('0')
  expect(getByRole('radio', { name: '以上' })).toBeDisabled()
  expect(getByRole('radio', { name: '以上' })).toBeChecked()
  expect(getByRole('radio', { name: '以下' })).toBeDisabled()
  expect(getByRole('radio', { name: '以下' })).not.toBeChecked()
  expect(getByRole('radio', { name: '等しい' })).toBeDisabled()
  expect(getByRole('radio', { name: '等しい' })).not.toBeChecked()
})
