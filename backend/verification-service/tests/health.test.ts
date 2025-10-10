import request from 'supertest';
import app from '../src/app';

describe('verification service health', () => {
  it('GET /healthz returns ok + worker', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.worker).toBe('string');
  });

  it('GET /readyz returns ready true', async () => {
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(200);
    expect(res.body.ready).toBe(true);
  });
});
