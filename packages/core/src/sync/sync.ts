// Sync Engine — lógica PURA de sincronização (sem rede). O transporte HTTP fica
// na app/api; aqui ficam as regras testáveis: merge por entidade, marca d'água e
// fila de saída. Veja docs/16-SYNC-ENGINE.md.
//
// Política de conflito: LAST-WRITE-WINS por entidade, comparando primeiro
// sync_version (monotônico no servidor) e, em empate, updated_at (ISO UTC).
// Soft delete (deletedAt) é uma "escrita" como outra qualquer.
import type { OutboxEntry, Syncable, SyncOp } from "@luma/shared";

/** Decide qual versão vence entre local e remoto. true = remoto vence. */
export function remoteWins(local: Syncable, remote: Syncable): boolean {
  if (remote.syncVersion !== local.syncVersion) {
    return remote.syncVersion > local.syncVersion;
  }
  // empate de versão: a escrita mais recente vence (determinístico por string ISO)
  return remote.updatedAt > local.updatedAt;
}

/**
 * Faz o merge de um lote remoto sobre o estado local (por id).
 * Aplica last-write-wins; remoções (deletedAt) também vencem se forem mais novas.
 * Retorna o novo mapa e a lista de ids que mudaram.
 */
export function mergeRecords<T extends Syncable>(
  localById: Map<string, T>,
  remote: T[],
): { merged: Map<string, T>; changed: string[] } {
  const merged = new Map(localById);
  const changed: string[] = [];
  for (const r of remote) {
    const local = merged.get(r.id);
    if (!local || remoteWins(local, r)) {
      merged.set(r.id, r);
      changed.push(r.id);
    }
  }
  return { merged, changed };
}

/** Maior sync_version de um conjunto (nova marca d'água após um pull). */
export function nextCursor(records: Syncable[], current = 0): number {
  return records.reduce((max, r) => Math.max(max, r.syncVersion), current);
}

/** Cria uma entrada de outbox para uma mudança local. */
export function makeOutboxEntry<T extends Syncable>(
  entity: string,
  payload: T,
  op: SyncOp = payload.deletedAt ? "delete" : "upsert",
  nowISO = new Date().toISOString(),
): OutboxEntry<T> {
  return { entity, op, payload, createdAt: nowISO };
}

/**
 * Compacta a fila: mantém só a ÚLTIMA operação por (entity,id) — não adianta
 * enviar 5 edições do mesmo registro; o estado final é o que importa.
 */
export function compactOutbox(entries: OutboxEntry[]): OutboxEntry[] {
  const lastByKey = new Map<string, OutboxEntry>();
  for (const e of entries) {
    lastByKey.set(`${e.entity}:${e.payload.id}`, e);
  }
  return [...lastByKey.values()];
}

/**
 * Após um push aceito pelo servidor, remove da fila as entradas cujo payload já
 * foi confirmado (mesma versão ou inferior). Retorna a fila restante.
 */
export function ackOutbox(
  entries: OutboxEntry[],
  acked: { entity: string; id: string; syncVersion: number }[],
): OutboxEntry[] {
  const ackedMap = new Map(acked.map((a) => [`${a.entity}:${a.id}`, a.syncVersion]));
  return entries.filter((e) => {
    const v = ackedMap.get(`${e.entity}:${e.payload.id}`);
    return v === undefined || e.payload.syncVersion > v;
  });
}
