# LUMA — Sync Engine

Sincronização **opcional** (opt-in) entre Desktop e Web/nuvem. Padrão: `local`
(nada sai da máquina). Veja docs/01-ARQUITETURA.md (ADR-005) e 03-BANCO-DE-DADOS.

> Status: **lógica pura implementada e testada** (`packages/core/src/sync`).
> Falta o transporte HTTP (`apps/api` + cliente no desktop) — próximo passo.

## Modos (`SyncMode`)
- **local** — 100% offline, sem servidor (padrão).
- **cloud** — espelha tudo na nuvem.
- **hybrid** — local é a verdade; nuvem é backup/espelho.

## Política de conflito: last-write-wins por entidade
Cada registro sincronizável (`Syncable`) tem `id`, `updatedAt` (ISO UTC) e
`syncVersion` (inteiro monotônico). Ao mesclar, vence:
1. maior `syncVersion`; em empate,
2. `updatedAt` mais recente.

Remoção é soft delete (`deletedAt`) — sincroniza como uma escrita normal.

## Funções puras (`core/sync`)
- `remoteWins(local, remote)` — decisão de conflito.
- `mergeRecords(localById, remote[])` — aplica o lote remoto (LWW) e diz o que mudou.
- `nextCursor(records, current)` — nova marca d'água (maior `syncVersion`).
- `makeOutboxEntry(entity, payload)` — cria item da fila de saída.
- `compactOutbox(entries)` — mantém só a última op por (entity,id).
- `ackOutbox(entries, acked)` — limpa a fila após confirmação do servidor.

## Fluxo (quando o transporte existir)
```
PUSH:  compactOutbox(local) → POST /sync/push → ackOutbox(confirmados)
PULL:  GET /sync/pull?since=cursor → mergeRecords → cursor = nextCursor(...)
```
Tudo idempotente e determinístico — por isso é testável sem servidor (13 testes).

## Privacidade
- Em `local`, o Sync Engine nunca é acionado.
- O usuário escolhe o modo; pode exportar/apagar a qualquer momento (aba Ajustes).
- Conversas/diário só sincronizam se o modo permitir — nunca por padrão.

## Próximo (transporte)
1. `apps/api` (Node + PostgreSQL): rotas `/sync/push` e `/sync/pull` por entidade,
   atribuindo `syncVersion` no servidor.
2. Cliente de sync no desktop: lê o `sync_outbox` (SQLite) e aplica pull/push.
3. `apps/web` consome o pull para refletir o pet em tempo (quase) real.
