// SPDX-License-Identifier: MIT

import { useDeferredValue, useState } from 'react'

import ContainerTextSearch from './ContainerTextSearch'

function useContainerTextSearch() {
  const [keywords, setKeywords] = useState([])
  const [includesTraitAndLegacy, setIncludesTraitAndLegacy] = useState(true)
  const deferredKeywords = useDeferredValue(keywords)

  function handleChangeKeywords(e) {
    setKeywords(
      e.currentTarget.value
        .trim()
        .split(/\s+/)
        .filter((e) => e.length > 0)
    )
  }

  function handleChangeIncludesTraitAndLegacy(e) {
    setIncludesTraitAndLegacy(e.currentTarget.checked)
  }

  const render = () => {
    return (
      <ContainerTextSearch
        handleChangeKeywords={handleChangeKeywords}
        handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
      />
    )
  }
  return [deferredKeywords, includesTraitAndLegacy, render]
}

export default useContainerTextSearch
