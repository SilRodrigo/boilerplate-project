import './App.css'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout'
import { useAuth } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ContentWrapper from './components/content-wrapper'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/home/Index'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    
    return <ContentWrapper>
      <div>Carregando...</div>
    </ContentWrapper>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ContentWrapper>
                  <HomePage />
                </ContentWrapper>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
