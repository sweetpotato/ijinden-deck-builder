// SPDX-License-Identifier: MIT

import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'

import { dataCardsMap } from './commons/dataCards'

function ModalZoom({ idZoom, handleClearIdZoom }) {
  return (
    <Modal show onHide={handleClearIdZoom}>
      <ModalHeader closeButton>
        <ModalTitle>{dataCardsMap.get(idZoom).name}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <img
          src={dataCardsMap.get(idZoom).imageUrl}
          alt={dataCardsMap.get(idZoom).name}
          style={{ width: '100%', height: 'auto' }}
        />
      </ModalBody>
    </Modal>
  )
}

export default ModalZoom
