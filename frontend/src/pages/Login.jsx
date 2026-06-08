import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

const BOOT_LINES = [
  '> INITIALISING PROJECT REWIND v3.7.2...',
  '> LOADING MEMORY ARCHIVE PROTOCOLS...',
  '> CORRUPTED SECTORS DETECTED: 847/2048',
  '> ATTEMPTING PARTIAL RECONSTRUCTION...',
  '> ENTERING CORRUPTED MEMORY SPACE...',
  '> AUTHENTICATION REQUIRED.',
]

export default function Login() {
  const [teamCode, setTeamCode]     = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [bootDone, setBootDone]     = useState(false)
  const [bootLines, setBootLines]   = useState([])
  const { loginTeam, user }         = useAuth()
  const navigate                    = useNavigate()

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/game', { replace: true })
  }, [user, navigate])

  // Boot sequence animation
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setBootDone(true), 400)
      }
    }, 350)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginTeam(teamCode.trim(), password)
      navigate('/game')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      {/* Animated grid background */}
      <div className={styles.grid} />

      {/* Scanline overlay */}
      <div className={styles.scanlineOverlay} />

      <div className={styles.container}>
        {/* Boot terminal */}
        <div className={styles.bootTerminal}>
          <div className={styles.terminalBar}>
            <span className={styles.dot} style={{background:'#ff5f57'}} />
            <span className={styles.dot} style={{background:'#febc2e'}} />
            <span className={styles.dot} style={{background:'#28c840'}} />
            <span className={styles.terminalTitle}>MEMORY_ARCHIVE_SYS</span>
          </div>
          <div className={styles.terminalBody}>
            {bootLines.map((line, i) => (
              <div key={i} className={styles.terminalLine} style={{animationDelay:`${i*0.05}s`}}>
                {line}
              </div>
            ))}
            {!bootDone && <span className={styles.cursor}>█</span>}
          </div>
        </div>

        {/* Login card */}
        {bootDone && (
          <div className={`${styles.loginCard} animate-fadeInUp`}>
            {/* Logo */}
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}>⟁</div>
              <h1 className={`${styles.title} brand-title glitch-text`}>PROJECT REWIND</h1>
              <p className={styles.subtitle}>Memory Archive Access Terminal</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="teamCode">Team ID</label>
                <input
                  id="teamCode"
                  className="form-input"
                  type="text"
                  placeholder="e.g. TEAM01"
                  value={teamCode}
                  onChange={e => setTeamCode(e.target.value.toUpperCase())}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Access Code</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Enter your access code"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="login-submit"
                style={{width:'100%', marginTop:'0.5rem'}}
              >
                {loading ? <><span className="spinner" style={{width:20,height:20}} /> AUTHENTICATING...</> : '↳ ACCESS ARCHIVE'}
              </button>
            </form>

            <div className={styles.adminLink}>
              <Link to="/admin-login" id="admin-login-link">Admin portal →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
