import styles from './PhoneApp.module.css'

export default function Maps({ onBack }) {
  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar}>
        <button className={styles.backBtn} onClick={onBack} style={{color:'#0a84ff'}}>‹ Back</button>
        <span className={styles.appTitle}>Maps</span>
        <div style={{width:60}} />
      </div>

      <div className={styles.mapContainer}>
        {/* Corrupted map visualization */}
        <div className={styles.corruptedMap}>
          {/* Abstract corrupted map grid */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 390 400"
            style={{position:'absolute', inset:0, opacity:0.15}}
          >
            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i*40} x2="390" y2={i*40} stroke="#00d4b8" strokeWidth="0.5" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="400" stroke="#00d4b8" strokeWidth="0.5" />
            ))}
            {/* Corrupted blocks */}
            <rect x="80" y="120" width="60" height="40" fill="#1c3a5e" />
            <rect x="160" y="80" width="100" height="80" fill="#0a2a4a" />
            <rect x="60" y="200" width="200" height="60" fill="#1a3a5e" />
            <rect x="200" y="280" width="80" height="50" fill="#0a2a4a" />
            {/* Roads */}
            <line x1="40" y1="200" x2="350" y2="200" stroke="#3a6a9e" strokeWidth="3" />
            <line x1="200" y1="40" x2="200" y2="360" stroke="#3a6a9e" strokeWidth="3" />
            <path d="M80 160 Q140 140 200 80" stroke="#2a5a8e" strokeWidth="2" fill="none" />
            {/* Location pin */}
            <circle cx="195" cy="195" r="8" fill="#ff3b30" opacity="0.8" />
            <circle cx="195" cy="195" r="14" fill="none" stroke="#ff3b30" strokeWidth="2" opacity="0.4" />
            {/* Error X marks */}
            <text x="280" y="120" fill="#ff3b30" fontSize="20" opacity="0.6">✕</text>
            <text x="100" y="280" fill="#ff3b30" fontSize="14" opacity="0.5">✕</text>
            <text x="300" y="240" fill="#ff3b30" fontSize="16" opacity="0.4">✕</text>
          </svg>

          <div className={styles.mapOverlay}>
            <div className={styles.coordBox}>
              <span className={styles.coordLabel}>Last Known GPS Coordinates</span>
              <div className={styles.coordValue}>
                43.7384° N
              </div>
              <div className={styles.coordValue}>
                7.<span className={styles.coordMissing}>????</span>° E
              </div>
            </div>

            <div className={styles.corruptedWarning}>
              ⚠ GPS DATA CORRUPTED — PARTIAL READ
            </div>

            <div className={styles.coordBox} style={{background:'rgba(0,212,184,0.08)', borderColor:'rgba(0,212,184,0.3)'}}>
              <span className={styles.coordLabel} style={{color:'#00d4b8'}}>Saved Location</span>
              <div style={{color:'#00d4b8', fontFamily:'Courier New', fontSize:'0.9rem', letterSpacing:'0.05em', lineHeight:1.6}}>
                Hotel de Paris<br />
                Monte-Carlo, ????<br />
                <span style={{fontSize:'0.75rem', color:'#636366'}}>May 24, 2024 — Saved pin</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mapHint}>
          <div className={styles.mapHintText}>
            🗺 The longitude coordinate is corrupted. Cross-reference with Voice Memos note #2 and the Browser History to reconstruct the full coordinates.
            <br /><br />
            <strong>Hint:</strong> The complete coordinates point to a small principality on the French Riviera.
          </div>
        </div>
      </div>
    </div>
  )
}
