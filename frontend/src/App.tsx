import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MockGame from './pages/eldritch/mockGame/Index'
import { CharacterSelectPage } from './pages/eldritch/characterSelect/Index'
import { applyTheme } from './theme/applyTheme'
import { eldritchTheme } from './theme/eldritch'
import { useEffect } from 'react'
import { IsSelected } from './components/eldritch/IsSelected'
import Admin from './pages/eldritch/admin/Index'


{/* <GameProvider>
  <CharacterSelectPage onConfirm={() =>} />
</GameProvider> */}

function App() {

  useEffect(() => {
    applyTheme(eldritchTheme);
  }, []);

  return (
    <AuthProvider>
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
                <MockGame />
              </IsSelected>
            }
          />
          <Route
            path="/admin"
            element={
                <Admin />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
