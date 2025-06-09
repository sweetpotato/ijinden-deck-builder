// SPDX-License-Identifier: MIT

import { useId, useRef } from 'react'
import { Button, FormCheck, FormControl, InputGroup } from 'react-bootstrap'

function ContainerTextSearch({
  handleChangeKeywords,
  handleChangeIncludesTraitAndLegacy,
}) {
  const ref = useRef(null)
  const idInput = useId()

  function handleClickClear() {
    /*
     * テキストボックスの現在のテキストを state として保持し、
     * FormControl に value={state} を指定して
     * 入力値が変わるたびに再レンダリングするように
     * このコンポーネントを実装してみたところ、
     * 単体テストにおける userEvent.type() 実行後の
     * アサーションを自然に書くことができなかった。
     *
     * そこで value={state} は指定せず、代わりに、
     * クリアボタンが押されたときに
     * テキストボックスを空にするイベントを模倣し、
     * handleChangeKeywords() にそれらしい引数を与えて呼び出す。
     * これは当該関数の実装が既知であることを前提としたコードであり、
     * 決してキレイではないどころかむしろ汚いが、
     * 意識すべき範囲は useContainerTextSearch までと
     * 比較的小さく閉じていることから、この実装を採用する。
     */
    ref.current.value = ''
    handleChangeKeywords({ currentTarget: { value: '' } })
  }

  return (
    <>
      <div className="m-2">
        <InputGroup>
          <FormControl
            ref={ref}
            id={idInput}
            type="text"
            placeholder="カード名やルールテキストで検索"
            onChange={handleChangeKeywords}
          />
          <Button variant="outline-danger" onClick={handleClickClear}>
            クリア
          </Button>
        </InputGroup>
      </div>
      <div className="m-2">
        <FormCheck
          id="includes-trait-and-legacy"
          type="checkbox"
          label="特性と遺業能力も検索する"
          defaultChecked={true}
          onChange={handleChangeIncludesTraitAndLegacy}
        />
      </div>
    </>
  )
}

export default ContainerTextSearch
