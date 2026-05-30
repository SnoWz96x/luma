# LUMA — Estrutura do Projeto

Monorepo com workspaces (pnpm). Tudo vive **dentro de `tamago/`**.

```
tamago/
├── README.md
├── package.json                # raiz do monorepo (workspaces)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── docs/
│   ├── 01-ARQUITETURA.md
│   ├── 02-ROADMAP.md
│   ├── 03-BANCO-DE-DADOS.md
│   ├── 04-ESTRUTURA-PROJETO.md
│   ├── 05-CHARACTER-ENGINE.md
│   ├── 06-MEMORY-ENGINE.md
│   └── 07-SAFETY-LAYER.md
│
├── packages/
│   ├── shared/                 # tipos, contratos, utils (sem I/O, sem framework)
│   │   ├── src/
│   │   │   ├── types/          # User, Character, Memory, WorldState, ...
│   │   │   ├── contracts/      # interfaces de Repository, AIProvider, SyncTransport
│   │   │   └── util/
│   │   └── package.json
│   │
│   ├── core/                   # ENGINES DE DOMÍNIO (puras, testáveis)
│   │   ├── src/
│   │   │   ├── character/      # Character Engine
│   │   │   ├── tamagotchi/     # estados vitais + decay/regen
│   │   │   ├── memory/         # Memory Engine (contexto, summaries)
│   │   │   ├── relationship/   # Relationship Engine
│   │   │   ├── world/          # World Engine (mundo espelho, constelações)
│   │   │   ├── habit/          # Habit Engine
│   │   │   ├── ai/             # AI Engine + prompt builder
│   │   │   ├── safety/         # Safety Layer
│   │   │   ├── support/        # Support Network
│   │   │   ├── emergency/      # Emergency Hub
│   │   │   └── help/           # Help/Resource Hub (providers por país)
│   │   └── package.json
│   │
│   ├── db/                     # schemas + migrations + acesso
│   │   ├── sqlite/schema.sql
│   │   ├── postgres/schema.sql
│   │   ├── migrations/
│   │   └── package.json
│   │
│   └── characters/             # catálogo dos 100+ personagens
│       ├── data/               # JSON por personagem (ou agrupado)
│       ├── src/generate.ts     # gerador procedural dos personagens
│       ├── src/index.ts        # loader + validação (zod)
│       └── package.json
│
└── apps/
    ├── desktop/                # Tauri + React + TS + Zustand + Tailwind
    │   ├── src-tauri/          # Rust (janela transparente, tray, SQLite)
    │   ├── src/
    │   │   ├── pet/            # render do pet, animações, arrastar
    │   │   ├── world/          # cenário, clima, paleta
    │   │   ├── ui/             # painéis: humor, hábitos, memórias, apoio
    │   │   ├── stores/         # Zustand
    │   │   ├── repositories/   # impl. SQLite das interfaces de shared
    │   │   └── ai/             # impl. dos AIProviders (Ollama local)
    │   └── package.json
    │
    ├── web/                    # Next.js + TS + Tailwind (espelho)
    │   ├── app/
    │   │   ├── (dashboard)/    # humor, evolução, mundo, itens
    │   │   └── api/            # rotas (se necessário)
    │   ├── lib/                # cliente de sync, postgres
    │   └── package.json
    │
    └── api/                    # Backend API (sync + cloud opcional)
        ├── src/
        │   ├── routes/         # auth, sync, alerts
        │   ├── sync/           # Sync Engine server-side
        │   └── db/             # acesso PostgreSQL
        └── package.json
```

## Convenções

- **Linguagem:** TypeScript em todo o JS; Rust no `src-tauri`.
- **Domínio puro:** `packages/core` e `packages/shared` não importam framework,
  banco nem rede. Recebem dados, devolvem decisões.
- **Inversão de dependência:** `shared/contracts` define interfaces
  (`CharacterRepository`, `MemoryRepository`, `AIProvider`, `SyncTransport`);
  `apps/*` fornecem as implementações concretas.
- **Validação:** `zod` nos limites (carregar personagens, payloads de sync, IA).
- **Testes:** Vitest. Engines de domínio com cobertura alta (são puras → fácil).
- **Estilo:** ESLint + Prettier. Imports absolutos via paths do tsconfig.
- **Sem segredos no repo.** Config de nuvem/IA via env e `settings`.

## Ordem de build (deps)
```
shared → db → core → characters → apps/desktop
                                 → apps/api → apps/web
```
