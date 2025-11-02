import { z } from 'zod';

export const roomTypeCreateSchema = z.object({
  name: z.string().min(2),
  capacity: z.number().int().min(1),
  basePrice: z.number().min(0),
  description: z.string().optional().default('')
});

export const roomTypeUpdateSchema = roomTypeCreateSchema.partial();