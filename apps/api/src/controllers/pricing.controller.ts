import { Request, Response } from 'express';
import { getQuote } from '../utils/pricingEngine.js';
import { prisma } from '../prisma/client.js';

export const quote = async (req: Request, res: Response) => {
  const { roomTypeId, checkIn, checkOut, guests } = req.query as any;
  if (!roomTypeId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ data: null, error: { message: 'Missing query params' } });
  }
  const rt = await prisma.roomType.findUnique({ where: { id: String(roomTypeId) } });
  if (!rt) return res.status(404).json({ data: null, error: { message: 'RoomType not found' } });
  const q = await getQuote({ roomTypeId: String(roomTypeId), checkIn: String(checkIn), checkOut: String(checkOut), guests: Number(guests) });
  res.json({ data: q });
};