const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Answer Keys (NEVER sent to client) ─────────────────────────────────────
const ANSWER_KEYS = {
  1: {
    1: '2024',   // Round 1, Puzzle 1 — Year
    2: 'MAY',    // Round 1, Puzzle 2 — Month
  },
  2: {
    1: '6',      // Weather
    2: '8',      // Receipt
    3: '3',      // Post
    4: '5',      // Calendar
    5: '5',      // WhatsApp
    6: '3',      // Hotel
    7: '26',     // Final Equation
  },
};

// POST /api/rounds/:round/puzzle/:puzzle/submit
router.post('/:round/puzzle/:puzzle/submit', authMiddleware, async (req, res) => {
  const round = parseInt(req.params.round);
  const puzzle = parseInt(req.params.puzzle);
  const { answer } = req.body;

  if (!answer) return res.status(400).json({ error: 'Answer required' });

  // Check round is not locked
  const { rows: lockRows } = await pool.query(
    'SELECT is_locked FROM round_locks WHERE round_number = $1',
    [round]
  );
  if (lockRows.length === 0 || lockRows[0].is_locked) {
    return res.status(403).json({ error: 'This round is locked' });
  }

  // Check team is not locked
  const { rows: teamRows } = await pool.query(
    'SELECT is_locked FROM teams WHERE id = $1',
    [req.user.teamId]
  );
  if (teamRows[0]?.is_locked) {
    return res.status(403).json({ error: 'Your team has been locked by the admin' });
  }

  // Check answer
  const correctAnswer = ANSWER_KEYS[round]?.[puzzle];
  if (!correctAnswer) {
    return res.status(404).json({ error: 'Unknown round or puzzle' });
  }

  const normalised = answer.trim().toUpperCase();
  if (normalised !== correctAnswer) {
    return res.status(200).json({ correct: false, message: 'Incorrect answer. Try again!' });
  }

  // Mark as complete
  try {
    await pool.query(
      `INSERT INTO team_progress (team_id, round_number, puzzle_number, completed_at, answer_submitted)
       VALUES ($1, $2, $3, NOW(), $4)
       ON CONFLICT (team_id, round_number, puzzle_number) DO UPDATE SET completed_at = NOW(), answer_submitted = $4`,
      [req.user.teamId, round, puzzle, normalised]
    );

    // Check if entire game is complete (Round 2 Puzzle 7 = final)
    if (round === 2 && puzzle === 7) {
      await pool.query('UPDATE teams SET finished_at = NOW() WHERE id = $1 AND finished_at IS NULL', [req.user.teamId]);
    }

    // Unlock Round 2 after Round 1 Puzzle 2 is complete
    if (round === 1 && puzzle === 2) {
      // Individual team proceeds — no global unlock needed
      // (Admin controls global lock; team progress tracks individual)
    }

    return res.json({ correct: true, message: 'Correct! Memory fragment restored.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/rounds/locks — Get current lock status
router.get('/locks', authMiddleware, async (req, res) => {
  const { rows } = await pool.query('SELECT round_number, is_locked FROM round_locks ORDER BY round_number');
  res.json({ locks: rows });
});

module.exports = router;
