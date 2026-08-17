// SPDX-License-Identifier: MIT

import { Table } from 'react-bootstrap'

import TableRowCard from './TableRowCard'

function TableCards({ model, dispatchDeck, zoomIn, interruptSimulator }) {
  return (
    <Table hover variant="light">
      <thead className="sticky-top">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">カード名</th>
          <th scope="col">メイン</th>
          <th scope="col">サイド</th>
        </tr>
      </thead>
      <tbody>
        {model.map((element) => (
          <TableRowCard
            key={element.id}
            id={element.id}
            displayName={element.displayName}
            color={element.color}
            term={element.term}
            counterMain={element.counterMain}
            counterSide={element.counterSide}
            dispatchDeck={dispatchDeck}
            zoomIn={zoomIn}
            interruptSimulator={interruptSimulator}
          />
        ))}
      </tbody>
    </Table>
  )
}

export default TableCards
