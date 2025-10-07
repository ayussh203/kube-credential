import { Router } from 'express';
import { getWorkerId } from '../utils/worker';
import { pingDb } from '../db/sqlite';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', worker: getWorkerId() });
});

healthRouter.get('/readyz', (_req, res) => {
  const ok = pingDb();
  res.status(ok ? 200 : 500).json({ ready: ok });
});
