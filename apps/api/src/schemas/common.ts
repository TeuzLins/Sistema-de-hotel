import { z } from 'zod';

export const idParam = z.object({ id: z.string().uuid() });

export const paginationQuery = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional()
});

export const dateRangeQuery = z.object({
  from: z.string().datetime(),
  to: z.string().datetime()
});