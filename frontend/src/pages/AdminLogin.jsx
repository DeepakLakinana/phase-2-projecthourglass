import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { loginAdmin, user }    = useAuth()
  const navigate                = useNavigate()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginAdmin(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{background:'var(--bg-base)'}}>
      <div style={{width:'100%', maxWidth:420}}>
        <div className="card animate-fadeInUp" style={{border:'1px solid rgba(255,59,92,0.2)'}}>
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <div style={{fontSize:'2.5rem', marginBottom:'0.5rem'}}>⚙</div>
            <h1 style={{fontSize:'1.5rem', fontFamily:'var(--font-display)', letterSpacing:'0.1em', color:'var(--accent-red)'}}>
              ADMIN PORTAL
            </h1>
            <p style={{color:'var(--text-muted)', fontSize:'0.8rem', fontFamily:'var(--font-mono)'}}>
              Restricted access — authorised personnel only
            </p>
          </div>

          {error && <div className="alert alert-error" style={{marginBottom:'1rem'}}>{error}</div>}

          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                className="form-input"
                type="text"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              id="admin-login-submit"
              className="btn btn-danger btn-lg"
              disabled={loading}
              style={{width:'100%'}}
            >
              {loading ? 'AUTHENTICATING...' : '⚙ ACCESS CONTROL PANEL'}
            </button>
          </form>

          <div style={{textAlign:'center', marginTop:'1rem'}}>
            <a href="/login" style={{color:'var(--text-muted)', fontSize:'0.8rem', textDecoration:'none'}}>
              ← Back to team login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
