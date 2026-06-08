import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import GameHub from './pages/GameHub'
import Round1 from './pages/Round1'
import Round2 from './pages/Round2'
import AdminDashboard from './pages/AdminDashboard'
import Victory from './pages/Victory'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/game" element={
            <ProtectedRoute><GameHub /></ProtectedRoute>
          } />
          <Route path="/game/round/1" element={
            <ProtectedRoute><Round1 /></ProtectedRoute>
          } />
          <Route path="/game/round/2" element={
            <ProtectedRoute><Round2 /></ProtectedRoute>
          } />
          <Route path="/game/victory" element={
            <ProtectedRoute><Victory /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
