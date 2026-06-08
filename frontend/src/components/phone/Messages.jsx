import { useState } from 'react'
import styles from './PhoneApp.module.css'

const CONVERSATIONS = [
  { id: 'alex', name: 'Alex K.', avatar: '👨', lastMsg: 'Still on for this weekend?', time: '14:21', unread: 2 },
  { id: 'mia',  name: 'Mia L.',  avatar: '👩', lastMsg: 'Found the tickets!!', time: '11:05', unread: 0 },
  { id: 'dad',  name: 'Dad',     avatar: '👴', lastMsg: 'Be safe, son', time: 'Yesterday', unread: 0 },
]

const MESSAGES = {
  alex: [
    { from: 'them', text: "Hey, you made it to Monaco?", time: '09:12' },
    { from: 'me',   text: "YES!! It's insane here. The harbor is beautiful 🚢", time: '09:15' },
    { from: 'them', text: "Are you going to the GP?", time: '09:16' },
    { from: 'me',   text: "Saturday and Sunday! Got the paddock pass", time: '09:18' },
    { from: 'them', text: "No way. Jealous. What's the hotel like?", time: '09:20' },
    { from: 'me',   text: "Hotel de Paris. Room overlooks the Casino Square 🎰", time: '09:22' },
    { from: 'them', text: "Dude. DUDE.", time: '09:23' },
    { from: 'them', text: "Still on for this weekend?", time: '14:21' },
    { from: 'them', text: "Also btw — · − · · · · − ·· −·−· · ·", time: '14:22', isMorse: true },
  ],
  mia: [
    { from: 'them', text: "Sam! I found the Grand Prix tickets in your downloads", time: '08:30' },
    { from: 'me',   text: "Oh good! Those are for Sat + Sun.", time: '08:45' },
    { from: 'them', text: "The venue listed is…M-O-N-A-C-O 🏎️", time: '08:47', isMorse: true },
    { from: 'me',   text: "Obviously 😂 It's the Monaco Grand Prix!", time: '08:48' },
    { from: 'them', text: "Found the tickets!!", time: '11:05' },
  ],
  dad: [
    { from: 'them', text: "Are you in France or Monaco? Your mother is asking", time: 'Yesterday' },
    { from: 'me',   text: "Monaco, Dad. It's its own country technically", time: 'Yesterday' },
    { from: 'them', text: "Your sister says hi. Be safe, son.", time: 'Yesterday' },
  ],
}

export default function Messages({ onBack }) {
  const [openConv, setOpenConv] = useState(null)
  const conv = openConv ? MESSAGES[openConv] : null
  const contact = CONVERSATIONS.find(c => c.id === openConv)

  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar}>
        {openConv ? (
          <button className={styles.backBtn} onClick={() => setOpenConv(null)} style={{color:'#0a84ff'}}>‹ Messages</button>
        ) : (
          <div style={{width:60}} />
        )}
        <span className={styles.appTitle}>{openConv ? contact?.name : 'Messages'}</span>
        <div style={{width:60}} />
      </div>

      {openConv ? (
        <div className={styles.chatContainer}>
          {conv.map((msg, i) => (
            <div key={i} style={{display:'flex', flexDirection:'column', alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start', maxWidth:'75%'}}>
              <div className={`${styles.bubble} ${msg.from === 'me' ? styles.bubbleSent : styles.bubbleReceived}`}>
                {msg.text}
              </div>
              {msg.isMorse && (
                <div className={styles.clueMark}>📡 Encoded — look closely</div>
              )}
              <span className={`${styles.msgTime} ${msg.from === 'me' ? styles.msgTimeSent : ''}`}>{msg.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{flex:1, background:'#f2f2f7', overflow:'auto'}}>
          {CONVERSATIONS.map(c => (
            <div key={c.id} style={{background:'#fff', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(0,0,0,0.05)', cursor:'pointer'}} onClick={() => setOpenConv(c.id)} id={`msg-conv-${c.id}`}>
              <div style={{width:48, height:48, borderRadius:'50%', background:'#e5e5ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0}}>{c.avatar}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:2}}>
                  <span style={{fontSize:'0.92rem', fontWeight:600, fontFamily:'sans-serif'}}>{c.name}</span>
                  <span style={{fontSize:'0.72rem', color:'#8e8e93', fontFamily:'sans-serif'}}>{c.time}</span>
                </div>
                <span style={{fontSize:'0.82rem', color:'#8e8e93', fontFamily:'sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block'}}>{c.lastMsg}</span>
              </div>
              {c.unread > 0 && <div style={{background:'#0a84ff', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.65rem', fontWeight:700, flexShrink:0}}>{c.unread}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
