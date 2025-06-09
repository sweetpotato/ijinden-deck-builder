// SPDX-License-Identifier: MIT

import { useEffect, useId, useRef, useState } from 'react'
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Tooltip,
} from 'react-bootstrap'

import { encodeDeck } from '../../commons/dataCards'

function ContainerDeckShare({ deckMain, deckSide }) {
  const [showCopied, setShowCopied] = useState(false)
  const refButton = useRef()
  const idButton = useId()
  const idInput = useId()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCopied(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [showCopied])

  // base は trailing slash (/) を含む
  const base = import.meta.env.VITE_LOCAL_BASE || import.meta.env.BASE_URL
  const deckCode = encodeDeck([...deckMain.entries()], [...deckSide.entries()])
  const deckUrl = deckCode ? `${base}#/deck/${deckCode}` : null

  return (
    <div className="m-2">
      <InputGroup>
        <Button
          id={idButton}
          ref={refButton}
          variant="outline-secondary"
          disabled={!deckUrl}
          onClick={async () => {
            await navigator.clipboard.writeText(deckUrl)
            setShowCopied(true)
          }}
        >
          ▶共有リンクをコピー
        </Button>
        <Overlay
          target={refButton.current}
          show={showCopied}
          placement="bottom"
        >
          {(props) => <Tooltip {...props}>コピーしました</Tooltip>}
        </Overlay>
        <FormControl
          id={idInput}
          readOnly
          aria-labelledby={idButton}
          type="text"
          value={deckUrl || '(共有できる条件を満たしていません)'}
        />
      </InputGroup>
    </div>
  )
}

export default ContainerDeckShare
