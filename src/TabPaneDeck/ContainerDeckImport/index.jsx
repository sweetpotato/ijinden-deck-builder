import { useId, useRef, useState } from 'react'
import { Alert, Button, FormControl, InputGroup } from 'react-bootstrap'
import { decodeDeck } from '../../commons/dataCards'

function ContainerDeckImport({ dispatchSetFromEntries }) {
  const ref = useRef()
  const idInput = useId()
  // TODO レシピペイントップのエラー表示と統合したい
  const [showError, setShowError] = useState(false)

  function handleClickImport() {
    const inputValue = ref.current.value
    // base は trailing slash (/) を含む
    const base = import.meta.env.VITE_LOCAL_BASE || import.meta.env.BASE_URL
    const hashDeck = base + '#/deck/'
    if (!inputValue.startsWith(hashDeck)) {
      setShowError(true)
      return
    }
    const code = inputValue.substring(hashDeck.length)
    const resultDecode = decodeDeck(code)
    if (!resultDecode) {
      setShowError(true)
      return
    }
    // インポート成功
    dispatchSetFromEntries(resultDecode[0], resultDecode[1])
    setShowError(false)
    // テキストボックスを空にする
    ref.current.value = ''
    // ページトップへスクロールする
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <div className="m-2">
        <InputGroup>
          <Button variant="outline-secondary" onClick={handleClickImport}>
            インポート◀
          </Button>
          <FormControl
            ref={ref}
            id={idInput}
            type="text"
            placeholder="ここに共有リンクを貼り付け"
          />
        </InputGroup>
      </div>
      {showError && (
        <Alert
          className="m-2"
          dismissible
          variant="danger"
          onClose={() => setShowError(false)}
        >
          共有リンクが正しくありません。
        </Alert>
      )}
    </>
  )
}

export default ContainerDeckImport
