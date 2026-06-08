-- Project Rewind Database Schema
-- Run this migration on first deploy

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  team_code VARCHAR(20) UNIQUE NOT NULL,
  team_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Round locks (globally controlled by admin)
CREATE TABLE IF NOT EXISTS round_locks (
  round_number INTEGER PRIMARY KEY,
  is_locked BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team round progress
CREATE TABLE IF NOT EXISTS team_progress (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  puzzle_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ,
  answer_submitted VARCHAR(100),
  UNIQUE(team_id, round_number, puzzle_number)
);

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed round locks (rounds 1 and 2 start locked)
INSERT INTO round_locks (round_number, is_locked) VALUES (1, FALSE), (2, TRUE)
ON CONFLICT (round_number) DO NOTHING;

-- Seed default teams (10 teams)
-- Passwords will be set via the seed script using bcrypt
-- These are placeholders — actual hashed passwords inserted by seed.js
