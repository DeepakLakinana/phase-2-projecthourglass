require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const authRoutes = require('./routes/auth');
const teamsRoutes = require('./routes/teams');
const roundsRoutes = require('./routes/rounds');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/rounds', roundsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ─── DB Init ─────────────────────────────────────────────────────────────────
async function initDB() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_init.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Database initialised');

    // Seed admin if not exists
    const bcrypt = require('bcryptjs');
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(adminPass, 12);
    await pool.query(
      `INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
      ['admin', hash]
    );

    // Seed teams if none exist
    const { rows } = await pool.query('SELECT COUNT(*) FROM teams');
    if (parseInt(rows[0].count) === 0) {
      await seedTeams();
    }

    console.log('✅ Seed data ready');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}

async function seedTeams() {
  const bcrypt = require('bcryptjs');
  const teams = [
    { code: 'TEAM01', name: 'Team Alpha', password: 'rewind01' },
    { code: 'TEAM02', name: 'Team Beta', password: 'rewind02' },
    { code: 'TEAM03', name: 'Team Gamma', password: 'rewind03' },
    { code: 'TEAM04', name: 'Team Delta', password: 'rewind04' },
    { code: 'TEAM05', name: 'Team Echo', password: 'rewind05' },
    { code: 'TEAM06', name: 'Team Foxtrot', password: 'rewind06' },
    { code: 'TEAM07', name: 'Team Golf', password: 'rewind07' },
    { code: 'TEAM08', name: 'Team Hotel', password: 'rewind08' },
    { code: 'TEAM09', name: 'Team India', password: 'rewind09' },
    { code: 'TEAM10', name: 'Team Juliet', password: 'rewind10' },
  ];

  for (const t of teams) {
    const hash = await bcrypt.hash(t.password, 12);
    await pool.query(
      `INSERT INTO teams (team_code, team_name, password_hash) VALUES ($1, $2, $3) ON CONFLICT (team_code) DO NOTHING`,
      [t.code, t.name, hash]
    );
  }
  console.log('✅ 10 teams seeded (TEAM01–TEAM10, passwords: rewind01–rewind10)');
}

// ─── Start ───────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
