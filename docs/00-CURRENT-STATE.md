# LUMA — CURRENT STATE (auditoria do código real)

> Snapshot factual do repositório em 2026-06-02. Gerado por auditoria direta de
> `packages/` e `apps/`, não de planos. **214 testes passando** (186 core + 23
> characters + 5 api), type-check limpo nos 6 workspaces, builds (desktop + web) ok.

## Monorepo
```
packages/shared     — tipos + contratos (sem I/O)
packages/core       — engines de domínio puras (19 módulos) + testes
packages/characters — 100 personagens (gerador) + renderizador SVG (vetorial + rico)
packages/db         — schema SQLite + PostgreSQL
apps/desktop        — Tauri + React + Zustand + Tailwind (app nativo, 12 abas)
apps/web            — Next.js 14 + Tailwind (site, 6 páginas)
apps/api            — Node HTTP (backend de sync, store + rotas push/pull)
```
Plano V3 (Sprints A–E) **concluído**. Atalhos: `LUMA-app.bat`, `LUMA-site.bat`,
`LUMA-api.bat` (duplo-clique para rodar localmente).

## Engines em `packages/core` (19 módulos) — puras e testadas
| Engine | Arquivo | Estado |
|--------|---------|--------|
| Tamagotchi | `tamagotchi/tamagotchi.ts` + `sensory.ts` | ✅ estados vitais, decay/regen, sinais sensoriais (sem barras) |
| Safety Layer | `safety/safety.ts` | ✅ inspeção entrada/saída, regras, oferta de recursos |
| AI Engine | `ai/{mockProvider,ollamaProvider,prompt,chatService,orchestrator}.ts` | ✅ Mock + Ollama + prompt builder + fluxo c/ safety + orquestrador de modelos |
| Memory | `memory/memory.ts` + `tiers.ts` | ✅ extração + tiers (curto/longo/emocional/marco) + relevância/decaimento |
| Emotion | `emotion/emotion.ts` | ✅ contexto emocional inferido (stress/energy/…); **não-clínico**, ajusta tom |
| Relationship | `relationship/relationship.ts` | ✅ amizade/confiança/familiaridade + estágios |
| Growth | `growth/growth.ts` | ✅ egg→elder, care-quality, ramo por traço |
| Achievement | `achievement/achievement.ts` | ✅ badges + streak com proteção gentil |
| Habit | `habit/habit.ts` | ✅ hábitos, streak por hábito, idempotência |
| Activity | `activity/breathing.ts` + `fishing.ts` | ✅ 2 minigames (respiração + pescaria) |
| Economy | `economy/shop.ts` | ✅ loja cosmética, skins, compra/equipar |
| World | `world/world.ts` + `constellation.ts` | ✅ mundo espelho + constelações de memória |
| Motivator | `motivator/motivator.ts` | ✅ vida interior do pet (sonhos/curiosidades) + falas proativas |
| Narrative | `narrative/narrative.ts` | ✅ micro-história por estágio de relacionamento |
| Events | `events/events.ts` | ✅ datas sazonais + aniversários (determinístico) |
| Plugin | `plugin/plugin.ts` | ✅ manifestos validados + registry de sprites (arte híbrida) |
| Sync | `sync/sync.ts` | ✅ merge last-write-wins + outbox/cursor (lógica pura, testada) |
| Help/Support | `help/providers.ts` + `support/support.ts` | ✅ BrazilProvider + rede de apoio + emergency opt-in |

## Tipos compartilhados (`packages/shared/src/types`)
character, state, memory, relationship, world, growth, achievement, habit, shop,
support, emotion, motivator, model, plugin, sync. Contratos: `AIProvider`, repositórios.

## App Desktop — 11 stores Zustand
appStore (onboarding/eclosão/hatched), petStore (vitais), chatStore (conversa +
emoção + memória), memoryStore (diário+memórias), progressStore (growth/badges/
streak/demoGrow), habitsStore (hábitos+fagulhas), shopStore (skins), supportStore
(apoio), aiStore (provider Mock/Ollama + model manager), **syncStore** (modos
local/hybrid/cloud), **artStore** (estilo vetorial ↔ rico).

## App Desktop — 12 abas
🏡 Casa · 💬 Conversar · 🌌 Mundo · 📖 História · 📓 Diário · 🌿 Hábitos ·
🫧 Respirar · 🎣 Pescar · 🎀 Loja · 💛 Apoio · 🏆 Conquistas · ⚙️ Ajustes.
+ Onboarding (categoria→personagem, 100) · EggHatch (ovo nasce) · PetSpeech (fala
proativa) · TitleBar (min/max/fechar via API global do Tauri).

## App Web (`apps/web`) — 6 páginas (Next.js, estático)
`/` (landing) · `/como-funciona` · `/personagens` (galeria real dos 100, busca+filtro)
· `/faq` · `/apoio` · `/download`. Design system cozy próprio. Build estático limpo.

## Sincronização (`apps/api` + cliente desktop)
- **Backend** `apps/api`: Node HTTP puro. Rotas `GET /health`, `POST /sync/push`,
  `GET /sync/pull`. `InMemorySyncStore` é a autoridade da `syncVersion`; interface
  pronta para `PostgresSyncStore`. 5 testes (push/pull/delete/isolamento/ciclo).
- **Cliente** desktop: `syncClient` (HTTP) + `syncStore` (modos local/hybrid/cloud,
  opt-in, fallback gracioso). UI em ⚙️ Ajustes. **Validado end-to-end** (push/pull/
  edição/delete/pull incremental).

## Arte dos personagens (toggle)
- `renderPetSVG` tem 2 estilos: **vetorial** (padrão, chapado) e **rico** (sticker:
  contorno grosso, gradiente profundo, gloss, sombra). `artStore` + UI alternam com
  1 clique, mantendo os dois. Sprites/ilustração externos entram via Plugin Engine.

## Persistência
- **SQLite** (Tauri) via migrations v1 (schema) + v2 (`app_kv`).
- Camada `repositories/kv.ts`: localStorage = cache síncrono + espelho assíncrono
  no SQLite; `hydrateFromSqlite` no boot. Todos os stores usam a camada kv.
- `vitalStateRepo` grava estados vitais no SQLite.

## IA
- `MockProvider` (offline, padrão), `LocalOllamaProvider` (local), `orchestrator`
  (catálogo de modelos + escolha por RAM). Seletor + Model Manager em Ajustes;
  fallback automático p/ Mock. CSP liberada p/ `localhost:11434`.

## Qualidade & distribuição
- **214 testes**, type-check (6 workspaces) e builds (desktop + web) limpos. Repo
  público (SnoWz96x/luma) com 20 topics, README profissional, CONTRIBUTING,
  LICENSE (MIT), NOTICE, logo SVG.
- Atalhos `LUMA-app.bat` / `LUMA-site.bat` / `LUMA-api.bat` (duplo-clique).

## Pendente (futuro, fora do MVP V3)
- `PostgresSyncStore` (hoje a store de sync é em memória — perfeita para dev/teste).
- Site web consumir o pull para espelhar o pet em tempo real.
- Arte por IA real (PNG/ilustração) via sprite-pack — o toggle já suporta.
- V2: família do pet, mobile, criptografia local, providers de IA cloud.
