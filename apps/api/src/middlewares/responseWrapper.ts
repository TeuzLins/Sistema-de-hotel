import { Request, Response, NextFunction } from 'express';

export function responseWrapper(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (body && ('data' in body || 'error' in body)) {
      return originalJson(body);
    }
    return originalJson({ data: body, meta: undefined, error: null });
  };
  next();
}