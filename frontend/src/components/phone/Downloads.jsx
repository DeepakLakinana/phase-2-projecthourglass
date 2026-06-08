import { useState } from 'react'
import styles from './PhoneApp.module.css'

const FILES = [
  {
    id: 1,
    name: 'GP_Ticket_SAM_RACE_DAY.pdf',
    size: '2.1 MB',
    icon: '🏎',
    iconBg: '#ff3b30',
    tag: 'CLUE',
    content: {
      title: 'Formula 1 Grand Prix — Paddock Club Pass',
      fields: [
        { label: 'Event', value: 'Formula 1 Grand Prix de Monaco 2024' },
        { label: 'Holder', value: 'SAM CHEN' },
        { label: 'Date', value: 'Sunday 26 May 2024' },
        { label: 'Location', value: '━━━━━━  ·−  ·−·· ·−·· ·−' }, // Morse for "ALLAY" (part clue)
        { label: 'Gate', value: 'Paddock Gate C — Circuit de Monaco' },
        { label: 'Barcode', value: 'MC-2024-GP-P1729-SAM' },
      ],
      clue: '·−  ·−·· ·−·· ·−  −−−  (encoded destination)',
    },
  },
  {
    id: 2,
    name: 'Hotel_de_Paris_Receipt_MAY24.pdf',
    size: '380 KB',
    icon: '🏨',
    iconBg: '#5856d6',
    tag: 'CLUE',
    content: {
      title: 'Hôtel de Paris Monte-Carlo — Invoice',
      fields: [
        { label: 'Guest', value: 'Sam Chen' },
        { label: 'Check-in', value: '22 May 2024' },
        { label: 'Check-out', value: '27 May 2024' },
        { label: 'Room', value: 'Suite Impériale — Floor 5' },
        { label: 'Address', value: 'Place du Casino, 98000 · · − ·−·· ·−·· −−· ·' },
        { label: 'Total', value: '€ 12,450.00' },
      ],
      clue: 'Address hidden clue: · · − ·−·· ·−·· −−· ·  =  S U L L G E ?',
    },
  },
  {
    id: 3,
    name: 'Marina_Booking_Hercule.pdf',
    size: '215 KB',
    icon: '⛵',
    iconBg: '#0a84ff',
    tag: 'CLUE',
    content: {
      title: 'Port Hercule Marina — Slip Booking',
      fields: [
        { label: 'Booker', value: 'S. Chen' },
        { label: 'Vessel', value: 'Azimut 50 — "Meridian"' },
        { label: 'Dates', value: '24–28 May 2024' },
        { label: 'Slip', value: 'D-47, Port Hercule' },
        { label: 'Country', value: '−− −−− −· ·− −·−· −−− (hint encoded)' },
        { label: 'Ref', value: 'MC-PORT-2024-D47' },
      ],
      clue: '−− −−− −· ·− −·−· −−−  decode this!',
    },
  },
  {
    id: 4,
    name: 'SAM_notes_encrypted.txt',
    size: '4 KB',
    icon: '📝',
    iconBg: '#34c759',
    content: {
      title: 'Personal Notes — Encrypted',
      fields: [
        { label: 'Author', value: 'Sam Chen' },
        { label: 'Date', value: 'May 25, 2024 23:44' },
        { label: 'Content', value: '-- --- -. .- -.-. ---\n..-. --- ..- -. -...' },
      ],
      clue: 'Decode the dots and dashes: -- --- -. .- -.-. ---',
    },
  },
]

export default function Downloads({ onBack }) {
  const [openFile, setOpenFile] = useState(null)
  const file = openFile !== null ? FILES[openFile] : null

  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar}>
        {openFile !== null ? (
          <button className={styles.backBtn} onClick={() => setOpenFile(null)} style={{color:'#5856d6'}}>‹ Files</button>
        ) : (
          <button className={styles.backBtn} onClick={onBack} style={{color:'#0a84ff'}}>‹ Back</button>
        )}
        <span className={styles.appTitle}>{file ? file.name.substring(0,20) + '…' : 'Downloads'}</span>
        <div style={{width:60}} />
      </div>

      {openFile !== null ? (
        <div className={styles.fileDetail}>
          <div className={styles.fileCard}>
            <div className={styles.fileCardTitle}>Document Details</div>
            <div style={{fontSize:'1rem', fontWeight:700, fontFamily:'sans-serif', marginBottom:12, color:'#000'}}>{file.content.title}</div>
            {file.content.fields.map((f, i) => (
              <div key={i} style={{display:'flex', borderBottom:'1px solid #f2f2f7', padding:'6px 0', gap:8}}>
                <span style={{fontSize:'0.75rem', color:'#8e8e93', fontFamily:'sans-serif', minWidth:70, flexShrink:0, fontWeight:600}}>{f.label}</span>
                <span style={{fontSize:'0.78rem', color:'#000', fontFamily:'Courier New', wordBreak:'break-all', lineHeight:1.4}}>{f.value}</span>
              </div>
            ))}
          </div>

          {file.content.clue && (
            <div className={styles.clueHighlight}>
              <span className={styles.clueHighlightLabel}>🔍 Hidden clue detected</span>
              <code className={styles.clueHighlightText}>{file.content.clue}</code>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.downloadsList}>
          <div style={{padding:'6px 12px', fontSize:'0.72rem', color:'#636366', fontFamily:'sans-serif'}}>
            4 items — Sorted by date
          </div>
          {FILES.map((f, i) => (
            <div
              key={f.id}
              className={styles.downloadItem}
              onClick={() => setOpenFile(i)}
              id={`download-file-${f.id}`}
            >
              <div className={styles.downloadIcon} style={{background:`${f.iconBg}22`, border:`1px solid ${f.iconBg}44`}}>
                {f.icon}
              </div>
              <div className={styles.downloadMeta}>
                <div className={styles.downloadName}>{f.name}</div>
                <div className={styles.downloadSize}>{f.size}</div>
              </div>
              {f.tag && <span className={styles.downloadClue}>{f.tag}</span>}
              <span style={{color:'#c7c7cc', fontSize:'0.9rem'}}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
