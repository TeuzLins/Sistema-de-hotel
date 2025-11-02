import { Request, Response } from 'express';
import { prisma } from '../prisma/client.js';
import { bookingCreateSchema, bookingStatusSchema, bookingsQuerySchema } from '../schemas/bookings.schema.js';
import { isRoomAvailable } from '../utils/availability.js';
import { getQuote } from '../utils/pricingEngine.js';
import { v4 as uuidv4 } from 'uuid';
import { tz } from '../utils/time.js';

export const createBooking = async (req: Request, res: Response) => {
  const parsed = bookingCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });

  const { roomId, guestName, guestEmail, checkIn, checkOut, guests } = parsed.data;
  const room = await prisma.room.findUnique({ include: { roomType: true }, where: { id: roomId } });
  if (!room) return res.status(404).json({ data: null, error: { message: 'Room not found' } });

  const available = await isRoomAvailable(roomId, checkIn, checkOut);
  if (!available) return res.status(409).json({ data: null, error: { message: 'Room not available' } });

  const quote = await getQuote({ roomTypeId: room.roomTypeId, checkIn, checkOut, guests });

  const code = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
  const created = await prisma.$transaction(async (tx) => {
    // Re-check availability inside transaction to reduce race conditions
    const overlapping = await tx.booking.findMany({
      where: {
        roomId,
        status: { in: ['PENDING', 'PAID', 'CHECKED_IN'] },
        AND: [{ checkIn: { lt: tz(checkOut).toDate() } }, { checkOut: { gt: tz(checkIn).toDate() } }]
      }
    });
    if (overlapping.length) throw { status: 409, message: 'Overbooking detected', code: 'OVERBOOKING' };

    const booking = await tx.booking.create({
      data: {
        code,
        roomId,
        guestName,
        guestEmail,
        checkIn: tz(checkIn).toDate(),
        checkOut: tz(checkOut).toDate(),
        guests,
        total: quote.total,
        status: 'PENDING'
      }
    });
    return booking;
  });

  res.status(201).json({ data: { booking: created, quote } });
};

export const listBookings = async (req: Request, res: Response) => {
  const parsed = bookingsQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const { status, from, to, roomId } = parsed.data;
  const where: any = {};
  if (status) where.status = status;
  if (roomId) where.roomId = roomId;
  if (from && to) {
    where.AND = [{ checkIn: { gte: tz(from).toDate() } }, { checkOut: { lte: tz(to).toDate() } }];
  }
  const r = await prisma.booking.findMany({ where, include: { room: true } });
  res.json({ data: r });
};

export const getBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id }, include: { room: true, payments: true } });
  if (!booking) return res.status(404).json({ data: null, error: { message: 'Booking not found' } });
  res.json({ data: booking });
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const parsed = bookingStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const { status } = parsed.data;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ data: null, error: { message: 'Booking not found' } });

  // Cancelation policy: full refund if >= 48h before check-in
  if (status === 'CANCELLED') {
    const hoursBefore = tz(booking.checkIn).diff(tz(), 'hour');
    let refundCreated = null;
    if (hoursBefore >= 48) {
      refundCreated = await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.total,
          method: 'REFUND',
          status: 'REFUNDED'
        }
      });
    }
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
    return res.json({ data: { booking: updated, refund: refundCreated } });
  }

  if (status === 'CHECKED_IN') {
    if (booking.status !== 'PAID' && booking.status !== 'CHECKED_IN') {
      return res.status(400).json({ data: null, error: { message: 'Booking must be PAID before check-in' } });
    }
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'CHECKED_IN' } });
    return res.json({ data: updated });
  }

  if (status === 'CHECKED_OUT') {
    if (booking.status !== 'CHECKED_IN') {
      return res.status(400).json({ data: null, error: { message: 'Booking must be CHECKED_IN before check-out' } });
    }
    const updated = await prisma.booking.update({ where: { id }, data: { status: 'CHECKED_OUT' } });
    return res.json({ data: updated });
  }

  return res.status(400).json({ data: null, error: { message: 'Invalid status transition' } });
};