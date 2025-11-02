import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const meta = err.meta || undefined;
  res.status(status).json({ data: null, meta, error: { message, code: err.code || 'UNKNOWN_ERROR' } });
}