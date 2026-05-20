import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SimulationSelect from './pages/SimulationSelect'
import Game from './pages/Game'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/simulations" element={<SimulationSelect />} />
      <Route path="/game/:simulationType" element={<Game />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App