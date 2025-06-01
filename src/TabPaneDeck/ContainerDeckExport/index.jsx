// SPDX-License-Identifier: MIT

import { useEffect, useRef, useState } from 'react'
import { Button, FormControl, Overlay, Tooltip } from 'react-bootstrap'

import { dataCardsMap } from '../../commons/dataCards'
import { sum } from '../../commons/utils'

function makeTextExportedPart(title, deck) {
  const numCards = sum(deck.values())
  const text = [...deck.entries()]
    .map(([id, numCopies]) => [dataCardsMap.get(id), numCopies])
    .sort((a, b) => a[0].orderDeck - b[0].orderDeck)
    .map(([card, numCopies]) => `\r\n${card.name}\t${numCopies}`)
    .join('')
  return `${title}\t${numCards}${text}`
}

function makeTextExported(deckMain, deckSide) {
  const textMain = makeTextExportedPart('メインデッキ', deckMain)
  const textSide = makeTextExportedPart('サイドデッキ', deckSide)
  return `${textMain}\r\n\r\n${textSide}`
}

function ContainerDeckExport({ deckMain, deckSide }) {
  const [showCopied, setShowCopied] = useState(false)
  const refButton = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCopied(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [showCopied])

  const textExported = makeTextExported(deckMain, deckSide)

  return (
    <>
      <div className="m-2">
        <Button
          ref={refButton}
          variant="outline-secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(textExported)
            setShowCopied(true)
          }}
        >
          ▼テキストデータをコピー
        </Button>
        <Overlay target={refButton.current} show={showCopied} placement="top">
          {(props) => <Tooltip {...props}>コピーしました</Tooltip>}
        </Overlay>
      </div>
      <div className="m-2">
        <FormControl
          readOnly
          as="textarea"
          rows={deckMain.size + deckSide.size + 3}
          value={textExported}
        />
      </div>
    </>
  )
}

export default ContainerDeckExport
