// SPDX-License-Identifier: MIT

import { FormCheck, FormControl } from 'react-bootstrap'

function ContainerTextSearch({
  handleChangeKeywords,
  handleChangeIncludesTraitAndLegacy,
}) {
  return (
    <>
      <div className="m-2">
        <FormControl
          placeholder="カード名やルールテキストを入力して検索"
          onChange={handleChangeKeywords}
        />
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
