import { z } from 'zod';

export const priceRuleCreateSchema = z.object({
  ruleType: z.enum(['WEEKEND', 'HOLIDAY', 'LAST_MINUTE', 'LONG_STAY']),
  value: z.number(),
  operator: z.enum(['MULTIPLY', 'ADD', 'SUBTRACT']),
  minNights: z.number().int().min(1).optional()
});

export const priceRuleUpdateSchema = priceRuleCreateSchema.partial();