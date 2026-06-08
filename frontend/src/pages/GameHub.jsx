import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import Timer from '../components/Timer'
import styles from './GameHub.module.css'

export default function GameHub() {
  const { user, logout }          = useAuth()
  const [progress, setProgress]   = useState([])
  const [locks, setLocks]         = useState([])
  const [teamData, setTeamData]   = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/teams/me')
      setProgress(data.progress)
      setLocks(data.roundLocks)
      setTeamData(data.team)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const isPuzzleComplete = (round, puzzle) =>
    progress.some(p => p.round_number === round && p.puzzle_number === puzzle && p.completed_at)

  const isRoundComplete = (round) => {
    if (round === 1) return isPuzzleComplete(1,1) && isPuzzleComplete(1,2)
    if (round === 2) return isPuzzleComplete(2,1)
    return false
  }

  const isRoundLocked = (round) => {
    const lock = locks.find(l => l.round_number === round)
    return lock?.is_locked ?? true
  }

  // Check if team has finished
  const isFinished = teamData?.finished_at != null

  const rounds = [
    {
      number: 1,
      title: 'Timeline Reconstruction',
      description: 'A corrupted memory fragment has been shattered. Assemble the pieces to identify when Sam was last seen.',
      icon: '🧩',
      puzzles: ['Identify the Year', 'Identify the Month'],
    },
    {
      number: 2,
      title: "Sam's Recovered Phone",
      description: "Sam's phone has been recovered from the archive. Dig through the apps to find clues about his location.",
      icon: '📱',
      puzzles: ['Decode all clues → Final location'],
    },
  ]

  if (loading) {
    return <div className="page"><div className="spinner" /></div>
  }

  return (
    <div className={styles.hub}>
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo">⟁ PROJECT REWIND</span>
        <div className="navbar-actions">
          <span className={styles.teamBadge}>{user?.name || user?.code}</span>
          {teamData?.started_at && <Timer startedAt={teamData.started_at} finishedAt={teamData.finished_at} />}
          <button className="btn btn-ghost btn-sm" onClick={logout} id="logout-btn">Logout</button>
        </div>
      </nav>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.caseFile}>CASE FILE #47-B</div>
          <h1 className={`brand-title ${styles.mainTitle}`}>MEMORY ARCHIVE</h1>
          <p className={styles.intro}>
            You have entered a corrupted sector of Sam's memory archive.<br />
            Reconstruct the timeline. Find the location. Find Sam.
          </p>
        </div>

        {isFinished && (
          <div className={styles.completedBanner}>
            <span>🎉</span>
            <span>Mission complete! Check the scoreboard to see your ranking.</span>
            <Link to="/game/victory" className="btn btn-primary btn-sm">View Victory →</Link>
          </div>
        )}

        {/* Rounds grid */}
        <div className={styles.roundsGrid}>
          {rounds.map((round) => {
            const locked   = isRoundLocked(round.number)
            const complete = isRoundComplete(round.number)

            // Round 2 requires Round 1 complete
            const blocked = round.number === 2 && !isRoundComplete(1)

            return (
              <div
                key={round.number}
                className={`${styles.roundCard} ${complete ? styles.roundComplete : ''} ${locked || blocked ? styles.roundLocked : ''}`}
              >
                <div className={styles.roundNumber}>ROUND {round.number}</div>

                <div className={styles.roundIcon}>{round.icon}</div>
                <h2 className={styles.roundTitle}>{round.title}</h2>
                <p className={styles.roundDesc}>{round.description}</p>

                {/* Puzzle checklist */}
                <div className={styles.puzzleList}>
                  {round.puzzles.map((p, i) => {
                    const done = isPuzzleComplete(round.number, i + 1)
                    return (
                      <div key={i} className={`${styles.puzzleItem} ${done ? styles.puzzleDone : ''}`}>
                        <span className={styles.puzzleCheck}>{done ? '✓' : '○'}</span>
                        {p}
                      </div>
                    )
                  })}
                </div>

                {/* Status & action */}
                {complete ? (
                  <div className={styles.completeBadge}>✓ ROUND COMPLETE</div>
                ) : locked ? (
                  <div className={styles.lockedBadge}>🔒 LOCKED BY ADMIN</div>
                ) : blocked ? (
                  <div className={styles.lockedBadge}>⏳ COMPLETE ROUND 1 FIRST</div>
                ) : (
                  <Link
                    to={`/game/round/${round.number}`}
                    className={`btn btn-primary ${styles.enterBtn}`}
                    id={`enter-round-${round.number}`}
                  >
                    ↳ Enter Round {round.number}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
