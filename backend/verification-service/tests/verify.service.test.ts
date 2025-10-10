import { verificationService } from '../src/services/verification.service';
import { getIssuanceDb } from '../src/db/issuanceDb';

// seed helper to simulate an issued credential
function seedIssued(id: string, issuedAt: string, issuedBy: string) {
  const db = getIssuanceDb();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS issued_credentials (
      credential_id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      issued_by TEXT NOT NULL
    )
  `).run();
  db.prepare(`
    INSERT OR REPLACE INTO issued_credentials (credential_id, payload, issued_at, issued_by)
    VALUES (?, ?, ?, ?)
  `).run(id, '{}', issuedAt, issuedBy);
}

describe('VerificationService', () => {
  const credential = {
    subject: 'did:example:alice',
    issuer: 'did:example:issuer',
    claims: { level: 'gold' }
  };

  it('returns valid:true if credential is in issuance DB', () => {
    // precompute id the same way service would
    const crypto = require('crypto');
    const basis = JSON.stringify({ claims: { level: 'gold' }, issuer: 'did:example:issuer', subject: 'did:example:alice' });
    const id = crypto.createHash('sha256').update(basis).digest('hex');

    const now = new Date().toISOString();
    seedIssued(id, now, 'worker-xyz');

    const res = verificationService.verify(credential as any);
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.credentialId).toBe(id);
      expect(res.issuedAt).toBe(now);
      expect(res.issuedBy).toBe('worker-xyz');
      expect(res.verifiedBy).toMatch(/^worker-/);
    }
  });

  it('returns valid:false if not found', () => {
    const res = verificationService.verify(credential as any);
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.message).toBe('credential not issued');
      expect(res.verifiedBy).toMatch(/^worker-/);
    }
  });
});
