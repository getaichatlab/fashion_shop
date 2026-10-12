-- SQLite remains the local business-rule engine. Postgres is the durable cloud
-- owner; FOR UPDATE serializes requests before stock/order changes are committed.
CREATE TABLE IF NOT EXISTS fashion_state (
  id TEXT PRIMARY KEY,
  snapshot BYTEA NOT NULL,
  revision BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
