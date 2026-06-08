const express = require('express');
const pool = require('../db');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// GET /api/admin/teams — All teams with progress
router.get('/teams', adminMiddleware, async (req, res) => {
  try {
    const { rows: teams } = await pool.query(
      `SELECT t.id, t.team_code, t.team_name, t.started_at, t.finished_at, t.is_locked,
              COALESCE(json_agg(tp ORDER BY tp.round_number, tp.puzzle_number) FILTER (WHERE tp.id IS NOT NULL), '[]') as progress
       FROM teams t
       LEFT JOIN team_progress tp ON t.id = tp.team_id
       GROUP BY t.id
       ORDER BY t.team_code`
    );
    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/scoreboard — Teams ranked by completion time
router.get('/scoreboard', adminMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT team_code, team_name, started_at, finished_at,
              EXTRACT(EPOCH FROM (finished_at - started_at))::int AS elapsed_seconds
       FROM teams
       WHERE finished_at IS NOT NULL
       ORDER BY elapsed_seconds ASC`
    );
    res.json({ scoreboard: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/rounds/:round/lock
router.post('/rounds/:round/lock', adminMiddleware, async (req, res) => {
  const round = parseInt(req.params.round);
  await pool.query(
    'UPDATE round_locks SET is_locked = TRUE, updated_at = NOW() WHERE round_number = $1',
    [round]
  );
  res.json({ success: true, round, locked: true });
});

// POST /api/admin/rounds/:round/unlock
router.post('/rounds/:round/unlock', adminMiddleware, async (req, res) => {
  const round = parseInt(req.params.round);
  await pool.query(
    'UPDATE round_locks SET is_locked = FALSE, updated_at = NOW() WHERE round_number = $1',
    [round]
  );
  res.json({ success: true, round, locked: false });
});

// POST /api/admin/teams/:id/lock
router.post('/teams/:id/lock', adminMiddleware, async (req, res) => {
  await pool.query('UPDATE teams SET is_locked = TRUE WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// POST /api/admin/teams/:id/unlock
router.post('/teams/:id/unlock', adminMiddleware, async (req, res) => {
  await pool.query('UPDATE teams SET is_locked = FALSE WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// POST /api/admin/teams/:id/reset
router.post('/teams/:id/reset', adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM team_progress WHERE team_id = $1', [req.params.id]);
    await pool.query('UPDATE teams SET started_at = NULL, finished_at = NULL, is_locked = FALSE WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/locks — Current round locks
router.get('/locks', adminMiddleware, async (req, res) => {
  const { rows } = await pool.query('SELECT round_number, is_locked, updated_at FROM round_locks ORDER BY round_number');
  res.json({ locks: rows });
});

module.exports = router;
