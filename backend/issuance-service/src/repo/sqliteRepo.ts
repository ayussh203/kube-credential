import { getDb } from '../db/sqlite';
import type { Credential } from '../schema/credential';

export interface IssuedRecord {
  credentialId: string;
  payload: Credential;
  issuedAt: string;
  issuedBy: string;
}

export class SqliteRepo {
  get(credentialId: string): IssuedRecord | undefined {
    const row = getDb()
      .prepare(
        `SELECT credential_id, payload, issued_at, issued_by
         FROM issued_credentials WHERE credential_id = ?`
      )
      .get(credentialId) as
      | { credential_id: string; payload: string; issued_at: string; issued_by: string }
      | undefined;

    if (!row) return undefined;
    return {
      credentialId: row.credential_id,
      payload: JSON.parse(row.payload),
      issuedAt: row.issued_at,
      issuedBy: row.issued_by
    };
    }

  upsert(rec: IssuedRecord): IssuedRecord {
    getDb()
      .prepare(
        `INSERT INTO issued_credentials (credential_id, payload, issued_at, issued_by)
         VALUES (@credentialId, @payload, @issuedAt, @issuedBy)
         ON CONFLICT(credential_id) DO UPDATE SET
            payload = excluded.payload,
            issued_at = excluded.issued_at,
            issued_by = excluded.issued_by`
      )
      .run({
        credentialId: rec.credentialId,
        payload: JSON.stringify(rec.payload),
        issuedAt: rec.issuedAt,
        issuedBy: rec.issuedBy
      });
    return rec;
  }
}

export const sqliteRepo = new SqliteRepo();
