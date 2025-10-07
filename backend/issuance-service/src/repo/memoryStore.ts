import type { Credential } from '../schema/credential';

export interface IssuedRecord {
  credentialId: string;
  payload: Credential;
  issuedAt: string;   // ISO string
  issuedBy: string;   // worker-*
}

/** Very simple in-memory store. Replaced by SQLite in Part 4. */
class MemoryStore {
  private store = new Map<string, IssuedRecord>();

  get(id: string): IssuedRecord | undefined {
    return this.store.get(id);
  }

  upsert(rec: IssuedRecord): IssuedRecord {
    this.store.set(rec.credentialId, rec);
    return rec;
  }
}

export const memoryStore = new MemoryStore();
