import { useState } from 'react'
import styles from './PhoneApp.module.css'

const VOICE_NOTES = [
  {
    id: 1,
    title: 'Reminder — GP Tickets',
    date: 'May 23, 2024',
    duration: '0:32',
    src: '/assets/audio/note1.mp3',
    transcript: 'Remember to pick up tickets from the hotel concierge. Monaco Grand Prix — Race day Sunday May 26th. Track access from Gate ·−· before noon.',
    morse: '·−· = R',
  },
  {
    id: 2,
    title: 'Marina directions',
    date: 'May 20, 2024',
    duration: '0:18',
    src: '/assets/audio/note2.mp3',
    transcript: 'From the casino, take the steps down to Port Hercule. Look for the blue and white signs. Coordinates note: 43 point ·−·· ·−·· − − −',
    morse: 'Part of the coordinates',
  },
  {
    id: 3,
    title: 'Meeting note',
    date: 'May 19, 2024',
    duration: '0:44',
    src: '/assets/audio/note3.mp3',
    transcript: 'Meeting at the Yacht Club at seven. The contact said to bring the flash drive. He mentioned something about — what did he say — − − − −·  ·−  −·  ·−  −·−· ·−',
    morse: '−−−−· ·− −· ·− −·−· ·− = MONACO (partial)',
  },
]

export default function VoiceNotes({ onBack }) {
  const [playing, setPlaying] = useState(null)

  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar} style={{background:'#1c1c1e'}}>
        <button className={styles.backBtn} onClick={onBack} style={{color:'#ff3b30'}}>‹ Back</button>
        <span className={styles.appTitle} style={{color:'#fff'}}>Voice Memos</span>
        <div style={{width:60}} />
      </div>

      <div className={styles.voiceList} style={{background:'#1c1c1e'}}>
        {VOICE_NOTES.map(note => (
          <div
            key={note.id}
            className={`${styles.voiceItem} ${playing === note.id ? styles.voiceItemActive : ''}`}
            style={{background:'#2c2c2e', borderRadius:12, marginBottom:2}}
            onClick={() => setPlaying(playing === note.id ? null : note.id)}
            id={`voice-note-${note.id}`}
          >
            <div className={styles.voiceIcon} style={{background: playing === note.id ? '#ff9500' : '#ff3b30'}}>
              {playing === note.id ? '⏸' : '▶'}
            </div>
            <div className={styles.voiceMeta}>
              <div className={styles.voiceTitle} style={{color:'#fff'}}>{note.title}</div>
              <div className={styles.voiceDate}>{note.date}</div>
            </div>
            <span className={styles.voiceDuration} style={{color:'#636366'}}>{note.duration}</span>
          </div>
        ))}
      </div>

      {playing !== null && (() => {
        const note = VOICE_NOTES.find(n => n.id === playing)
        return (
          <div className={styles.audioPlayer}>
            <div className={styles.audioTitle}>{note.title}</div>
            <audio
              className={styles.nativeAudio}
              controls
              autoPlay
              src={note.src}
              onEnded={() => setPlaying(null)}
            >
              Your browser does not support audio.
            </audio>
            <div style={{background:'rgba(255,255,255,0.06)', borderRadius:8, padding:'8px', marginTop:8}}>
              <div style={{color:'#8e8e93', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4}}>📝 Transcript:</div>
              <div style={{color:'#ebebf5', fontSize:'0.78rem', lineHeight:1.6, fontFamily:'sans-serif'}}>{note.transcript}</div>
            </div>
            <div className={styles.morseHint} style={{marginTop:8}}>
              🔍 Encoded: {note.morse}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
