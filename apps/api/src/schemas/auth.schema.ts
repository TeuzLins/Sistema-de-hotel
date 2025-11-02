import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OWNER', 'STAFF', 'GUEST']).optional().default('GUEST')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});