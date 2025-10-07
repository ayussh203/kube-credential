import { sqliteRepo } from '../src/repo/sqliteRepo';
import type { Credential } from '../src/schema/credential';

describe('SqliteRepo', () => {
  const payload: Credential = {
    subject: 'did:example:alice',
    issuer: 'did:example:issuer',
    claims: { k: 'v' },
    issuanceDate: '2024-01-01T00:00:00.000Z'
  };

  it('upserts and retrieves records', () => {
    const rec = sqliteRepo.upsert({
      credentialId: 'abc123',
      payload,
      issuedAt: '2024-01-01T01:00:00.000Z',
      issuedBy: 'worker-42'
    });

    expect(rec.credentialId).toBe('abc123');

    const read = sqliteRepo.get('abc123');
    expect(read).toBeTruthy();
    expect(read!.credentialId).toBe('abc123');
    expect(read!.issuedBy).toBe('worker-42');
    expect(read!.payload.subject).toBe('did:example:alice');
  });

  it('returns undefined for missing id', () => {
    const read = sqliteRepo.get('does-not-exist');
    expect(read).toBeUndefined();
  });
});
