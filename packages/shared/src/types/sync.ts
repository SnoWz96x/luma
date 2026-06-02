// Sync Engine — tipos. Veja docs/01-ARQUITETURA.md (ADR-005) e 03-BANCO-DE-DADOS.
// Sincronização opcional (opt-in). Resolução por entidade: last-write-wins via
// updated_at + sync_version. Soft delete (deleted_at) sincroniza como remoção.

export type SyncMode = "local" | "cloud" | "hybrid";

/** Operação enfileirada para enviar à nuvem (outbox). */
export type SyncOp = "upsert" | "delete";

/** Item sincronizável: precisa de id, updated_at e sync_version. */
export interface Syncable {
  id: string;
  updatedAt: string; // ISO-8601 UTC
  syncVersion: number;
  deletedAt?: string | null;
}

/** Entrada da fila de saída (mudanças locais a enviar). */
export interface OutboxEntry<T extends Syncable = Syncable> {
  entity: string; // nome da tabela/coleção
  op: SyncOp;
  payload: T;
  createdAt: string;
}

/** Pacote trocado com o servidor. */
export interface SyncPushRequest {
  entity: string;
  changes: OutboxEntry[];
  /** marca d'água: última versão conhecida pelo cliente (para o pull) */
  since: number;
}

export interface SyncPullResponse<T extends Syncable = Syncable> {
  entity: string;
  records: T[];
  /** maior sync_version retornada (nova marca d'água do cliente) */
  cursor: number;
}
