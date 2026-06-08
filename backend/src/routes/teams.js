const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/teams/me — Current team info + progress
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows: teamRows } = await pool.query(
      'SELECT id, team_code, team_name, started_at, finished_at FROM teams WHERE id = $1',
      [req.user.teamId]
    );
    if (teamRows.length === 0) return res.status(404).json({ error: 'Team not found' });

    const { rows: progress } = await pool.query(
      'SELECT round_number, puzzle_number, completed_at FROM team_progress WHERE team_id = $1 ORDER BY round_number, puzzle_number',
      [req.user.teamId]
    );

    const { rows: locks } = await pool.query('SELECT round_number, is_locked FROM round_locks');

    res.json({ team: teamRows[0], progress, roundLocks: locks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
