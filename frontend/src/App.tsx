import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Match from './pages/eldritch/match/Index'
import { CharacterSelectPage } from './pages/eldritch/characterSelect/Index'
import { applyTheme } from './theme/applyTheme'
import { eldritchTheme } from './theme/eldritch'
import { useEffect } from 'react'
import { IsSelected } from './components/eldritch/IsSelected'
import Admin from './pages/eldritch/admin/Index'
import Spectator from './pages/eldritch/spectator/Index'
function App() {

  useEffect(() => {
    applyTheme(eldritchTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CharacterSelectPage />
          }
        />
        <Route
          path="/mock-game"
          element={
            <IsSelected>
              <Match />
            </IsSelected>
          }
        />
        <Route
          path="/admin"
          element={
            <Admin />
          }
        />
        <Route
          path="/spectate"
          element={
            <Spectator />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
