import { Route, Routes } from 'react-router-dom'
import Home from './Home'

function App() {
  return (
    <Routes>
      <Route path="/ijinden-deck-builder/deck/:code" element={<Home />} />
      <Route path="/ijinden-deck-builder/" element={<Home />} />
    </Routes>
  )
}

export default App
