-- =============================================================
-- Bunker Podcast — Initial Schema
-- Version: 0001
-- Date: 2026-05-14
-- =============================================================
-- Tables: customers, episodes, episode_versions, reels, feedback_items
-- All tables have RLS enabled. Admin uses service_role, client uses share_token via API.
-- =============================================================

-- ============ ENUMS ============

CREATE TYPE episode_status AS ENUM (
  'recorded',
  'reviewing',
  'sent_v1',
  'revisions_v1',
  'sent_v2',
  'revisions_v2',
  'sent_v3',
  'approved',
  'archived'
);

CREATE TYPE reel_status AS ENUM (
  'selected',
  'editing',
  'sent_v1',
  'revisions_v1',
  'sent_v2',
  'revisions_v2',
  'sent_v3',
  'approved'
);

CREATE TYPE customer_package AS ENUM (
  'photo_only',
  'photo_edit',
  'retainer'
);

CREATE TYPE feedback_type AS ENUM (
  'timestamped',
  'general'
);

CREATE TYPE creator_role AS ENUM (
  'client',
  'admin'
);

-- ============ TABLES ============

-- ---------- customers ----------
CREATE TABLE customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL UNIQUE,
  whatsapp        text NOT NULL,                       -- e164 format: 9725XXXXXXXX
  package         customer_package NOT NULL DEFAULT 'photo_edit',
  retainer_active boolean NOT NULL DEFAULT false,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_email ON customers(email);

-- ---------- episodes ----------
CREATE TABLE episodes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title             text NOT NULL,
  episode_number    integer,
  recorded_at       date NOT NULL,
  status            episode_status NOT NULL DEFAULT 'recorded',
  current_version   integer NOT NULL DEFAULT 1 CHECK (current_version BETWEEN 1 AND 3),
  bunny_video_id    text,                              -- current version's video
  share_token       text UNIQUE,                       -- nanoid(32) — public access token
  share_expires_at  timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_episodes_customer ON episodes(customer_id, recorded_at DESC);
CREATE INDEX idx_episodes_status ON episodes(status);
CREATE INDEX idx_episodes_share_token ON episodes(share_token) WHERE share_token IS NOT NULL;

-- ---------- episode_versions ----------
CREATE TABLE episode_versions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id        uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  version_number    integer NOT NULL CHECK (version_number BETWEEN 1 AND 3),
  bunny_video_id    text NOT NULL,
  duration_seconds  integer,
  sent_at           timestamptz,
  approved_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(episode_id, version_number)
);

CREATE INDEX idx_versions_episode ON episode_versions(episode_id);

-- ---------- reels ----------
CREATE TABLE reels (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id          uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  order_num           integer NOT NULL,                -- auto-computed by start_time
  title               text NOT NULL,
  start_time_seconds  numeric(10, 2) NOT NULL CHECK (start_time_seconds >= 0),
  end_time_seconds    numeric(10, 2) NOT NULL,
  status              reel_status NOT NULL DEFAULT 'selected',
  bunny_video_id      text,                            -- once edited
  created_by          creator_role NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reel_valid_range CHECK (end_time_seconds > start_time_seconds)
);

CREATE INDEX idx_reels_episode ON reels(episode_id, order_num);
CREATE INDEX idx_reels_status ON reels(status);

-- ---------- feedback_items ----------
CREATE TABLE feedback_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id          uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  version_id          uuid NOT NULL REFERENCES episode_versions(id) ON DELETE CASCADE,
  type                feedback_type NOT NULL,
  timestamp_seconds   numeric(10, 2),                  -- NULL for 'general'
  comment             text NOT NULL,
  resolved            boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT feedback_timestamp_valid CHECK (
    (type = 'timestamped' AND timestamp_seconds IS NOT NULL) OR
    (type = 'general' AND timestamp_seconds IS NULL)
  )
);

CREATE INDEX idx_feedback_episode ON feedback_items(episode_id);
CREATE INDEX idx_feedback_unresolved ON feedback_items(episode_id) WHERE resolved = false;

-- ============ UPDATED_AT TRIGGER ============

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============ RLS POLICIES ============
-- Strategy:
--   • Admin actions go through the service_role API (bypasses RLS).
--   • Public client portal access goes through the service_role API too, but the route
--     handler validates the share_token before returning data.
--   • Authenticated admin users (via Supabase Auth) get full access.

ALTER TABLE customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_versions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels              ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_items     ENABLE ROW LEVEL SECURITY;

-- Admin full access (authenticated users)
CREATE POLICY "admin_all_customers" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_episodes" ON episodes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_versions" ON episode_versions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_reels" ON reels
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_feedback" ON feedback_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
