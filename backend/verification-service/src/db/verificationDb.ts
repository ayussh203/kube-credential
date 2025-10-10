import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../utils/env';
import logger from '../utils/logger';

let db: Database.Database | null = null;

export function getVerificationDb(): Database.Database {
  if (db) return db;

  //const file = path.resolve(env.VERIFICATION_DB_FILE);
  const file = path.resolve(env.VERIFICATION_DB_FILE || './data/verification.db');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.prepare(`
    CREATE TABLE IF NOT EXISTS verification_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      credential_id TEXT NOT NULL,
      valid INTEGER NOT NULL,
      verified_by TEXT NOT NULL,
      verified_at TEXT NOT NULL,
      result_json TEXT NOT NULL
    )
  `).run();

  logger.info(`verification DB ready at ${file}`);
  return db;
}

export function recordAudit(
  credentialId: string,
  valid: boolean,
  verifiedBy: string,
  result: unknown
): void {
  const db = getVerificationDb();
  db.prepare(
    `INSERT INTO verification_audit (credential_id, valid, verified_by, verified_at, result_json)
     VALUES (?, ?, ?, ?, ?)`
  ).run(credentialId, valid ? 1 : 0, verifiedBy, new Date().toISOString(), JSON.stringify(result));
}

export function pingVerificationDb(): boolean {
  try {
    const db = getVerificationDb();
    db.prepare('SELECT 1').get();
    return true;
  } catch (e) {
    logger.error({ e }, 'verification DB ping failed');
    return false;
  }
}
