import { useState } from 'react'
import styles from './PhoneApp.module.css'

const PHOTOS = [
  {
    id: 1,
    filename: '.. ___ -. .- -.-. ---_harbor_view.jpg',
    thumb: '/assets/images/monaco1.jpg',
    caption: 'Beautiful harbor — must come back',
    date: 'May 18, 2024',
  },
  {
    id: 2,
    filename: '--. .--. __-__.._race_barriers.jpg',
    thumb: '/assets/images/monaco2.jpg',
    caption: 'Race day atmosphere is incredible!',
    date: 'May 25, 2024',
  },
  {
    id: 3,
    filename: '-- --- -. .- -.-. ---_yacht_club.jpg',
    thumb: '/assets/images/monaco3.jpg',
    caption: 'Yacht Club de Monaco',
    date: 'May 20, 2024',
  },
  {
    id: 4,
    filename: '... .- -- ..._grand_prix_2024.jpg',
    thumb: '/assets/images/monaco4.jpg',
    caption: 'Ferrari fans everywhere',
    date: 'May 26, 2024',
  },
  {
    id: 5,
    filename: '-.-. .- ... .. -. ---_monte_carlo.jpg',
    thumb: '/assets/images/monaco5.jpg',
    caption: 'Casino gardens at golden hour',
    date: 'May 19, 2024',
  },
  {
    id: 6,
    filename: '-... . .- ..- - .. ..-. ..- .-.._.view_from_top.jpg',
    thumb: '/assets/images/monaco6.jpg',
    caption: 'View from the Palace Rock',
    date: 'May 21, 2024',
  },
]

export default function Gallery({ onBack }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className={styles.appContainer}>
      <div className={styles.appBar} style={{background:'#000'}}>
        <button className={styles.backBtn} onClick={onBack} style={{color:'#0a84ff'}}>‹ Back</button>
        <span className={styles.appTitle} style={{color:'#fff'}}>Gallery</span>
        <div style={{width:60}} />
      </div>

      {selected !== null ? (
        <div className={styles.photoDetail}>
          <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
          <div className={styles.fullPhotoWrapper}>
            <img
              src={PHOTOS[selected].thumb}
              alt={PHOTOS[selected].caption}
              className={styles.fullPhoto}
              onError={e => { e.target.style.display='none' }}
            />
          </div>
          <div className={styles.photoMeta}>
            <p className={styles.photoCaption}>{PHOTOS[selected].caption}</p>
            <p className={styles.photoDate}>{PHOTOS[selected].date}</p>
            <div className={styles.filenameBox}>
              <span className={styles.filenameLabel}>🔍 File name (clue):</span>
              <code className={styles.filename}>{PHOTOS[selected].filename}</code>
            </div>
          </div>
        </div>
      ) : (
        <div style={{flex:1, overflow:'auto'}}>
          <div style={{padding:'8px 12px', fontSize:'0.75rem', color:'#636366', fontFamily:'sans-serif'}}>
            Recents • {PHOTOS.length} items
          </div>
          <div className={styles.photoGrid}>
            {PHOTOS.map((p, i) => (
              <div
                key={p.id}
                className={styles.photoThumb}
                onClick={() => setSelected(i)}
                id={`gallery-photo-${p.id}`}
              >
                <img
                  src={p.thumb}
                  alt={p.caption}
                  className={styles.thumbImg}
                  onError={e => { e.target.style.display='none' }}
                />
                <div className={styles.thumbPlaceholder}>🌆</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
