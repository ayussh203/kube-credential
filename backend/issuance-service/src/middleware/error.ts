import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export function errorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  logger.error({ err, status }, 'Unhandled error');
  res.status(status).json({ error: message });
}
