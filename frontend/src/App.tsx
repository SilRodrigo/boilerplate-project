import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EldritchMatch from './pages/eldritch/match/Index'
import { EldritchCharacterSelectPage } from './pages/eldritch/characterSelect/Index'
import { IsSelected } from './components/IsSelected'
import EldritchAdmin from './pages/eldritch/admin/Index'
import EldritchSpectator from './pages/eldritch/spectator/Index'
import HomePage from './pages/home/Index'
import { MOMCharacterSelectPage } from './pages/mansions-of-madness/characterSelect/Index'
import MOMMatch from './pages/mansions-of-madness/match/Index'
import MOMAdmin from './pages/mansions-of-madness/admin/Index'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MOMCharacterSelectPage />
          }
        />
        <Route
          path="eldritch/"
          element={
            <EldritchCharacterSelectPage />
          }
        />
        <Route
          path="eldritch/game"
          element={
            <IsSelected>
              <EldritchMatch />
            </IsSelected>
          }
        />
        <Route
          path="eldritch/admin"
          element={
            <EldritchAdmin />
          }
        />
        <Route
          path="eldritch/spectate"
          element={
            <EldritchSpectator />
          }
        />
        <Route
          path="mansions/"
          element={
            <MOMCharacterSelectPage />
          }
        />
        <Route
          path="mansions/game"
          element={
            <IsSelected>
              <MOMMatch />
            </IsSelected>
          }
        />
        <Route
          path="mansions/admin"
          element={
            <MOMAdmin />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
