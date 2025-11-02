import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtUser {
  id: string;
  role: 'ADMIN' | 'OWNER' | 'STAFF' | 'GUEST';
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ data: null, error: { message: 'Missing authorization', code: 'NO_AUTH' } });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtUser;
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ data: null, error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
  }
}

export function authorize(roles: JwtUser['role'][] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined;
    if (!user) return res.status(401).json({ data: null, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ data: null, error: { message: 'Forbidden', code: 'FORBIDDEN' } });
    }
    next();
  };
}