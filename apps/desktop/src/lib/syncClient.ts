// Cliente de sync (desktop) — transporte HTTP para a API do LUMA.
// Opt-in: só é chamado quando o modo de sync não é "local". A lógica de merge
// vive no core (mergeRecords/nextCursor). Veja docs/16-SYNC-ENGINE.md.
import type { OutboxEntry, Syncable } from "@luma/shared";

export interface PushResult {
  acked: { entity: string; id: string; syncVersion: number }[];
  cursor: number;
}

export interface PullResult<T extends Syncable = Syncable> {
  entity: string;
  records: T[];
  cursor: number;
}

export class SyncClient {
  constructor(private baseUrl: string) {}

  /** Verifica se a API está acessível. */
  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Envia mudanças locais de uma entidade. */
  async push(entity: string, changes: OutboxEntry[]): Promise<PushResult> {
    const res = await fetch(`${this.baseUrl}/sync/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, changes }),
    });
    if (!res.ok) throw new Error(`push falhou: ${res.status}`);
    return (await res.json()) as PushResult;
  }

  /** Busca registros novos de uma entidade desde `since`. */
  async pull<T extends Syncable>(entity: string, since: number): Promise<PullResult<T>> {
    const res = await fetch(
      `${this.baseUrl}/sync/pull?entity=${encodeURIComponent(entity)}&since=${since}`,
    );
    if (!res.ok) throw new Error(`pull falhou: ${res.status}`);
    return (await res.json()) as PullResult<T>;
  }
}
