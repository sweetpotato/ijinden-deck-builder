// SPDX-License-Identifier: MIT

import { afterEach, expect, test } from 'vitest'
import { cleanup, render, renderHook } from '@testing-library/react'

import { getCanvasSpec } from './utils'
import useCanvasScreenshot from '.'

function getRef(result) {
  return result.current[0]
}

function getRenderFn(result) {
  return result.current[1]
}

afterEach(cleanup)

test('レンダリング', () => {
  const { result } = renderHook(() => useCanvasScreenshot())
  const deckMain = new Map()
  const deckSide = new Map()
  const spec = getCanvasSpec(deckMain.size, deckSide.size)

  const { container } = render(getRenderFn(result)(deckMain, deckSide, spec))

  expect(getRef(result).current.toDataURL).toBeTypeOf('function')

  expect(container.getElementsByTagName('canvas').length).toEqual(1)
  const canvas = container.getElementsByTagName('canvas')[0]
  expect(canvas).not.toBeVisible()
  expect(canvas).toHaveAttribute('width')
  const width = parseInt(canvas.getAttribute('width'))
  expect(width).toBeGreaterThanOrEqual(0)
  expect(canvas).toHaveAttribute('height')
  const height = parseInt(canvas.getAttribute('height'))
  expect(height).toBeGreaterThanOrEqual(0)
})
