import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import JigsawPuzzle from '../components/JigsawPuzzle'
import styles from './Round1.module.css'

const ANSWERS = {
  1: '2024',
  2: 'MAY',
}

const STEPS = [
  {
    puzzle: 1,
    title: 'PUZZLE 1 — Identify the Year',
    story: 'The system reports this memory is the last checkpoint before Sam disappeared. Important details have been shattered into fragments. Assemble the puzzle to reveal a collage of major world events — they all point to a single year.',
    imageSrc: '/assets/images/puzzle1_year.jpg',
    placeholder: 'Enter the year (e.g. 2024)',
    inputLabel: 'WHAT YEAR?',
    hint: 'Think about the Paris Olympics, F1 World Championship, and major global elections.',
  },
  {
    puzzle: 2,
    title: 'PUZZLE 2 — Identify the Month',
    story: 'The memory stabilises further, revealing another corrupted file. Assemble this puzzle to uncover three significant events that share the same month.',
    imageSrc: '/assets/images/puzzle2_month.jpg',
    placeholder: 'Enter the month (e.g. May)',
    inputLabel: 'WHAT MONTH?',
    hint: "Think about the Cannes Film Festival, International Workers' Day, and Mother's Day.",
  },
]

export default function Round1() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [answer, setAnswer]            = useState('')
  const [feedback, setFeedback]        = useState(null)
  const [loading, setLoading]          = useState(false)
  const [showHint, setShowHint]        = useState(false)

  const step = STEPS[currentStep]

  const handlePuzzleComplete = () => {
    setPuzzleSolved(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    setLoading(true)
    setFeedback(null)

    const correct = ANSWERS[step.puzzle]
    const match = answer.trim().toUpperCase() === correct

    setTimeout(() => {
      if (match) {
        setFeedback({ type: 'success', message: 'Correct!' })
        setTimeout(() => {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(1)
            setPuzzleSolved(false)
            setAnswer('')
            setFeedback(null)
            setShowHint(false)
          } else {
            navigate('/game')
          }
        }, 1500)
      } else {
        setFeedback({ type: 'error', message: 'Incorrect. Try again.' })
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className={styles.roundPage}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/game" className="navbar-logo">⟁ PROJECT REWIND</Link>
        <div className="navbar-actions">
          <span className={styles.roundBadge}>ROUND 1</span>
          <Link to="/game" className="btn btn-ghost btn-sm" id="back-to-hub">← Hub</Link>
        </div>
      </nav>

      <div className={styles.content}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          {STEPS.map((s, i) => (
            <div key={i} className={`${styles.progressStep} ${i < currentStep ? styles.done : ''} ${i === currentStep ? styles.active : ''}`}>
              <div className={styles.progressDot}>{i < currentStep ? '✓' : i + 1}</div>
              <span>{i === 0 ? 'Year' : 'Month'}</span>
            </div>
          ))}
          <div className={styles.progressLine} />
        </div>

        <div className={styles.stepHeader}>
          <div className={styles.stepTag}>TIMELINE RECONSTRUCTION</div>
          <h1 className={styles.stepTitle}>{step.title}</h1>
          <p className={styles.story}>{step.story}</p>
        </div>

        <div className={styles.twoCol}>
          {/* Puzzle */}
          <div className={styles.puzzleArea}>
            <JigsawPuzzle
              imageSrc={step.imageSrc}
              onComplete={handlePuzzleComplete}
              puzzleId={currentStep}
            />
          </div>

          {/* Answer panel */}
          <div className={styles.answerPanel}>
            {!puzzleSolved ? (
              <div className={styles.waitingPanel}>
                <div className={styles.lockIcon}>🔒</div>
                <p style={{color:'var(--text-muted)', textAlign:'center', fontFamily:'Space Mono', fontSize:'0.85rem'}}>
                  Assemble the puzzle to unlock the answer input.
                </p>
              </div>
            ) : (
              <div className={`${styles.answerForm} animate-fadeInUp`}>
                <div className={styles.answerTitle}>
                  <span className={styles.checkMark}>✓</span> PUZZLE ASSEMBLED
                </div>
                <p style={{color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'1.5rem'}}>
                  Study the completed image carefully. What does it tell you?
                </p>

                {feedback && (
                  <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{marginBottom:'1rem'}}>
                    {feedback.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`answer-${currentStep}`}>{step.inputLabel}</label>
                    <input
                      id={`answer-${currentStep}`}
                      className="form-input"
                      type="text"
                      placeholder={step.placeholder}
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !answer.trim()}
                    id={`submit-puzzle-${step.puzzle}`}
                  >
                    {loading ? 'VERIFYING...' : '↳ Submit Answer'}
                  </button>
                </form>

                <button
                  className={styles.hintBtn}
                  onClick={() => setShowHint(!showHint)}
                  id={`hint-btn-${step.puzzle}`}
                >
                  {showHint ? '▲ Hide hint' : '▼ Need a hint?'}
                </button>

                {showHint && (
                  <div className="alert alert-info animate-fadeInUp" style={{marginTop:'0.75rem'}}>
                    💡 {step.hint}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
