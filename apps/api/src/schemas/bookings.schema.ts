import { z } from 'zod';

export const bookingCreateSchema = z.object({
  roomId: z.string().uuid(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1)
});

export const bookingStatusSchema = z.object({
  status: z.enum(['CANCELLED', 'CHECKED_IN', 'CHECKED_OUT'])
});

export const bookingsQuerySchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  roomId: z.string().uuid().optional()
});