// SPDX-License-Identifier: MIT

import { Route, Routes } from 'react-router-dom'

import Home from './Home'

function App() {
  return (
    <Routes>
      <Route path="/deck/:code" element={<Home />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
