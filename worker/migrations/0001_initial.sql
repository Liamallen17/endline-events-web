-- Migration: 0001_initial
-- Racing Events Database Schema

-- Athletes: canonical record of participants
CREATE TABLE IF NOT EXISTS athletes (
    email TEXT PRIMARY KEY,  -- lowercase, normalised
    name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unspecified')),
    run_club TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Events: each race/competition
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,  -- slug e.g. 'summer-relay-2025'
    name TEXT NOT NULL,
    description TEXT,
    event_date TEXT,  -- ISO date
    min_team_size INTEGER NOT NULL DEFAULT 1,
    max_team_size INTEGER NOT NULL DEFAULT 1,
    stripe_price_id TEXT NOT NULL,
    registration_opens_at TEXT,
    registration_closes_at TEXT,
    is_published INTEGER DEFAULT 0,  -- SQLite boolean
    created_at TEXT DEFAULT (datetime('now'))
);

-- Teams: a group registering for an event
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id),
    name TEXT,  -- optional team name
    stripe_session_id TEXT UNIQUE,
    payment_status TEXT DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    paid_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Team members: junction table linking athletes to teams
CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    athlete_email TEXT NOT NULL REFERENCES athletes(email) ON UPDATE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'member')),
    added_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (team_id, athlete_email)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_payment ON teams(payment_status);
CREATE INDEX IF NOT EXISTS idx_teams_stripe ON teams(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_team_members_athlete ON team_members(athlete_email);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
