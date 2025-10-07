import request from 'supertest';
import app from '../src/app';
import { resetDb } from '../src/db/sqlite';

describe('Credential validation', () => {
  beforeEach(() => resetDb());

  const valid = {
    subject: 'did:example:alice',
    issuer: 'did:example:issuer',
    issuanceDate: '2024-01-01T12:00:00.000Z',
    claims: { level: 'gold', score: 95 }
  };

  it('accepts a valid payload and issues', async () => {
    const res = await request(app).post('/api/issue').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/^credential issued by worker-/);
    expect(res.body.payload.subject).toBe(valid.subject);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/issue').send({ issuer: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('rejects bad issuanceDate format', async () => {
    const bad = { ...valid, issuanceDate: 'not-a-date' };
    const res = await request(app).post('/api/issue').send(bad);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});
