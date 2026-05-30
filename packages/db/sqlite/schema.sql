-- LUMA — Schema SQLite (fonte da verdade local, offline-first)
-- Todos os IDs são UUID v4 em TEXT. Timestamps ISO-8601 UTC em TEXT.
-- Tabelas sincronizáveis têm updated_at, deleted_at (soft delete) e sync_version.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

------------------------------------------------------------------------------
-- USERS & SETTINGS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  display_name  TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  deleted_at    TEXT,
  sync_version  INTEGER NOT NULL DEFAULT 0,
  -- credenciais de nuvem só existem se o usuário ativar Cloud/Hybrid
  cloud_user_id TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  user_id        TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sync_mode      TEXT NOT NULL DEFAULT 'local' CHECK (sync_mode IN ('local','cloud','hybrid')),
  ai_provider    TEXT NOT NULL DEFAULT 'mock'  CHECK (ai_provider IN ('mock','ollama','openai','anthropic')),
  ai_model       TEXT,
  country        TEXT NOT NULL DEFAULT 'BR',   -- plugin do Help Hub
  language       TEXT NOT NULL DEFAULT 'pt-BR',
  encryption_on  INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT NOT NULL,
  sync_version   INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- USER PROFILE & TRAITS (alimenta o contexto da IA)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profile (
  user_id           TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  favorite_activity TEXT,
  sleep_quality     TEXT,           -- 'good' | 'bad' | 'mixed'
  bio               TEXT,
  data              TEXT,           -- JSON livre p/ campos aprendidos
  updated_at        TEXT NOT NULL,
  sync_version      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_traits (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trait        TEXT NOT NULL,       -- 'creative','adventurous','calm',...
  weight       REAL NOT NULL DEFAULT 0.5,   -- 0..1 confiança/intensidade
  updated_at   TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, trait)
);

------------------------------------------------------------------------------
-- CHARACTER CATALOG (read-only, versionado com o app) + INSTÂNCIA + ESTADO
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS character_defs (
  id            TEXT PRIMARY KEY,    -- ex: 'luma','momo','sprout'
  name          TEXT NOT NULL,
  species       TEXT NOT NULL,
  category      TEXT NOT NULL,       -- 'animal','robot','ghost','plant','dragon',...
  rarity        TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  biome         TEXT,
  archetype     TEXT,                -- arquétipo emocional
  personality   TEXT NOT NULL,       -- JSON (traços, tom)
  story         TEXT,
  phrases       TEXT NOT NULL,       -- JSON: { greeting:[], idle:[], happy:[], ... }
  emotions      TEXT NOT NULL,       -- JSON: lista de estados emocionais suportados
  preferences   TEXT,                -- JSON: gostos/desgostos
  animations    TEXT NOT NULL,       -- JSON: { idle, happy, sleep, ... } -> assets
  evolution     TEXT NOT NULL,       -- JSON: estágios e gatilhos
  schema_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS characters (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  def_id        TEXT NOT NULL REFERENCES character_defs(id),
  nickname      TEXT,
  evolution_stage INTEGER NOT NULL DEFAULT 0,
  evolution_path TEXT,               -- JSON: trilha de evolução baseada na vida
  is_active     INTEGER NOT NULL DEFAULT 1,
  adopted_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  deleted_at    TEXT,
  sync_version  INTEGER NOT NULL DEFAULT 0
);

-- Estados vitais 0..100 (NUNCA exibidos como número — traduzidos em sinais visuais)
CREATE TABLE IF NOT EXISTS character_states (
  character_id  TEXT PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  energy        INTEGER NOT NULL DEFAULT 70,
  mood          INTEGER NOT NULL DEFAULT 60,
  curiosity     INTEGER NOT NULL DEFAULT 50,
  bond          INTEGER NOT NULL DEFAULT 30,
  comfort       INTEGER NOT NULL DEFAULT 60,
  trust         INTEGER NOT NULL DEFAULT 30,
  sleep         INTEGER NOT NULL DEFAULT 70,
  progress      INTEGER NOT NULL DEFAULT 0,
  last_tick_at  TEXT NOT NULL,       -- p/ cálculo de decay/regen
  updated_at    TEXT NOT NULL,
  sync_version  INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- RELATIONSHIP
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS relationships (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id   TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  friendship     INTEGER NOT NULL DEFAULT 0,   -- 0..100
  trust          INTEGER NOT NULL DEFAULT 0,
  familiarity    INTEGER NOT NULL DEFAULT 0,
  shared_memories INTEGER NOT NULL DEFAULT 0,
  shared_adventures INTEGER NOT NULL DEFAULT 0,
  first_met_at   TEXT NOT NULL,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT NOT NULL,
  sync_version   INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, character_id)
);

------------------------------------------------------------------------------
-- MOODS (check-in diário do usuário)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS moods (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date         TEXT NOT NULL,        -- YYYY-MM-DD (um check-in por dia)
  mood         TEXT NOT NULL,        -- 'great','good','ok','low','sad'
  energy       TEXT,
  sleep        TEXT,
  note         TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

------------------------------------------------------------------------------
-- HABITS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habits (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'habit' CHECK (type IN ('habit','mission','checkin')),
  frequency    TEXT NOT NULL DEFAULT 'daily', -- 'daily','weekly', JSON p/ custom
  reward_item  TEXT,                  -- item desbloqueável
  icon         TEXT,
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id           TEXT PRIMARY KEY,
  habit_id     TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date         TEXT NOT NULL,         -- YYYY-MM-DD
  completed_at TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (habit_id, date)
);

------------------------------------------------------------------------------
-- MEMORIES, CLUSTERS, CONSTELLATIONS
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_clusters (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT,
  theme        TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS memories (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cluster_id   TEXT REFERENCES memory_clusters(id) ON DELETE SET NULL,
  content      TEXT NOT NULL,
  emotion      TEXT,                  -- emoção associada
  importance   INTEGER NOT NULL DEFAULT 50,  -- 0..100
  source       TEXT NOT NULL DEFAULT 'conversation', -- 'conversation','habit','mood','manual'
  source_ref   TEXT,                  -- id da origem (ex: message_id)
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

-- Materialização visual: memória -> estrela/objeto no céu/mundo
CREATE TABLE IF NOT EXISTS constellations (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_id    TEXT REFERENCES memories(id) ON DELETE CASCADE,
  shape        TEXT,                  -- 'star','fragment','object'
  x            REAL, y               REAL,   -- posição no céu
  brightness   REAL NOT NULL DEFAULT 1.0,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- ITEMS (catálogo) & INVENTORY
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,        -- 'furniture','plant','clothing','effect','biome','sound','skin'
  rarity        TEXT NOT NULL DEFAULT 'common',
  biome         TEXT,
  asset         TEXT,                 -- ref ao asset visual/sonoro
  unlock_rule   TEXT,                 -- JSON: como desbloquear
  schema_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS inventory (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL REFERENCES items(id),
  placed       INTEGER NOT NULL DEFAULT 0,
  pos_x        REAL, pos_y          REAL,
  unlocked_at  TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, item_id)
);

------------------------------------------------------------------------------
-- WORLD STATE (mundo espelho)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS world_state (
  user_id       TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  active_biome  TEXT NOT NULL DEFAULT 'room',  -- 'room','garden','island','forest',...
  weather       TEXT NOT NULL DEFAULT 'clear', -- 'clear','rain','soft_rain','stars',...
  palette       TEXT,                 -- JSON: paleta atual derivada do humor
  elements      TEXT,                 -- JSON: flores/pontes/árvores/vaga-lumes gerados
  updated_at    TEXT NOT NULL,
  sync_version  INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- CONVERSATIONS, MESSAGES, SUMMARIES
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id TEXT REFERENCES characters(id) ON DELETE SET NULL,
  started_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','pet','system')),
  content         TEXT NOT NULL,
  emotion         TEXT,
  created_at      TEXT NOT NULL,
  deleted_at      TEXT,
  sync_version    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conversation_summaries (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary         TEXT NOT NULL,
  covers_until    TEXT NOT NULL,       -- timestamp da última msg resumida
  created_at      TEXT NOT NULL,
  sync_version    INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- SUPPORT NETWORK (opcional)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_contacts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  relation     TEXT,                  -- 'family','friend','partner','therapist','mentor'
  priority     INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT,
  sync_version INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- EMERGENCY HUB (100% opt-in)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_preferences (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- 'never' | 'suggest_only' | 'ask_first' | 'allow_selected'
  mode         TEXT NOT NULL DEFAULT 'never' CHECK (mode IN ('never','suggest_only','ask_first','allow_selected')),
  allowed_contact_ids TEXT,           -- JSON: ids de support_contacts autorizados
  updated_at   TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alerts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,         -- 'talk','help','show_plan'
  -- NUNCA contém conversa/diário/memórias. Mensagem fixa e neutra.
  message      TEXT NOT NULL DEFAULT 'O usuário solicitou apoio e gostaria de ser contatado.',
  contact_ids  TEXT,                  -- JSON
  consented    INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- SAFETY FLAGS (marcadores de tom — NÃO são diagnóstico)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS safety_flags (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signal       TEXT NOT NULL,         -- marcador genérico (ex: 'low_mood_streak')
  severity     TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info','gentle','offer_resources')),
  handled      INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  sync_version INTEGER NOT NULL DEFAULT 0
);

------------------------------------------------------------------------------
-- SYNC OUTBOX (fila de mudanças p/ envio quando Cloud/Hybrid)
------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sync_outbox (
  id           TEXT PRIMARY KEY,
  entity       TEXT NOT NULL,
  entity_id    TEXT NOT NULL,
  op           TEXT NOT NULL CHECK (op IN ('upsert','delete')),
  payload      TEXT NOT NULL,         -- JSON snapshot
  created_at   TEXT NOT NULL,
  synced_at    TEXT
);

------------------------------------------------------------------------------
-- ÍNDICES
------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_mem_user        ON memories(user_id, importance DESC);
CREATE INDEX IF NOT EXISTS idx_msg_conv        ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_habitlogs_user  ON habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_moods_user      ON moods(user_id, date);
CREATE INDEX IF NOT EXISTS idx_chars_user      ON characters(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_outbox_pending  ON sync_outbox(synced_at);
