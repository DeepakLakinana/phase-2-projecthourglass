import { useState } from 'react'
import styles from './Smartphone.module.css'
import Gallery from './phone/Gallery'
import Messages from './phone/Messages'
import VoiceNotes from './phone/VoiceNotes'
import BrowserHistory from './phone/BrowserHistory'
import Maps from './phone/Maps'
import Downloads from './phone/Downloads'

const APPS = [
  { id: 'gallery',   label: 'Gallery',   icon: '🖼', color: '#ff9a56' },
  { id: 'messages',  label: 'Messages',  icon: '💬', color: '#34c759' },
  { id: 'voice',     label: 'Voice Notes', icon: '🎙', color: '#ff3b30' },
  { id: 'browser',   label: 'Browser',   icon: '🌐', color: '#0a84ff' },
  { id: 'maps',      label: 'Maps',      icon: '🗺', color: '#ff9500' },
  { id: 'downloads', label: 'Downloads', icon: '📥', color: '#5856d6' },
]

export default function Smartphone() {
  const [openApp, setOpenApp] = useState(null)
  const [time, setTime]       = useState('14:23')

  const now = new Date()
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0')

  const renderApp = () => {
    switch(openApp) {
      case 'gallery':   return <Gallery onBack={() => setOpenApp(null)} />
      case 'messages':  return <Messages onBack={() => setOpenApp(null)} />
      case 'voice':     return <VoiceNotes onBack={() => setOpenApp(null)} />
      case 'browser':   return <BrowserHistory onBack={() => setOpenApp(null)} />
      case 'maps':      return <Maps onBack={() => setOpenApp(null)} />
      case 'downloads': return <Downloads onBack={() => setOpenApp(null)} />
      default: return null
    }
  }

  return (
    <div className={styles.phoneFrame}>
      {/* Notch */}
      <div className={styles.notch}>
        <div className={styles.speaker} />
        <div className={styles.camera} />
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>{timeStr}</span>
        <div className={styles.statusIcons}>
          <span>▲▲▲</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Screen */}
      <div className={styles.screen}>
        {openApp ? (
          <div className={styles.appScreen}>
            {renderApp()}
          </div>
        ) : (
          // Home screen
          <div className={styles.homeScreen}>
            <div className={styles.wallpaperOverlay} />

            <div className={styles.homeTime}>{timeStr}</div>
            <div className={styles.homeDate}>Sam's iPhone — Evidence</div>

            <div className={styles.appGrid}>
              {APPS.map(app => (
                <button
                  key={app.id}
                  className={styles.appIcon}
                  onClick={() => setOpenApp(app.id)}
                  id={`app-${app.id}`}
                >
                  <div className={styles.appIconInner} style={{background: `linear-gradient(135deg, ${app.color}cc, ${app.color}88)`}}>
                    <span className={styles.appEmoji}>{app.icon}</span>
                  </div>
                  <span className={styles.appLabel}>{app.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.lockHint}>Tap an app to investigate</div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className={styles.homeIndicator}>
        {openApp && (
          <button className={styles.homeBtn} onClick={() => setOpenApp(null)} title="Home">
            ⊙
          </button>
        )}
        <div className={styles.homeBar} />
      </div>

      {/* Side buttons */}
      <div className={styles.sideButtonsLeft}>
        <div className={styles.sideBtn} />
        <div className={styles.sideBtn} />
      </div>
      <div className={styles.sideButtonsRight}>
        <div className={styles.sideBtnLong} />
      </div>
    </div>
  )
}
