import { prisma } from '../prisma/client.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

function signTokens(user: { id: string; role: string }) {
  const access = jwt.sign({ id: user.id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ id: user.id, role: user.role }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { access, refresh };
}

export const signup = async (req: any, res: any) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const { name, email, password, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ data: null, error: { message: 'Email already used' } });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role } });
  const tokens = signTokens(user);
  res.json({ data: { user: { id: user.id, name, email, role }, tokens } });
};

export const login = async (req: any, res: any) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ data: null, error: { message: 'Invalid credentials' } });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ data: null, error: { message: 'Invalid credentials' } });
  const tokens = signTokens(user);
  res.json({ data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens } });
};

export const refresh = async (req: any, res: any) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ data: null, error: { message: 'Missing token' } });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
    const tokens = signTokens({ id: payload.id, role: payload.role });
    res.json({ data: { tokens } });
  } catch (e) {
    res.status(401).json({ data: null, error: { message: 'Invalid refresh token' } });
  }
};