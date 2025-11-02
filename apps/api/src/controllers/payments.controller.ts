import { Request, Response } from 'express';
import { prisma } from '../prisma/client.js';

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { bookingId, method } = req.body as any;
  if (!bookingId) return res.status(400).json({ data: null, error: { message: 'bookingId required' } });
  const booking = await prisma.booking.findUnique({ where: { id: String(bookingId) } });
  if (!booking) return res.status(404).json({ data: null, error: { message: 'Booking not found' } });

  // Mock intent: immediately create payment as PAID
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.total,
      method: method || 'CARD',
      status: 'PAID',
      transactionId: `txn_${Math.random().toString(36).slice(2, 10)}`
    }
  });
  await prisma.booking.update({ where: { id: booking.id }, data: { status: 'PAID' } });
  return res.json({ data: { payment } });
};

export const webhook = async (_req: Request, res: Response) => {
  // Mock webhook: acknowledge
  res.json({ data: { received: true } });
};