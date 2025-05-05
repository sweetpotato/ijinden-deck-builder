import { cleanup, render } from '@testing-library/react'
import { Accordion } from 'react-bootstrap'
import { afterEach, expect, test, vi } from 'vitest'
import AccordionItemRadioFilter from './AccordionItemRadioFilter'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

const dataTypes = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'イジン' },
  { value: 2, label: 'ハイケイ' },
  { value: 3, label: 'マホウ' },
  { value: 4, label: 'マリョク' },
]

const dataColors = [
  { value: 0, label: 'すべて' },
  { value: 1, label: '赤' },
  { value: 2, label: '青' },
  { value: 4, label: '緑' },
  { value: 8, label: '黄' },
  { value: 16, label: '紫' },
  { value: 32, label: '多色' },
  { value: 64, label: '無色' },
]

test('種類のようにビットセットでないフィルタ', async () => {
  const handleChange = vi.fn()
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="種類"
        name="type"
        state={0} // すべて
        handleChange={handleChange}
        data={dataTypes}
      />
    </Accordion>
  )
  expect(handleChange.mock.calls.length).toBe(0)

  let buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  let buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  let buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  let buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  let buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // イジンを選択する
  await userEvent.click(buttonIjin)

  expect(handleChange.mock.calls.length).toBe(1)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('1') // イジン

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="種類"
        name="type"
        state={1} // イジン
        handleChange={handleChange}
        data={dataTypes}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  // イジンが選択されている
  expect(buttonIjin).toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // ハイケイを選択する
  await userEvent.click(buttonHaikei)

  expect(handleChange.mock.calls.length).toBe(2)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('2') // ハイケイ

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="種類"
        name="type"
        state={2} // ハイケイ
        handleChange={handleChange}
        data={dataTypes}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  // ハイケイが選択されている
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マホウを選択する
  await userEvent.click(buttonMahou)

  expect(handleChange.mock.calls.length).toBe(3)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('3') // マホウ

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="種類"
        name="type"
        state={3} // マホウ
        handleChange={handleChange}
        data={dataTypes}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  // マホウが選択されている
  expect(buttonMahou).toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  expect(buttonMaryoku).not.toBeChecked()

  // マリョクを選択する
  await userEvent.click(buttonMaryoku)

  expect(handleChange.mock.calls.length).toBe(4)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('4') // マリョク

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="種類"
        name="type"
        state={4} // マリョク
        handleChange={handleChange}
        data={dataTypes}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonIjin = getByRole('radio', { name: 'イジン' })
  expect(buttonIjin).toBeVisible()
  expect(buttonIjin).not.toBeChecked()
  buttonHaikei = getByRole('radio', { name: 'ハイケイ' })
  expect(buttonHaikei).toBeVisible()
  expect(buttonHaikei).not.toBeChecked()
  buttonMahou = getByRole('radio', { name: 'マホウ' })
  expect(buttonMahou).toBeVisible()
  expect(buttonMahou).not.toBeChecked()
  buttonMaryoku = getByRole('radio', { name: 'マリョク' })
  expect(buttonMaryoku).toBeVisible()
  // マリョクが選択されている
  expect(buttonMaryoku).toBeChecked()
})

test('色のようにビットセットであるフィルタ', async () => {
  const handleChange = vi.fn()
  const { rerender, getByRole } = render(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={0} // すべて
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )
  expect(handleChange.mock.calls.length).toBe(0)

  let buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  // すべてが選択されている
  expect(buttonAll).toBeChecked()
  let buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  let buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  let buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  let buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  let buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  let buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  let buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 赤を選択する
  await userEvent.click(buttonRed)

  expect(handleChange.mock.calls.length).toBe(1)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('1') // 赤

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={1} // 赤
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  // 赤が選択されている
  expect(buttonRed).toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 青を選択する
  await userEvent.click(buttonBlue)

  expect(handleChange.mock.calls.length).toBe(2)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('2') // 青

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={2} // 青
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  // 青が選択されている
  expect(buttonBlue).toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 緑を選択する
  await userEvent.click(buttonGreen)

  expect(handleChange.mock.calls.length).toBe(3)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('4') // 緑

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={4} // 緑
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  // 緑が選択されている
  expect(buttonGreen).toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 黄を選択する
  await userEvent.click(buttonYellow)

  expect(handleChange.mock.calls.length).toBe(4)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('8') // 黄

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={8} // 黄
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  // 緑が選択されている
  expect(buttonYellow).toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 紫を選択する
  await userEvent.click(buttonPurple)

  expect(handleChange.mock.calls.length).toBe(5)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('16') // 紫

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={16} // 紫
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  // 紫が選択されている
  expect(buttonPurple).toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 多色を選択する
  await userEvent.click(buttonMulticolor)

  expect(handleChange.mock.calls.length).toBe(6)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('32') // 多色

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={32} // 多色
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  // 多色が選択されている
  expect(buttonMulticolor).toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  expect(buttonColorless).not.toBeChecked()

  // 無色を選択する
  await userEvent.click(buttonColorless)

  expect(handleChange.mock.calls.length).toBe(7)
  expect(handleChange.mock.lastCall.length).toBe(1)
  // TODO currentTarget が null になってしまう
  expect(handleChange.mock.lastCall[0].currentTarget).toBeNull()
  expect(handleChange.mock.lastCall[0].target.value).toBe('64') // 多色

  rerender(
    <Accordion alwaysOpen>
      <AccordionItemRadioFilter
        eventKey={0}
        title="色"
        name="color"
        state={64} // 無色
        handleChange={handleChange}
        data={dataColors}
      />
    </Accordion>
  )

  buttonAll = getByRole('radio', { name: 'すべて' })
  expect(buttonAll).toBeVisible()
  expect(buttonAll).not.toBeChecked()
  buttonRed = getByRole('radio', { name: '赤' })
  expect(buttonRed).toBeVisible()
  expect(buttonRed).not.toBeChecked()
  buttonBlue = getByRole('radio', { name: '青' })
  expect(buttonBlue).toBeVisible()
  expect(buttonBlue).not.toBeChecked()
  buttonGreen = getByRole('radio', { name: '緑' })
  expect(buttonGreen).toBeVisible()
  expect(buttonGreen).not.toBeChecked()
  buttonYellow = getByRole('radio', { name: '黄' })
  expect(buttonYellow).toBeVisible()
  expect(buttonYellow).not.toBeChecked()
  buttonPurple = getByRole('radio', { name: '紫' })
  expect(buttonPurple).toBeVisible()
  expect(buttonPurple).not.toBeChecked()
  buttonMulticolor = getByRole('radio', { name: '多色' })
  expect(buttonMulticolor).toBeVisible()
  expect(buttonMulticolor).not.toBeChecked()
  buttonColorless = getByRole('radio', { name: '無色' })
  expect(buttonColorless).toBeVisible()
  // 無色が選択されている
  expect(buttonColorless).toBeChecked()
})
