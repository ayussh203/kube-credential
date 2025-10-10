import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { AppError } from '../errors/AppError';

export function errorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);

  const status = err instanceof AppError ? err.status : err?.status ?? 500;
  const message = err instanceof AppError ? err.message : err?.message ?? 'Internal Server Error';

  let details: unknown = undefined;
  if (err instanceof AppError && err.code) {
    try {
      details = JSON.parse(err.code);
    } catch {
      details = err.code;
    }
  }

  logger.error({ err, status, details }, 'Unhandled error');
  res.status(status).json({ error: message, ...(details ? { details } : {}) });
}
