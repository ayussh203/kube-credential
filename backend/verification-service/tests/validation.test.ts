import request from 'supertest';
import app from '../src/app';

describe('Verification validation', () => {
  const valid = {
    subject: 'did:example:alice',
    issuer: 'did:example:issuer',
    issuanceDate: '2024-01-01T12:00:00.000Z',
    claims: { level: 'gold', score: 95 }
  };

  it('accepts a valid payload', async () => {
    const res = await request(app).post('/api/verify').send(valid);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('valid');
    expect(res.body.received.subject).toBe(valid.subject);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/verify').send({ issuer: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('rejects bad issuanceDate format', async () => {
    const bad = { ...valid, issuanceDate: 'not-a-date' };
    const res = await request(app).post('/api/verify').send(bad);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});
