import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map(i => ({
          path: i.path.join('.'),
          message: i.message,
          code: i.code
        }));
        return next(new AppError('Validation failed', 400, JSON.stringify(details)));
      }
      next(err);
    }
  };
}
