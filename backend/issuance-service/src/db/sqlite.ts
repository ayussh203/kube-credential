import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../utils/env';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  // ensure directory exists
  const dir = path.dirname(env.DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(env.DB_FILE, { fileMustExist: false });

  // pragmas for reliability
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // init schema
  db.prepare(`
    CREATE TABLE IF NOT EXISTS issued_credentials (
      credential_id TEXT PRIMARY KEY,
      payload       TEXT NOT NULL,
      issued_at     TEXT NOT NULL,
      issued_by     TEXT NOT NULL
    )
  `).run();

  return db;
}

export function pingDb(): boolean {
  try {
    const d = getDb();
    // simple no-op query
    d.prepare('SELECT 1').get();
    return true;
  } catch {
    return false;
  }
}

export function resetDb(): void {
  const d = getDb();
  d.prepare('DELETE FROM issued_credentials').run();
}
