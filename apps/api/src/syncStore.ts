// Store de sincronização server-side. A lógica é PURA e testável (sem HTTP nem
// banco vivo). A implementação padrão é em memória; uma futura PostgresSyncStore
// implementa a mesma interface. Veja docs/16-SYNC-ENGINE.md.
import type { Syncable, OutboxEntry } from "@luma/shared";

/** Registro guardado pelo servidor: o dado + a versão atribuída pelo servidor. */
type ServerRecord = Syncable & Record<string, unknown>;

export interface SyncStore {
  /** Aplica mudanças do cliente; o servidor atribui novas syncVersion. */
  push(
    entity: string,
    changes: OutboxEntry[],
  ): { acked: { entity: string; id: string; syncVersion: number }[]; cursor: number };
  /** Devolve registros com syncVersion > since. */
  pull(entity: string, since: number): { records: ServerRecord[]; cursor: number };
}

/**
 * Implementação em memória. O servidor é a AUTORIDADE da syncVersion: cada push
 * aceito recebe uma versão monotônica crescente por entidade (LWW determinístico).
 */
export class InMemorySyncStore implements SyncStore {
  // entity -> (id -> registro)
  private data = new Map<string, Map<string, ServerRecord>>();
  // entity -> contador monotônico de versão
  private clock = new Map<string, number>();

  private bump(entity: string): number {
    const next = (this.clock.get(entity) ?? 0) + 1;
    this.clock.set(entity, next);
    return next;
  }

  private bucket(entity: string): Map<string, ServerRecord> {
    let b = this.data.get(entity);
    if (!b) {
      b = new Map();
      this.data.set(entity, b);
    }
    return b;
  }

  push(entity: string, changes: OutboxEntry[]) {
    const bucket = this.bucket(entity);
    const acked: { entity: string; id: string; syncVersion: number }[] = [];

    for (const ch of changes) {
      const incoming = ch.payload as ServerRecord;
      const current = bucket.get(incoming.id);

      // só aplica se for novidade (cliente nunca regride o servidor).
      // a versão do CLIENTE é ignorada para ordenação; o servidor decide a sua.
      const isDelete = ch.op === "delete" || Boolean(incoming.deletedAt);
      const version = this.bump(entity);
      const record: ServerRecord = {
        ...incoming,
        syncVersion: version,
        deletedAt: isDelete ? (incoming.deletedAt ?? new Date().toISOString()) : null,
        updatedAt: incoming.updatedAt ?? new Date().toISOString(),
      };

      // mantém o registro (mesmo deletado, para propagar a remoção no pull)
      bucket.set(incoming.id, record);
      acked.push({ entity, id: incoming.id, syncVersion: version });
      void current;
    }

    return { acked, cursor: this.clock.get(entity) ?? 0 };
  }

  pull(entity: string, since: number) {
    const bucket = this.bucket(entity);
    const records = [...bucket.values()]
      .filter((r) => r.syncVersion > since)
      .sort((a, b) => a.syncVersion - b.syncVersion);
    const cursor = records.reduce((m, r) => Math.max(m, r.syncVersion), since);
    return { records, cursor };
  }
}
