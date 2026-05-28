-- Migration: 0004_athlete_fields_and_spectator_passes
-- Adds the extra athlete data colleague's modal collects (first/last split,
-- phone, date of birth), a vehicle_reg slot on teams for the campervan add-on,
-- and a dedicated spectator_passes table for non-racing attendees.

-- Existing athletes.name column stays NOT NULL and continues to be populated
-- as "first last" for backward compatibility with historical rows; the new
-- columns are nullable so old records don't need backfill.
ALTER TABLE athletes ADD COLUMN first_name TEXT;
ALTER TABLE athletes ADD COLUMN last_name TEXT;
ALTER TABLE athletes ADD COLUMN phone TEXT;
ALTER TABLE athletes ADD COLUMN date_of_birth TEXT;

-- Campervan add-on carries the vehicle registration at team level
-- (the same campervan parks for the whole team).
ALTER TABLE teams ADD COLUMN vehicle_reg TEXT;

-- Spectator passes are paid non-racing entries: deliberately separate from
-- the athlete/team model because spectators have no team, no race category,
-- and don't need gender/run_club/date_of_birth recorded.
CREATE TABLE IF NOT EXISTS spectator_passes (
    id TEXT PRIMARY KEY,                          -- UUID
    event_id TEXT NOT NULL REFERENCES events(id),
    stripe_session_id TEXT UNIQUE,
    stripe_price_id TEXT REFERENCES stripe_prices(id),
    payment_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    paid_at TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    vehicle_reg TEXT,                             -- only set when campervan add-on chosen
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_spectator_passes_event ON spectator_passes(event_id);
CREATE INDEX IF NOT EXISTS idx_spectator_passes_email ON spectator_passes(email);
CREATE INDEX IF NOT EXISTS idx_spectator_passes_session ON spectator_passes(stripe_session_id);
