-- Migration: 0003_stripe_products
-- Mirror Stripe products and prices as the pricing source of truth,
-- add webhook idempotency table, and link teams to the specific price paid.

-- Products mirrored from Stripe.
-- event_id is populated at webhook time from product.metadata.event_id;
-- left NULL if no matching event slug exists yet (can be reconciled later).
CREATE TABLE IF NOT EXISTS stripe_products (
    id TEXT PRIMARY KEY,                          -- e.g. prod_xxx
    name TEXT NOT NULL,
    description TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    event_id TEXT REFERENCES events(id),
    metadata_json TEXT,                           -- raw Stripe metadata for forward compatibility
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stripe_products_event ON stripe_products(event_id);

-- Prices mirrored from Stripe. Team-size constraints live here so each
-- category can differ (e.g. BBU "Full Pair" requires 2, "Last Man Standing" requires 1).
CREATE TABLE IF NOT EXISTS stripe_prices (
    id TEXT PRIMARY KEY,                          -- e.g. price_xxx
    product_id TEXT NOT NULL REFERENCES stripe_products(id) ON DELETE CASCADE,
    nickname TEXT,                                -- price.nickname, e.g. "Full Pair"
    unit_amount INTEGER,                          -- pence
    currency TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    min_team_size INTEGER,                        -- from price.metadata.min_team_size
    max_team_size INTEGER,                        -- from price.metadata.max_team_size
    metadata_json TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stripe_prices_product ON stripe_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_stripe_prices_active ON stripe_prices(active);

-- Webhook idempotency: Stripe retries failed deliveries for up to 3 days.
-- Check before processing, insert on success; rely on PK conflict for dedup.
CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,                          -- e.g. evt_xxx
    type TEXT NOT NULL,
    processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Capture which specific price each team paid for, so reporting can
-- distinguish BBU "Full Pair" entries from "Half Solo" entries etc.
ALTER TABLE teams ADD COLUMN stripe_price_id TEXT REFERENCES stripe_prices(id);
