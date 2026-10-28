-- MovoX admin — additive schema only.
--
-- The main MovoX tables (admin_users, enquiries, works, blogs, projects,
-- agreements, invoices, quotations, policies, settings, team_members,
-- project_members, project_updates, project_files) already exist in Neon and
-- are owned by the existing backend. This script only creates the extra tables
-- the admin needs and adds one column to enquiries. Safe to run repeatedly.

CREATE TABLE IF NOT EXISTS quotations (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  valid_until TEXT,
  demo BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS revenue (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  source TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'income',
  demo BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  started_at TEXT
);

-- The admin tracks a lead pipeline status on enquiries.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_revenue_month ON revenue(month);
