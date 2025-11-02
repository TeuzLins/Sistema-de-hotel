import { Request, Response } from 'express';
import { prisma } from '../prisma/client.js';
import { tz, nightsBetween } from '../utils/time.js';

export const occupancy = async (req: Request, res: Response) => {
  const { from, to } = req.query as any;
  if (!from || !to) return res.status(400).json({ data: null, error: { message: 'from & to required' } });
  const rooms = await prisma.room.findMany();
  const days = nightsBetween(String(from), String(to));
  const occupancyByDay: { date: string; occupied: number; totalRooms: number; occupancyPct: number }[] = [];
  for (const day of days) {
    const occupied = await prisma.booking.count({
      where: {
        status: { in: ['PENDING', 'PAID', 'CHECKED_IN'] },
        AND: [{ checkIn: { lte: tz(day).endOf('day').toDate() } }, { checkOut: { gt: tz(day).startOf('day').toDate() } }]
      }
    });
    const pct = rooms.length ? Math.round(((occupied / rooms.length) * 100 + Number.EPSILON) * 100) / 100 : 0;
    occupancyByDay.push({ date: tz(day).format('YYYY-MM-DD'), occupied, totalRooms: rooms.length, occupancyPct: pct });
  }
  res.json({ data: occupancyByDay });
};

export const revenue = async (req: Request, res: Response) => {
  const { from, to } = req.query as any;
  if (!from || !to) return res.status(400).json({ data: null, error: { message: 'from & to required' } });
  const payments = await prisma.payment.findMany({
    where: {
      status: 'PAID',
      createdAt: { gte: tz(String(from)).toDate(), lte: tz(String(to)).toDate() }
    }
  });
  const total = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  res.json({ data: { total, count: payments.length } });
};