import { useState, useEffect } from 'react'

export default function Timer({ startedAt, finishedAt }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startedAt) return
    const start = new Date(startedAt).getTime()
    const end   = finishedAt ? new Date(finishedAt).getTime() : null

    const tick = () => {
      const now = end || Date.now()
      setElapsed(Math.floor((now - start) / 1000))
    }

    tick()
    if (!finishedAt) {
      const interval = setInterval(tick, 1000)
      return () => clearInterval(interval)
    }
  }, [startedAt, finishedAt])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60

  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <div id="game-timer" style={{
      fontFamily: 'Space Mono, monospace',
      fontSize: '0.9rem',
      color: finishedAt ? 'var(--success)' : 'var(--accent-gold)',
      padding: '0.3rem 0.75rem',
      background: finishedAt ? 'rgba(16,185,129,0.1)' : 'rgba(255,209,102,0.08)',
      border: `1px solid ${finishedAt ? 'rgba(16,185,129,0.3)' : 'rgba(255,209,102,0.3)'}`,
      borderRadius: '8px',
      letterSpacing: '0.05em',
    }}>
      {h > 0 ? `${fmt(h)}:` : ''}{fmt(m)}:{fmt(s)}
    </div>
  )
}
