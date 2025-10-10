import { Router } from 'express';
import { getWorkerId } from '../utils/worker';
import { pingVerificationDb } from '../db/verificationDb';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', worker: getWorkerId() });
});

healthRouter.get('/readyz', (_req, res) => {
  const dbOk = pingVerificationDb();
  res.status(dbOk ? 200 : 500).json({
    ready: dbOk,
    worker: getWorkerId()
  });
});
