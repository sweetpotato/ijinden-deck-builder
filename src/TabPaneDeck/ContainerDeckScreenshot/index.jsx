// SPDX-License-Identifier: MIT

import { useRef } from 'react'
import { Button } from 'react-bootstrap'

import CanvasScreenshot from './CanvasScreenshot'
import { getCanvasSpec, isCanvasEnabled } from './CanvasScreenshot/utils'

// YYYY/mm/dd HH:MM:SS
const DTF = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function ContainerDeckScreenshot({ deckMain, deckSide }) {
  const ref = useRef(null)
  const spec = getCanvasSpec(deckMain.size, deckSide.size)

  function handleClickDownload() {
    const url = ref.current.toDataURL()
    const link = document.createElement('a')
    const dt = Date.now()
    link.download =
      'ijinden-deck-builder-' + DTF.format(dt).replaceAll(/[ :/]/g, '-')
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="container-button m-2">
        <Button
          className="button-download"
          disabled={!isCanvasEnabled(spec)}
          variant="outline-secondary"
          onClick={handleClickDownload}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-download"
            viewBox="0 0 16 16"
            style={{ marginRight: '0.25rem' }}
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
          </svg>
          レシピ画像をダウンロードβ
        </Button>
      </div>
      <CanvasScreenshot
        refCanvas={ref}
        deckMain={deckMain}
        deckSide={deckSide}
        spec={spec}
      />
    </>
  )
}

export default ContainerDeckScreenshot
