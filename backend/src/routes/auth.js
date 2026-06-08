const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Set a strong random secret.');
  process.exit(1);
}

// POST /api/auth/login — Team login
router.post('/login', async (req, res) => {
  const { teamCode, password } = req.body;
  if (!teamCode || !password) {
    return res.status(400).json({ error: 'Team code and password required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM teams WHERE team_code = $1',
      [teamCode.toUpperCase()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid team code or password' });
    }

    const team = rows[0];
    const valid = await bcrypt.compare(password, team.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid team code or password' });
    }

    // Record start time on first login
    if (!team.started_at) {
      await pool.query('UPDATE teams SET started_at = NOW() WHERE id = $1', [team.id]);
    }

    const token = jwt.sign(
      { teamId: team.id, teamCode: team.team_code, teamName: team.team_name, role: 'team' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      team: { id: team.id, code: team.team_code, name: team.team_name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/admin — Admin login
router.post('/admin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
