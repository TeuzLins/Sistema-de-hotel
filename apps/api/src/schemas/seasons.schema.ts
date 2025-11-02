import { z } from 'zod';

export const seasonCreateSchema = z.object({
  name: z.string().min(2),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  priceMultiplier: z.number().min(0)
});

export const seasonUpdateSchema = seasonCreateSchema.partial();