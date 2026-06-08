import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import styles from './Round2.module.css'

const PUZZLES = [
  {
    id: 1,
    title: 'Puzzle 1: The Storm',
    riddle: "The clouds have not yet spoken.\nTheir message lies in the waiting.\nMeasure the distance between now and the storm,\nAnd the hidden key will reveal itself.",
    image: "/assets/images/r2_1_weather.jpg",
  },
  {
    id: 2,
    title: 'Puzzle 2: The Gathering',
    riddle: "Five papers lie before you.\nFour speak of journeys, payments, and farewells.\nOne remembers a gathering.\nFind where the guests were meant to meet,\nAnd the hidden key will reveal itself.",
    image: "/assets/images/r2_2_receipt.jpg",
  },
  {
    id: 3,
    title: 'Puzzle 3: The Tale',
    riddle: "Do not measure the achievement.\nMeasure the way it is remembered.\nThe key lies not in the quantity,\nBut in the characters that tell its tale.",
    image: "/assets/images/r2_3_post.jpg",
  },
  {
    id: 4,
    title: 'Puzzle 4: The Champion',
    riddle: "One number describes the plan.\nOne number marks what is yet to come.\nOne number celebrates a completed task.\nSeek the champion, and the key is yours.",
    image: "/assets/images/r2_4_calendar.jpg",
  },
  {
    id: 5,
    title: 'Puzzle 5: The Span',
    riddle: "A circle marks the chosen path.\nThree records remain untouched.\nSeek the furthest whisper in time.\nThe key is found not at the destination,\nBut in the span that separates certainty from fate.",
    image: "/assets/images/r2_5_whatsapp.jpg",
  },
  {
    id: 6,
    title: 'Puzzle 6: The Room',
    riddle: "One date unlocks the room,\nAnother turns the final key.\nCount only the darkness in between,\nAnd the hidden number will reveal itself.",
    image: "/assets/images/r2_6_hotel.jpg",
  },
  {
    id: 7,
    title: 'Final Equation',
    riddle: "The numbers don't tell everything but equations do.\n\nTarget Date = (Hotel × Weather) + Receipt + (Calendar - WhatsApp) × Post",
    image: null,
  }
]

export default function Round2() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [answer, setAnswer]             = useState('')
  const [feedback, setFeedback]         = useState(null)
  const [loading, setLoading]           = useState(false)

  const puzzle = PUZZLES[currentSlide]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    setLoading(true)
    setFeedback(null)

    try {
      const { data } = await api.post(`/rounds/2/puzzle/${puzzle.id}/submit`, { answer: answer.trim() })

      if (data.correct) {
        setFeedback({ type: 'success', message: data.message })
        setTimeout(() => {
          if (currentSlide < PUZZLES.length - 1) {
            setCurrentSlide(s => s + 1)
            setAnswer('')
            setFeedback(null)
          } else {
            navigate('/game/victory')
          }
        }, 1000)
      } else {
        setFeedback({ type: 'error', message: data.message })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Server error. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.roundPage}>
      <nav className="navbar">
        <Link to="/game" className="navbar-logo">⟁ PROJECT REWIND</Link>
        <div className="navbar-actions">
          <span className={styles.roundBadge}>ROUND 2</span>
          <Link to="/game" className="btn btn-ghost btn-sm" id="back-to-hub-r2">← Hub</Link>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.tag}>THE DATE CHALLENGE</div>
          <h1 className={styles.title}>Hidden in Plain Sight</h1>
          <p className={styles.desc}>
            Appearances deceive. Hidden within each image lies a number. Only careful observation will reveal it. Solve the sequence to uncover the final equation.
          </p>
        </div>

        {/* Progress indicators */}
        <div className={styles.progressRow}>
          {PUZZLES.map((p, i) => (
            <div key={p.id} className={`${styles.progressDot} ${i === currentSlide ? styles.active : ''} ${i < currentSlide ? styles.completed : ''}`} />
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.slideHeader}>
            <h2 className={styles.slideTitle}>{puzzle.title}</h2>
          </div>

          <div className={styles.slideContent}>
            {puzzle.image && (
              <div className={styles.imageWrapper}>
                <img src={puzzle.image} alt={puzzle.title} className={styles.puzzleImage} />
              </div>
            )}

            <div className={styles.interactionArea}>
              <div className={styles.riddleBox}>
                {puzzle.riddle.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{marginBottom:'1rem'}}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.answerForm}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter the hidden number..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !answer.trim()}
                >
                  {loading ? 'Verifying...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
