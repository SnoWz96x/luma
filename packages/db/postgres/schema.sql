-- LUMA — Schema PostgreSQL (espelho de nuvem, opcional / Sync Engine)
-- Mesmo modelo conceitual do SQLite, com tipos nativos do Postgres.
-- IDs UUID iguais aos do cliente (sem remapeamento no sync).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------------------------
-- USERS & SETTINGS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  display_name  TEXT,
  email         TEXT UNIQUE,             -- só existe em conta de nuvem
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  sync_version  BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sync_mode      TEXT NOT NULL DEFAULT 'local' CHECK (sync_mode IN ('local','cloud','hybrid')),
  ai_provider    TEXT NOT NULL DEFAULT 'mock' CHECK (ai_provider IN ('mock','ollama','openai','anthropic')),
  ai_model       TEXT,
  country        TEXT NOT NULL DEFAULT 'BR',
  language       TEXT NOT NULL DEFAULT 'pt-BR',
  encryption_on  BOOLEAN NOT NULL DEFAULT false,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version   BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- USER PROFILE & TRAITS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profile (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  favorite_activity TEXT,
  sleep_quality     TEXT,
  bio               TEXT,
  data              JSONB NOT NULL DEFAULT '{}',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version      BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_traits (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trait        TEXT NOT NULL,
  weight       REAL NOT NULL DEFAULT 0.5,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version BIGINT NOT NULL DEFAULT 0,
  UNIQUE (user_id, trait)
);

------------------------------------------------------------------------------
-- CHARACTER CATALOG + INSTANCE + STATE
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS character_defs (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  species       TEXT NOT NULL,
  category      TEXT NOT NULL,
  rarity        TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  biome         TEXT,
  archetype     TEXT,
  personality   JSONB NOT NULL DEFAULT '{}',
  story         TEXT,
  phrases       JSONB NOT NULL DEFAULT '{}',
  emotions      JSONB NOT NULL DEFAULT '[]',
  preferences   JSONB NOT NULL DEFAULT '{}',
  animations    JSONB NOT NULL DEFAULT '{}',
  evolution     JSONB NOT NULL DEFAULT '{}',
  schema_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS characters (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  def_id          TEXT NOT NULL REFERENCES character_defs(id),
  nickname        TEXT,
  evolution_stage INTEGER NOT NULL DEFAULT 0,
  evolution_path  JSONB NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  adopted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  sync_version    BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_states (
  character_id  UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  energy        SMALLINT NOT NULL DEFAULT 70,
  mood          SMALLINT NOT NULL DEFAULT 60,
  curiosity     SMALLINT NOT NULL DEFAULT 50,
  bond          SMALLINT NOT NULL DEFAULT 30,
  comfort       SMALLINT NOT NULL DEFAULT 60,
  trust         SMALLINT NOT NULL DEFAULT 30,
  sleep         SMALLINT NOT NULL DEFAULT 70,
  progress      SMALLINT NOT NULL DEFAULT 0,
  last_tick_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version  BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- RELATIONSHIP
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS relationships (
  id                UUID PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id      UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  friendship        SMALLINT NOT NULL DEFAULT 0,
  trust             SMALLINT NOT NULL DEFAULT 0,
  familiarity       SMALLINT NOT NULL DEFAULT 0,
  shared_memories   INTEGER NOT NULL DEFAULT 0,
  shared_adventures INTEGER NOT NULL DEFAULT 0,
  first_met_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_time_seconds BIGINT NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version      BIGINT NOT NULL DEFAULT 0,
  UNIQUE (user_id, character_id)
);

------------------------------------------------------------------------------
-- MOODS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS moods (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  mood         TEXT NOT NULL,
  energy       TEXT,
  sleep        TEXT,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

------------------------------------------------------------------------------
-- HABITS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habits (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'habit' CHECK (type IN ('habit','mission','checkin')),
  frequency    TEXT NOT NULL DEFAULT 'daily',
  reward_item  TEXT,
  icon         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id           UUID PRIMARY KEY,
  habit_id     UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version BIGINT NOT NULL DEFAULT 0,
  UNIQUE (habit_id, date)
);

------------------------------------------------------------------------------
-- MEMORIES, CLUSTERS, CONSTELLATIONS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_clusters (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT,
  theme        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS memories (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cluster_id   UUID REFERENCES memory_clusters(id) ON DELETE SET NULL,
  content      TEXT NOT NULL,
  emotion      TEXT,
  importance   SMALLINT NOT NULL DEFAULT 50,
  source       TEXT NOT NULL DEFAULT 'conversation',
  source_ref   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS constellations (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_id    UUID REFERENCES memories(id) ON DELETE CASCADE,
  shape        TEXT,
  x            REAL,
  y            REAL,
  brightness   REAL NOT NULL DEFAULT 1.0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- ITEMS & INVENTORY
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,
  rarity        TEXT NOT NULL DEFAULT 'common',
  biome         TEXT,
  asset         TEXT,
  unlock_rule   JSONB NOT NULL DEFAULT '{}',
  schema_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS inventory (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL REFERENCES items(id),
  placed       BOOLEAN NOT NULL DEFAULT false,
  pos_x        REAL,
  pos_y        REAL,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0,
  UNIQUE (user_id, item_id)
);

------------------------------------------------------------------------------
-- WORLD STATE
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS world_state (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  active_biome  TEXT NOT NULL DEFAULT 'room',
  weather       TEXT NOT NULL DEFAULT 'clear',
  palette       JSONB NOT NULL DEFAULT '{}',
  elements      JSONB NOT NULL DEFAULT '[]',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version  BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- CONVERSATIONS, MESSAGES, SUMMARIES
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','pet','system')),
  content         TEXT NOT NULL,
  emotion         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  sync_version    BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conversation_summaries (
  id              UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary         TEXT NOT NULL,
  covers_until    TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version    BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- SUPPORT NETWORK / EMERGENCY / ALERTS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_contacts (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  relation     TEXT,
  priority     SMALLINT NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emergency_preferences (
  user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mode                TEXT NOT NULL DEFAULT 'never' CHECK (mode IN ('never','suggest_only','ask_first','allow_selected')),
  allowed_contact_ids JSONB NOT NULL DEFAULT '[]',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version        BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alerts (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,
  message      TEXT NOT NULL DEFAULT 'O usuário solicitou apoio e gostaria de ser contatado.',
  contact_ids  JSONB NOT NULL DEFAULT '[]',
  consented    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS safety_flags (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signal       TEXT NOT NULL,
  severity     TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info','gentle','offer_resources')),
  handled      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_version BIGINT NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- ÍNDICES
------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_mem_user       ON memories(user_id, importance DESC);
CREATE INDEX IF NOT EXISTS idx_msg_conv        ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_habitlogs_user  ON habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_moods_user      ON moods(user_id, date);
CREATE INDEX IF NOT EXISTS idx_chars_user      ON characters(user_id, is_active);
