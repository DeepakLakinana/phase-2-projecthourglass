import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import Timer from '../components/Timer'
import styles from './AdminDashboard.module.css'

function formatTime(seconds) {
  if (!seconds) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
    : `${m}m ${String(s).padStart(2,'0')}s`
}

export default function AdminDashboard() {
  const { logout }              = useAuth()
  const [teams, setTeams]       = useState([])
  const [locks, setLocks]       = useState([])
  const [scoreboard, setScore]  = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('teams')
  const [confirmReset, setConfirmReset] = useState(null)

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchAll = async () => {
    try {
      const [teamsRes, locksRes, scoreRes] = await Promise.all([
        api.get('/admin/teams'),
        api.get('/admin/locks'),
        api.get('/admin/scoreboard'),
      ])
      setTeams(teamsRes.data.teams)
      setLocks(locksRes.data.locks)
      setScore(scoreRes.data.scoreboard)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const toggleRoundLock = async (round, currentlyLocked) => {
    const action = currentlyLocked ? 'unlock' : 'lock'
    await api.post(`/admin/rounds/${round}/${action}`)
    fetchAll()
  }

  const toggleTeamLock = async (id, locked) => {
    await api.post(`/admin/teams/${id}/${locked ? 'unlock' : 'lock'}`)
    fetchAll()
  }

  const resetTeam = async (id) => {
    await api.post(`/admin/teams/${id}/reset`)
    setConfirmReset(null)
    fetchAll()
  }

  const getTeamProgress = (team) => {
    if (!team.progress?.length) return { r1p1: false, r1p2: false, r2p1: false }
    return {
      r1p1: team.progress.some(p => p.round_number===1 && p.puzzle_number===1),
      r1p2: team.progress.some(p => p.round_number===1 && p.puzzle_number===2),
      r2p1: team.progress.some(p => p.round_number===2 && p.puzzle_number===1),
    }
  }

  const completedCount = teams.filter(t => t.finished_at).length
  const startedCount   = teams.filter(t => t.started_at && !t.finished_at).length

  if (loading) return <div className="page"><div className="spinner" /></div>

  return (
    <div className={styles.dashboard}>
      <nav className="navbar">
        <span className="navbar-logo">⟁ PROJECT REWIND — ADMIN</span>
        <div className="navbar-actions">
          <span style={{fontFamily:'Space Mono', fontSize:'0.7rem', color:'var(--accent-red)', padding:'0.3rem 0.8rem', background:'rgba(255,59,92,0.08)', border:'1px solid rgba(255,59,92,0.3)', borderRadius:'999px'}}>
            ⚙ CONTROL PANEL
          </span>
          <button className="btn btn-ghost btn-sm" onClick={logout} id="admin-logout">Logout</button>
        </div>
      </nav>

      <div className={styles.content}>
        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{teams.length}</div>
            <div className={styles.statLabel}>Total Teams</div>
          </div>
          <div className={styles.statCard} style={{borderColor:'rgba(255,209,102,0.3)'}}>
            <div className={styles.statNum} style={{color:'var(--accent-gold)'}}>{startedCount}</div>
            <div className={styles.statLabel}>In Progress</div>
          </div>
          <div className={styles.statCard} style={{borderColor:'rgba(16,185,129,0.3)'}}>
            <div className={styles.statNum} style={{color:'var(--success)'}}>{completedCount}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statCard} style={{borderColor:'rgba(167,139,250,0.3)'}}>
            <div className={styles.statNum} style={{color:'var(--accent-purple)'}}>{teams.length - startedCount - completedCount}</div>
            <div className={styles.statLabel}>Not Started</div>
          </div>
        </div>

        {/* Round lock controls */}
        <div className={styles.lockPanel}>
          <h2 className={styles.sectionTitle}>🔒 Round Controls</h2>
          <div className={styles.lockRow}>
            {locks.map(lock => (
              <div key={lock.round_number} className={styles.lockCard}>
                <div className={styles.lockName}>Round {lock.round_number}</div>
                <div className={`badge ${lock.is_locked ? 'badge-danger' : 'badge-success'}`}>
                  {lock.is_locked ? '🔒 Locked' : '🔓 Unlocked'}
                </div>
                <button
                  className={`btn btn-sm ${lock.is_locked ? 'btn-primary' : 'btn-danger'}`}
                  onClick={() => toggleRoundLock(lock.round_number, lock.is_locked)}
                  id={`toggle-round-${lock.round_number}`}
                >
                  {lock.is_locked ? '↳ Unlock' : '↳ Lock'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='teams' ? styles.tabActive : ''}`} onClick={() => setTab('teams')} id="tab-teams">Team Progress</button>
          <button className={`${styles.tab} ${tab==='scoreboard' ? styles.tabActive : ''}`} onClick={() => setTab('scoreboard')} id="tab-scoreboard">Scoreboard</button>
        </div>

        {/* Teams table */}
        {tab === 'teams' && (
          <div className={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Elapsed</th>
                  <th>R1-P1</th>
                  <th>R1-P2</th>
                  <th>R2</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => {
                  const prog = getTeamProgress(team)
                  const status = team.finished_at ? 'complete' : team.started_at ? 'playing' : 'waiting'
                  return (
                    <tr key={team.id}>
                      <td>
                        <div style={{fontWeight:600, color:'var(--text-primary)'}}>{team.team_name}</div>
                        <div style={{fontSize:'0.72rem', fontFamily:'Space Mono', color:'var(--accent-teal)'}}>{team.team_code}</div>
                      </td>
                      <td>
                        {status === 'complete' && <span className="badge badge-success">✓ Done</span>}
                        {status === 'playing'  && <span className="badge badge-gold">▶ Playing</span>}
                        {status === 'waiting'  && <span className="badge badge-muted">○ Waiting</span>}
                        {team.is_locked        && <span className="badge badge-danger" style={{marginLeft:4}}>🔒</span>}
                      </td>
                      <td>
                        {team.started_at
                          ? <Timer startedAt={team.started_at} finishedAt={team.finished_at} />
                          : <span style={{color:'var(--text-muted)'}}>—</span>
                        }
                      </td>
                      <td><span style={{color: prog.r1p1 ? 'var(--success)' : 'var(--text-muted)'}}>{prog.r1p1 ? '✓' : '○'}</span></td>
                      <td><span style={{color: prog.r1p2 ? 'var(--success)' : 'var(--text-muted)'}}>{prog.r1p2 ? '✓' : '○'}</span></td>
                      <td><span style={{color: prog.r2p1 ? 'var(--success)' : 'var(--text-muted)'}}>{prog.r2p1 ? '✓' : '○'}</span></td>
                      <td>
                        <div style={{display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
                          <button
                            className={`btn btn-sm ${team.is_locked ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => toggleTeamLock(team.id, team.is_locked)}
                            id={`team-lock-${team.id}`}
                          >
                            {team.is_locked ? '🔓' : '🔒'}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setConfirmReset(team)}
                            id={`team-reset-${team.id}`}
                          >
                            ↺
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Scoreboard */}
        {tab === 'scoreboard' && (
          <div className={styles.tableWrapper}>
            {scoreboard.length === 0 ? (
              <div style={{textAlign:'center', padding:'3rem', color:'var(--text-muted)'}}>
                No teams have finished yet.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Time</th>
                    <th>Finished At</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreboard.map((row, i) => (
                    <tr key={row.team_code}>
                      <td>
                        <span style={{
                          fontFamily:'Space Mono', fontSize:'1.1rem',
                          color: i===0 ? '#ffd700' : i===1 ? '#c0c0c0' : i===2 ? '#cd7f32' : 'var(--text-muted)'
                        }}>
                          {i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : `#${i+1}`}
                        </span>
                      </td>
                      <td style={{fontWeight:600, color:'var(--text-primary)'}}>{row.team_name}</td>
                      <td style={{fontFamily:'Space Mono', color:'var(--accent-gold)'}}>{formatTime(row.elapsed_seconds)}</td>
                      <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{new Date(row.finished_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Confirm reset modal */}
      {confirmReset && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{marginBottom:'1rem', color:'var(--accent-red)'}}>⚠ Reset Team?</h3>
            <p style={{marginBottom:'1.5rem'}}>
              This will erase all progress for <strong style={{color:'var(--text-primary)'}}>{confirmReset.team_name}</strong>.
              This cannot be undone.
            </p>
            <div style={{display:'flex', gap:'0.75rem'}}>
              <button className="btn btn-danger" style={{flex:1}} onClick={() => resetTeam(confirmReset.id)} id="confirm-reset">
                ↺ Reset
              </button>
              <button className="btn btn-ghost" style={{flex:1}} onClick={() => setConfirmReset(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
