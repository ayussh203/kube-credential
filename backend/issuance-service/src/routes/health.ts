import { Router } from 'express';
import { getWorkerId } from '../utils/worker';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', worker: getWorkerId() });
});

healthRouter.get('/readyz', (_req, res) => {
  res.json({ ready: true });
});
