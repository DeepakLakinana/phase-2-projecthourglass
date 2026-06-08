import styles from './PhoneApp.module.css'

const HISTORY = {
  'May 26, 2024': [
    { favicon: '🏎', title: 'Formula 1 Monaco Grand Prix 2024 – Results', url: 'formula1.com/races/monaco-gp', time: '16:34' },
    { favicon: '🗺', title: 'How to get from Port Hercule to Palais du Prince', url: 'maps.google.com/directions/monaco', time: '12:10' },
  ],
  'May 25, 2024': [
    { favicon: '🎰', title: 'Casino de Monte-Carlo – Opening hours & dress code', url: 'casinodemontecarlo.com', time: '20:45', clue: true },
    { favicon: '⛵', title: 'Yacht Club de Monaco – Annual Grand Prix Gala', url: 'ycm.mc/grand-prix-gala', time: '18:30', clue: true },
    { favicon: '🏨', title: 'Hôtel de Paris Monte-Carlo – Reservation', url: 'hoteldeparismontecarlo.com/booking', time: '14:22' },
  ],
  'May 24, 2024': [
    { favicon: '✈', title: 'Nice Côte d\'Azur Airport to Monaco – Transfer', url: 'nice-airport.com/transfers', time: '11:05' },
    { favicon: '🏁', title: 'Monaco Grand Prix ticket – Paddock Club entry rules', url: 'formula1.com/paddock-club-monaco', time: '09:30' },
    { favicon: '🌐', title: 'Monaco – Wikipedia', url: 'en.wikipedia.org/wiki/Monaco', time: '08:15', clue: true },
  ],
  'May 20, 2024': [
    { favicon: '📍', title: 'Coordinates of Monaco: 43.7384° N, 7.4246° E', url: 'latlong.net/place/monaco', time: '15:02', clue: true },
    { favicon: '⛽', title: 'Marina di Monaco – slip berth availability', url: 'marinedemonaco.mc', time: '13:45' },
  ],
}

export default function BrowserHistory({ onBack }) {
  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar}>
        <button className={styles.backBtn} onClick={onBack} style={{color:'#0a84ff'}}>‹ Back</button>
        <span className={styles.appTitle}>Browser History</span>
        <div style={{width:60}} />
      </div>

      <div className={styles.historyList}>
        {Object.entries(HISTORY).map(([date, items]) => (
          <div key={date} className={styles.historyGroup}>
            <div className={styles.historyDate}>{date}</div>
            {items.map((item, i) => (
              <div key={i} className={styles.historyItem} id={`history-${date.replace(/\s/g,'')}-${i}`}>
                <span className={styles.historyFavicon}>{item.favicon}</span>
                <div className={styles.historyContent}>
                  <div className={styles.historyTitle}>{item.title}</div>
                  <div className={styles.historyUrl}>{item.url}</div>
                </div>
                {item.clue && (
                  <span style={{fontSize:'0.7rem', color:'#ff9500', fontFamily:'sans-serif'}}>⭐</span>
                )}
                <span className={styles.historyTime}>{item.time}</span>
              </div>
            ))}
          </div>
        ))}

        <div style={{padding:'12px 16px', background:'#f2f2f7'}}>
          <div style={{background:'rgba(255,149,0,0.1)', border:'1px solid rgba(255,149,0,0.3)', borderRadius:8, padding:'10px 12px'}}>
            <div style={{fontSize:'0.65rem', color:'#ff9500', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:'sans-serif', marginBottom:4}}>
              ⭐ = Coordinates clue found
            </div>
            <div style={{fontSize:'0.78rem', color:'#000', fontFamily:'sans-serif', lineHeight:1.5}}>
              GPS data from the search on May 20:<br />
              <strong>43.7384° N, 7.????° E</strong><br />
              <span style={{color:'#ff3b30', fontSize:'0.7rem'}}>Part of the coordinate has been corrupted. Check the Maps app for the full entry.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
