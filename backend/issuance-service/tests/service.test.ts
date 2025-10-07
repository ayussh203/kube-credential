import { issuanceService } from '../src/services/issuance.service';

const sample = () => ({
  subject: 'did:example:alice',
  issuer: 'did:example:issuer',
  claims: { level: 'gold' }
});

describe('IssuanceService', () => {
  it('issues new credential with worker info and fills issuanceDate', () => {
    const res = issuanceService.issue(sample() as any);
    expect(res.status).toBe('new');
    if (res.status === 'new') {
      expect(res.message).toMatch(/^credential issued by worker-/);
      expect(typeof res.credentialId).toBe('string');
      expect(res.issuedBy).toBe('worker-42'); // from test HOSTNAME
      expect(typeof res.issuedAt).toBe('string');
      expect(typeof res.payload.issuanceDate).toBe('string');
    }
  });

  it('is idempotent for the same payload', () => {
    const first = issuanceService.issue(sample() as any);
    const second = issuanceService.issue(sample() as any);
    expect(first.status).toBe('new');
    expect(second.status).toBe('already');
    if (second.status === 'already' && first.status === 'new') {
      expect(second.message).toBe('already issued');
      expect(second.credentialId).toBe(first.credentialId);
      expect(typeof second.issuedAt).toBe('string');
    }
  });
});
