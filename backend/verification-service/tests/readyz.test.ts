import request from 'supertest';
import app from '../src/app';

describe('readyz endpoint', () => {
  it('returns ready:true when DB reachable', async () => {
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(200);
    expect(res.body.ready).toBe(true);
    expect(res.body.worker).toMatch(/^worker-/);
  });
});
