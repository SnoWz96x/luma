# LUMA — Banco de Dados

Dois bancos, mesmo modelo conceitual:

- **SQLite** (`packages/db/sqlite/schema.sql`) — local, fonte da verdade. Roda no Desktop.
- **PostgreSQL** (`packages/db/postgres/schema.sql`) — nuvem, espelho opcional (Sync).

## Convenções

- IDs: `TEXT` UUID (v4) — iguais em ambos os bancos para sync sem remapeamento.
- Timestamps: ISO-8601 UTC em `TEXT` (SQLite) / `TIMESTAMPTZ` (Postgres).
- Sync: toda tabela sincronizável tem `updated_at` e `deleted_at` (soft delete) e
  `sync_version` (inteiro incremental) para resolução last-write-wins por entidade.
- Estados vitais: inteiros `0..100` internamente — **nunca exibidos como número**.

## Entidades (visão geral)

```
users ──┬── settings
        ├── user_profile ── user_traits
        ├── characters (instâncias do usuário) ── character_states
        │        └── (ref) character_defs (catálogo, read-only)
        ├── relationships
        ├── moods ── mood_history
        ├── habits ── habit_logs
        ├── memories ── memory_clusters ── constellations
        ├── inventory ── items (catálogo)
        ├── world_state
        ├── conversations ── messages ── conversation_summaries
        ├── support_contacts
        ├── emergency_preferences ── alerts
        └── safety_flags
```

`character_defs` e `items` são **catálogos** (read-only, versionados com o app);
as demais são dados do usuário (editáveis, exportáveis, apagáveis).

## Tabelas principais

### users
Conta local. Em Local Only, é um único usuário sem credenciais de nuvem.

### user_profile / user_traits
Perfil aprendido: `favorite_activity`, `sleep_quality`, traços inferidos
(`creative`, `adventurous`...) com peso/confiança. Alimenta o prompt da IA.

### character_defs (catálogo) / characters (instância) / character_states
- `character_defs`: os 100+ personagens (id, nome, espécie, personalidade,
  história, frases, emoções, preferências, raridade, bioma, arquétipo, evolução).
- `characters`: a instância adotada pelo usuário (apelido, estágio de evolução).
- `character_states`: estados vitais atuais (energia, humor, curiosidade, vínculo,
  conforto, confiança, sono, progresso) + `last_tick_at` para decay.

### relationships
Amizade, confiança, familiaridade, memórias/aventuras compartilhadas, tempo de
convivência (`first_met_at`, `total_time_seconds`).

### moods / mood_history
Check-in diário do usuário (humor, energia, sono, nota livre). Histórico.

### habits / habit_logs
Definição de hábito (título, tipo, frequência, recompensa) e log de execução
(streaks calculados a partir dos logs).

### memories / memory_clusters / constellations
Memórias importantes (texto, emoção, importância 0..100, origem). Clusters agrupam
memórias relacionadas. Constelações materializam memórias como estrelas/objetos.

### inventory / items
`items`: catálogo (móveis, plantas, roupas, efeitos, biomas, sons, skins).
`inventory`: o que o usuário desbloqueou e onde está posicionado.

### world_state
Estado do mundo espelho: bioma ativo, clima, paleta, elementos gerados
(flores, pontes, árvores, vaga-lumes) ligados a hábitos/metas/memórias.

### conversations / messages / conversation_summaries
Histórico de conversa + resumos comprimidos (para caber no contexto da IA).

### support_contacts
Contatos de confiança (nome, telefone, email, relação, prioridade). **Opcional.**

### emergency_preferences / alerts
Preferências de alerta (nunca / sugerir / perguntar antes / contatos selecionados)
e registro de alertas disparados (sem nunca anexar conversa/diário/memórias).

### safety_flags
Sinais levantados pela Safety Layer (sem diagnóstico — apenas marcadores para
orientar tom e oferecer recursos de ajuda).

### settings
Modo de sync (`local`/`cloud`/`hybrid`), provider de IA, país (Help Hub),
criptografia, idioma, etc.

Ver SQL completo em [`packages/db/sqlite/schema.sql`](../packages/db/sqlite/schema.sql)
e [`packages/db/postgres/schema.sql`](../packages/db/postgres/schema.sql).
