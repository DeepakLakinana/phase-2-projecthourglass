# PROJECT REWIND 🔍

> A multi-round escape-room web experience where teams enter a corrupted memory archive to find a missing person named Sam.

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Default Credentials

### Teams
| Team Code | Password    |
|-----------|-------------|
| TEAM01    | rewind01    |
| TEAM02    | rewind02    |
| TEAM03    | rewind03    |
| ...       | ...         |
| TEAM10    | rewind10    |

### Admin
| Username | Password  |
|----------|-----------|
| admin    | admin123  |

> ⚠️ **Change `ADMIN_PASSWORD` in production via Render environment variables!**

---

## 📁 Project Structure

```
project-rewind/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── index.js      # Server entry point + DB init
│   │   ├── db.js         # PostgreSQL pool
│   │   ├── routes/       # auth, teams, rounds, admin
│   │   ├── middleware/   # JWT auth, admin guard
│   │   └── migrations/   # SQL schema
│   └── .env.example
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── pages/        # Login, GameHub, Round1, Round2, Victory, AdminDashboard
│   │   ├── components/   # JigsawPuzzle, Smartphone, Timer, ProtectedRoute
│   │   │   └── phone/    # Gallery, Messages, VoiceNotes, BrowserHistory, Maps, Downloads
│   │   ├── context/      # AuthContext
│   │   └── api/          # Axios client
│   └── public/assets/    # Images, audio, downloads
└── render.yaml           # Render deployment config
```

---

## 🎮 Game Flow

```
Login (TEAM01 / rewind01)
  ↓
Game Hub (round selector)
  ↓
Round 1: Timeline Reconstruction
  ├─ Jigsaw Puzzle 1 → Enter year → Answer: 2024
  └─ Jigsaw Puzzle 2 → Enter month → Answer: May
  ↓
Round 2: Sam's Recovered Phone
  ├─ Gallery   — Morse code in image filenames
  ├─ Messages  — Encoded text in chat messages
  ├─ Voice Notes — Audio with Morse transcripts
  ├─ Browser History — Monaco search clues
  ├─ Maps      — Corrupted GPS coordinates
  └─ Downloads — PDF clues (tickets, receipts)
  ↓
Submit final answer: MONACO
  ↓
Victory Screen 🏁
```

---

## 🔒 Security

- Answer keys live **only on the server** — never exposed to clients
- JWT authentication (24h tokens)
- Admin-only routes protected by separate middleware
- Passwords hashed with bcrypt (12 rounds)

---

## 📦 Deploying to Render

1. Push this repo to GitHub
2. Log in to [render.com](https://render.com)
3. Click **"New → Blueprint"** and connect your GitHub repo
4. Render reads `render.yaml` automatically
5. Set the `ADMIN_PASSWORD` environment variable in the Render dashboard
6. Deploy! Migrations run automatically on first start.

### Adding real puzzle images

Replace placeholder paths in `frontend/public/assets/images/`:
- `puzzle1_year.jpg` — Year collage (2024 events)
- `puzzle2_month.jpg` — Month collage (May events)
- `monaco1.jpg` through `monaco6.jpg` — Monaco photos for Gallery app

### Adding audio files

Place MP3s in `frontend/public/assets/audio/`:
- `note1.mp3`, `note2.mp3`, `note3.mp3`

---

## 🛠 Admin Panel

Available at `/admin-login` with username `admin`.

Features:
- **Live team progress table** — see who's on which puzzle
- **Elapsed timer** per team (counts up from login)
- **Lock/Unlock rounds** globally
- **Lock/Unlock individual teams**
- **Reset team progress** (with confirmation)
- **Scoreboard** — ranked by completion time

---

## 🎨 Design

- Dark cyberpunk aesthetic with teal/purple accents
- Glassmorphism cards with backdrop blur
- Animated boot/glitch effects on login
- Realistic iOS-style smartphone shell for Round 2
- Confetti victory animation

---

Built with ❤️ for the Project Rewind escape room experience.
