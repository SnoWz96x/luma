# LUMA

> Um ser vivo digital que mora no computador e cresce junto com seu usuário.

LUMA é um ecossistema de companhia digital, bem-estar e autocuidado. Um companheiro
vivo que mora no **Desktop**, no **Site** e (futuramente) no **Mobile**, tudo
sincronizado. Ele aprende, evolui, cria memórias, constrói seu próprio mundo e
desenvolve personalidade junto do usuário — funcionando também como uma **ponte
opcional para ajuda real** quando necessário.

## O que LUMA NÃO é

- ❌ Terapia
- ❌ Diagnóstico
- ❌ Tratamento médico
- ❌ Substituto de psicólogo ou psiquiatra
- ❌ Um chatbot
- ❌ Um clone de Finch / Replika / Tamagotchi

## O que LUMA É

- ✅ Companhia
- ✅ Bem-estar e autocuidado
- ✅ Hábitos e organização emocional
- ✅ Crescimento pessoal
- ✅ Rede de apoio **opcional**

## Princípios de Design

1. **Offline-first** — tudo funciona 100% local por padrão.
2. **Privacidade radical** — dados são do usuário (editáveis, exportáveis, apagáveis).
3. **Sem barras** — estados emocionais são *sentidos* (luz, clima, animação), não lidos.
4. **Sem culpa, sem manipulação** — o pet nunca usa "você me abandonou".
5. **Incentiva conexão humana real** — nunca cria dependência emocional.
6. **Modular e escalável** — cada engine é isolada e substituível.
7. **A IA é só o mecanismo** — o valor está em memória, contexto e relacionamento.

## Documentação

| Doc | Conteúdo |
|-----|----------|
| [docs/01-ARQUITETURA.md](docs/01-ARQUITETURA.md) | Visão de sistema, engines, diagramas |
| [docs/02-ROADMAP.md](docs/02-ROADMAP.md) | Fases, MVP, marcos |
| [docs/03-BANCO-DE-DADOS.md](docs/03-BANCO-DE-DADOS.md) | Modelo de dados, SQLite + PostgreSQL |
| [docs/04-ESTRUTURA-PROJETO.md](docs/04-ESTRUTURA-PROJETO.md) | Monorepo, pastas, convenções |
| [docs/05-CHARACTER-ENGINE.md](docs/05-CHARACTER-ENGINE.md) | Personagens, schema, geração dos 100 |
| [docs/06-MEMORY-ENGINE.md](docs/06-MEMORY-ENGINE.md) | Memória, contexto, prompt building |
| [docs/07-SAFETY-LAYER.md](docs/07-SAFETY-LAYER.md) | Camada de segurança e ética |

## Estrutura (Monorepo)

```
luma/
├── apps/
│   ├── desktop/   # Tauri + React + TS + SQLite + Zustand + Tailwind
│   ├── web/       # Next.js + TS + Tailwind + PostgreSQL
│   └── api/       # Backend API (sync, cloud opcional)
├── packages/
│   ├── core/      # Engines de domínio (puro TS, sem I/O)
│   ├── db/        # Schemas SQLite + PostgreSQL + migrations
│   ├── characters/# Dados dos 100 personagens + gerador
│   └── shared/    # Tipos, contratos, utils compartilhados
└── docs/
```

## Status

🚧 **Fase 0 — Fundação.** Arquitetura, roadmap, banco e estrutura definidos.
Próximo: implementação incremental do MVP (Desktop Pet → Character → Memory → IA local).
