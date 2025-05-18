// SPDX-License-Identifier: MIT

import { useState } from 'react'

import ModalZoom from './ModalZoom'

function useModalZoom() {
  const [id, setId] = useState(null)
  const render = () =>
    id !== null && <ModalZoom id={id} zoomOut={() => setId(null)} />
  return [setId, render]
}

export default useModalZoom
