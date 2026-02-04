// SPDX-License-Identifier: MIT

import { useRef } from 'react'

import CanvasScreenshot from './CanvasScreenshot'

function useCanvasScreenshot() {
  const ref = useRef(null)
  const render = (deckMain, deckSide, spec) => {
    return (
      <CanvasScreenshot
        refCanvas={ref}
        deckMain={deckMain}
        deckSide={deckSide}
        spec={spec}
      />
    )
  }
  return [ref, render]
}

export default useCanvasScreenshot
