import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './JigsawPuzzle.module.css'

const GRID = 4 // 4x4 = 16 tiles

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function JigsawPuzzle({ imageSrc, onComplete, puzzleId }) {
  const [tiles, setTiles]         = useState([])
  const [selected, setSelected]   = useState(null)
  const [solved, setSolved]       = useState(false)
  const [moves, setMoves]         = useState(0)
  const containerRef              = useRef(null)

  // Build initial shuffled tile array
  useEffect(() => {
    const total = GRID * GRID
    const initialTiles = shuffle(Array.from({ length: total }, (_, i) => i))
    setTiles(initialTiles)
    setSolved(false)
    setMoves(0)
    setSelected(null)
  }, [puzzleId])

  const checkSolved = useCallback((arr) => {
    return arr.every((v, i) => v === i)
  }, [])

  const handleTileClick = useCallback((pos) => {
    if (solved) return

    if (selected === null) {
      setSelected(pos)
    } else {
      if (selected === pos) {
        setSelected(null)
        return
      }
      // Swap
      setTiles(prev => {
        const next = [...prev]
        ;[next[selected], next[pos]] = [next[pos], next[selected]]
        if (checkSolved(next)) {
          setSolved(true)
          setTimeout(() => onComplete?.(), 800)
        }
        return next
      })
      setMoves(m => m + 1)
      setSelected(null)
    }
  }, [selected, solved, checkSolved, onComplete])

  const reset = () => {
    const total = GRID * GRID
    setTiles(shuffle(Array.from({ length: total }, (_, i) => i)))
    setSolved(false)
    setMoves(0)
    setSelected(null)
  }

  const size = 100 / GRID // percent per tile

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <span className={styles.moveCount}>Moves: {moves}</span>
        <button className="btn btn-ghost btn-sm" onClick={reset}>↺ Reset</button>
        <span style={{color:'var(--text-muted)', fontSize:'0.8rem', fontFamily:'Space Mono'}}>
          Click two tiles to swap them
        </span>
      </div>

      <div
        ref={containerRef}
        className={`${styles.puzzleGrid} ${solved ? styles.solved : ''}`}
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {tiles.map((tileIndex, pos) => {
          const col = tileIndex % GRID
          const row = Math.floor(tileIndex / GRID)
          const isSelected = selected === pos

          return (
            <div
              key={pos}
              className={`${styles.tile} ${isSelected ? styles.tileSelected : ''} ${solved ? styles.tileSolved : ''}`}
              onClick={() => handleTileClick(pos)}
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${GRID * 100}%`,
                backgroundPosition: `${col * (100 / (GRID - 1))}% ${row * (100 / (GRID - 1))}%`,
              }}
            >
              {isSelected && <div className={styles.selectedOverlay} />}
            </div>
          )
        })}
      </div>

      {solved && (
        <div className={styles.solvedBanner}>
          <span className={styles.solvedIcon}>✓</span>
          <span>MEMORY FRAGMENT RESTORED</span>
        </div>
      )}
    </div>
  )
}
