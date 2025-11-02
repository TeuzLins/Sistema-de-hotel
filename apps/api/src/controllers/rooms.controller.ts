import { prisma } from '../prisma/client.js';
import { roomCreateSchema, roomUpdateSchema } from '../schemas/rooms.schema.js';

export const listRooms = async (_req: any, res: any) => {
  const r = await prisma.room.findMany({ include: { roomType: true } });
  res.json({ data: r });
};

export const createRoom = async (req: any, res: any) => {
  const parsed = roomCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.room.create({ data: parsed.data });
  res.status(201).json({ data: r });
};

export const updateRoom = async (req: any, res: any) => {
  const id = req.params.id;
  const parsed = roomUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.room.update({ where: { id }, data: parsed.data });
  res.json({ data: r });
};

export const deleteRoom = async (req: any, res: any) => {
  const id = req.params.id;
  await prisma.room.delete({ where: { id } });
  res.status(204).json({ data: null });
};