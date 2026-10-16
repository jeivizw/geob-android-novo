import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pix from './pages/Pix'
import Cards from './pages/Cards'

function App() {
  const { session, loading } = useAuth()

  // Exibe o Loading enquanto verifica a memória nativa
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isAuthenticated = !!session

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/pix" element={isAuthenticated ? <Pix /> : <Navigate to="/login" replace />} />
        <Route path="/cards" element={isAuthenticated ? <Cards /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App