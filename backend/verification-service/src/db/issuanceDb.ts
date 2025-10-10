import Database from 'better-sqlite3';
import path from 'path';
import { env } from '../utils/env';
import logger from '../utils/logger';

let db: Database.Database | null = null;

export function getIssuanceDb(): Database.Database {
  if (db) return db;

  // default inside container; change as needed for local runs
  const file = path.resolve(env.ISSUANCE_DB_FILE || '/data/issuance.db');
  logger.info({ file }, '[verification] using issuance DB');

  // IMPORTANT: verification must NOT create/write the issuance DB
  // Fail fast if the path is wrong.
  db = new Database(file, { fileMustExist: true, readonly: true });
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  return db;
}

export function findIssuedById(credentialId: string): {
  credentialId: string;
  issuedAt: string;
  issuedBy: string;
} | undefined {
  try {
    const row = getIssuanceDb()
     .prepare(
        `SELECT credential_id AS credentialId,
                issued_at     AS issuedAt,
                issued_by     AS issuedBy
           FROM issued_credentials
          WHERE credential_id = ?`
      )
      .get(credentialId) as
      | { credentialId: string; issuedAt: string; issuedBy: string }
      | undefined;

    return row;
  } catch (err: any) {
    // Helpful message if we accidentally pointed to the wrong file
    if (err?.code === 'SQLITE_ERROR' && /no such table/i.test(err.message)) {
      logger.error(
        { err },
        '[verification] issued_credentials table missing - is ISSUANCE_DB_FILE pointing to the issuance DB?'
      );
      return undefined;
    }
    throw err;
  }
}
