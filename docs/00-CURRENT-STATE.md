# LUMA — CURRENT STATE (auditoria do código real)

> Snapshot factual do repositório em 2026-05-31 (commit `00a2efb`). Gerado por
> auditoria direta de `packages/` e `apps/`, não de planos. 128 testes passando.

## Monorepo
```
packages/shared   — tipos + contratos (sem I/O)
packages/core     — engines de domínio puras (11) + 12 arquivos de teste
packages/characters — 100 personagens (gerador determinístico) + renderizador SVG
packages/db       — schema SQLite + PostgreSQL
apps/desktop      — Tauri + React + Zustand + Tailwind (app nativo funcionando)
```
Ainda **não existe**: `apps/web`, `apps/api`.

## Engines em `packages/core` (11) — todas puras e testadas
| Engine | Arquivo | Estado |
|--------|---------|--------|
| Tamagotchi | `tamagotchi/tamagotchi.ts` + `sensory.ts` | ✅ estados vitais, decay/regen, sinais sensoriais (sem barras) |
| Safety Layer | `safety/safety.ts` | ✅ inspeção entrada/saída, regras, oferta de recursos |
| AI Engine | `ai/{mockProvider,ollamaProvider,prompt,chatService}.ts` | ✅ Mock + Ollama local + prompt builder + fluxo c/ safety |
| Memory | `memory/memory.ts` | ✅ extractMemory, diaryMemory, rankMemories |
| Relationship | `relationship/relationship.ts` | ✅ amizade/confiança/familiaridade + estágios |
| Growth | `growth/growth.ts` | ✅ egg→elder, care-quality, ramo por traço |
| Achievement | `achievement/achievement.ts` | ✅ badges + streak com proteção |
| Habit | `habit/habit.ts` | ✅ hábitos, streak por hábito, idempotência |
| Activity | `activity/breathing.ts` | ✅ respiração guiada (1 minigame) |
| Economy | `economy/shop.ts` | ✅ loja cosmética, skins, compra/equipar |
| World | `world/world.ts` + `constellation.ts` | ✅ mundo espelho + constelações de memória |
| Help/Support | `help/providers.ts` + `support/support.ts` | ✅ BrazilProvider + rede de apoio + emergency opt-in |

## Tipos compartilhados (`packages/shared/src/types`)
character, state, memory, relationship, world, growth, achievement, habit, shop, support.
Contratos: `AIProvider`, repositórios.

## App Desktop — 8 stores Zustand
appStore (onboarding/eclosão), petStore (vitais), chatStore (conversa),
memoryStore (diário+memórias), progressStore (growth/badges/streak),
habitsStore (hábitos+fagulhas), shopStore (skins), supportStore (apoio),
aiStore (provider Mock/Ollama).

## App Desktop — 15 componentes / 10 abas
Onboarding (categoria→personagem, 100), EggHatch (ovo nasce), PetView (SVG por
estágio/ramo + skin), Scene (clima/paleta/luz), InteractionBar, Chat (+ recursos
de crise), WorldScene (mundo espelho), DiaryPanel, HabitsPanel, Breathing,
ShopPanel, SupportPanel, SettingsPanel (país, IA, demo crescimento, privacidade),
BadgesPanel, Celebration, TitleBar.

## Persistência
- **SQLite** (Tauri) via migrations v1 (schema) + v2 (`app_kv`).
- Camada `repositories/kv.ts`: localStorage como cache síncrono + espelho
  assíncrono no SQLite; `hydrateFromSqlite` no boot.
- `vitalStateRepo` grava estados vitais no SQLite.

## IA
- `MockProvider` (offline, padrão) e `LocalOllamaProvider` (local, opt-in).
- Seletor em Ajustes (endereço/modelo/status/testar), fallback automático p/ Mock.
- CSP do Tauri liberada p/ `localhost:11434`.

## Plataformas
- ✅ Desktop nativo (Tauri) — compila e roda (janela transparente, ícones).
- ❌ Web (Next.js) e ❌ Backend API/Sync: não iniciados.

## Qualidade
128 testes (107 core + 21 characters), type-check e build limpos. Repo público
no GitHub (SnoWz96x/luma).
