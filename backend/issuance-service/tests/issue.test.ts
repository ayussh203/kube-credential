import request from 'supertest';
import app from '../src/app';
import { resetDb } from '../src/db/sqlite';

const sample = () => ({
  subject: 'did:example:alice',
  issuer: 'did:example:issuer',
  claims: { level: 'gold', tags: ['a', 'b', 1] }
});

describe('POST /api/issue', () => {
  beforeEach(() => resetDb());

  it('issues a new credential and returns worker info', async () => {
    const res = await request(app).post('/api/issue').send(sample());
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/^credential issued by worker-/);
    expect(typeof res.body.credentialId).toBe('string');
    expect(typeof res.body.issuedBy).toBe('string');
    expect(typeof res.body.issuedAt).toBe('string');
    expect(typeof res.body.payload.issuanceDate).toBe('string');
  });

  it('is idempotent: same payload returns "already issued"', async () => {
    const first = await request(app).post('/api/issue').send(sample());
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/issue').send(sample());
    expect(second.status).toBe(200);
    expect(second.body.message).toBe('already issued');
  });
});
