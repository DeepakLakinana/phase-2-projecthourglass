import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Victory.module.css'

export default function Victory() {
  const { user } = useAuth()
  const canvasRef = useRef(null)

  // Particle confetti animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1,
      color: ['#00d4b8','#ffd166','#a78bfa','#ff3b5c','#10b981'][Math.floor(Math.random()*5)],
      size: Math.random() * 8 + 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
    }))

    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size/2)
        ctx.restore()
        p.x  += p.vx
        p.y  += p.vy
        p.angle += p.spin
        if (p.y > canvas.height) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className={styles.victoryPage}>
      <canvas ref={canvasRef} className={styles.confetti} />

      <div className={`${styles.card} animate-fadeInUp`}>
        <div className={styles.icon}>🏁</div>
        <div className={styles.tag}>MISSION COMPLETE</div>
        <h1 className={`brand-title ${styles.title}`}>SAM FOUND</h1>

        <div className={styles.reveal}>
          <div className={styles.revealLabel}>LOCATION IDENTIFIED</div>
          <div className={`glitch-text ${styles.location}`}>MONACO</div>
          <div className={styles.coords}>43.7384° N — 7.4246° E</div>
        </div>

        <p className={styles.story}>
          Sam was attending the <strong>2024 Monaco Formula 1 Grand Prix</strong>.
          His last known location was the Port Hercule marina, where he was boarding
          a yacht the evening of May 26th. The corrupted memory archive has been
          successfully reconstructed.
        </p>

        <div className={styles.teamName}>
          Team: <span>{user?.name || user?.code}</span>
        </div>

        <div style={{display:'flex', gap:'1rem', marginTop:'2rem', flexWrap:'wrap', justifyContent:'center'}}>
          <Link to="/game" className="btn btn-primary btn-lg" id="back-to-hub-victory">← Back to Hub</Link>
        </div>
      </div>
    </div>
  )
}
