import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token  = localStorage.getItem('token')
    if (stored && token) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const loginTeam = useCallback(async (teamCode, password) => {
    const { data } = await api.post('/auth/login', { teamCode, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ ...data.team, role: 'team' }))
    setUser({ ...data.team, role: 'team' })
    return data
  }, [])

  const loginAdmin = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/admin', { username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: 'admin' }))
    setUser({ username: data.username, role: 'admin' })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, loginTeam, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
