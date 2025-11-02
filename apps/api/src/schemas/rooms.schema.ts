import { z } from 'zod';

export const roomCreateSchema = z.object({
  number: z.string().min(1),
  roomTypeId: z.string().uuid(),
  status: z.enum(['AVAILABLE', 'MAINTENANCE', 'CLEANING']).default('AVAILABLE')
});

export const roomUpdateSchema = roomCreateSchema.partial();