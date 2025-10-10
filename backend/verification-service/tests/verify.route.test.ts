import request from 'supertest';
import app from '../src/app';
import { getIssuanceDb } from '../src/db/issuanceDb';

function resetIssuance() {
  const db = getIssuanceDb();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS issued_credentials (
      credential_id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      issued_by TEXT NOT NULL
    )
  `).run();
  db.prepare('DELETE FROM issued_credentials').run();
}

function seed(id: string, at: string, by: string) {
  const db = getIssuanceDb();
  db.prepare(`
    INSERT OR REPLACE INTO issued_credentials (credential_id, payload, issued_at, issued_by)
    VALUES (?, ?, ?, ?)
  `).run(id, '{}', at, by);
}

const cred = {
  subject: 'did:example:alice',
  issuer: 'did:example:issuer',
  claims: { level: 'gold' }
};

function idFor(c = cred) {
  const crypto = require('crypto');
  const basis = JSON.stringify({ subject: c.subject, issuer: c.issuer, claims: c.claims });
  return crypto.createHash('sha256').update(basis).digest('hex');
}

describe('POST /api/verify', () => {
  beforeEach(() => resetIssuance());

  it('returns valid:true for issued credentials', async () => {
    const id = idFor();
    const when = new Date().toISOString();
    seed(id, when, 'worker-123');

    const res = await request(app).post('/api/verify').send(cred);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.credentialId).toBe(id);
    expect(res.body.issuedAt).toBe(when);
    expect(res.body.issuedBy).toBe('worker-123');
    expect(res.body.verifiedBy).toMatch(/^worker-/);
  });

  it('returns valid:false for non-issued', async () => {
    const res = await request(app).post('/api/verify').send(cred);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.message).toBe('credential not issued');
    expect(res.body.verifiedBy).toMatch(/^worker-/);
  });
});
