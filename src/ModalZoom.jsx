// SPDX-License-Identifier: MIT

import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'

import { dataCardsMap } from './commons/dataCards'

function ModalZoom({ id, zoomOut }) {
  return (
    <Modal show onHide={zoomOut}>
      <ModalHeader closeButton>
        <ModalTitle>{dataCardsMap.get(id).displayName}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <img
          src={dataCardsMap.get(id).imageUrl}
          alt={dataCardsMap.get(id).displayName}
          style={{ width: '100%', height: 'auto' }}
        />
      </ModalBody>
    </Modal>
  )
}

export default ModalZoom
