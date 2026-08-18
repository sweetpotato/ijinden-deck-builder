// SPDX-License-Identifier: MIT

import { useDeferredValue, useState } from 'react'

import ContainerTextSearch from './ContainerTextSearch'

function useContainerTextSearch() {
  const [keywords, setKeywords] = useState([])
  const [includesTraitAndLegacy, setIncludesTraitAndLegacy] = useState(true)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const deferredKeywords = useDeferredValue(keywords)
  const deferredOnlyFavorites = useDeferredValue(onlyFavorites)

  function handleChangeKeywords(e) {
    setKeywords(
      e.currentTarget.value
        .trim()
        .split(/\s+/)
        .filter((e) => e.length > 0),
    )
  }

  function handleChangeIncludesTraitAndLegacy(e) {
    setIncludesTraitAndLegacy(e.currentTarget.checked)
  }

  function handleChangeOnlyFavorites(e) {
    setOnlyFavorites(e.currentTarget.checked)
  }

  const render = () => {
    return (
      <ContainerTextSearch
        includesTraitAndLegacy={includesTraitAndLegacy}
        onlyFavorites={onlyFavorites}
        handleChangeKeywords={handleChangeKeywords}
        handleChangeIncludesTraitAndLegacy={handleChangeIncludesTraitAndLegacy}
        handleChangeOnlyFavorites={handleChangeOnlyFavorites}
      />
    )
  }
  return [
    deferredKeywords,
    includesTraitAndLegacy,
    deferredOnlyFavorites,
    render,
  ]
}

export default useContainerTextSearch
